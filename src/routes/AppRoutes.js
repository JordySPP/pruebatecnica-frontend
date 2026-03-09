import { Routes, Route } from "react-router-dom";
import Motoristas from "../pages/Motoristas";
import Vehiculos from "../pages/Vehiculos";
import Registros from "../pages/Registros";
import Reportes from "../pages/Reportes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/motoristas" />} />
      <Route path="/motoristas" element={<Motoristas />} />
      <Route path="/vehiculos" element={<Vehiculos />} />
      <Route path="/registros" element={<Registros />} />
      <Route path="/reportes" element={<Reportes />} />
    </Routes>
  );
}

export default AppRoutes;
