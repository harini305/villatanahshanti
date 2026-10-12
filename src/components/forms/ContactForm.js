'use client';
// Enquiry form. Submits to NEXT_PUBLIC_FORM_ENDPOINT (a form service owned by the villa) when
// configured. Until then it says plainly that online sending is unavailable and offers the
// verified Facebook and Airbnb routes. It never shows a success message it can't back up.
import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';
import { contact } from '@/data/pages';
import { validateAll, validateField, LIMITS } from '@/lib/validation';
import Icon from '@/components/ui/Icon';
import styles from './ContactForm.module.css';

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || '';
const FIELDS = { name: 'Your name', email: 'Your email', message: 'How can we help you?' };

export default function ContactForm() {
  const formRef = useRef(null);
  const summaryRef = useRef(null);
  const statusRef = useRef(null);
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error | unavailable
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // JS is running: take over from native validation for clearer inline messages.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  useEffect(() => {
    if (['success', 'error', 'unavailable'].includes(status)) statusRef.current?.focus();
  }, [status]);

  const update = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (touched[name]) setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
    if (status !== 'idle' && status !== 'sending') setStatus('idle');
  };
  const blur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validateAll(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    setSubmitted(true);
    if (Object.keys(found).length) {
      setStatus('idle');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const data = new FormData(formRef.current);
    if (data.get('company')) return; // honeypot filled: almost certainly a bot, silently drop

    if (!ENDPOINT) {
      setStatus('unavailable');
      return;
    }
    setStatus('sending');
    try {
      data.delete('company');
      data.append('_subject', `Website enquiry from ${values.name.trim()}`);
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setValues({ name: '', email: '', message: '' });
      setTouched({});
      setSubmitted(false);
    } catch {
      setStatus('error');
    }
  };

  const copyMessage = async () => {
    const text = `${values.name.trim()} (${values.email.trim()})\n\n${values.message.trim()}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const errorList = Object.entries(errors).filter(([, m]) => m);
  const showSummary = submitted && errorList.length > 0;
  const remaining = LIMITS.message - values.message.length;

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} action={ENDPOINT || undefined} method="post" aria-labelledby="form-title">
      <div className={styles.head}>
        <h2 id="form-title" className={styles.title}>
          Send us an enquiry
        </h2>
        <p className={styles.req}>
          Fields marked <span aria-hidden="true">*</span>
          <span className="visually-hidden">with an asterisk</span> are required.
        </p>
      </div>

      {!ENDPOINT && (
        <div className={styles.notice}>
          <Icon name="alert" size={20} />
          <p>
            Online sending from this form isn&rsquo;t available yet. You can still write your message here and copy it, then reach us on{' '}
            <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer">
              Facebook<span className="visually-hidden"> (opens in new tab)</span>
            </a>{' '}
            or check room availability on{' '}
            <a href={site.airbnbUrl} target="_blank" rel="noopener noreferrer">
              Airbnb<span className="visually-hidden"> (opens in new tab)</span>
            </a>
            .
          </p>
        </div>
      )}

      {showSummary && (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1} aria-labelledby="error-summary-title">
          <p id="error-summary-title" className={styles.summaryTitle}>
            Please check {errorList.length === 1 ? 'this field' : `these ${errorList.length} fields`}:
          </p>
          <ul>
            {errorList.map(([field, msg]) => (
              <li key={field}>
                <a href={`#field-${field}`}>{msg}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.row}>
        {['name', 'email'].map((field) => (
          <div key={field} className={`${styles.field} ${errors[field] ? styles.invalid : ''}`}>
            <label htmlFor={`field-${field}`} className={styles.label}>
              {FIELDS[field]} <span aria-hidden="true" className={styles.star}>*</span>
            </label>
            <input
              id={`field-${field}`}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              inputMode={field === 'email' ? 'email' : undefined}
              autoComplete={field}
              required
              minLength={field === 'name' ? LIMITS.name[0] : undefined}
              maxLength={field === 'name' ? LIMITS.name[1] : 254}
              value={values[field]}
              onChange={update}
              onBlur={blur}
              aria-invalid={errors[field] ? 'true' : undefined}
              aria-describedby={errors[field] ? `error-${field}` : undefined}
              className={styles.input}
            />
            {errors[field] && (
              <p id={`error-${field}`} className={styles.error}>
                <Icon name="alert" size={16} /> {errors[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className={`${styles.field} ${errors.message ? styles.invalid : ''}`}>
        <label htmlFor="field-message" className={styles.label}>
          {FIELDS.message} <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="field-message"
          name="message"
          rows={6}
          maxLength={LIMITS.message + 200}
          value={values.message}
          onChange={update}
          onBlur={blur}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={`message-hint${errors.message ? ' error-message' : ''}`}
          className={`${styles.input} ${styles.textarea}`}
        />
        <p id="message-hint" className={`${styles.hint} ${remaining < 0 ? styles.over : ''}`}>
          Tell us your dates, how many guests, or anything else you&rsquo;d like to know. {remaining >= 0 ? `${remaining} characters left.` : ''}
        </p>
        {errors.message && (
          <p id="error-message" className={styles.error}>
            <Icon name="alert" size={16} /> {errors.message}
          </p>
        )}
      </div>

      {/* honeypot: hidden from people, tempting to bots */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="field-company">Company</label>
        <input id="field-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className={styles.submit} disabled={status === 'sending'} aria-disabled={status === 'sending'}>
        {status === 'sending' ? (
          <>
            <span className={styles.spinner} aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            Send <Icon name="arrowRight" size={18} />
          </>
        )}
      </button>

      <noscript>
        <p className={styles.notice}>Sending this form needs JavaScript. Please message us on Facebook instead.</p>
      </noscript>

      <div aria-live="polite" className={styles.live}>
        {status === 'success' && (
          <div ref={statusRef} tabIndex={-1} className={`${styles.status} ${styles.success}`} role="status">
            <Icon name="check" size={22} strokeWidth={2} />
            <p>{contact.successMessage}</p>
          </div>
        )}
        {status === 'error' && (
          <div ref={statusRef} tabIndex={-1} className={`${styles.status} ${styles.failure}`} role="alert">
            <Icon name="alert" size={22} />
            <p>
              Sorry, your message couldn&rsquo;t be sent. Please try again, or reach us on{' '}
              <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer">
                Facebook<span className="visually-hidden"> (opens in new tab)</span>
              </a>
              .
            </p>
          </div>
        )}
        {status === 'unavailable' && (
          <div ref={statusRef} tabIndex={-1} className={`${styles.status} ${styles.info}`} role="status">
            <Icon name="alert" size={22} />
            <div>
              <p>
                <strong>Your message has not been sent.</strong> Online enquiries are being set up. In the meantime, please message us on Facebook
                or check room availability on Airbnb.
              </p>
              <div className={styles.statusActions}>
                <button type="button" className={styles.copy} onClick={copyMessage}>
                  {copied ? 'Copied to clipboard' : 'Copy my message'}
                </button>
                <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.copy}>
                  <Icon name="facebook" size={16} /> Message us on Facebook<span className="visually-hidden"> (opens in new tab)</span>
                </a>
                <a href={site.airbnbUrl} target="_blank" rel="noopener noreferrer" className={styles.copy}>
                  Check availability on Airbnb<span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
