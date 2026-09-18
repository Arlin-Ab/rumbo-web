import { AlertCircle, Compass, Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      login(res.access_token, res.role);
      navigate("/panel/kpis");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 72, paddingBottom: 72 }}>
      <Link
        to="/"
        className="text-muted text-sm"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, textDecoration: "none" }}
      >
        <Compass size={16} aria-hidden="true" /> Rumbo
      </Link>

      <h1>Acceso institucional</h1>
      <p className="text-muted">Para instituciones y empresas asociadas a Rumbo.</p>

      <form onSubmit={handleSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
        {error && (
          <div className="form-alert" role="alert">
            <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="field">
          <label className="label" htmlFor="login-email">
            Email
          </label>
          <div className="input-wrapper">
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="nombre@institucion.org"
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="login-password">
            Contraseña
          </label>
          <div className="input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-with-action"
            />
            <button
              type="button"
              className="input-action"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="text-muted text-sm" style={{ textAlign: "center", margin: 0 }}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Registrá tu institución/empresa
          </Link>
        </p>
      </form>
    </div>
  );
}
