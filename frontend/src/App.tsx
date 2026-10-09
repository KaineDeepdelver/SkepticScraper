import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css'

interface DailySummary {
  generatedAt: string;
  articlesCount: number;
  summary: string;
}

function App() {
  const [data, setData] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchSummary() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/daily-summary');

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setData(await response.json());
    } catch {
      setError('Could not load the summary. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchSummary();
  }, []);

  return (
<div className="app">
<aside className="sidebar">
<div className="brand"><span className="brand-mark">S</span> SkepticScraper</div>
<p className="nav-label">WORKSPACE</p>
<div className="nav-item active">◈ <span>Daily briefing</span></div>
<div className="nav-item">◎ <span>News sources</span></div>
<div className="nav-item">⌕ <span>Explore</span></div>
<div className="sidebar-bottom">Independent news. Clear perspective.</div>
</aside>

  <main className="main">
    <header className="topbar">
      <span className="status"><span className="status-dot" /> INTELLIGENCE DASHBOARD</span>
      <button className="refresh-button" onClick={fetchSummary} disabled={loading}>
        {loading ? 'Loading…' : '↻ Refresh briefing'}
      </button>
    </header>

    <section className="hero">
      <p className="eyebrow">YOUR DAILY OVERVIEW</p>
      <h1>The world,<br /><span>decoded.</span></h1>
      <p className="hero-description">
        News from across the web, brought together into one AI-powered briefing.
      </p>
    </section>

    <section className="stats">
      <div className="stat-card">
        <span className="stat-label">ARTICLES ANALYZED</span>
        <strong>{data ? data.articlesCount : '—'}</strong>
        <span className="stat-note">Across today's feed</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">BRIEFING STATUS</span>
        <strong className="status-text">{loading ? 'Loading' : error ? 'Offline' : 'Ready'}</strong>
        <span className="stat-note">AI-generated overview</span>
      </div>
    </section>

    <section className="briefing">
      <div className="briefing-header">
        <div>
          <p className="eyebrow">THE BIG PICTURE</p>
          <h2>Today's briefing</h2>
        </div>
        {data && (
          <span className="timestamp">
            Updated {new Date(data.generatedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {loading && <p className="message">Gathering the latest headlines…</p>}
      {error && <p className="error">{error}</p>}
      {data && !loading && (
        <article className="summary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.summary}</ReactMarkdown>
        </article>
      )}
    </section>

    <footer>Stay informed. Think critically.</footer>
  </main>
</div>

);
}

export default App;
  

