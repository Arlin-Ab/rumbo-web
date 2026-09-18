import { AlertCircle, Bot, Send, Sparkles, X } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

import { api, ApiError } from "../api/client";

interface Mensaje {
  rol: "usuario" | "asistente";
  texto: string;
}

const PREGUNTAS_SUGERIDAS = [
  "¿Cuándo conviene publicar una vacante de Desarrollo web?",
  "¿En qué país hay más postulantes de Marketing digital?",
];

// Parser liviano para el markdown simple que devuelve la IA (**negrita** y
// listas con "- "), sin sumar una dependencia entera de markdown.
function parsearNegrita(texto: string): ReactNode {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return partes.map((parte, i) => {
    const match = parte.match(/^\*\*([^*]+)\*\*$/);
    return match ? <strong key={i}>{match[1]}</strong> : <span key={i}>{parte}</span>;
  });
}

function renderizarRespuesta(texto: string): ReactNode {
  return texto.split("\n").map((linea, i) => {
    if (linea.trim() === "") return <div key={i} style={{ height: 6 }} />;

    const esBullet = /^[-*]\s+/.test(linea);
    const contenido = esBullet ? linea.replace(/^[-*]\s+/, "") : linea;

    if (esBullet) {
      return (
        <div key={i} style={{ display: "flex", gap: 6, margin: "2px 0" }}>
          <span aria-hidden="true">•</span>
          <span>{parsearNegrita(contenido)}</span>
        </div>
      );
    }
    return <div key={i}>{parsearNegrita(contenido)}</div>;
  });
}

export default function ChatbotAsistente() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [pregunta, setPregunta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, enviando]);

  async function enviarPregunta(texto: string) {
    const limpio = texto.trim();
    if (!limpio || enviando) return;

    setMensajes((prev) => [...prev, { rol: "usuario", texto: limpio }]);
    setPregunta("");
    setEnviando(true);
    setError(null);
    try {
      const { respuesta } = await api.consultarAsistente(limpio);
      setMensajes((prev) => [...prev, { rol: "asistente", texto: respuesta }]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo consultar al asistente");
    } finally {
      setEnviando(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    enviarPregunta(pregunta);
  }

  return (
    <>
      {abierto && (
        <div
          role="dialog"
          aria-label="Asistente de datos"
          style={{
            position: "fixed",
            right: 20,
            bottom: 92,
            width: "min(380px, calc(100vw - 40px))",
            height: "min(560px, calc(100vh - 140px))",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 12px 32px rgba(15, 43, 51, 0.18)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-primary)",
              color: "#fff",
            }}
          >
            <Sparkles size={18} aria-hidden="true" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", wordBreak: "break-word" }}>Asistente de datos</p>
              <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.9, wordBreak: "break-word" }}>KPIs + predicción por IA</p>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar asistente"
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {mensajes.length === 0 && (
              <div>
                <p className="text-muted text-sm" style={{ margin: "0 0 12px" }}>
                  Preguntame cuándo conviene publicar una vacante, o en qué países hay más demanda de cierta área. Respondo
                  en base a los KPIs y al modelo de predicción de este panel.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {PREGUNTAS_SUGERIDAS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{
                        textAlign: "left",
                        justifyContent: "flex-start",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        width: "100%",
                        lineHeight: 1.3,
                      }}
                      onClick={() => enviarPregunta(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mensajes.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.rol === "usuario" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: 14,
                    background: m.rol === "usuario" ? "var(--color-primary)" : "var(--color-background)",
                    color: m.rol === "usuario" ? "#fff" : "var(--color-foreground)",
                    border: m.rol === "usuario" ? "none" : "1px solid var(--color-border)",
                    whiteSpace: m.rol === "usuario" ? "pre-wrap" : "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    fontSize: "0.9rem",
                    lineHeight: 1.45,
                  }}
                >
                  {m.rol === "asistente" ? renderizarRespuesta(m.texto) : m.texto}
                </div>
              </div>
            ))}

            {enviando && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 14,
                    background: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    fontSize: "0.9rem",
                  }}
                  className="text-muted"
                >
                  Pensando...
                </div>
              </div>
            )}

            {error && (
              <div className="form-alert" role="alert">
                <AlertCircle size={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: "0.85rem", wordBreak: "break-word", minWidth: 0 }}>{error}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--color-border)" }}>
            <input
              type="text"
              className="input"
              placeholder="Escribí tu pregunta..."
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              disabled={enviando}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={enviando || !pregunta.trim()} aria-label="Enviar pregunta">
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar asistente de datos" : "Abrir asistente de datos"}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--color-primary)",
          color: "#fff",
          border: "none",
          boxShadow: "0 8px 20px rgba(15, 43, 51, 0.25)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        {abierto ? <X size={24} aria-hidden="true" /> : <Bot size={24} aria-hidden="true" />}
      </button>
    </>
  );
}
