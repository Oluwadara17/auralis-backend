import { Link } from 'react-router-dom';
import { useDeferredValue, useEffect, useState } from 'react';
import { getJournals } from '../lib/api.js';
import { formatDate, splitTags } from '../lib/format.js';

function sortByNewest(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.created_at || 0).getTime();
    const rightTime = new Date(right.created_at || 0).getTime();
    return rightTime - leftTime;
  });
}

export default function JournalsPage() {
  const [journals, setJournals] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let active = true;

    async function loadJournals() {
      try {
        const response = await getJournals();
        if (!active) {
          return;
        }
        setJournals(Array.isArray(response) ? sortByNewest(response) : []);
        setError('');
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(requestError.message || 'Failed to load journals.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadJournals();

    return () => {
      active = false;
    };
  }, []);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredJournals = journals.filter((journal) => {
    if (!normalizedQuery) {
      return true;
    }

    const haystack = `${journal.title} ${journal.excerpt || ''} ${journal.tags || ''}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const featuredJournal = filteredJournals[0];
  const archiveJournals = featuredJournal ? filteredJournals.slice(1) : filteredJournals;

  return (
    <div className="page page-journals">
      <section className="page-hero page-hero-rich reveal">
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">Journal Archive</p>
            <h1 className="page-title">Published stories, reflections, and research notes.</h1>
            <p className="lead">
              The journal is where AARF can share stories, reflections, cohort updates, and research notes in a more lasting public form.
            </p>
            <div className="meta-pill-row">
              <span className="meta-pill">{journals.length} published entries</span>
              <span className="meta-pill">Searchable archive</span>
              <span className="meta-pill">Editorial archive</span>
            </div>
          </div>

          <aside className="hero-aside-card">
            <label className="search-stack">
              <span className="eyebrow">Search archive</span>
              <input
                className="input-field"
                type="search"
                placeholder="Search title, excerpt, or tags"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="mini-metric-grid">
              <article className="mini-metric-card">
                <small>Total journals</small>
                <strong>{journals.length}</strong>
              </article>
              <article className="mini-metric-card">
                <small>Filtered results</small>
                <strong>{filteredJournals.length}</strong>
              </article>
            </div>
          </aside>
        </div>
      </section>

      {loading ? <section className="section-block reveal"><p className="status">Loading journals...</p></section> : null}
      {error ? <section className="section-block reveal"><p className="status error-status">{error}</p></section> : null}

      {!loading && !error && featuredJournal ? (
        <section className="section-block reveal">
          <div className="section-heading">
            <p className="eyebrow">Featured Story</p>
            <h2 className="section-title">Lead with the newest publication.</h2>
          </div>
          <article className="journal-spotlight">
            <div className="journal-spotlight-copy">
              <p className="journal-card__meta">
                {featuredJournal.author || 'AARF team'} / {formatDate(featuredJournal.created_at)}
              </p>
              <h2>{featuredJournal.title}</h2>
              <p>{featuredJournal.excerpt || 'No excerpt available for this article yet.'}</p>
              <div className="tag-list">
                {splitTags(featuredJournal.tags).map((tag) => (
                  <span key={`${featuredJournal.id}-${tag}`}>{tag}</span>
                ))}
              </div>
              <Link className="btn btn-solid" to={`/journals/${featuredJournal.id}`}>
                Read featured article
              </Link>
            </div>
            <div className="journal-spotlight-panel">
              <small>Archive note</small>
              <strong>{filteredJournals.length} stories ready to explore</strong>
              <p>Use the journal to share cohort updates, methods reflections, demos, and community stories.</p>
            </div>
          </article>
        </section>
      ) : null}

      {!loading && !error ? (
        <section className="section-block reveal">
          <div className="section-heading">
            <p className="eyebrow">Archive Grid</p>
            <h2 className="section-title">Browse the rest of the publication archive.</h2>
          </div>
          {archiveJournals.length ? (
            <div className="route-card-grid journal-archive-grid">
              {archiveJournals.map((journal) => (
                <article className="route-card compact-route-card" key={journal.id}>
                  <span className="route-card-code">{formatDate(journal.created_at)}</span>
                  <h3>{journal.title}</h3>
                  <p>{journal.excerpt || 'No excerpt available.'}</p>
                  <div className="tag-list">
                    {splitTags(journal.tags).map((tag) => (
                      <span key={`${journal.id}-${tag}`}>{tag}</span>
                    ))}
                  </div>
                  <Link className="route-card-link" to={`/journals/${journal.id}`}>
                    Open article
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="status">No matching journals found.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
