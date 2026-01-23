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

  const parseMarkdown = (content) => {
    // 1. LIMPIEZA DE ESPACIOS RAROS:
    // Eliminamos espacios en blanco al inicio de cada línea que Gemini usa para "sangría"
    const cleanContent = content
      .split("\n")
      .map(line => line.replace(/^\s+/, "")) // Esto quita el margin raro del inicio
      .join("\n")
      .trim();

    // 2. REGEX: Detecta negritas, itálicas, listas y saltos de línea
    // Mejorada para capturar negritas incluso si están al inicio de línea
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|^-\s+.+|^\d+\.\s+.+|\n)/gm;
    
    const parts = cleanContent.split(regex);
    
    return parts.map((part, idx) => {
      if (!part) return null;

      // NEGRITAS **texto**
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      } 
      // ITÁLICAS *texto*
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={idx}>{part.slice(1, -1)}</em>;
      } 
      // CÓDIGO `texto`
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={idx} className="inline-code">{part.slice(1, -1)}</code>;
      } 
      // LISTAS - item
      if (part.startsWith("- ")) {
        return <div key={idx} className="list-item">• {part.slice(2)}</div>;
      } 
      // LISTAS NUMERADAS 1. item
      if (part.match(/^\d+\./)) {
        return <div key={idx} className="ordered-item">{part}</div>;
      }
      // SALTOS DE LÍNEA
      if (part === "\n") {
        return <br key={idx} />;
      }

      // TEXTO PLANO
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="markdown-container">
      <div className="markdown-content">{parseMarkdown(text)}</div>
      <button className="copy-button" onClick={copyToClipboard}>
        {copied ? <><FaCheck /> Copiado</> : <><FaCopy /> Copiar</>}
      </button>
    </div>
  );
};

export default MarkdownRenderer;