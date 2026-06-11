import { useState, useEffect, useRef } from 'react';

type PipelineStage = 'IDLE' | 'RESEARCHER' | 'KNOWLEDGE' | 'CREATOR' | 'SEO' | 'EVALUATOR' | 'IDEAS' | 'IMAGE_PROMPT' | 'VIDEO_SCRIPT' | 'COMPLETE';

// ===== Toast Notification System =====
type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return { toasts, addToast };
}

// ===== Animated Counter Hook =====
function useCountUp(target: number, duration = 1500, startOnMount = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnMount) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnMount, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

// ===== Prompt Suggestions =====
const PROMPT_SUGGESTIONS = [
  {
    label: '🏢 Product Launch',
    text: "INTERNAL MEMO: Project Phoenix is launching Q3. It's a cloud DB with sub-10ms queries. Target enterprise CTOs. Don't mention the premium pricing directly — focus on ROI and performance gains.",
  },
  {
    label: '🎓 EdTech Campaign',
    text: 'BRIEF: EduSpark is an AI-powered tutoring platform for K-12 students. It adapts to learning speed and provides instant feedback. We need content for back-to-school season targeting parents who value personalized education.',
  },
  {
    label: '🏥 Health & Wellness',
    text: 'NOTES: VitaTrack is a wearable health monitor that tracks sleep, stress, and hydration. FDA-pending approval. Target health-conscious millennials. Avoid any medical claims — focus on lifestyle and wellness benefits.',
  },
  {
    label: '🛒 E-Commerce Sale',
    text: "MEMO: StyleVault's Summer Mega Sale starts July 1st. Up to 60% off on 500+ brands. Free shipping on orders above ₹999. Early access for app users. Push urgency without being spammy — we want premium tone.",
  },
];

