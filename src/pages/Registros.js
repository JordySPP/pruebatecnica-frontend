import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { getRegistros, createRegistro, registrarSalida, deleteRegistro } from "../services/registroServices";
import { getMotoristas } from "../services/motoristaServices";
import { getVehiculos } from "../services/vehiculoServices";
import { AgregarButton, EditarButton, EliminarButton } from "../components/Button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

function Registros() {
  const [registros, setRegistros] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [todosMotoristas, setTodosMotoristas] = useState([]);
  const [todosVehiculos, setTodosVehiculos] = useState([]);

  const [showModalEntrada, setShowModalEntrada] = useState(false);
  const [showModalSalida, setShowModalSalida] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

  const [formEntrada, setFormEntrada] = useState({
    vehiculoId: null,
    motoristaId: null,
    fechaEntrada: "",
    horaEntrada: "",
    kmEntrada: "",
  });

  const [formSalida, setFormSalida] = useState({
    fechaSalida: "",
    horaSalida: "",
    kmSalida: "",
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

    const registrosData = regRes.data;

    setTodosMotoristas(motRes.data);
    setTodosVehiculos(vehRes.data);

    const ocupados = registrosData.filter((r) => !r.fechaSalida);
    const motoristaOcupados = ocupados.map((r) => r.motoristaId);
    const vehiculosOcupados = ocupados.map((r) => r.vehiculoId);

    setMotoristas(
      motRes.data
        .filter((m) => !motoristaOcupados.includes(m.id))
        .map((m) => ({ label: m.nombre, value: m.id }))
    );

    setVehiculos(
      vehRes.data
        .filter((v) => !vehiculosOcupados.includes(v.id))
        .map((v) => ({ label: `${v.marca} ${v.modelo} - ${v.placa}`, value: v.id }))
    );

    setRegistros(registrosData);

  } catch (err) {
    console.error("Error cargando datos:", err);
  }
};

  const handleChangeEntrada = (e) => {
    setFormEntrada({ ...formEntrada, [e.target.name]: e.target.value });
  };

  const handleChangeSalida = (e) => {
    setFormSalida({ ...formSalida, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    setFormEntrada({ vehiculoId: null, motoristaId: null, fechaEntrada: "", horaEntrada: "", kmEntrada: "" });
    setShowModalEntrada(true);
  };

  const handleEditar = (registro) => {
    setRegistroSeleccionado(registro);
    setFormSalida({
      fechaSalida: registro.fechaSalida || "",
      horaSalida: registro.horaSalida || "",
      kmSalida: registro.kmSalida || "",
    });
    setShowModalSalida(true);
  };

  const handleEliminar = async (id) => {
    try {
      await deleteRegistro(id);
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el registro");
    }
  };

  const handleSubmitEntrada = async () => {
    try {
      await createRegistro(formEntrada);
      setShowModalEntrada(false);
      setFormEntrada({ vehiculoId: null, motoristaId: null, fechaEntrada: "", horaEntrada: "", kmEntrada: "" });
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error al crear el registro");
    }
  };

  const handleSubmitSalida = async () => {
    try {
      await registrarSalida(registroSeleccionado.id, formSalida);
      setShowModalSalida(false);
      setFormSalida({ fechaSalida: "", horaSalida: "", kmSalida: "" });
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error al registrar la salida");
    }
  };

  const footerEntrada = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowModalEntrada(false)} className="p-button-text" />
      <Button label="Guardar" icon="pi pi-check" onClick={handleSubmitEntrada} />
    </div>
  );

  const footerSalida = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowModalSalida(false)} className="p-button-text" />
      <Button label="Guardar" icon="pi pi-check" onClick={handleSubmitSalida} />
    </div>
  );

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
    {
      header: "Acciones",
      body: (rowData) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <EditarButton onClick={() => handleEditar(rowData)} />
          <EliminarButton onClick={() => handleEliminar(rowData.id)} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 1rem" }}>
      <ConfirmDialog />
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>Lista de Registros</h2>
        <AgregarButton onClick={handleAgregar} />
      </div>

      <DataTable data={registros} columns={columns} />

      {/* Modal Entrada */}
      <Dialog
        header="Inicio de Jornada"
        visible={showModalEntrada}
        style={{ width: "420px" }}
        onHide={() => setShowModalEntrada(false)}
        footer={footerEntrada}
        draggable={false}
        resizable={false}
      >
        <div className="p-fluid">
          <div className="p-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Motorista</label>
            <Dropdown
              value={formEntrada.motoristaId}
              options={motoristas}
              onChange={(e) => setFormEntrada({ ...formEntrada, motoristaId: e.value })}
              placeholder="Selecciona un motorista"
            />
          </div>
          <div className="p-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Vehículo</label>
            <Dropdown
              value={formEntrada.vehiculoId}
              options={vehiculos}
              onChange={(e) => setFormEntrada({ ...formEntrada, vehiculoId: e.value })}
              placeholder="Selecciona un vehículo"
            />
          </div>
          <div className="p-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Fecha Inicio</label>
            <InputText type="date" name="fechaEntrada" value={formEntrada.fechaEntrada} onChange={handleChangeEntrada} />
          </div>
          <div className="p-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Hora Inicio</label>
            <InputText type="time" name="horaEntrada" value={formEntrada.horaEntrada} onChange={handleChangeEntrada} />
          </div>
          <div className="p-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>KM Inicio</label>
            <InputText type="number" name="kmEntrada" value={formEntrada.kmEntrada} onChange={handleChangeEntrada} placeholder="Ingresa km de inicio" />
          </div>
        </div>
      </Dialog>

      {/* Modal Salida */}
      <Dialog
        header="Fin de Jornada"
        visible={showModalSalida}
        style={{ width: "420px" }}
        onHide={() => setShowModalSalida(false)}
        footer={footerSalida}
        draggable={false}
        resizable={false}
      >
        <div className="p-fluid">
          <div className="p-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Fecha Fin</label>
            <InputText type="date" name="fechaSalida" value={formSalida.fechaSalida} onChange={handleChangeSalida} />
          </div>
          <div className="p-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Hora Fin</label>
            <InputText type="time" name="horaSalida" value={formSalida.horaSalida} onChange={handleChangeSalida} />
          </div>
          <div className="p-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>KM Fin</label>
            <InputText type="number" name="kmSalida" value={formSalida.kmSalida} onChange={handleChangeSalida} placeholder="Ingresa km de fin" />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Registros;