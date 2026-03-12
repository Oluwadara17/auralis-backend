import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const quickLinks = [
    {
      title: 'Home',
      text: 'Return to the fellowship landing page.',
      to: '/',
    },
    {
      title: 'Tracks',
      text: 'Browse the structured research track catalog.',
      to: '/tracks',
    },
    {
      title: 'Apply',
      text: 'Explore ways to join or contribute to AARF.',
      to: '/apply',
    },
    {
      title: 'Journal',
      text: 'Read stories, reflections, and research notes from the fellowship.',
      to: '/journals',
    },
  ];

  return (
    <div className="page page-not-found">
      <section className="page-hero page-hero-rich reveal">
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">404</p>
            <h1 className="page-title">That page could not be found.</h1>
            <p className="lead">
              The page you requested is not available, but the main AARF sections are still available below.
            </p>
            <div className="action-row">
              <Link className="btn btn-solid" to="/">
                Back to Home
              </Link>
              <Link className="btn btn-ghost" to="/contact">
                Go to Contact
              </Link>
            </div>
          </div>

          <aside className="hero-aside-card">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Quick Navigation</p>
              <h2 className="section-title">Continue exploring the fellowship.</h2>
            </div>
            <div className="route-card-grid compact-route-grid">
              {quickLinks.map((item, index) => (
                <Link className="route-card compact-route-card" key={item.to} to={item.to}>
                  <span className="route-card-code">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="route-card-link">Open section</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
