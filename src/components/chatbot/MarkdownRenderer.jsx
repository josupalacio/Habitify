import React from "react";
import { FaCopy, FaCheck } from "react-icons/fa6";
import "./MarkdownRenderer.css";

const MarkdownRenderer = ({ text }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown text to JSX
  const parseMarkdown = (content) => {
    const elements = [];
    let lastIndex = 0;

    // Regex para detectar:
    // **bold**, *italic*, `code`, - list items, números con ., saltos de línea
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|-\s+[^\n]+|\d+\.\s+[^\n]+|\n\n|\n)/g;

    let match;
    const matches = [];

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        matches.push({
          type: "text",
          content: content.substring(lastIndex, match.index),
        });
      }

      const matched = match[0];

      if (matched.startsWith("**") && matched.endsWith("**")) {
        matches.push({
          type: "bold",
          content: matched.slice(2, -2),
        });
      } else if (matched.startsWith("*") && matched.endsWith("*")) {
        matches.push({
          type: "italic",
          content: matched.slice(1, -1),
        });
      } else if (matched.startsWith("`") && matched.endsWith("`")) {
        matches.push({
          type: "code",
          content: matched.slice(1, -1),
        });
      } else if (matched.startsWith("-")) {
        matches.push({
          type: "listItem",
          content: matched.slice(2).trim(),
        });
      } else if (matched.match(/^\d+\./)) {
        matches.push({
          type: "orderedItem",
          content: matched.slice(matched.indexOf(".") + 1).trim(),
        });
      } else if (matched === "\n\n") {
        matches.push({
          type: "paragraph",
          content: null,
        });
      } else if (matched === "\n") {
        matches.push({
          type: "linebreak",
          content: null,
        });
      }

      lastIndex = match.index + matched.length;
    }

    if (lastIndex < content.length) {
      matches.push({
        type: "text",
        content: content.substring(lastIndex),
      });
    }

    // Convertir matches a JSX
    return matches.map((match, idx) => {
      switch (match.type) {
        case "bold":
          return <strong key={idx}>{match.content}</strong>;
        case "italic":
          return <em key={idx}>{match.content}</em>;
        case "code":
          return (
            <code key={idx} className="inline-code">
              {match.content}
            </code>
          );
        case "listItem":
          return (
            <div key={idx} className="list-item">
              • {match.content}
            </div>
          );
        case "orderedItem":
          return (
            <div key={idx} className="ordered-item">
              {match.content}
            </div>
          );
        case "paragraph":
          return <div key={idx} className="paragraph-break" />;
        case "linebreak":
          return <br key={idx} />;
        case "text":
        default:
          return <span key={idx}>{match.content}</span>;
      }
    });
  };

  return (
    <div className="markdown-container">
      <div className="markdown-content">{parseMarkdown(text)}</div>
      <button
        className="copy-button"
        onClick={copyToClipboard}
        title="Copiar al portapapeles"
      >
        {copied ? (
          <>
            <FaCheck /> Copiado
          </>
        ) : (
          <>
            <FaCopy /> Copiar
          </>
        )}
      </button>
    </div>
  );
};

export default MarkdownRenderer;
