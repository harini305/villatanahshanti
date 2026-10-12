// Link-styled buttons. Internal hrefs use next/link; `external` opens a new tab with an announced cue.
import Link from 'next/link';
import Icon from './Icon';
import styles from './Button.module.css';

export function buttonClass(variant = 'primary', size) {
  return [styles.btn, styles[variant], size && styles[size]].filter(Boolean).join(' ');
}

export default function Button({ href, external, variant = 'primary', size, icon, children, className, ...rest }) {
  const cls = [buttonClass(variant, size), className].filter(Boolean).join(' ');
  const content = (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {external ? <Icon name="external" size={15} className={styles.trail} /> : null}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {content}
        <span className="visually-hidden"> (opens in new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
