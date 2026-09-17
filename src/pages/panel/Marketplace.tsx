const PROYECTOS_MOCK = [
  { titulo: "Diseño de flyer para evento local", presupuesto: "$50 - $80", categoria: "Diseño gráfico" },
  { titulo: "Landing page simple para emprendimiento", presupuesto: "$150 - $250", categoria: "Desarrollo web" },
  { titulo: "Redacción de 5 posts para redes sociales", presupuesto: "$30 - $60", categoria: "Marketing" },
];

export default function Marketplace() {
  return (
    <div>
      <h1>Marketplace de proyectos freelance</h1>
      <p style={{ color: "#475569" }}>
        Vista mock, sin transacciones reales — se presenta como visión de Fase 2/3 del producto.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {PROYECTOS_MOCK.map((p) => (
          <div className="card" key={p.titulo}>
            <h3 style={{ margin: "0 0 8px" }}>{p.titulo}</h3>
            <p style={{ margin: "4px 0", fontSize: 14 }}>Categoría: {p.categoria}</p>
            <p style={{ margin: "4px 0", fontSize: 14 }}>Presupuesto: {p.presupuesto}</p>
            <button className="btn btn-secondary" disabled>Postularme (próximamente)</button>
          </div>
        ))}
      </div>
    </div>
  );
}
