import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  aboutSections,
  communityCountries,
  programOffers,
  publicProfileSignals,
  values,
} from '../data/siteContent.js';
import { getImpactMetrics, getTestimonials } from '../lib/api.js';

export default function AboutPage() {
  const [impactMetrics, setImpactMetrics] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [impactResponse, testimonialResponse] = await Promise.all([
          getImpactMetrics(),
          getTestimonials(),
        ]);

        if (!active) {
          return;
        }

        setImpactMetrics(Array.isArray(impactResponse) ? impactResponse : []);
        setTestimonials(Array.isArray(testimonialResponse) ? testimonialResponse : []);
      } catch {
        if (!active) {
          return;
        }

        setImpactMetrics([]);
        setTestimonials([]);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const displaySignals = impactMetrics.length
    ? impactMetrics.slice(0, 4).map((metric) => ({
        label: metric.title,
        value: metric.value,
      }))
    : publicProfileSignals;

  return (
    <div className="page page-about">
      <section className="page-hero page-hero-rich reveal">
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">About</p>
            <h1 className="page-title">AARF as a youth-led, open-access AI research community.</h1>
            <p className="lead">
              AARF is a youth-led, open-access AI research community built around ethical inquiry,
              mentorship, and shared learning across borders.
            </p>
            <div className="meta-pill-row">
              <span className="meta-pill">Youth-led</span>
              <span className="meta-pill">Nonprofit framing</span>
              <span className="meta-pill">Global community</span>
            </div>
            <div className="action-row">
              <Link className="btn btn-solid" to="/tracks">
                See research tracks
              </Link>
              <Link className="btn btn-ghost" to="/journals">
                Read journal archive
              </Link>
            </div>
          </div>

          <aside className="hero-aside-card">
            <div className="section-heading compact-heading">
              <p className="eyebrow">At a Glance</p>
              <h2 className="section-title">Community signals that reflect the fellowship's reach.</h2>
            </div>
            <div className="mini-metric-grid">
              {displaySignals.map((signal) => (
                <article className="mini-metric-card" key={signal.label}>
                  <small>{signal.label}</small>
                  <strong>{signal.value}</strong>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Institutional Narrative</p>
          <h2 className="section-title">What AARF stands for in practice.</h2>
          <div className="title-divider" aria-hidden="true" />
        </div>
        <div className="cards-grid three-up">
          {aboutSections.map((section) => (
            <article className="tile-card" key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Public Footprint</p>
          <h2 className="section-title">AARF has already described itself as a community spanning multiple countries.</h2>
        </div>
        <div className="cards-grid two-up">
          <article className="tile-card">
            <h3>Community countries</h3>
            <p>{communityCountries.join(', ')}</p>
          </article>
          <article className="tile-card">
            <h3>What members can expect</h3>
            <p>{programOffers.slice(0, 3).join('. ')}.</p>
          </article>
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Core Values</p>
          <h2 className="section-title">Built for access, rigor, and responsible AI practice.</h2>
        </div>
        <div className="cards-grid four-up">
          {values.map((value) => (
            <article className="value-card" key={value.name}>
              <h3>{value.name}</h3>
              <p>{value.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Community Proof</p>
          <h2 className="section-title">Testimonials turn the institutional story into something human.</h2>
        </div>
        <div className="cards-grid two-up">
          {testimonials.length ? (
            testimonials.slice(0, 2).map((testimonial) => (
              <article className="focus-card" key={testimonial.id}>
                <div className="focus-card-top">
                  <p className="track-theme">{testimonial.role || 'Community voice'}</p>
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
              <p>Community reflections will appear here as AARF members begin sharing their experiences.</p>
            </article>
          )}
        </div>
      </section>

      <section className="section-block split-panel reveal">
        <div>
          <p className="eyebrow">Program Blueprint</p>
          <h2 className="section-title">How AARF turns access into a serious research culture.</h2>
          <p className="muted">
            The fellowship brings together open entry points, mentorship, research standards, and
            public-facing outputs so learning feels both welcoming and rigorous.
          </p>
          <div className="badge-row">
            <Link className="pill-link" to="/apply">
              Apply to AARF
            </Link>
            <Link className="pill-link" to="/contact">
              Contact the team
            </Link>
            <Link className="pill-link" to="/journals">
              Read journals
            </Link>
          </div>
        </div>

        <div className="blueprint-grid">
          <article className="blueprint-card">
            <span className="blueprint-code">AC</span>
            <h3>Access model</h3>
            <p>Keep participation pathways clear so applicants understand cost, eligibility, and openness.</p>
          </article>
          <article className="blueprint-card">
            <span className="blueprint-code">RS</span>
            <h3>Research standards</h3>
            <p>Publish expectations for documentation, critique quality, attribution, and responsible experimentation.</p>
          </article>
          <article className="blueprint-card">
            <span className="blueprint-code">ML</span>
            <h3>Mentorship layer</h3>
            <p>Define how mentors, facilitators, and peer leads interact across cohorts and track-specific labs.</p>
          </article>
          <article className="blueprint-card">
            <span className="blueprint-code">OA</span>
            <h3>Outputs archive</h3>
            <p>Create a public-facing archive for demos, project notes, and reflections as the program grows.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