function App() {
  const [rawData, setRawData] = useState(PROMPT_SUGGESTIONS[0].text);
  const [stage, setStage] = useState<PipelineStage>('IDLE');
  const [isError, setIsError] = useState(false);
  const [mode, setMode] = useState<'classic' | 'pro'>('classic');
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toasts, addToast } = useToast();

  // Animated counters
  const stat1 = useCountUp(mode === 'pro' ? 8 : 3, 1200);
  const stat2 = useCountUp(3, 1400);
  const stat3 = useCountUp(mode === 'pro' ? 25 : 10, 1000);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const runPipeline = async () => {
    if (!rawData.trim()) {
      addToast('Please enter some raw data or select a prompt suggestion.', 'error');
      return;
    }

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setStage(mode === 'pro' ? 'RESEARCHER' : 'KNOWLEDGE');
    setIsError(false);
    setResult(null);
    addToast('Pipeline started — agents are working...', 'info');

    // Fake visual progress based on mode
    if (mode === 'classic') {
      timersRef.current.push(setTimeout(() => setStage('CREATOR'), 2000));
      timersRef.current.push(setTimeout(() => setStage('EVALUATOR'), 4000));
    } else {
      timersRef.current.push(setTimeout(() => setStage('KNOWLEDGE'), 2000));
      timersRef.current.push(setTimeout(() => setStage('CREATOR'), 4000));
      timersRef.current.push(setTimeout(() => setStage('SEO'), 6000));
      timersRef.current.push(setTimeout(() => setStage('EVALUATOR'), 8000));
      timersRef.current.push(setTimeout(() => setStage('IDEAS'), 11000));
      timersRef.current.push(setTimeout(() => setStage('IMAGE_PROMPT'), 13000));
      timersRef.current.push(setTimeout(() => setStage('VIDEO_SCRIPT'), 15000));
    }

    try {
      abortControllerRef.current = new AbortController();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawData, mode }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      timersRef.current.forEach(clearTimeout);
      setStage('COMPLETE');
      setResult(data);
      addToast('Content generated and approved! ✨', 'success');

    } catch (error: any) {
      timersRef.current.forEach(clearTimeout);
      setIsError(true);
      if (error.name === 'AbortError') {
        addToast('Pipeline aborted by user.', 'error');
      } else {
        console.error("Pipeline failed", error);
        addToast('Failed to connect to backend. Make sure the Fastify server is running!', 'error');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const abortPipeline = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const copyToClipboard = async () => {
    const text = result?.data?.finalDraft;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      addToast('Content copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Failed to copy — try selecting the text manually.', 'error');
    }
  };

  const getStepClass = (targetStage: PipelineStage) => {
    const stages: PipelineStage[] = mode === 'classic'
      ? ['IDLE', 'KNOWLEDGE', 'CREATOR', 'EVALUATOR', 'COMPLETE']
      : ['IDLE', 'RESEARCHER', 'KNOWLEDGE', 'CREATOR', 'SEO', 'EVALUATOR', 'IDEAS', 'IMAGE_PROMPT', 'VIDEO_SCRIPT', 'COMPLETE'];
    const currentIndex = stages.indexOf(stage);
    const targetIndex = stages.indexOf(targetStage);
    
    if (currentIndex > targetIndex) return "agent-step step-complete";
    if (currentIndex === targetIndex) {
      return isError ? "agent-step step-error" : "agent-step step-active";
    }
    return "agent-step";
  };

  return (
    <div className="app-container">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            {toast.message}
          </div>
        ))}
      </div>

      <header className="header">
        <div className="logo-text">Content<span className="logo-accent">Orchestra</span></div>
        <div className="nav-devs">
          <div className="nav-dev-wrap">
            <div className="nav-dev-trigger">
              <div className="nav-dev-avatar">
                <span className="nav-dev-active-dot"></span>
                YC
              </div>
              <span className="nav-dev-name-short">Yash</span>
            </div>
            <div className="nav-dev-popover">
              <div className="nav-dev-popover-header">
                <div className="nav-dev-avatar nav-dev-avatar-lg">YC</div>
                <div>
                  <div className="nav-dev-popover-name">Yash Choudhary</div>
                  <div className="nav-dev-popover-role">Frontend Developer</div>
                </div>
              </div>
              <div className="nav-dev-popover-msg">
                "Crafting a UI that makes AI orchestration feel intuitive — every interaction should feel instant and delightful."
              </div>
              <div className="nav-dev-popover-status">
                <span className="nav-dev-status-dot"></span> Currently working on this project
              </div>
            </div>
          </div>

          <div className="nav-dev-separator"></div>

          <div className="nav-dev-wrap">
            <div className="nav-dev-trigger">
              <div className="nav-dev-avatar nav-dev-avatar-alt">
                <span className="nav-dev-active-dot"></span>
                RRT
              </div>
              <span className="nav-dev-name-short">Rishiraj</span>
            </div>
            <div className="nav-dev-popover">
              <div className="nav-dev-popover-header">
                <div className="nav-dev-avatar nav-dev-avatar-alt nav-dev-avatar-lg">RRT</div>
                <div>
                  <div className="nav-dev-popover-name">Rishiraj Tanwar</div>
                  <div className="nav-dev-popover-role">AI / Backend Engineer</div>
                </div>
              </div>
              <div className="nav-dev-popover-msg">
                "Building intelligent agents that don't just generate — they reason, review, and refine until the content is truly brand-safe."
              </div>
              <div className="nav-dev-popover-status">
                <span className="nav-dev-status-dot"></span> Currently working on this project
              </div>
            </div>
          </div>
        </div>
        <div className="status-badge">
          {stage === 'IDLE' ? '⚡ Ready' : stage === 'COMPLETE' ? '✅ Done' : '🔄 Running'}
        </div>
      </header>

      {/* ===== Mode Toggle ===== */}
      <div className="mode-toggle-container">
        <div className="mode-toggle">
          <button 
            className={`mode-btn ${mode === 'classic' ? 'active' : ''}`}
            onClick={() => setMode('classic')}
            disabled={stage !== 'IDLE' && stage !== 'COMPLETE' && !isError}
          >
            Classic (3 Agents)
          </button>
          <button 
            className={`mode-btn ${mode === 'pro' ? 'active' : ''}`}
            onClick={() => setMode('pro')}
            disabled={stage !== 'IDLE' && stage !== 'COMPLETE' && !isError}
          >
            Pro (8 Agents)
          </button>
        </div>
        {mode === 'pro' && (
          <div className="pro-banner">
            <span className="pro-banner-icon">🧪</span>
            Pro Mode is under development & evolving
          </div>
        )}
      </div>

      {/* ===== Animated Stats Bar ===== */}
      <div className="stats-bar">
        <div className="stat-item" ref={stat1.ref}>
          <span className="stat-number">{stat1.count}</span>
          <span className="stat-label">AI Agents</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" ref={stat2.ref}>
          <span className="stat-number">{stat2.count}</span>
          <span className="stat-label">Revision Cycles</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" ref={stat3.ref}>
          <span className="stat-number">&lt;{stat3.count}s</span>
          <span className="stat-label">Processing</span>
        </div>
      </div>

      {/* ===== How It Works ===== */}
      <section className="how-it-works">
        <h2 className="section-heading">How It Works</h2>
        <div className="hiw-flow">
          <div className="hiw-step">
            <div className="hiw-icon">📄</div>
            <div className="hiw-step-title">1. Paste Raw Data</div>
            <div className="hiw-step-desc">Internal memos, notes, or rough ideas</div>
          </div>
          <div className="hiw-arrow">
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
              <path d="M0 8H36M36 8L28 1M36 8L28 15" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hiw-step">
            <div className="hiw-icon">🤖</div>
            <div className="hiw-step-title">2. AI Agents Process</div>
            <div className="hiw-step-desc">
              {mode === 'classic' 
                ? "Knowledge → Creator → Governance loop" 
                : "Full 8-Agent orchestration and content studio"}
            </div>
          </div>
          <div className="hiw-arrow">
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
              <path d="M0 8H36M36 8L28 1M36 8L28 15" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hiw-step">
            <div className="hiw-icon">✅</div>
            <div className="hiw-step-title">3. Get Polished Content</div>
            <div className="hiw-step-desc">Brand-safe, compliant & ready to publish</div>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <div className="glass-panel">
          <h2 className="panel-title">📄 Raw Data Source</h2>
          <textarea 
            className="input-area"
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            placeholder="Paste your internal memo, raw data, or unformatted text here..."
          />

          {/* Prompt Suggestions */}
          <div className="suggestions-bar">
            <span className="suggestions-label">Try a prompt:</span>
            <div className="suggestions-list">
              {PROMPT_SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  className={`suggestion-chip ${rawData === suggestion.text ? 'suggestion-active' : ''}`}
                  onClick={() => {
                    setRawData(suggestion.text);
                    addToast(`Loaded "${suggestion.label.replace(/^. /, '')}" prompt`, 'info');
                  }}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn-primary" 
              onClick={runPipeline}
              disabled={stage !== 'IDLE' && stage !== 'COMPLETE' && !isError}
              style={{ flex: 1 }}
            >
              {stage !== 'IDLE' && stage !== 'COMPLETE' && !isError ? (
                <><div className="spinner"></div> Orchestrating Agents...</>
              ) : (
                "▶ Run Orchestration"
              )}
            </button>

            {(stage !== 'IDLE' && stage !== 'COMPLETE' && !isError) && (
              <button 
                className="btn-primary" 
                onClick={abortPipeline}
                style={{ backgroundColor: '#EF4444', flex: '0 0 auto', width: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
              >
                ⏹ Abort
              </button>
            )}
          </div>
        </div>

        <div className="glass-panel">
          <h2 className="panel-title">🧠 Agent Pipeline</h2>
          
          <div className="visualizer">
            {mode === 'pro' && (
              <div className={getStepClass('RESEARCHER')}>
                <div className="step-indicator"></div>
                <div className="step-content">
                  <div className="step-title">Researcher Agent</div>
                  <div className="step-desc">Analyzes industry context, competitors, and trends.</div>
                </div>
              </div>
            )}

            <div className={getStepClass('KNOWLEDGE')}>
              <div className="step-indicator"></div>
              <div className="step-content">
                <div className="step-title">Knowledge Agent</div>
                <div className="step-desc">Synthesizes raw data into a structured brief.</div>
              </div>
            </div>

            <div className={getStepClass('CREATOR')}>
              <div className="step-indicator"></div>
              <div className="step-content">
                <div className="step-title">Creator Agent</div>
                <div className="step-desc">Drafts highly engaging marketing copy.</div>
              </div>
            </div>

            {mode === 'pro' && (
              <div className={getStepClass('SEO')}>
                <div className="step-indicator"></div>
                <div className="step-content">
                  <div className="step-title">SEO Agent</div>
                  <div className="step-desc">Optimizes for search and social engagement.</div>
                </div>
              </div>
            )}

            <div className={getStepClass('EVALUATOR')}>
              <div className="step-indicator"></div>
              <div className="step-content">
                <div className="step-title">Governance Agent</div>
                <div className="step-desc">Evaluates for brand safety and compliance.</div>
              </div>
            </div>

            {mode === 'pro' && (
              <>
                <div className={getStepClass('IDEAS')}>
                  <div className="step-indicator"></div>
                  <div className="step-content">
                    <div className="step-title">Idea Generator</div>
                    <div className="step-desc">Brainstorms follow-up campaign content.</div>
                  </div>
                </div>

                <div className={getStepClass('IMAGE_PROMPT')}>
                  <div className="step-indicator"></div>
                  <div className="step-content">
                    <div className="step-title">Image Prompt Agent</div>
                    <div className="step-desc">Designs visual assets and styling prompts.</div>
                  </div>
                </div>

                <div className={getStepClass('VIDEO_SCRIPT')}>
                  <div className="step-indicator"></div>
                  <div className="step-content">
                    <div className="step-title">Video Script Agent</div>
                    <div className="step-desc">Adapts content for short-form vertical video.</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {stage === 'COMPLETE' && result && (
            <div style={{ marginTop: '2rem' }}>
              <div className="output-header">
                <h2 className="panel-title" style={{ color: 'var(--accent)', margin: 0 }}>✨ Approved Output</h2>
                <button className="btn-copy" onClick={copyToClipboard}>
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="final-output">
                {result.data?.finalDraft || "Content generation failed. Please try again."}
              </div>
              <div className="output-meta">
                <span className="meta-chip">Status: {result.data?.finalStatus}</span>
                <span className="meta-chip">Attempts: {result.data?.attemptsTaken}</span>
              </div>

              {mode === 'pro' && result.data?.seo && (
                <div className="pro-output-section">
                  <h3 className="pro-output-title">SEO Optimization</h3>
                  <div className="pro-output-content">
                    <strong>Keywords:</strong> {result.data.seo.keywords.join(', ')}<br/>
                    <strong>Hashtags:</strong> {result.data.seo.hashtags.join(' ')}<br/>
                    <strong>Best Time:</strong> {result.data.seo.bestPostingTime}
                  </div>
                </div>
              )}

              {mode === 'pro' && result.data?.imagePrompt && (
                <div className="pro-output-section">
                  <h3 className="pro-output-title">Image Generation Prompt</h3>
                  <div className="pro-output-content" style={{ fontStyle: 'italic' }}>
                    "{result.data.imagePrompt.imagePrompt}"
                    <br/><br/>
                    <span className="meta-chip">Style: {result.data.imagePrompt.style}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Coming Next — Roadmap Section */}
      <section className="roadmap-section">
        <div className="roadmap-header">
          <h2 className="roadmap-title">
            <span className="roadmap-icon">🚀</span>
            What's Coming Next
          </h2>
          <span className="roadmap-phase-badge">Phase 2</span>
        </div>
        <p className="roadmap-subtitle">
          We're transforming Content Orchestra from a 3-agent pipeline into a full AI-powered content studio.
        </p>

        <div className="roadmap-grid">
          {[
            {
              icon: '🤖',
              title: '8+ Specialized AI Agents',
              desc: 'Researcher, SEO Optimizer, Image Generator, Video Script Writer, Analytics Advisor — each agent masters one domain.',
              tag: 'Core Upgrade',
            },
            {
              icon: '📱',
              title: 'Multi-Platform Content',
              desc: 'Generate optimized content for LinkedIn, Twitter/X, Instagram, TikTok, YouTube, Pinterest, Blog, and Email — all at once.',
              tag: '8+ Platforms',
            },
            {
              icon: '⚡',
              title: 'Real-Time Streaming UI',
              desc: 'Watch each agent work live with Server-Sent Events. See content being written in real-time with a typing effect.',
              tag: 'SSE',
            },
            {
              icon: '🎨',
              title: 'AI Image Generation',
              desc: 'Dual-model support — choose between Google Gemini and Stable Diffusion to generate on-brand visuals for your content.',
              tag: 'Dual Model',
            },
            {
              icon: '💡',
              title: 'AI Content Ideas',
              desc: 'Never run out of ideas. Our Idea Generator agent analyzes trends and suggests content topics with strategic rationale.',
              tag: 'Smart Ideas',
            },
            {
              icon: '📊',
              title: 'Content Studio Dashboard',
              desc: 'A beautiful multi-page dashboard with a creation wizard, content library, and agent execution trace viewer.',
              tag: 'New UI',
            },
          ].map((feature, i) => (
            <div className="roadmap-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="roadmap-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Phase 3 Teaser */}
        <div className="roadmap-header" style={{ marginTop: '5rem' }}>
          <h2 className="roadmap-title">
            <span className="roadmap-icon" style={{ marginBottom: 0 }}>🔮</span>
            On the Horizon
          </h2>
          <span className="roadmap-phase-badge">Phase 3</span>
        </div>
        <p className="roadmap-subtitle">
          Expanding into a full-scale enterprise product with user accounts, databases, and direct publishing.
        </p>

        <div className="roadmap-grid">
          {[
            { icon: '🔐', title: 'Authentication', desc: 'Secure user accounts with Clerk integration.' },
            { icon: '🗄️', title: 'Database', desc: 'Persistent storage for generated content with Supabase.' },
            { icon: '📅', title: 'Content Calendar', desc: 'Visual scheduling & planning for your campaigns.' },
            { icon: '📈', title: 'Analytics Dashboard', desc: 'AI-powered performance insights on published posts.' },
            { icon: '🔗', title: 'Platform Integrations', desc: 'Direct publishing via OAuth to LinkedIn and Twitter.' },
            { icon: '🎯', title: 'Brand Kit Settings', desc: 'Custom voice and compliance rules per organization.' },
          ].map((item, i) => (
            <div className="roadmap-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="roadmap-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="app-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-text" style={{ marginBottom: '0.5rem' }}>
              Content<span className="logo-accent">Orchestra</span>
            </div>
            <p className="footer-tagline">Multi-agent AI pipeline for brand-safe content generation</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Project</h4>
              <ul>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>B.Tech Major Project — 2026</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Multi-Agent AI System</li>
                <li>
                  <a href="https://github.com/R123456-123/content-orchestra" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1rem', color: 'var(--accent)' }}>
                    GitHub Repository ↗
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Developers</h4>
              <ul>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Yash Choudhary</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rishiraj Tanwar</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-tech">
          <span className="footer-tech-label">Built with</span>
          <div className="footer-tech-list">
            {['React 19', 'TypeScript', 'Fastify', 'Gemini AI', 'Vercel AI SDK', 'Zod v4', 'Vite 8', 'Node.js'].map((tech, i) => (
              <span className="tech-pill" key={i}>{tech}</span>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Content Orchestra — B.Tech Final Year Major Project</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
