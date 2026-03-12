import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getJournal } from '../lib/api.js';
import { formatDate, splitTags } from '../lib/format.js';

function toParagraphs(content) {
  if (!content) {
    return [];
  }

  return String(content)
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export default function JournalDetailPage() {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadJournal() {
      try {
        const response = await getJournal(id);
        if (!active) {
          return;
        }
        setJournal(response);
        setError('');
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(requestError.message || 'Failed to load journal.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadJournal();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page page-journal-detail">
      {loading ? (
        <section className="section-block reveal">
          <p className="status">Loading journal...</p>
        </section>
      ) : null}

      {error ? (
        <section className="section-block reveal">
          <p className="status error-status">{error}</p>
          <div className="action-row">
            <Link className="btn btn-ghost" to="/journals">
              Back to journals
            </Link>
          </div>
        </section>
      ) : null}

      {!loading && !error && journal ? (
        <>
          <section className="page-hero page-hero-rich reveal article-hero">
            <div className="page-hero-grid">
              <div>
                <p className="eyebrow">Journal Entry</p>
                <h1 className="page-title">{journal.title}</h1>
                <p className="lead">
                  {journal.excerpt || 'A long-form note from the AARF journal archive.'}
                </p>
                <div className="meta-pill-row">
                  <span className="meta-pill">{journal.author || 'AARF team'}</span>
                  <span className="meta-pill">{formatDate(journal.created_at)}</span>
                </div>
              </div>

              <aside className="hero-aside-card">
                <div className="section-heading compact-heading">
                  <p className="eyebrow">Metadata</p>
                  <h2 className="section-title">Article tags and navigation.</h2>
                </div>
                <div className="tag-list">
                  {splitTags(journal.tags).length ? (
                    splitTags(journal.tags).map((tag) => <span key={tag}>{tag}</span>)
                  ) : (
                    <span>General</span>
                  )}
                </div>
                <div className="action-row">
                  <Link className="btn btn-solid" to="/journals">
                    Back to archive
                  </Link>
                  <Link className="btn btn-ghost" to="/contact">
                    Contact the team
                  </Link>
                </div>
              </aside>
            </div>
          </section>

          <section className="section-block reveal">
            <article className="article-shell">
              <div className="article__content">
                {toParagraphs(journal.content).length ? (
                  toParagraphs(journal.content).map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
                  ))
                ) : (
                  <p>{journal.content || 'No article content provided.'}</p>
                )}
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
