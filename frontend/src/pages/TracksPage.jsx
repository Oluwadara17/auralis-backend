import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { tracks } from '../data/siteContent.js';
import { getJournals } from '../lib/api.js';
import { formatDate } from '../lib/format.js';

function sortByNewest(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.created_at || 0).getTime();
    const rightTime = new Date(right.created_at || 0).getTime();
    return rightTime - leftTime;
  });
}

export default function TracksPage() {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadJournals() {
      try {
        const response = await getJournals();
        if (!active) {
          return;
        }
        setJournals(Array.isArray(response) ? sortByNewest(response).slice(0, 3) : []);
      } catch {
        if (!active) {
          return;
        }
        setJournals([]);
      }
    }

    loadJournals();

    return () => {
      active = false;
    };
  }, []);

  const featuredTracks = tracks.slice(0, 3);
  const trackSelectionSteps = [
    {
      title: 'Start from the problem, not the tool',
      text: 'Choose a track based on a real question you want to investigate, then select methods that fit.',
    },
    {
      title: 'Pick a scope that fits the cohort cycle',
      text: 'Strong projects define a narrow outcome, a clear dataset or evidence source, and measurable progress.',
    },
    {
      title: 'Document as you go',
      text: 'Use shared templates for notes, decisions, and experiments so mentors and peers can give useful feedback.',
    },
  ];

  return (
    <div className="page page-tracks">
      <section className="page-hero page-hero-rich reveal">
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">Research Focus Areas</p>
            <h1 className="page-title">Themes that fit AARF's emphasis on ethical, accessible AI research.</h1>
            <p className="lead">
              These focus areas reflect the kind of work AARF is building around: ethical inquiry,
              strong research habits, mentorship, communication, and community contribution.
            </p>
            <div className="meta-pill-row">
              <span className="meta-pill">{tracks.length} aligned focus areas</span>
              <span className="meta-pill">Mentorship + methods</span>
              <span className="meta-pill">Communication + contribution</span>
            </div>
            <div className="action-row">
              <Link className="btn btn-solid" to="/apply">
                View application page
              </Link>
              <Link className="btn btn-ghost" to="/journals">
                Read journal notes
              </Link>
            </div>
          </div>

          <aside className="hero-aside-card">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Catalog Snapshot</p>
              <h2 className="section-title">A cross-section of the themes shaping AARF's research culture.</h2>
            </div>
            <div className="mini-metric-grid">
              <article className="mini-metric-card">
                <small>Domains</small>
                <strong>{tracks.length}</strong>
              </article>
              <article className="mini-metric-card">
                <small>Examples per track</small>
                <strong>3+</strong>
              </article>
              <article className="mini-metric-card">
                <small>Format</small>
                <strong>Curated focus map</strong>
              </article>
              <article className="mini-metric-card">
                <small>Field notes</small>
                <strong>{journals.length || 0}</strong>
              </article>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading center-heading">
          <p className="eyebrow">Featured Domains</p>
          <h2 className="section-title">Some of the strongest themes in AARF's work and learning culture.</h2>
          <div className="title-divider" aria-hidden="true" />
        </div>

        <div className="focus-grid">
          {featuredTracks.map((track) => (
            <article className="focus-card" key={`featured-${track.name}`}>
              <div className="focus-card-top">
                <p className="track-theme">{track.theme}</p>
                <span className="focus-icon" aria-hidden="true">
                  {track.name
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('')}
                </span>
              </div>
              <h3>{track.name}</h3>
              <p>{track.description}</p>
              <ul className="focus-bullets">
                {track.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Track Catalog</p>
          <h2 className="section-title">A full set of focus areas aligned to AARF's identity.</h2>
        </div>
        <div className="track-grid">
          {tracks.map((track) => (
            <article className="track-card" key={track.name}>
              <p className="track-theme">{track.theme}</p>
              <h2>{track.name}</h2>
              <p className="track-description">{track.description}</p>
              <div className="track-tags" aria-label={`${track.name} examples`}>
                {track.examples.map((example) => (
                  <span key={example}>{example}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Field Notes</p>
          <h2 className="section-title">Journal notes and reflections across AARF's focus areas.</h2>
        </div>
        <div className="cards-grid three-up">
          {journals.length ? (
            journals.map((journal) => (
              <article className="tile-card" key={journal.id}>
                <small className="track-theme">{formatDate(journal.created_at)}</small>
                <h3>{journal.title}</h3>
                <p>{journal.excerpt || 'No excerpt available yet.'}</p>
                <Link className="inline-link" to={`/journals/${journal.id}`}>
                  Open article
                </Link>
              </article>
            ))
          ) : (
            <article className="tile-card">
              <h3>No journal field notes yet</h3>
              <p>New reflections and research notes will appear here as the archive grows.</p>
            </article>
          )}
        </div>
      </section>

      <section className="section-block split-panel reveal">
        <div>
          <p className="eyebrow">Track Selection</p>
          <h2 className="section-title">Help applicants choose a contribution direction without overcomplicating it.</h2>
          <p className="muted">
            This section helps new fellows choose a direction and reduces confusion during intake.
          </p>
          <div className="badge-row">
            <Link className="pill-link" to="/apply">
              Application requirements
            </Link>
            <Link className="pill-link" to="/contact">
              Mentor interest form
            </Link>
          </div>
        </div>

        <ol className="timeline-list">
          {trackSelectionSteps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
