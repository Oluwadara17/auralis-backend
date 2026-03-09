import { useEffect, useState } from 'react';
import {
  createImpactMetric,
  createJournal,
  createTestimonial,
  getImpactMetrics,
  getJournals,
  getTestimonials,
} from '../lib/api.js';
import { formatDate } from '../lib/format.js';

const initialJournal = {
  title: '',
  content: '',
  excerpt: '',
  author: '',
  tags: '',
  is_published: true,
};

const initialImpact = {
  title: '',
  value: '',
  description: '',
};

const initialTestimonial = {
  name: '',
  role: '',
  message: '',
};

function StatusMessage({ state }) {
  if (!state.message) {
    return null;
  }

  return (
    <p className={`status ${state.type === 'error' ? 'status--error' : 'status--success'}`}>
      {state.message}
    </p>
  );
}

export default function AdminPage() {
  const [journalForm, setJournalForm] = useState(initialJournal);
  const [impactForm, setImpactForm] = useState(initialImpact);
  const [testimonialForm, setTestimonialForm] = useState(initialTestimonial);

  const [journalStatus, setJournalStatus] = useState({ type: '', message: '' });
  const [impactStatus, setImpactStatus] = useState({ type: '', message: '' });
  const [testimonialStatus, setTestimonialStatus] = useState({ type: '', message: '' });

  const [submitting, setSubmitting] = useState('');
  const [counts, setCounts] = useState({ journals: 0, metrics: 0, testimonials: 0 });
  const [latestJournal, setLatestJournal] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const [journals, metrics, testimonials] = await Promise.all([
          getJournals(),
          getImpactMetrics(),
          getTestimonials(),
        ]);

        if (!active) {
          return;
        }

        const journalList = Array.isArray(journals) ? journals : [];
        const latest = [...journalList].sort((a, b) => {
          const left = new Date(a.created_at || 0).getTime();
          const right = new Date(b.created_at || 0).getTime();
          return right - left;
        })[0];

        setCounts({
          journals: journalList.length,
          metrics: Array.isArray(metrics) ? metrics.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        });
        setLatestJournal(latest || null);
      } catch {
        if (!active) {
          return;
        }
        setCounts({ journals: 0, metrics: 0, testimonials: 0 });
        setLatestJournal(null);
      }
    }

    loadSummary();

    return () => {
      active = false;
    };
  }, [journalStatus.message, impactStatus.message, testimonialStatus.message]);

  function updateForm(setter) {
    return (event) => {
      const { name, value, type, checked } = event.target;
      setter((current) => ({
        ...current,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  }

  async function submitJournal(event) {
    event.preventDefault();
    setSubmitting('journal');
    setJournalStatus({ type: '', message: '' });

    try {
      await createJournal(journalForm);
      setJournalStatus({ type: 'success', message: 'Journal created successfully.' });
      setJournalForm(initialJournal);
    } catch (requestError) {
      setJournalStatus({
        type: 'error',
        message: requestError.message || 'Could not create journal.',
      });
    } finally {
      setSubmitting('');
    }
  }

  async function submitImpact(event) {
    event.preventDefault();
    setSubmitting('impact');
    setImpactStatus({ type: '', message: '' });

    try {
      await createImpactMetric(impactForm);
      setImpactStatus({ type: 'success', message: 'Impact metric created successfully.' });
      setImpactForm(initialImpact);
    } catch (requestError) {
      setImpactStatus({
        type: 'error',
        message: requestError.message || 'Could not create impact metric.',
      });
    } finally {
      setSubmitting('');
    }
  }

  async function submitTestimonial(event) {
    event.preventDefault();
    setSubmitting('testimonial');
    setTestimonialStatus({ type: '', message: '' });

    try {
      await createTestimonial(testimonialForm);
      setTestimonialStatus({ type: 'success', message: 'Testimonial created successfully.' });
      setTestimonialForm(initialTestimonial);
    } catch (requestError) {
      setTestimonialStatus({
        type: 'error',
        message: requestError.message || 'Could not create testimonial.',
      });
    } finally {
      setSubmitting('');
    }
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-head">
          <p className="eyebrow">Admin Console</p>
          <h1>Content publishing tools</h1>
          <p className="section-copy">
            Internal workspace for managing journals, impact metrics, and testimonials. Restrict access
            before launch.
          </p>
        </div>
        <div className="card-grid card-grid--three">
          <article className="metric-card">
            <p className="metric-card__title">Journals</p>
            <strong className="metric-card__value">{counts.journals}</strong>
            <p className="metric-card__copy">Published entries currently available</p>
          </article>
          <article className="metric-card">
            <p className="metric-card__title">Impact metrics</p>
            <strong className="metric-card__value">{counts.metrics}</strong>
            <p className="metric-card__copy">Public stats currently available</p>
          </article>
          <article className="metric-card">
            <p className="metric-card__title">Testimonials</p>
            <strong className="metric-card__value">{counts.testimonials}</strong>
            <p className="metric-card__copy">Community messages currently available</p>
          </article>
        </div>
        {latestJournal ? (
          <p className="status">
            Latest journal: <strong>{latestJournal.title}</strong> ({formatDate(latestJournal.created_at)})
          </p>
        ) : null}
      </section>

      <section className="panel">
        <div className="section-head">
          <p className="eyebrow">Create Journal</p>
          <h2>POST /api/journals</h2>
        </div>
        <form className="form-grid" onSubmit={submitJournal}>
          <label className="form-grid__full">
            Title
            <input
              name="title"
              type="text"
              required
              value={journalForm.title}
              onChange={updateForm(setJournalForm)}
            />
          </label>
          <label className="form-grid__full">
            Excerpt
            <input
              name="excerpt"
              type="text"
              value={journalForm.excerpt}
              onChange={updateForm(setJournalForm)}
            />
          </label>
          <label>
            Author
            <input
              name="author"
              type="text"
              value={journalForm.author}
              onChange={updateForm(setJournalForm)}
            />
          </label>
          <label>
            Tags (comma-separated)
            <input
              name="tags"
              type="text"
              value={journalForm.tags}
              onChange={updateForm(setJournalForm)}
              placeholder="education, community"
            />
          </label>
          <label className="form-grid__full">
            Content
            <textarea
              name="content"
              required
              rows="8"
              value={journalForm.content}
              onChange={updateForm(setJournalForm)}
            />
          </label>
          <label className="checkbox-field form-grid__full">
            <input
              name="is_published"
              type="checkbox"
              checked={journalForm.is_published}
              onChange={updateForm(setJournalForm)}
            />
            Publish immediately
          </label>
          <div className="form-grid__full form-actions">
            <button className="btn btn--solid" type="submit" disabled={submitting === 'journal'}>
              {submitting === 'journal' ? 'Saving...' : 'Create journal'}
            </button>
          </div>
        </form>
        <StatusMessage state={journalStatus} />
      </section>

      <section className="panel">
        <div className="section-head">
          <p className="eyebrow">Create Impact Metric</p>
          <h2>POST /api/impact</h2>
        </div>
        <form className="form-grid" onSubmit={submitImpact}>
          <label>
            Title
            <input
              name="title"
              type="text"
              required
              value={impactForm.title}
              onChange={updateForm(setImpactForm)}
            />
          </label>
          <label>
            Value
            <input
              name="value"
              type="text"
              required
              value={impactForm.value}
              onChange={updateForm(setImpactForm)}
            />
          </label>
          <label className="form-grid__full">
            Description
            <textarea
              name="description"
              rows="4"
              value={impactForm.description}
              onChange={updateForm(setImpactForm)}
            />
          </label>
          <div className="form-grid__full form-actions">
            <button className="btn btn--solid" type="submit" disabled={submitting === 'impact'}>
              {submitting === 'impact' ? 'Saving...' : 'Create metric'}
            </button>
          </div>
        </form>
        <StatusMessage state={impactStatus} />
      </section>

      <section className="panel">
        <div className="section-head">
          <p className="eyebrow">Create Testimonial</p>
          <h2>POST /api/testimonials</h2>
        </div>
        <form className="form-grid" onSubmit={submitTestimonial}>
          <label>
            Name
            <input
              name="name"
              type="text"
              required
              value={testimonialForm.name}
              onChange={updateForm(setTestimonialForm)}
            />
          </label>
          <label>
            Role
            <input
              name="role"
              type="text"
              value={testimonialForm.role}
              onChange={updateForm(setTestimonialForm)}
            />
          </label>
          <label className="form-grid__full">
            Message
            <textarea
              name="message"
              required
              rows="5"
              value={testimonialForm.message}
              onChange={updateForm(setTestimonialForm)}
            />
          </label>
          <div className="form-grid__full form-actions">
            <button
              className="btn btn--solid"
              type="submit"
              disabled={submitting === 'testimonial'}
            >
              {submitting === 'testimonial' ? 'Saving...' : 'Create testimonial'}
            </button>
          </div>
        </form>
        <StatusMessage state={testimonialStatus} />
      </section>
    </div>
  );
}
