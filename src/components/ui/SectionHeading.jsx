export default function SectionHeading({ eyebrow, title, text, light = false }) {
  return <div className={`section-heading ${light ? 'light' : ''}`}><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="section-copy">{text}</p>}</div>
}
