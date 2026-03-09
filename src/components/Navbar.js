import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Motoristas",
      icon: "pi pi-users",
      command: () => navigate("/motoristas"),
    },
    {
      label: "Vehículos",
      icon: "pi pi-car",
      command: () => navigate("/vehiculos"),
    },
    {
      label: "Registros",
      icon: "pi pi-list",
      command: () => navigate("/registros"),
    },
  ];

  return <Menubar model={items} />;
}

export default Navbar;