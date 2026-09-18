import { AlertCircle, Compass, Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

type Role = "institucion" | "empresa";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("institucion");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await api.register({ nombre, email, password, role, codigo_institucional: codigo });
      const res = await api.login(email, password);
      login(res.access_token, res.role);
      navigate("/panel/kpis");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 460, paddingTop: 72, paddingBottom: 72 }}>
      <Link
        to="/"
        className="text-muted text-sm"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, textDecoration: "none" }}
      >
        <Compass size={16} aria-hidden="true" /> Rumbo
      </Link>

      <h1>Registrar institución/empresa</h1>

      <form onSubmit={handleSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
        {error && (
          <div className="form-alert" role="alert">
            <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="field">
          <span className="label">Tipo de cuenta</span>
          <div className="segmented" role="group" aria-label="Tipo de cuenta">
            <button type="button" aria-pressed={role === "institucion"} onClick={() => setRole("institucion")}>
              Institución / ONG
            </button>
            <button type="button" aria-pressed={role === "empresa"} onClick={() => setRole("empresa")}>
              Empresa
            </button>
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="reg-nombre">
            Nombre de la institución o empresa
            <span className="required-mark">*</span>
          </label>
          <input
            id="reg-nombre"
            type="text"
            autoComplete="organization"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
            placeholder="Universidad Autónoma Gabriel René Moreno"
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="reg-email">
            Email de contacto
            <span className="required-mark">*</span>
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="reg-password">
            Contraseña
            <span className="required-mark">*</span>
          </label>
          <div className="input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
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
          <span className="help-text">Mínimo 8 caracteres.</span>
        </div>

        <div className="field">
          <label className="label" htmlFor="reg-codigo">
            Código de invitación
            <span className="required-mark">*</span>
          </label>
          <input
            id="reg-codigo"
            type="text"
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="input"
          />
          <span className="help-text">Te lo comparte el equipo de Rumbo al validar tu institución/empresa.</span>
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="text-muted text-sm" style={{ textAlign: "center", margin: 0 }}>
          ¿Ya tenés cuenta? <Link to="/login" style={{ fontWeight: 600 }}>Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
}
