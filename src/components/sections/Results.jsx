import MetricGraph3D from '../three/MetricGraph3D.jsx'

const metrics = [
  ['3.2×', 'ROAS', [.18, .26, .22, .42, .36, .61, .55, .76], '#009c95'],
  ['+184%', 'Leads', [.12, .2, .18, .34, .43, .57, .7, .91], '#ff6b16'],
  ['+67%', 'Conversion', [.16, .25, .34, .3, .52, .47, .72, .86], '#f9b62b'],
]

export default function Results() {
  return <section className="results"><div className="container results-panel"><div className="results-grid"><blockquote>“DigitSol helped us turn a complex challenge into a digital experience that performs.”<footer>Marketing Director · Dubai</footer></blockquote><div className="metric-wrap"><p className="eyebrow">MEASURABLE RESULTS</p><div className="metric-grid">{metrics.map(metric => <article key={metric[1]}><strong>{metric[0]}</strong><span>{metric[1]}</span><MetricGraph3D values={metric[2]} color={metric[3]}/></article>)}</div></div></div></div></section>
}
