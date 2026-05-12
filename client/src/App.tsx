import { useState } from 'react';

type PipelineStage = 'IDLE' | 'KNOWLEDGE' | 'CREATOR' | 'EVALUATOR' | 'COMPLETE';

function App() {
  const [rawData, setRawData] = useState("INTERNAL MEMO: Project Phoenix is launching Q3. It's a cloud DB. Super fast queries (under 10ms). But it's really expensive, so target enterprise CTOs who have big budgets. Don't mention the price directly.");
  const [stage, setStage] = useState<PipelineStage>('IDLE');
  const [result, setResult] = useState<any>(null);

  const runPipeline = async () => {
    setStage('KNOWLEDGE');
    setResult(null);

    setTimeout(() => setStage('CREATOR'), 2000);
    setTimeout(() => setStage('EVALUATOR'), 4000);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawData })
      });

      const data = await response.json();
      setStage('COMPLETE');
      setResult(data);

    } catch (error) {
      console.error("Pipeline failed", error);
      setStage('IDLE');
      alert("Failed to connect to Content Orchestra backend. Make sure the Fastify server is running!");
    }
  };

  const getStepClass = (targetStage: PipelineStage) => {
    const stages: PipelineStage[] = ['IDLE', 'KNOWLEDGE', 'CREATOR', 'EVALUATOR', 'COMPLETE'];
    const currentIndex = stages.indexOf(stage);
    const targetIndex = stages.indexOf(targetStage);
    
    if (currentIndex > targetIndex) return "agent-step step-complete";
    if (currentIndex === targetIndex) return "agent-step step-active";
    return "agent-step";
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-text">Content<span className="logo-accent">Orchestra</span></div>
        <div className="status-badge">
          {stage === 'IDLE' ? '⚡ Ready' : stage === 'COMPLETE' ? '✅ Done' : '🔄 Running'}
        </div>
      </header>

      <div className="main-grid">
        <div className="glass-panel">
          <h2 className="panel-title">📄 Raw Data Source</h2>
          <textarea 
            className="input-area"
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            placeholder="Paste your internal memo, raw data, or unformatted text here..."
          />
          <button 
            className="btn-primary" 
            onClick={runPipeline}
            disabled={stage !== 'IDLE' && stage !== 'COMPLETE'}
          >
            {stage !== 'IDLE' && stage !== 'COMPLETE' ? (
              <><div className="spinner"></div> Orchestrating...</>
            ) : (
              "Generate Compliant Content"
            )}
          </button>
        </div>

        <div className="glass-panel">
          <h2 className="panel-title">🧠 Agent Pipeline</h2>
          
          <div className="visualizer">
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

            <div className={getStepClass('EVALUATOR')}>
              <div className="step-indicator"></div>
              <div className="step-content">
                <div className="step-title">Governance Agent</div>
                <div className="step-desc">Evaluates for brand safety and compliance.</div>
              </div>
            </div>
          </div>

          {stage === 'COMPLETE' && result && (
            <div style={{ marginTop: '2rem' }}>
              <h2 className="panel-title" style={{ color: 'var(--accent)' }}>✨ Approved Output</h2>
              <div className="final-output">
                {result.data?.finalDraft || "Content generation failed. Please try again."}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Status: {result.data?.finalStatus} • Attempts: {result.data?.attemptsTaken}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
