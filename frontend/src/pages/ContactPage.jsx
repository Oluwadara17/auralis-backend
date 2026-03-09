import { Link } from 'react-router-dom';
import { useState } from 'react';
import { contactChannels, faqs, siteMeta } from '../data/siteContent.js';
import { submitContact } from '../lib/api.js';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const responseSignals = [
    { label: 'Primary channel', value: 'LinkedIn + contact form' },
    { label: 'Best for', value: 'Mentorship / partnerships / support' },
    { label: 'Who can reach out', value: 'Mentors, partners, contributors' },
    { label: 'Approach', value: 'Thoughtful and mission-aligned' },
  ];

  const responseWorkflow = [
    {
      title: 'Mentorship and speaking invitations',
      text: 'Reach out if you want to guide learners, join conversations, or support the fellowship with expertise.',
    },
    {
      title: 'Institutional partnerships',
      text: 'Reach out for collaborations with schools, labs, nonprofits, or mission-aligned communities.',
    },
    {
      title: 'Volunteer and contributor support',
      text: 'AARF also welcomes people who want to help with outreach, writing, design, coordination, or technical support.',
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

    try {
      await submitContact(form);
      setStatus({ type: 'success', message: 'Message received successfully.' });
      setForm(initialForm);
    } catch (requestError) {
      setStatus({
        type: 'error',
        message: requestError.message || 'Unable to send your message.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-contact">
      <section className="page-hero page-hero-rich reveal">
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="page-title">
              Reach AARF for mentorship, partnerships, and contributor support.
            </h1>
            <p className="lead">
              AARF invites people into the mission through mentorship, partnership, collaboration,
              and community support. This is the direct way to start that conversation.
            </p>
            <div className="meta-pill-row">
              <span className="meta-pill">Mentor interest</span>
              <span className="meta-pill">Partnership intake</span>
              <span className="meta-pill">General inquiries</span>
            </div>
            <div className="action-row">
              <a className="btn btn-solid" href={siteMeta.linkedInUrl} target="_blank" rel="noreferrer">
                Open LinkedIn
              </a>
              <Link className="btn btn-ghost" to="/apply">
                View application page
              </Link>
            </div>
          </div>

          <aside className="hero-aside-card">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Contact Readout</p>
              <h2 className="section-title">A quick picture of how people can connect with AARF.</h2>
            </div>
            <div className="mini-metric-grid">
              {responseSignals.map((signal) => (
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
          <p className="eyebrow">Channels</p>
          <h2 className="section-title">Route inquiries by purpose and keep the public path obvious.</h2>
        </div>
        <div className="cards-grid three-up">
          {contactChannels.map((channel) => (
            <article className="tile-card contact-channel-card" key={channel.title}>
              <span className="focus-icon" aria-hidden="true">
                {channel.title
                  .split(' ')
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join('')}
              </span>
              <h3>{channel.title}</h3>
              <p>{channel.detail}</p>
              {channel.actionHref.startsWith('http') ? (
                <a className="inline-link" href={channel.actionHref} target="_blank" rel="noreferrer">
                  {channel.actionLabel}
                </a>
              ) : (
                <Link className="inline-link" to={channel.actionHref}>
                  {channel.actionLabel}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="application-form-shell">
          <aside className="form-sidebar-panel">
            <p className="eyebrow">Ways To Reach Out</p>
            <h2 className="section-title">AARF welcomes thoughtful contact from mentors, partners, and contributors.</h2>
            <p className="muted">
              Use the form below if you want to support the mission, ask a meaningful question, or explore a collaboration.
            </p>
            <div className="sidebar-list">
              {responseWorkflow.map((item) => (
                <article key={item.title}>
                  <small>Pathway</small>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <a className="btn btn-ghost" href={siteMeta.linkedInUrl} target="_blank" rel="noreferrer">
              Open LinkedIn page
            </a>
          </aside>

          <div className="form-panel" id="contact-form">
            <form className="form-grid contact-form" onSubmit={handleSubmit}>
              <label>
                Name
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
              <label className="full-width">
                Topic
                <input
                  className="input-field"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={updateField}
                  placeholder="Mentorship, partnership, or general inquiry"
                />
              </label>
              <label className="full-width">
                Message
                <textarea
                  className="input-field textarea-field"
                  name="message"
                  rows="6"
                  required
                  value={form.message}
                  onChange={updateField}
                  placeholder="Write your message..."
                />
              </label>
              <div className="full-width form-actions">
                <button className="btn btn-solid" type="submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send message'}
                </button>
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
        <div className="faq-panel">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title">Common questions about connecting with AARF.</h2>
          </div>
          <div className="faq-list faq-grid">
            {faqs.map((item) => (
              <article key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
            <article>
              <h3>What should I include in my first message?</h3>
              <p>
                Introduce yourself, explain why you are reaching out, and describe the kind of support,
                partnership, or contribution you have in mind.
              </p>
            </article>
            <article>
              <h3>Can I reach out even if I am outside the countries already represented?</h3>
              <p>
                Yes. AARF's identity is global, and the community is meant to welcome serious interest from people across regions.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
