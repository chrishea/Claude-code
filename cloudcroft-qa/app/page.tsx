"use client";

import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";

interface Source {
  content: string;
  metadata: Record<string, string>;
}

interface Answer {
  answer: string;
  sources: Source[];
}

const EXAMPLE_QUESTIONS = [
  "What is Cloudcroft known for?",
  "Tell me about the history of Cloudcroft",
  "What outdoor activities are available?",
  "Where can I eat in Cloudcroft?",
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setAnswer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleExampleClick(exampleQuestion: string) {
    setQuestion(exampleQuestion);
  }

  return (
    <div className="container">
      <header>
        <h1>Ask Cloudcroft</h1>
        <p>Your AI-powered guide to Cloudcroft, New Mexico</p>
      </header>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Ask anything about Cloudcroft, NM..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "..." : "Ask"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Searching knowledge base</div>}

      {answer && (
        <div className="answer-card">
          <h2>Answer</h2>
          <div className="answer-text">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {answer.answer}
            </ReactMarkdown>
          </div>

          {answer.sources.length > 0 && (
            <div className="sources">
              <h3>Sources used ({answer.sources.length})</h3>
              {answer.sources.map((source, i) => (
                <div key={i} className="source-item">
                  {source.metadata.title || `Source ${i + 1}`}
                  {source.metadata.url && (
                    <> - <a href={source.metadata.url} target="_blank" rel="noopener noreferrer">View</a></>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="examples">
        <h3>Try asking:</h3>
        <div className="example-buttons">
          {EXAMPLE_QUESTIONS.map((eq) => (
            <button
              key={eq}
              className="example-button"
              onClick={() => handleExampleClick(eq)}
              type="button"
            >
              {eq}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
