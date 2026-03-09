import { Routes, Route } from "react-router-dom";
import Motoristas from "../pages/Motoristas";
import Vehiculos from "../pages/Vehiculos";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/motoristas" element={<Motoristas />} />
      <Route path="/vehiculos" element={<Vehiculos />} />
      <Route path="/" element={<h1>Home</h1>} />
    </Routes>
  );
}

export default AppRoutes;