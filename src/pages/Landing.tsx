import { Building2, Compass, HeartHandshake, LineChart, Smartphone, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

const PASOS = [
  {
    icon: HeartHandshake,
    titulo: "1. Check-in diario",
    texto: "Registra tu estado emocional y recibí una carga de actividades adaptada a tu ritmo, sin importar la ruta que elijas.",
  },
  {
    icon: Sparkles,
    titulo: "2. Practicá con IA",
    texto: "Mejorá tu CV o tu pitch freelance, y practicá entrevistas o negociaciones con clientes antes del momento real.",
  },
  {
    icon: LineChart,
    titulo: "3. Seguí tu progreso",
    texto: "Un dashboard personal con tu historial, insignias de reconocimiento y avances en el tiempo.",
  },
];

export default function Landing() {
  return (
    <div>
      <header className="container" style={headerStyle}>
        <div style={brandStyle}>
          <Compass size={22} aria-hidden="true" />
          <strong>Rumbo</strong>
        </div>
        <Link to="/login" className="btn btn-secondary btn-sm">
          Acceso institucional
        </Link>
      </header>

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="badge" style={{ marginBottom: 16 }}>
            Empleabilidad juvenil + salud mental
          </span>
          <h1 style={{ margin: "0 auto 16px", maxWidth: 720 }}>
            Acompañamiento emocional para tu primera oportunidad laboral
          </h1>
          <p className="text-muted" style={{ fontSize: "1.125rem", margin: "0 auto 32px", maxWidth: 560 }}>
            Rumbo acompaña a jóvenes en su búsqueda de empleo tradicional o su primer cliente freelance,
            combinando check-ins de bienestar, preparación con IA y seguimiento personal.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn btn-primary" href="#descargar">
              <Smartphone size={18} aria-hidden="true" />
              Descargá la app
            </a>
            <a className="btn btn-secondary" href="#demo">
              <Building2 size={18} aria-hidden="true" />
              Soy institución, quiero una demo
            </a>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <h2>El problema</h2>
          <p className="text-muted" style={{ maxWidth: 720 }}>
            Muchos jóvenes abandonan su búsqueda laboral por ansiedad, falta de práctica y de acompañamiento
            — ya sea que busquen un empleo corporativo o su primer proyecto freelance. La escasez de
            vacantes formales en Bolivia empuja a cada vez más jóvenes hacia el trabajo remoto, un camino
            con su propia carga emocional.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ marginBottom: 32 }}>Cómo funciona</h2>
          <div className="grid-cards">
            {PASOS.map(({ icon: Icon, titulo, texto }) => (
              <div className="card" key={titulo}>
                <div className="card-title">
                  <span className="icon-badge">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h3 style={{ margin: 0 }}>{titulo}</h3>
                </div>
                <p className="text-muted" style={{ margin: 0 }}>
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="section section-muted">
        <div className="container">
          <h2>Para instituciones y empresas</h2>
          <p className="text-muted" style={{ maxWidth: 720 }}>
            Universidades, ONGs y empresas pueden licenciar Rumbo y acceder a un panel con reportes de
            KPIs de empleabilidad y bienestar de los jóvenes que acompañan, además de un pool de talento
            junior preparado.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/login" className="btn btn-primary">
              Solicitar demo institucional
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Registrar mi institución/empresa
            </Link>
          </div>
        </div>
      </section>

      <footer className="container" style={{ padding: "32px 0" }}>
        <p className="text-muted text-sm" style={{ margin: 0 }}>
          © {new Date().getFullYear()} Rumbo — Proyecto de HACKBIZ 2026, U.A.G.R.M.
        </p>
      </footer>
    </div>
  );
}

const headerStyle: CSSProperties = {
  padding: "20px 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: "1.125rem",
  color: "var(--color-foreground)",
};
