export default function Logo({ light = false }) {
  return <a href="#top" className="logo" aria-label="DigitSol home"><span className="logo-mark" aria-hidden="true"><i /><i /><i /></span><span className={light ? 'text-white' : ''}>Digit<span>Sol</span></span></a>
}
