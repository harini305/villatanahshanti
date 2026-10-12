// Small-caps label above headings, set off by a gold hairline.
export default function Eyebrow({ children, center = false, light = false, as: Tag = 'p', className, ...rest }) {
  const cls = ['eyebrow', center && 'eyebrow--center', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} style={light ? { color: 'rgba(255,255,255,0.92)' } : undefined} {...rest}>
      {children}
    </Tag>
  );
}
