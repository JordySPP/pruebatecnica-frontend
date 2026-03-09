import { Routes, Route } from "react-router-dom";
import Motoristas from "../pages/Motoristas";
import Vehiculos from "../pages/Vehiculos";
import Registros from "../pages/Registros";
import Reportes from "../pages/Reportes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/motoristas" element={<Motoristas />} />
      <Route path="/vehiculos" element={<Vehiculos />} />
      <Route path="/Registros" element={<Registros />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/" element={<h1>Home</h1>} />
    </Routes>
  );
}

export default AppRoutes;
