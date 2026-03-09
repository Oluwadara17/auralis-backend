import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cohortFormats, cohortTimeline, communityCountries } from '../data/siteContent.js';
import { getTestimonials } from '../lib/api.js';

export default function CohortPage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadTestimonials() {
      try {
        const response = await getTestimonials();
        if (!active) {
          return;
        }
        setTestimonials(Array.isArray(response) ? response.slice(0, 4) : []);
      } catch {
        if (!active) {
          return;
        }
        setTestimonials([]);
      }
    }

    loadTestimonials();

    return () => {
      active = false;
    };
  }, []);

  const cohortSignals = [
    { label: 'Phases', value: `${cohortTimeline.length}` },
    { label: 'Weekly formats', value: `${cohortFormats.length}+` },
    { label: 'Delivery mode', value: 'Virtual-first' },
    { label: 'End point', value: 'Showcase output' },
  ];

  const supportSystems = [
    {
      title: 'Mentor Touchpoints',
      text: 'Short, recurring mentor reviews help fellows unblock decisions and avoid drifting into vague project scopes.',
    },
    {
      title: 'Peer Critique Culture',
      text: 'Visible norms for feedback quality improve drafts, demos, and collaboration confidence across the cohort.',
    },
    {
      title: 'Documentation Habits',
      text: 'Shared notes and research logs make progress legible and make cross-track support easier.',
    },
    {
      title: 'Showcase Preparation',
      text: 'Presentation rehearsals and communication coaching help fellows present strong work to public audiences.',
    },
  ];

  return (
    <div className="page page-cohort">
      <section className="page-hero page-hero-rich reveal">
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">Cohort Experience</p>
            <h1 className="page-title">AARF's community rhythm: mentorship, circles, and global participation.</h1>
            <p className="lead">
              AARF emphasizes support, inclusion, and collaborative learning. The cohort experience is
              shaped around shared inquiry, guided growth, and a global sense of community.
            </p>
            <div className="meta-pill-row">
              <span className="meta-pill">Global participation</span>
              <span className="meta-pill">Research circles</span>
              <span className="meta-pill">Mentorship and support</span>
            </div>
            <div className="action-row">
              <Link className="btn btn-solid" to="/apply">
                View application flow
              </Link>
              <Link className="btn btn-ghost" to="/contact">
                Contact the team
              </Link>
            </div>
          </div>

          <aside className="hero-aside-card">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Program Rhythm</p>
              <h2 className="section-title">A quick view of how the fellowship can feel week to week.</h2>
            </div>
            <div className="mini-metric-grid">
              {cohortSignals.map((signal) => (
                <article className="mini-metric-card" key={signal.label}>
                  <small>{signal.label}</small>
                  <strong>{signal.value}</strong>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-band reveal">
        <div className="metric-strip">
          {cohortSignals.map((signal) => (
            <article className="metric-tile" key={`band-${signal.label}`}>
              <span className="metric-label">{signal.label}</span>
              <strong className="metric-value">{signal.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block split-panel reveal">
        <div>
          <p className="eyebrow">Community Rhythm</p>
          <h2 className="section-title">A clear picture of how people can move through AARF.</h2>
          <p className="muted">
            AARF is global in spirit and in participation. These phases show how people can grow into the fellowship without pretending every timeline is fixed.
          </p>
          <div className="badge-row">
            {communityCountries.map((country) => (
              <span className="pill-link" key={country}>
                {country}
              </span>
            ))}
          </div>
        </div>

        <ol className="timeline-list">
          {cohortTimeline.map((item, index) => (
            <li key={item.phase}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{item.phase}</h3>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-block reveal">
        <div className="section-heading center-heading">
          <p className="eyebrow">Community Formats</p>
          <h2 className="section-title">The kinds of interactions that fit AARF's learning culture.</h2>
          <div className="title-divider" aria-hidden="true" />
        </div>
        <div className="cards-grid four-up">
          {cohortFormats.map((format) => (
            <article className="value-card" key={format.title}>
              <h3>{format.title}</h3>
              <p>{format.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Live Voices</p>
          <h2 className="section-title">Community testimonials make the public promise feel real.</h2>
        </div>
        <div className="cards-grid two-up">
          {testimonials.length ? (
            testimonials.slice(0, 2).map((testimonial) => (
              <article className="focus-card" key={testimonial.id}>
                <div className="focus-card-top">
                  <p className="track-theme">{testimonial.role || 'Community member'}</p>
                  <span className="focus-icon" aria-hidden="true">
                    {testimonial.name
                      .split(' ')
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join('')}
                  </span>
                </div>
                <h3>{testimonial.name}</h3>
                <p>{testimonial.message}</p>
              </article>
            ))
          ) : (
            <article className="tile-card">
              <h3>No testimonials yet</h3>
              <p>Community reflections will appear here as members begin sharing what the fellowship feels like from the inside.</p>
            </article>
          )}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Support Systems</p>
          <h2 className="section-title">AARF should feel guided, inclusive, and serious about growth.</h2>
        </div>
        <div className="cards-grid four-up">
          {supportSystems.map((item) => (
            <article className="value-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
