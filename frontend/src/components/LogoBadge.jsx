export default function LogoBadge({ large = false, label = 'AARF logo' }) {
  return (
    <span className={`logo-badge${large ? ' logo-badge-large' : ''}`} aria-label={label}>
      <img className="logo-badge-image" src="/logo.png" alt="" aria-hidden="true" />
    </span>
  );
}
