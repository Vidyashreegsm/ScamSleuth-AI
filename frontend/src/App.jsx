
import { useState } from "react";
import axios from "axios";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Activity,
  MessageSquare,
  Clock3,
  ArrowUpRight,
  LoaderCircle,
  Trash2,
  LockKeyhole,
  Zap,
} from "lucide-react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const analyzeMessage = async () => {
    if (!message.trim()) {
      setError("Please enter a message to scan.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/analyze/sms`,
        { message: message.trim() }
      );

      setResult(response.data);

      setHistory((previous) => [
        {
          id: Date.now(),
          message: message.trim(),
          classification: response.data.classification,
          risk_score: response.data.risk_score,
          time: new Date().toLocaleTimeString(),
        },
        ...previous,
      ]);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to connect to the AI server. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearScanner = () => {
    setMessage("");
    setResult(null);
    setError("");
  };

  const spamDetected = result?.prediction === "spam";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Shield size={25} />
          </div>
          <div>
            <h2>ScamSleuth</h2>
            <span>AI SECURITY PLATFORM</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <div className="nav-item active">
          <Activity size={19} />
          <span>Overview</span>
        </div>

        <div className="nav-item">
          <MessageSquare size={19} />
          <span>SMS Scanner</span>
          <span className="nav-tag">LIVE</span>
        </div>

        <div className="nav-item">
          <Clock3 size={19} />
          <span>Scan History</span>
        </div>

        <div className="sidebar-bottom">
          <div className="security-card">
            <LockKeyhole size={20} />
            <strong>AI Protection</strong>
            <p>Machine learning powered message analysis.</p>
            <span className="online-status">
              <span className="status-dot" />
              SYSTEM ONLINE
            </span>
          </div>
          <div className="sidebar-footer">
            ScamSleuth AI · Version 1.0
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Overview
          </div>
          <div className="topbar-right">
            <span className="server-status">
              <span className="status-dot" />
              AI ENGINE CONNECTED
            </span>
            <div className="avatar">S</div>
          </div>
        </header>

        <section className="dashboard">
          <div className="welcome-section">
            <div>
              <div className="eyebrow">
                <Zap size={14} /> INTELLIGENT THREAT DETECTION
              </div>
              <h1>Stay one step ahead of <span>scams.</span></h1>
              <p>
                Analyze suspicious messages with machine learning
                and identify potential spam patterns.
              </p>
            </div>
            <div className="hero-shield">
              <ShieldCheck size={65} strokeWidth={1.1} />
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Activity size={20} />
              </div>
              <span>MODEL ACCURACY</span>
              <h2>97.04%</h2>
              <p>Held-out test dataset</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <ShieldCheck size={20} />
              </div>
              <span>MODEL STATUS</span>
              <h2 className="status-text">Active</h2>
              <p>AI engine connected</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <MessageSquare size={20} />
              </div>
              <span>MESSAGES SCANNED</span>
              <h2>{history.length}</h2>
              <p>This session</p>
            </div>
          </div>

          <div className="scanner-layout">
            <section className="panel scanner-panel">
              <div className="panel-heading">
                <div>
                  <div className="panel-icon">
                    <Search size={19} />
                  </div>
                  <h2>SMS Threat Scanner</h2>
                  <p>Paste a message to analyze its spam patterns.</p>
                </div>
                <span className="live-tag">LIVE SCANNER</span>
              </div>

              <label htmlFor="sms-message">MESSAGE CONTENT</label>
              <textarea
                id="sms-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Paste your suspicious SMS message here..."
                maxLength={10000}
              />

              <div className="input-footer">
                <span>{message.length} / 10000 characters</span>
                <button className="clear-button" onClick={clearScanner}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                className="scan-button"
                onClick={analyzeMessage}
                disabled={loading || !message.trim()}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="spin" size={18} />
                    Analyzing message...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Analyze Message
                    <ArrowUpRight size={17} />
                  </>
                )}
              </button>

              <div className="privacy-note">
                <LockKeyhole size={14} />
                Avoid pasting passwords, OTPs, or sensitive personal data.
              </div>
            </section>

            <section className="panel result-panel">
              <div className="result-heading">
                <div>
                  <h2>Analysis Results</h2>
                  <p>AI-powered detection output</p>
                </div>
                <Activity size={20} />
              </div>

              {!result && !loading && (
                <div className="empty-result">
                  <div className="empty-icon">
                    <Shield size={35} />
                  </div>
                  <h3>Ready to analyze</h3>
                  <p>
                    Your scan results will appear here after
                    analyzing a message.
                  </p>
                  <div className="empty-line" />
                  <span>WAITING FOR INPUT</span>
                </div>
              )}

              {loading && (
                <div className="empty-result">
                  <LoaderCircle className="spin loading-icon" size={42} />
                  <h3>Analyzing message</h3>
                  <p>The machine learning model is evaluating patterns.</p>
                </div>
              )}

              {result && (
                <div className="analysis-result">
                  <div className={`verdict ${spamDetected ? "danger" : "safe"}`}>
                    {spamDetected ? (
                      <ShieldAlert size={31} />
                    ) : (
                      <ShieldCheck size={31} />
                    )}
                    <div>
                      <span>CLASSIFICATION</span>
                      <h3>{result.classification}</h3>
                    </div>
                  </div>

                  <div className="risk-section">
                    <div className="risk-header">
                      <span>SPAM PROBABILITY</span>
                      <strong>{result.risk_score}%</strong>
                    </div>
                    <div className="risk-track">
                      <div
                        className={`risk-fill ${spamDetected ? "high" : "low"}`}
                        style={{ width: `${result.risk_score}%` }}
                      />
                    </div>
                    <div className="risk-footer">
                      <span>0% — Low</span>
                      <span>100% — High</span>
                    </div>
                  </div>

                  <div className="result-detail">
                    <span>MODEL CONFIDENCE</span>
                    <strong>{result.confidence}%</strong>
                  </div>

                  <div className="explanation">
                    <strong>Detection explanation</strong>
                    <p>{result.explanation}</p>
                  </div>

                  <div className="model-info">
                    <span>MODEL</span>
                    <strong>{result.model}</strong>
                  </div>
                </div>
              )}
            </section>
          </div>

          <section className="panel history-panel">
            <div className="history-heading">
              <div>
                <h2>Recent Scans</h2>
                <p>Your latest message analysis results</p>
              </div>
              <span>{history.length} SCANS</span>
            </div>

            {history.length === 0 ? (
              <div className="history-empty">
                No scans yet. Analyze your first SMS to get started.
              </div>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div className="history-row" key={item.id}>
                    <div className="history-message">
                      <div className="history-icon">
                        <MessageSquare size={17} />
                      </div>
                      <div>
                        <strong>
                          {item.message.length > 65
                            ? item.message.slice(0, 65) + "..."
                            : item.message}
                        </strong>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <strong
                      className={
                        item.classification === "Spam"
                          ? "history-spam"
                          : "history-safe"
                      }
                    >
                      {item.classification}
                    </strong>
                    <span>{item.risk_score}% risk</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="page-footer">
            <span>© 2026 ScamSleuth AI</span>
            <span>Built with machine learning · TF-IDF + Logistic Regression</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
