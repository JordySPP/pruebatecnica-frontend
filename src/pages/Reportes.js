import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { getRegistros } from "../services/registroServices";
import { getMotoristas } from "../services/motoristaServices";
import { getVehiculos } from "../services/vehiculoServices";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function Reportes() {
  const [registros, setRegistros] = useState([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState([]);
  const [todosMotoristas, setTodosMotoristas] = useState([]);
  const [todosVehiculos, setTodosVehiculos] = useState([]);
  const [opcionesMotoristas, setOpcionesMotoristas] = useState([]);
  const [opcionesVehiculos, setOpcionesVehiculos] = useState([]);

  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    motoristaId: null,
    vehiculoId: null,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [regRes, motRes, vehRes] = await Promise.all([
        getRegistros(),
        getMotoristas(),
        getVehiculos(),
      ]);

      setRegistros(regRes.data);
      setRegistrosFiltrados(regRes.data);
      setTodosMotoristas(motRes.data);
      setTodosVehiculos(vehRes.data);

      setOpcionesMotoristas([
        { label: "Todos", value: null },
        ...motRes.data.map((m) => ({ label: m.nombre, value: m.id })),
      ]);

      setOpcionesVehiculos([
        { label: "Todos", value: null },
        ...vehRes.data.map((v) => ({
          label: `${v.marca} ${v.modelo} - ${v.placa}`,
          value: v.id,
        })),
      ]);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...registros];

    if (filtros.fechaDesde) {
      resultado = resultado.filter((r) => r.fechaEntrada >= filtros.fechaDesde);
    }

    if (filtros.fechaHasta) {
      resultado = resultado.filter((r) => r.fechaEntrada <= filtros.fechaHasta);
    }

    if (filtros.motoristaId) {
      resultado = resultado.filter((r) => r.motoristaId === filtros.motoristaId);
    }

    if (filtros.vehiculoId) {
      resultado = resultado.filter((r) => r.vehiculoId === filtros.vehiculoId);
    }

    setRegistrosFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setFiltros({ fechaDesde: "", fechaHasta: "", motoristaId: null, vehiculoId: null });
    setRegistrosFiltrados(registros);
  };

  const columns = [
    { field: "id", header: "ID" },
    {
      header: "Motorista",
      body: (rowData) => {
        const motorista = todosMotoristas.find((m) => m.id === rowData.motoristaId);
        return motorista ? motorista.nombre : rowData.motoristaId;
      },
    },
    {
      header: "Vehículo",
      body: (rowData) => {
        const vehiculo = todosVehiculos.find((v) => v.id === rowData.vehiculoId);
        return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}` : rowData.vehiculoId;
      },
    },
    { field: "fechaEntrada", header: "Fecha Inicio" },
    { field: "horaEntrada", header: "Hora Inicio" },
    { field: "kmEntrada", header: "KM Inicio" },
    { field: "fechaSalida", header: "Fecha Fin" },
    { field: "horaSalida", header: "Hora Fin" },
    { field: "kmSalida", header: "KM Fin" },
  ];

  return (
    <div style={{ padding: "0 1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Reportes</h2>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>Desde</label>
            <InputText
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>Hasta</label>
            <InputText
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>Motorista</label>
            <Dropdown
              value={filtros.motoristaId}
              options={opcionesMotoristas}
              onChange={(e) => setFiltros({ ...filtros, motoristaId: e.value })}
              placeholder="Todos"
              style={{ minWidth: "180px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>Vehículo</label>
            <Dropdown
              value={filtros.vehiculoId}
              options={opcionesVehiculos}
              onChange={(e) => setFiltros({ ...filtros, vehiculoId: e.value })}
              placeholder="Todos"
              style={{ minWidth: "200px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button label="Filtrar" icon="pi pi-search" onClick={aplicarFiltros} className="p-button-sm" />
            <Button label="Limpiar" icon="pi pi-times" onClick={limpiarFiltros} className="p-button-sm p-button-outlined" />
          </div>
        </div>
      </div>

      <DataTable data={registrosFiltrados} columns={columns} />
    </div>
  );
}

export default Reportes;