# Rumbo — Web (Landing + Panel institucional/empresarial)

React + Vite + TypeScript. Cubre:

- **UC-17** — Landing pública (`/`), sin login.
- **UC-13** — Panel de KPIs institucional (`/panel/kpis`), con login contra el backend FastAPI y datos mock con la forma real (gráficos con Recharts).
- **UC-14** — Pool de talento (`/panel/talento`), mock estático.
- **UC-16** — Marketplace freelance (`/panel/marketplace`), mock estático, no funcional.

## Setup

```bash
npm install
copy .env.example .env    # Windows (o cp en bash)
npm run dev
```

Requiere el backend (`rumbo-backend`) corriendo en `http://localhost:8000` (o la URL configurada en `VITE_API_URL`) para el login institucional y los KPIs.

## Estructura

```
src/
  pages/
    Landing.tsx          # UC-17
    Login.tsx            # login institucional/empresa
    panel/
      PanelLayout.tsx     # sidebar + logout
      Kpis.tsx            # UC-13
      TalentPool.tsx      # UC-14 (mock)
      Marketplace.tsx     # UC-16 (mock)
  api/client.ts          # llamadas al backend FastAPI
  context/AuthContext.tsx # token JWT en localStorage
```
