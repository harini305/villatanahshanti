// Renders verbatim paragraphs that may contain structured inline link segments.
import ExternalLink from './ExternalLink';

export function Inline({ content }) {
  if (typeof content === 'string') return content;
  return content.map((seg, i) =>
    typeof seg === 'string' ? (
      <span key={i}>{seg}</span>
    ) : seg.external ? (
      <ExternalLink key={i} href={seg.href} icon={false}>
        {seg.text}
        <span className="visually-hidden">: {seg.label}</span>
      </ExternalLink>
    ) : (
      <a key={i} href={seg.href}>
        {seg.text}
      </a>
    )
  );
}

export default function RichText({ paragraphs, className = 'prose', reveal = false }) {
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i} data-reveal={reveal ? '' : undefined}>
          <Inline content={p} />
        </p>
      ))}
    </div>
  );
}
