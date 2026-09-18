# Rumbo — Web (Landing + Panel institucional/empresarial)

React + Vite + TypeScript. Panel para instituciones/ONGs y empresas (no para el joven usuario final, eso es la app móvil). Cubre:

- **Landing pública** (`/`), sin login.
- **Registro y login** (`/register`, `/login`) contra el backend real (`POST /auth/register`, `POST /auth/login`).
- **Panel de KPIs** (`/panel/kpis`) — datos reales calculados por el backend (retención, bienestar antes/después, usuarios por ruta, activos por mes), no mock.
- **Gestión de vacantes** (`/panel/vacantes`) — publicar/editar/eliminar vacantes y ver postulantes con su perfil y experiencia laboral. Solo visible para roles `empresa`/`institucion`.
- **Demanda y predicción** (`/panel/demanda`) — historial real de postulaciones + predicción por regresión lineal (ML) del mejor mes para publicar una vacante, por área/país.
- **Asistente de datos** — chatbot flotante (visible en todo el panel para `empresa`/`institucion`) que responde preguntas usando los KPIs y predicciones ya calculados.

## Setup

```bash
npm install
copy .env.example .env    # Windows (o cp en bash)
npm run dev
```

Requiere el backend (`rumbo-backend`) corriendo en `http://localhost:8000` (o la URL configurada en `VITE_API_URL`).

## Estructura

```
src/
  pages/
    Landing.tsx           # Landing publica
    Login.tsx             # Login institucional/empresa
    Register.tsx          # Alta de cuenta institucional/empresa
    panel/
      PanelLayout.tsx      # Sidebar responsive + datos del usuario logueado
      Kpis.tsx             # KPIs reales (Recharts)
      Vacantes.tsx         # CRUD de vacantes + postulantes
      Demanda.tsx          # Historial + prediccion ML
  components/
    ChatbotAsistente.tsx   # Asistente de datos (burbuja flotante)
  api/client.ts            # llamadas al backend FastAPI
  context/AuthContext.tsx  # token JWT + datos del usuario (GET /auth/me)
  constants.ts             # vocabulario compartido con el backend (areas, paises, tipos de empleo)
```
