import { Briefcase, GraduationCap, Info, User } from "lucide-react";

const CANDIDATOS_MOCK = [
  { nombre: "Ana G.", ruta: "Tradicional", sector: "Administración", nivel: "Inicial" },
  { nombre: "Bruno L.", ruta: "Freelance", sector: "Diseño gráfico", nivel: "Intermedio" },
  { nombre: "Camila R.", ruta: "Tradicional", sector: "Atención al cliente", nivel: "Inicial" },
  { nombre: "Diego M.", ruta: "Freelance", sector: "Desarrollo web", nivel: "Intermedio" },
  { nombre: "Elena P.", ruta: "Ambas", sector: "Marketing digital", nivel: "Inicial" },
];

export default function TalentPool() {
  return (
    <div>
      <h1>Pool de talento</h1>
      <div className="form-alert" style={{ marginBottom: 24, maxWidth: 640 }}>
        <Info size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          Datos de ejemplo para la demo — en el MVP real se conecta al backend con jóvenes que autorizaron
          compartir su perfil con empresas.
        </span>
      </div>

      <div className="grid-cards">
        {CANDIDATOS_MOCK.map((c) => (
          <div className="card" key={c.nombre}>
            <div className="card-title">
              <span className="icon-badge">
                <User size={18} aria-hidden="true" />
              </span>
              <h3 style={{ margin: 0 }}>{c.nombre}</h3>
            </div>
            <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 0 4px" }}>
              <Briefcase size={14} aria-hidden="true" /> {c.sector}
            </p>
            <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 12px" }}>
              <GraduationCap size={14} aria-hidden="true" /> Nivel {c.nivel.toLowerCase()}
            </p>
            <span className="badge">{c.ruta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
