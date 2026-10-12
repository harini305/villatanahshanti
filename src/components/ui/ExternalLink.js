// External link that always opens in a new tab and says so to assistive technology.
import Icon from './Icon';

export default function ExternalLink({ href, children, className, icon = true, ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
      <span className="visually-hidden"> (opens in new tab)</span>
      {icon && <Icon name="external" size={14} className="ext-icon" />}
    </a>
  );
}
