import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function PanelLayout() {
  const { logout } = useAuth();

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: "block",
    padding: "10px 16px",
    borderRadius: 8,
    textDecoration: "none",
    color: isActive ? "#06210f" : "#334155",
    background: isActive ? "#22c55e" : "transparent",
    fontWeight: 600,
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, borderRight: "1px solid #e2e8f0", padding: 24 }}>
        <strong style={{ display: "block", marginBottom: 24, fontSize: 18 }}>Rumbo — Panel</strong>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <NavLink to="/panel/kpis" style={linkStyle}>KPIs</NavLink>
          <NavLink to="/panel/talento" style={linkStyle}>Pool de talento</NavLink>
          <NavLink to="/panel/marketplace" style={linkStyle}>Marketplace</NavLink>
        </nav>
        <button className="btn btn-secondary" style={{ marginTop: 32 }} onClick={logout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="container" style={{ flex: 1, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}
