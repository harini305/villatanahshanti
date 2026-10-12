// Contact form validation (client side). Messages are written to say what to fix.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = { name: [2, 100], message: 2000 };

export function validateField(name, raw) {
  const value = (raw ?? '').trim();
  switch (name) {
    case 'name':
      if (!value) return 'Please enter your name.';
      if (value.length < LIMITS.name[0]) return 'Your name needs at least 2 characters.';
      if (value.length > LIMITS.name[1]) return 'Please keep your name under 100 characters.';
      return '';
    case 'email':
      if (!value) return 'Please enter your email address so we can reply.';
      if (!EMAIL.test(value)) return 'Please enter a valid email address, for example name@example.com.';
      return '';
    case 'message':
      if (value.length > LIMITS.message) return `Please keep your message under ${LIMITS.message} characters (currently ${value.length}).`;
      return '';
    default:
      return '';
  }
}

export function validateAll(values) {
  const errors = {};
  for (const key of ['name', 'email', 'message']) {
    const msg = validateField(key, values[key]);
    if (msg) errors[key] = msg;
  }
  return errors;
}
