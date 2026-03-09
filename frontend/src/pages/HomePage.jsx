import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  communityCountries,
  contributionAreas,
  homeJourney,
  homePillars,
  programOffers,
  publicProfileSignals,
  siteMeta,
  tracks,
} from '../data/siteContent.js';
import { getImpactMetrics, getJournals, getTestimonials } from '../lib/api.js';
import { formatDate } from '../lib/format.js';
import LogoBadge from '../components/LogoBadge.jsx';

function sortByNewest(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.created_at || 0).getTime();
    const rightTime = new Date(right.created_at || 0).getTime();
    return rightTime - leftTime;
  });
}

export default function HomePage() {
  const [impactMetrics, setImpactMetrics] = useState([]);
  const [journals, setJournals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPageData() {
      try {
        const [impactResponse, journalResponse, testimonialResponse] = await Promise.all([
          getImpactMetrics(),
          getJournals(),
          getTestimonials(),
        ]);

        if (!active) {
          return;
        }

        setImpactMetrics(Array.isArray(impactResponse) ? impactResponse : []);
        setJournals(Array.isArray(journalResponse) ? sortByNewest(journalResponse) : []);
        setTestimonials(Array.isArray(testimonialResponse) ? testimonialResponse : []);
        setError('');
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(requestError.message || 'Unable to load AARF updates.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      active = false;
    };
  }, []);

  const featuredTracks = tracks.slice(0, 3);
  const impactStrip = impactMetrics.length
    ? impactMetrics.slice(0, 4).map((metric) => ({
        label: metric.title,
        value: metric.value,
      }))
    : publicProfileSignals;
  const featuredJournals = journals.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 2);
  const updateCards = featuredJournals.length
    ? featuredJournals.slice(0, 2).map((journal) => ({
        title: journal.title,
        text: journal.excerpt || 'Read the latest update from the journal archive.',
        to: `/journals/${journal.id}`,
        action: 'Read article',
        label: `Published ${formatDate(journal.created_at)}`,
      }))
    : [
        {
          title: 'Program updates',
          text: 'Follow cohort announcements, mentor spotlights, and fellowship updates as the community grows.',
          to: '/journals',
          action: 'Open journal archive',
          label: 'Communications',
        },
        {
          title: 'Open resources',
          text: 'Explore reading lists, methods guides, and reflections that make AI research more approachable.',
          to: '/about',
          action: 'Explore about page',
          label: 'Knowledge base',
        },
      ];

  const resourceCards = [
    {
      title: 'Research Tracks',
      text: 'Structured domains for fellows to enter with a clear question, methods plan, and collaboration space.',
      to: '/tracks',
      action: 'Explore tracks',
      code: 'TRK',
    },
    {
      title: 'Cohort Experience',
      text: 'A timeline-first view of onboarding, lab cycles, critique sessions, and showcase milestones.',
      to: '/cohort',
      action: 'See cohort rhythm',
      code: 'CHT',
    },
    {
      title: 'Application Flow',
      text: 'An open invitation for learners, volunteers, and collaborators who want to grow with AARF.',
      to: '/apply',
      action: 'View application page',
      code: 'APP',
    },
    {
      title: 'Journal Archive',
      text: 'Stories, reflections, and research notes that show how the AARF community learns, builds, and shares.',
      to: '/journals',
      action: 'Read journal archive',
      code: 'JNL',
    },
  ];

  return (
    <div className="page page-home">
      <section className="hero-shell reveal hero-research-banner">
        <div className="hero-bg-animation" aria-hidden="true">
          <div className="orbital-scene">
            <div className="pulse-ring ring-one" />
            <div className="pulse-ring ring-two" />
            <div className="pulse-ring ring-three" />

            <div className="orbit-track track-one" />
            <div className="orbit-track track-two" />
            <div className="orbit-track track-three" />

            <span className="orbit-dot dot-one" />
            <span className="orbit-dot dot-two" />
            <span className="orbit-dot dot-three" />

            <span className="scene-node node-core" />
            <span className="scene-node node-a" />
            <span className="scene-node node-b" />
            <span className="scene-node node-c" />
            <span className="scene-node node-d" />

            <div className="signal-wave wave-one" />
            <div className="signal-wave wave-two" />
          </div>
        </div>

        <div className="hero-copy-card">
          <p className="eyebrow">AARF | Auralis AI Research Fellowship</p>
          <h1 className="display-title">
            Ethical AI research,
            <span>opened up for a global, youth-led community.</span>
          </h1>
          <p className="lead">
            AARF is a free, open-access AI research fellowship built to make
            ethical, high-quality research more reachable for students, early researchers, and
            contributors worldwide.
          </p>

          <div className="meta-pill-row" aria-label="Program highlights">
            <span className="meta-pill">Youth-led</span>
            <span className="meta-pill">Free and open-access</span>
            <span className="meta-pill">Ethical and responsible AI</span>
          </div>

          <div className="action-row">
            <Link className="btn btn-solid" to="/apply">
              Apply to AARF
            </Link>
            <Link className="btn btn-ghost" to="/journals">
              Read journals
            </Link>
          </div>
        </div>
      </section>

      <section className="section-band reveal">
        <div className="metric-strip">
          {impactStrip.map((signal) => (
            <article className="metric-tile" key={signal.label}>
              <span className="metric-label">{signal.label}</span>
              <strong className="metric-value">{signal.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal snapshot-relocated">
        <div className="section-heading">
          <p className="eyebrow">Program Snapshot</p>
          <h2 className="section-title">The fellowship model in one structured, living view.</h2>
        </div>

        {error ? <p className="status error-status">{error}</p> : null}
        {loading ? <p className="status">Loading AARF updates...</p> : null}

        <div className="snapshot-grid">
          <div className="visual-brand snapshot-brand">
            <LogoBadge large label={`${siteMeta.name} badge`} />
            <div>
              <p className="eyebrow">AARF</p>
              <h2>{siteMeta.tagline}</h2>
            </div>
          </div>

          <div className="mosaic-grid snapshot-mosaic">
            <article>
              <small>Model</small>
              <strong>Open access</strong>
              <p>Free participation with a global, youth-led learning culture</p>
            </article>
            <article>
              <small>Learning</small>
              <strong>Mentorship + circles</strong>
              <p>Structured guidance, collaborative circles, and shared inquiry</p>
            </article>
            <article>
              <small>Community</small>
              <strong>Global participation</strong>
              <p>{communityCountries.join(', ')}</p>
            </article>
            <article>
              <small>Evidence</small>
              <strong>Community signals</strong>
              <p>Journals, testimonials, and open contribution paths show how the fellowship is growing</p>
            </article>
          </div>

          <div className="panel-list snapshot-panel-list">
            <div>
              <span className="panel-list-label">Track architecture</span>
              <strong>Ethics, research skills, communication, and contribution pathways</strong>
            </div>
            <div>
              <span className="panel-list-label">What AARF offers</span>
              <strong>{programOffers[0]}</strong>
            </div>
            <div>
              <span className="panel-list-label">Latest story</span>
              <strong>
                {featuredJournals[0]?.title || 'First journal entry coming soon'}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading center-heading">
          <p className="eyebrow">Our Research Focus</p>
          <h2 className="section-title">
            AARF approaches its work like a serious research community, with clear focus areas and
            methods-oriented themes.
          </h2>
          <div className="title-divider" aria-hidden="true" />
        </div>

        <div className="focus-grid">
          {featuredTracks.map((track) => (
            <article className="focus-card" key={track.name}>
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
                {track.examples.slice(0, 3).map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
              <Link className="inline-link" to="/tracks">
                View full track catalog
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block split-panel reveal">
        <div>
          <p className="eyebrow">Program Flow</p>
          <h2 className="section-title">
            From curiosity to contribution in a visible community pathway.
          </h2>
          <p className="muted">
            AARF's story is not only about fellows. It also includes volunteers,
            collaborators, mentors, and community builders who help the ecosystem grow.
          </p>
          <div className="badge-row">
            <Link className="pill-link" to="/cohort">
              Cohort experience
            </Link>
            <Link className="pill-link" to="/apply">
              Application flow
            </Link>
            <Link className="pill-link" to="/contact">
              Contact pathways
            </Link>
          </div>

          <div className="stacked-callouts">
            {updateCards.map((item) => (
              <article className="stacked-callout" key={item.title}>
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link className="inline-link" to={item.to}>
                  {item.action}
                </Link>
              </article>
            ))}
          </div>
        </div>

        <ol className="journey-list">
          {homeJourney.map((item) => (
            <li key={item.step}>
              <span>{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">How People Contribute</p>
          <h2 className="section-title">Public calls already point to multiple ways people can help build AARF.</h2>
        </div>

        <div className="cards-grid three-up">
          {contributionAreas.slice(0, 6).map((area) => (
            <article className="tile-card" key={area}>
              <h3>{area}</h3>
              <p>
                Each pathway helps AARF grow as a research community, not just as a single fellowship cycle.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Why AARF Feels Different</p>
          <h2 className="section-title">
            AARF brings access, seriousness, and community into the same learning environment.
          </h2>
        </div>

        <div className="cards-grid three-up">
          {homePillars.map((pillar) => (
            <article className="tile-card" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block reveal">
        <div className="section-heading">
          <p className="eyebrow">Explore AARF</p>
          <h2 className="section-title">Every section opens a different part of the fellowship story.</h2>
        </div>
        <div className="route-card-grid four-up-grid">
          {resourceCards.map((card) => (
            <Link className="route-card" key={card.title} to={card.to}>
              <span className="route-card-code">{card.code}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <span className="route-card-link">{card.action}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block cta-banner reveal">
        <div>
          <p className="eyebrow">Keep The Story Growing</p>
          <h2 className="section-title">
            More journals, testimonials, and community updates will keep AARF's story rich and current.
          </h2>
          <p className="muted">
            A living fellowship needs visible stories, research notes, and shared progress.
          </p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-solid" to="/journals">
            Read the journal
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            Contact the team
          </Link>
        </div>
      </section>
    </div>
  );
}
