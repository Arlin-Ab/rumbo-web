import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <header className="container" style={{ padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: 20 }}>Rumbo</strong>
        <Link to="/login" className="btn btn-secondary">Acceso institucional</Link>
      </header>

      <section className="container" style={{ padding: "64px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>Encontrá tu rumbo laboral</h1>
        <p style={{ fontSize: 18, color: "#475569", maxWidth: 560, margin: "0 auto 32px" }}>
          Rumbo acompaña a jóvenes en su primer paso hacia un empleo tradicional o el trabajo freelance,
          con check-ins de bienestar, práctica con IA y seguimiento personal.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <a className="btn btn-primary" href="#descargar">Descargá la app</a>
          <a className="btn btn-secondary" href="#demo">Soy institución, quiero una demo</a>
        </div>
      </section>

      <section className="container" style={{ padding: "48px 0" }}>
        <h2>El problema</h2>
        <p style={{ color: "#475569", maxWidth: 720 }}>
          Muchos jóvenes abandonan su búsqueda laboral por ansiedad, falta de práctica y de acompañamiento,
          sin importar si buscan un empleo tradicional o quieren iniciarse como freelance.
        </p>
      </section>

      <section className="container" style={{ padding: "48px 0" }}>
        <h2>Cómo funciona</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div className="card">
            <h3>1. Check-in diario</h3>
            <p>Registra tu estado emocional y recibí una carga de actividades adaptada a tu ritmo.</p>
          </div>
          <div className="card">
            <h3>2. Practicá con IA</h3>
            <p>Mejorá tu CV o tu pitch freelance, y practicá entrevistas o negociaciones con clientes.</p>
          </div>
          <div className="card">
            <h3>3. Seguí tu progreso</h3>
            <p>Un dashboard personal con tu historial, insignias y avances.</p>
          </div>
        </div>
      </section>

      <section id="demo" className="container" style={{ padding: "48px 0" }}>
        <h2>Para instituciones y empresas</h2>
        <p style={{ color: "#475569", maxWidth: 720 }}>
          Universidades, ONGs y empresas pueden acceder a un panel con reportes de KPIs de empleabilidad
          y bienestar de los jóvenes que acompañan.
        </p>
        <Link to="/login" className="btn btn-primary">Solicitar demo institucional</Link>
      </section>

      <footer className="container" style={{ padding: "32px 0", color: "#94a3b8", fontSize: 14 }}>
        © {new Date().getFullYear()} Rumbo — Proyecto de hackathon.
      </footer>
    </div>
  );
}
