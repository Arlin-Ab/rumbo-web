import { BarChart3, Briefcase, Compass, LineChart, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import ChatbotAsistente from "../../components/ChatbotAsistente";
import { useAuth } from "../../context/AuthContext";

export default function PanelLayout() {
  const { user, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/panel/kpis", label: "KPIs", icon: BarChart3 },
    { to: "/panel/demanda", label: "Demanda y predicción", icon: LineChart },
    ...(role === "empresa" || role === "institucion"
      ? [{ to: "/panel/vacantes", label: "Vacantes", icon: Briefcase }]
      : []),
  ];

  return (
    <div className="panel-shell">
      <header className="panel-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Compass size={20} aria-hidden="true" />
          <strong>Rumbo</strong>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú de navegación"
          aria-expanded={mobileOpen}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </header>

      {mobileOpen && (
        <div className="panel-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside className={`panel-sidebar ${mobileOpen ? "panel-sidebar-open" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Compass size={20} aria-hidden="true" />
            <strong style={{ fontSize: "1.125rem" }}>Rumbo — Panel</strong>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm panel-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="card" style={{ padding: 12, marginBottom: 20 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>
            {user?.nombre ?? "Cargando..."}
          </p>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            {role === "empresa" ? "Cuenta empresa" : "Cuenta institución"}
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `panel-nav-link ${isActive ? "panel-nav-link-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="btn btn-ghost" style={{ marginTop: 24, color: "var(--color-destructive)" }} onClick={logout}>
          <LogOut size={18} aria-hidden="true" />
          Cerrar sesión
        </button>
      </aside>

      <main className="panel-main">
        <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
          <Outlet />
        </div>
      </main>

      {(role === "empresa" || role === "institucion") && <ChatbotAsistente />}
    </div>
  );
}
