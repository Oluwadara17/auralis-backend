import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { navItems, publicProfileSignals, siteMeta } from '../data/siteContent.js';
import LogoBadge from './LogoBadge.jsx';

function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    const pageTitles = {
      '/': `${siteMeta.shortName} | Fellowship Home`,
      '/about': `${siteMeta.shortName} | About`,
      '/tracks': `${siteMeta.shortName} | Tracks`,
      '/cohort': `${siteMeta.shortName} | Cohort`,
      '/apply': `${siteMeta.shortName} | Apply`,
      '/journals': `${siteMeta.shortName} | Journals`,
      '/contact': `${siteMeta.shortName} | Contact`,
      '/volunteer': `${siteMeta.shortName} | Apply`,
      '/admin': `${siteMeta.shortName} | Content Admin`,
    };

    if (location.pathname.startsWith('/journals/')) {
      document.title = `${siteMeta.shortName} | Journal Article`;
    } else {
      document.title = pageTitles[location.pathname] || siteMeta.shortName;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

export default function SiteLayout() {
  const footerSignals = publicProfileSignals.slice(0, 3);

  return (
    <div className="app-shell">
      <RouteEffects />
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-orb orb-left" aria-hidden="true" />
      <div className="ambient-orb orb-right" aria-hidden="true" />
      <div className="ambient-orb orb-bottom" aria-hidden="true" />

      <header className="site-header">
        <div className="topbar">
          <div className="topbar-inner">
            <NavLink className="brand" to="/" end aria-label={`${siteMeta.name} home`}>
              <LogoBadge label={`${siteMeta.name} logo`} />
              <span className="brand-copy">
                <strong>{siteMeta.name}</strong>
                <small>{siteMeta.tagline}</small>
              </span>
            </NavLink>

            <nav className="nav-links" aria-label="Primary">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="header-actions">
              <a className="topbar-link" href={siteMeta.linkedInUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <NavLink className="btn btn-solid topbar-cta" to="/apply">
                Apply
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <main className="page-wrap">
        <Outlet />
      </main>

      <footer className="footer-panel">
        <div className="footer-grid">
          <div className="footer-brand">
            <NavLink className="footer-brand-lockup" to="/" end aria-label={`${siteMeta.name} home`}>
              <LogoBadge label={`${siteMeta.name} footer logo`} />
              <span className="brand-copy">
                <strong>{siteMeta.name}</strong>
                <small>{siteMeta.tagline}</small>
              </span>
            </NavLink>
            <p className="muted">
              Auralis AI Research Fellowship is building a public home for ethical AI research,
              mentorship, open learning, and global collaboration.
            </p>
            <div className="footer-signal-grid" aria-label="Public profile signals">
              {footerSignals.map((signal) => (
                <div className="footer-signal" key={signal.label}>
                  <small>{signal.label}</small>
                  <strong>{signal.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <p className="eyebrow">Explore</p>
            {navItems.map((item) => (
              <NavLink key={`footer-${item.to}`} to={item.to} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/journals">Journal archive</NavLink>
          </div>

          <div className="footer-links">
            <p className="eyebrow">Connect</p>
            <a href={siteMeta.linkedInUrl} target="_blank" rel="noreferrer">
              LinkedIn profile
            </a>
            <NavLink to="/apply">Apply or collaborate</NavLink>
            <NavLink to="/contact">Reach the team</NavLink>
          </div>
        </div>

        <div className="footer-bottom">
          <p>AARF | Free, youth-led, global AI research access.</p>
          <a href={siteMeta.linkedInUrl} target="_blank" rel="noreferrer">
            Follow on LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
