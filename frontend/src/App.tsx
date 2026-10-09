import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css'

interface DailySummary {
  generatedAt: string;
  articlesCount: number;
  summary: string;
}

type Language = 'en' | 'ar';

const translations = {
  en: {
    workspace: 'WORKSPACE',
    dailyBriefing: 'Daily briefing',
    newsSources: 'News sources',
    explore: 'Explore',
    tagline: 'Independent news. Clear perspective.',
    dashboard: 'INTELLIGENCE DASHBOARD',
    refresh: '↻ Refresh briefing',
    loading: 'Loading…',
    overview: 'YOUR DAILY OVERVIEW',
    headline1: 'The world,',
    headline2: 'decoded.',
    description: 'News from across the web, brought together into one AI-powered briefing.',
    articles: 'ARTICLES ANALYZED',
    feedNote: "Across today's feed",
    status: 'BRIEFING STATUS',
    aiNote: 'AI-generated overview',
    bigPicture: 'THE BIG PICTURE',
    today: "Today's briefing",
    gathering: 'Gathering the latest headlines…',
    error: 'Could not load the briefing. Make sure the backend is running.',
    footer: 'Stay informed. Think critically.',
  },
  ar: {
    workspace: 'مساحة العمل',
    dailyBriefing: 'الموجز اليومي',
    newsSources: 'مصادر الأخبار',
    explore: 'استكشاف',
    tagline: 'أخبار مستقلة. رؤية واضحة.',
    dashboard: 'لوحة الاستخبارات',
    refresh: '↻ تحديث الموجز',
    loading: 'جارٍ التحميل…',
    overview: 'نظرة عامة يومية',
    headline1: 'العالم،',
    headline2: 'بوضوح.',
    description: 'أخبار من مختلف أنحاء العالم، مجمّعة في موجز واحد مدعوم بالذكاء الاصطناعي.',
    articles: 'الأخبار التي تم تحليلها',
    feedNote: 'من موجز أخبار اليوم',
    status: 'حالة الموجز',
    aiNote: 'ملخص مُنشأ بالذكاء الاصطناعي',
    bigPicture: 'الصورة الكاملة',
    today: 'موجز اليوم',
    gathering: 'جارٍ جمع أحدث الأخبار…',
    error: 'تعذّر تحميل الموجز. تأكد من تشغيل الخادم الخلفي.',
    footer: 'ابقَ على اطلاع. فكّر بنقدية.',
  },
};

function App() {
  const [data, setData] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<Language>(() => {
    return localStorage.getItem('language') === 'ar' ? 'ar' : 'en';
  });

  const isArabic = language === 'ar';
  const t = translations[language];

  async function fetchSummary() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/ai/daily-summary?language=${language}`);

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
    <div className="app" lang={language} dir={isArabic ? 'rtl' : 'ltr'}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">S</span> SkepticScraper
        </div>

        <p className="nav-label">{t.workspace}</p>
        <div className="nav-item active">◈ <span>{t.dailyBriefing}</span></div>
        <div className="nav-item">◎ <span>{t.newsSources}</span></div>
        <div className="nav-item">⌕ <span>{t.explore}</span></div>

        <div className="sidebar-bottom">{t.tagline}</div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="status">
            <span className="status-dot" /> {t.dashboard}
          </span>

          <div className="topbar-actions">
            <button className="language-button"
              onClick={() => {
                const nextLanguage = isArabic ? 'en' : 'ar';

                localStorage.setItem('language', nextLanguage);
                window.location.reload();
              }}
            >
              {isArabic ? 'English' : 'العربية'}
            </button>
            <button
              className="refresh-button"
              onClick={fetchSummary}
              disabled={loading}
            >
              {loading ? t.loading : t.refresh}
            </button>
          </div>
        </header>

        <section className="hero">
          <p className="eyebrow">{t.overview}</p>
          <h1>
            {t.headline1}
            <br />
            <span>{t.headline2}</span>
          </h1>
          <p className="hero-description">{t.description}</p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-label">{t.articles}</span>
            <strong>{data ? data.articlesCount : '—'}</strong>
            <span className="stat-note">{t.feedNote}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">{t.status}</span>
            <strong className="status-text">
              {loading
                ? t.loading
                : error
                  ? isArabic ? 'غير متصل' : 'Offline'
                  : isArabic ? 'جاهز' : 'Ready'}
            </strong>
            <span className="stat-note">{t.aiNote}</span>
          </div>
        </section>

        <section className="briefing">
          <div className="briefing-header">
            <div>
              <p className="eyebrow">{t.bigPicture}</p>
              <h2>{t.today}</h2>
            </div>

            {data && (
              <span className="timestamp">
                {isArabic ? 'آخر تحديث' : 'Updated'}{' '}
                {new Date(data.generatedAt).toLocaleTimeString(
                  isArabic ? 'ar-KW' : 'en',
                  { hour: '2-digit', minute: '2-digit' },
                )}
              </span>
            )}
          </div>

          {loading && <p className="message">{t.gathering}</p>}
          {error && <p className="error">{t.error}</p>}

          {data && !loading && (
            <article className="summary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.summary}
              </ReactMarkdown>
            </article>
          )}
        </section>

        <footer>{t.footer}</footer>
      </main>
    </div>
  );
}
export default App;