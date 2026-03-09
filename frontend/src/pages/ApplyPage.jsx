import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  applicationChecklist,
  applicationSteps,
  reviewPrinciples,
  siteMeta,
  tracks,
} from '../data/siteContent.js';
import { submitVolunteer } from '../lib/api.js';

const initialForm = {
  name: '',
  email: '',
  interest: '',
  collaborationMode: '',
  message: '',
};

export default function ApplyPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const intakeReadout = [
    { label: 'Open to', value: 'Learners, volunteers, collaborators' },
    { label: 'Community style', value: 'Mentorship + shared learning' },
    { label: 'What to share', value: 'Interest, fit, motivation' },
    { label: 'Best for', value: 'People ready to learn and contribute' },
  ];

  const nextSteps = [
    {
      title: 'Show a real question you care about',
      text: 'Strong applications usually point to a concrete problem, theme, or learning goal the applicant wants to pursue.',
    },
    {
      title: 'Be clear about your role fit',
      text: 'Say whether you are applying as a fellow, volunteer, collaborator, mentor, or someone open to more than one pathway.',
    },
    {
      title: 'Explain what you can commit',
      text: 'Availability, time zone, and level of participation help AARF understand how you can contribute well.',
    },
  ];

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    const payload = {
      name: form.name,
      email: form.email,
      interest: [form.interest, form.collaborationMode].filter(Boolean).join(' / '),
      message: form.message,
    };

    try {
      await submitVolunteer(payload);
      setStatus({ type: 'success', message: 'Interest submitted successfully.' });
      setForm(initialForm);
    } catch (requestError) {
      setStatus({
        type: 'error',
        message: requestError.message || 'Could not submit your application interest.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-apply">
      <section className="page-hero page-hero-rich reveal">
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">Apply</p>
            <h1 className="page-title">Apply to AARF as a learner, volunteer, or collaborator.</h1>
            <p className="lead">
              AARF welcomes more than fellows alone. It is for people who want to learn,
              contribute, support the mission, or grow with the community.
            </p>
            <div className="meta-pill-row">
              <span className="meta-pill">Learners welcome</span>
              <span className="meta-pill">Volunteer pathways</span>
              <span className="meta-pill">Collaborator interest</span>
            </div>
          </div>

          <aside className="hero-aside-card">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Who This Is For</p>
              <h2 className="section-title">AARF is open to people who want to learn with purpose and contribute with care.</h2>
            </div>
            <div className="mini-metric-grid">
              {intakeReadout.map((item) => (
                <article className="mini-metric-card" key={item.label}>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-block split-panel reveal">
        <div>
          <p className="eyebrow">How To Apply</p>
          <h2 className="section-title">Simple flow for people who want to join or help build AARF.</h2>
          <p className="muted">
            Clear guidance helps applicants submit thoughtful materials and understand where they fit in the fellowship.
          </p>
          <div className="badge-row">
            <Link className="pill-link" to="/tracks">
              Browse tracks first
            </Link>
            <Link className="pill-link" to="/cohort">
              Review cohort timeline
            </Link>
          </div>
        </div>

        <ol className="journey-list">
          {applicationSteps.map((step, index) => (
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

      <section className="section-block reveal">
        <div className="cards-grid two-up">
          <article className="check-card">
            <p className="eyebrow">Preparation Checklist</p>
            <h2 className="section-title">What applicants can prepare in advance.</h2>
            <ul className="check-list">
              {applicationChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="check-card">
            <p className="eyebrow">Review Principles</p>
            <h2 className="section-title">Signal the culture you want in the cohort.</h2>
            <ul className="check-list">
              {reviewPrinciples.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-block reveal">
        <div className="application-form-shell" id="interest-form">
          <aside className="form-sidebar-panel">
            <p className="eyebrow">Interest Form</p>
            <h2 className="section-title">Tell AARF what you want to learn, build, or support.</h2>
            <p className="muted">
              Use this space to introduce yourself, explain your interests, and show how you hope to contribute to the fellowship.
            </p>
            <div className="sidebar-list">
              <article>
                <small>Good fit</small>
                <strong>Curious and community-minded people</strong>
                <p>AARF is a strong fit for people who care about ethical AI, shared learning, and thoughtful contribution.</p>
              </article>
              <article>
                <small>Where to follow updates</small>
                <strong>LinkedIn and journals</strong>
                <p>Follow public updates, community highlights, and fellowship stories as AARF continues to grow.</p>
              </article>
              <article>
                <small>How to stand out</small>
                <strong>Bring clarity and genuine motivation</strong>
                <p>Share what you want to explore, why it matters to you, and how you hope to support the community.</p>
              </article>
            </div>
            <a className="btn btn-ghost" href={siteMeta.linkedInUrl} target="_blank" rel="noreferrer">
              Check LinkedIn for updates
            </a>
          </aside>

          <div className="form-panel">
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Full name
                <input
                  className="input-field"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={updateField}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email
                <input
                  className="input-field"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Interest area
                <select
                  className="input-field"
                  name="interest"
                  value={form.interest}
                  onChange={updateField}
                  required
                >
                  <option value="" disabled>
                    Select a track
                  </option>
                  {tracks.map((track) => (
                    <option key={track.name} value={track.name}>
                      {track.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Collaboration mode
                <select
                  className="input-field"
                  name="collaborationMode"
                  value={form.collaborationMode}
                  onChange={updateField}
                  required
                >
                  <option value="" disabled>
                    Select preference
                  </option>
                  <option value="Applying as a fellow">Applying as a fellow</option>
                  <option value="Volunteering or collaborating">Volunteering or collaborating</option>
                  <option value="Open to multiple roles">Open to multiple roles</option>
                </select>
              </label>
              <label className="full-width">
                Why AARF?
                <textarea
                  className="input-field textarea-field"
                  name="message"
                  rows="5"
                  required
                  value={form.message}
                  onChange={updateField}
                  placeholder="Share what you want to learn and contribute..."
                />
              </label>
              <div className="full-width form-actions">
                <button className="btn btn-solid" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit interest'}
                </button>
                <Link className="btn btn-text" to="/contact">
                  Need a contact page?
                </Link>
              </div>
            </form>

            {status.message ? (
              <p className={`status ${status.type === 'error' ? 'error-status' : 'success-status'}`}>
                {status.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Before You Apply</p>
          <h2 className="section-title">A few things that make an AARF application stronger.</h2>
        </div>
        <div className="cards-grid three-up">
          {nextSteps.map((step) => (
            <article className="tile-card" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
