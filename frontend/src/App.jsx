import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  Upload,
  MessageSquare,
  FileText,
  Zap,
  BookOpen,
  Lightbulb,
  CheckSquare,
  Tag,
  Clock,
  GitCompare,
  Download,
  Trash2,
  ChevronDown,
  Loader2,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import "./App.css";

// ── Reusable primitives ────────────────────────────────────────────────────

function GlassCard({ children, className = "" }) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="section-header">
      <div className="section-icon">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

function ActionButton({ onClick, disabled, loading, variant = "primary", icon: Icon, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`action-btn action-btn--${variant} ${className}`}
    >
      {loading ? (
        <Loader2 size={15} className="spin" />
      ) : Icon ? (
        <Icon size={15} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

function ResultPanel({ title, icon: Icon, content, accentClass = "" }) {
  if (!content) return null;
  return (
    <GlassCard className={`result-panel ${accentClass}`}>
      <div className="result-panel__header">
        <Icon size={16} />
        <h3>{title}</h3>
      </div>
      <pre className="result-panel__body">{content}</pre>
    </GlassCard>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState("");
  const [insights, setInsights] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [entities, setEntities] = useState("");
  const [deadlines, setDeadlines] = useState("");
  const [comparison, setComparison] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeLoader, setActiveLoader] = useState("");

  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [compareDoc1, setCompareDoc1] = useState("");
  const [compareDoc2, setCompareDoc2] = useState("");

  const startLoad = (key) => { setLoading(true); setActiveLoader(key); };
  const stopLoad = () => { setLoading(false); setActiveLoader(""); };

  const uploadFile = async () => {
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) formData.append("files", file[i]);
    try {
      startLoad("upload");
      const response = await axios.post("http://127.0.0.1:8000/upload", formData);
      alert(response.data.message);
      const names = Array.from(file).map((f) => f.name);
      setUploadedDocs((prev) => [...new Set([...prev, ...names])]);
      if (names.length > 0) setSelectedDocument(names[0]);
    } catch (error) {
      console.log(error);
    } finally {
      stopLoad();
    }
  };

  const askQuestion = async () => {
    try {
      startLoad("chat");
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        question,
        document_name: selectedDocument,
      });
      setAnswer(response.data.answer);
      setSources(response.data.sources || []);
      setChatHistory((prev) => [
        ...prev,
        { question, answer: response.data.answer, sources: response.data.sources || [] },
      ]);
      setQuestion("");
    } catch (error) {
      console.log(error);
      alert("Error asking question");
    } finally {
      stopLoad();
    }
  };

  const summarizeDocument = async () => {
    try {
      startLoad("summary");
      const response = await axios.get("http://127.0.0.1:8000/summarize");
      setSummary(response.data.summary);
    } catch (error) {
      console.log(error);
    } finally {
      stopLoad();
    }
  };

  const generateQuiz = async () => {
    try {
      startLoad("quiz");
      const response = await axios.get("http://127.0.0.1:8000/generate-quiz");
      setQuiz(response.data.quiz_questions);
    } catch (error) {
      console.log(error);
    } finally {
      stopLoad();
    }
  };

  const extractInsights = async () => {
    try {
      startLoad("insights");
      const response = await axios.get("http://127.0.0.1:8000/extract-insights");
      setInsights(response.data.insights);
    } catch (error) {
      console.log(error);
    } finally {
      stopLoad();
    }
  };

  const getActionItems = async () => {
    try {
      startLoad("actions");
      const response = await axios.get("http://127.0.0.1:8000/action-items");
      setActionItems(response.data.action_items);
    } catch (error) {
      console.log(error);
      alert("Failed to extract action items");
    } finally {
      stopLoad();
    }
  };

  const getEntities = async () => {
    try {
      startLoad("entities");
      const response = await axios.get("http://127.0.0.1:8000/entities");
      setEntities(response.data.entities);
    } catch (error) {
      console.log(error);
      alert("Failed to extract entities");
    } finally {
      stopLoad();
    }
  };

  const getDeadlines = async () => {
    try {
      startLoad("deadlines");
      const response = await axios.get("http://127.0.0.1:8000/deadlines");
      setDeadlines(response.data.deadlines);
    } catch (error) {
      console.log(error);
      alert("Failed to extract deadlines");
    } finally {
      stopLoad();
    }
  };

  const compareDocuments = async () => {
    if (!compareDoc1 || !compareDoc2) { alert("Please select both documents"); return; }
    if (compareDoc1 === compareDoc2) { alert("Please select two different documents"); return; }
    try {
      startLoad("compare");
      const response = await axios.get("http://127.0.0.1:8000/compare", {
        params: { doc1: compareDoc1, doc2: compareDoc2 },
      });
      setComparison(response.data.comparison);
    } catch (error) {
      console.log(error);
      alert("Failed to compare documents");
    } finally {
      stopLoad();
    }
  };

  const downloadSummary = () => {
    if (!summary) { alert("Generate a summary first!"); return; }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Company Knowledge Assistant", 20, 20);
    doc.setFontSize(14);
    doc.text("Document Summary", 20, 35);
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(summary, 170);
    doc.text(splitText, 20, 50);
    doc.save("document-summary.pdf");
  };

  const isLoading = (key) => loading && activeLoader === key;

  return (
    <div className="app-root">
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb--purple" />
      <div className="bg-orb bg-orb--blue" />

      <div className="app-container">

        {/* ── Header ── */}
        <header className="app-header">
          <div className="app-header__logo">
            <Sparkles size={22} className="logo-icon" />
            <span className="logo-text">DocIntel</span>
          </div>
          <p className="app-header__tagline">
            AI-powered document intelligence
          </p>
        </header>

        {/* ── Upload ── */}
        <GlassCard>
          <SectionHeader icon={Upload} title="Upload documents" subtitle="PDF, DOCX, TXT — multi-file supported" />

          <div className="upload-row">
            <label className="file-label">
              <input
                type="file"
                multiple
                className="file-input-hidden"
                onChange={(e) => setFile(e.target.files)}
              />
              <Upload size={14} />
              <span>{file ? Array.from(file).map((f) => f.name).join(", ") : "Choose files"}</span>
            </label>

            <ActionButton
              onClick={uploadFile}
              disabled={!file}
              loading={isLoading("upload")}
              icon={Upload}
            >
              {isLoading("upload") ? "Uploading…" : "Upload"}
            </ActionButton>
          </div>

          {uploadedDocs.length > 0 && (
            <div className="doc-select-wrap">
              <label className="field-label">Active document</label>
              <div className="select-wrapper">
                <FileText size={14} className="select-icon" />
                <select
                  value={selectedDocument}
                  onChange={(e) => setSelectedDocument(e.target.value)}
                  className="styled-select"
                >
                  {uploadedDocs.map((doc, i) => (
                    <option key={i} value={doc}>{doc}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-caret" />
              </div>
            </div>
          )}
        </GlassCard>

        {/* ── Compare ── */}
        {uploadedDocs.length >= 2 && (
          <GlassCard>
            <SectionHeader icon={GitCompare} title="Compare documents" subtitle="Side-by-side AI analysis of two uploads" />

            <div className="compare-row">
              <div className="select-wrapper">
                <FileText size={14} className="select-icon" />
                <select
                  value={compareDoc1}
                  onChange={(e) => setCompareDoc1(e.target.value)}
                  className="styled-select"
                >
                  <option value="">Document A</option>
                  {uploadedDocs.map((doc, i) => <option key={i} value={doc}>{doc}</option>)}
                </select>
                <ChevronDown size={14} className="select-caret" />
              </div>

              <div className="compare-divider">vs</div>

              <div className="select-wrapper">
                <FileText size={14} className="select-icon" />
                <select
                  value={compareDoc2}
                  onChange={(e) => setCompareDoc2(e.target.value)}
                  className="styled-select"
                >
                  <option value="">Document B</option>
                  {uploadedDocs.map((doc, i) => <option key={i} value={doc}>{doc}</option>)}
                </select>
                <ChevronDown size={14} className="select-caret" />
              </div>

              <ActionButton
                onClick={compareDocuments}
                disabled={!compareDoc1 || !compareDoc2}
                loading={isLoading("compare")}
                variant="secondary"
                icon={GitCompare}
              >
                Compare
              </ActionButton>
            </div>

            {comparison && (
              <ResultPanel title="Comparison" icon={GitCompare} content={comparison} />
            )}
          </GlassCard>
        )}

        {/* ── Chat ── */}
        <GlassCard>
          <SectionHeader icon={MessageSquare} title="Ask questions" subtitle="Query any uploaded document with natural language" />

          <div className="chat-input-row">
            <input
              type="text"
              placeholder="What does this document say about…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && question.trim() && askQuestion()}
              className="chat-input"
            />
            <ActionButton
              onClick={askQuestion}
              disabled={!question.trim()}
              loading={isLoading("chat")}
              icon={MessageSquare}
            >
              Ask
            </ActionButton>
          </div>

          {chatHistory.length > 0 && (
            <div className="chat-history">
              <div className="chat-history__topbar">
                <span className="chat-history__label">Conversation</span>
                <button
                  onClick={() => setChatHistory([])}
                  className="clear-btn"
                >
                  <Trash2 size={13} /> Clear
                </button>
              </div>

              <div className="chat-messages">
                {chatHistory.map((chat, i) => (
                  <div key={i} className="chat-thread">
                    <div className="chat-bubble chat-bubble--user">
                      <div className="bubble-avatar bubble-avatar--user">
                        <User size={12} />
                      </div>
                      <div className="bubble-content">{chat.question}</div>
                    </div>

                    <div className="chat-bubble chat-bubble--ai">
                      <div className="bubble-avatar bubble-avatar--ai">
                        <Bot size={12} />
                      </div>
                      <div className="bubble-content">
                        <p>{chat.answer}</p>
                        {chat.sources.length > 0 && (
                          <div className="sources">
                            <span className="sources__label">Sources</span>
                            <ul className="sources__list">
                              {chat.sources.map((src, idx) => (
                                <li key={idx}>{src}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* ── Analysis actions ── */}
        <GlassCard>
          <SectionHeader icon={Zap} title="Analyze document" subtitle="Run AI-powered extractions on the active document" />

          <div className="action-grid">
            <ActionButton onClick={summarizeDocument} loading={isLoading("summary")} variant="purple" icon={FileText}>
              Summarize
            </ActionButton>
            <ActionButton onClick={generateQuiz} loading={isLoading("quiz")} variant="pink" icon={BookOpen}>
              Generate quiz
            </ActionButton>
            <ActionButton onClick={extractInsights} loading={isLoading("insights")} variant="orange" icon={Lightbulb}>
              Extract insights
            </ActionButton>
            <ActionButton onClick={getActionItems} loading={isLoading("actions")} variant="yellow" icon={CheckSquare}>
              Action items
            </ActionButton>
            <ActionButton onClick={getEntities} loading={isLoading("entities")} variant="cyan" icon={Tag}>
              Extract entities
            </ActionButton>
            <ActionButton onClick={getDeadlines} loading={isLoading("deadlines")} variant="red" icon={Clock}>
              Deadlines
            </ActionButton>
          </div>
        </GlassCard>

        {/* ── Results ── */}
        {(summary || quiz || insights || actionItems || entities || deadlines) && (
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                <Sparkles size={16} /> Results
              </h2>
              {summary && (
                <ActionButton onClick={downloadSummary} variant="ghost" icon={Download}>
                  Download summary PDF
                </ActionButton>
              )}
            </div>

            <div className="results-grid">
              <ResultPanel title="Summary" icon={FileText} content={summary} accentClass="accent--purple" />
              <ResultPanel title="Quiz" icon={BookOpen} content={quiz} accentClass="accent--pink" />
              <ResultPanel title="Insights" icon={Lightbulb} content={insights} accentClass="accent--orange" />
              <ResultPanel title="Action items" icon={CheckSquare} content={actionItems} accentClass="accent--yellow" />
              <ResultPanel title="Entities" icon={Tag} content={entities} accentClass="accent--cyan" />
              <ResultPanel title="Deadlines" icon={Clock} content={deadlines} accentClass="accent--red" />
            </div>
          </div>
        )}

        {/* ── Global loading overlay hint ── */}
        {loading && (
          <div className="loading-bar">
            <Loader2 size={14} className="spin" />
            <span>Processing…</span>
          </div>
        )}

        <footer className="app-footer">
          DocIntel · AI-powered document intelligence
        </footer>
      </div>
    </div>
  );
}

export default App;
