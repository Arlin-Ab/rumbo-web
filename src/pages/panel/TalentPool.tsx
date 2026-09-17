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
      <p style={{ color: "#475569" }}>
        Datos de ejemplo para la demo — en el MVP real se conectará al backend con jóvenes que autorizaron
        compartir su perfil con empresas.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {CANDIDATOS_MOCK.map((c) => (
          <div className="card" key={c.nombre}>
            <h3 style={{ margin: "0 0 8px" }}>{c.nombre}</h3>
            <p style={{ margin: "4px 0", fontSize: 14 }}>Ruta: {c.ruta}</p>
            <p style={{ margin: "4px 0", fontSize: 14 }}>Sector: {c.sector}</p>
            <p style={{ margin: "4px 0", fontSize: 14 }}>Nivel: {c.nivel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
