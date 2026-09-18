import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Demanda from "./pages/panel/Demanda";
import Kpis from "./pages/panel/Kpis";
import Marketplace from "./pages/panel/Marketplace";
import PanelLayout from "./pages/panel/PanelLayout";
import TalentPool from "./pages/panel/TalentPool";
import Vacantes from "./pages/panel/Vacantes";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/panel"
        element={
          <ProtectedRoute>
            <PanelLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="kpis" replace />} />
        <Route path="kpis" element={<Kpis />} />
        <Route path="demanda" element={<Demanda />} />
        <Route path="vacantes" element={<Vacantes />} />
        <Route path="talento" element={<TalentPool />} />
        <Route path="marketplace" element={<Marketplace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
