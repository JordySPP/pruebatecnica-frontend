import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { getVehiculos, createVehiculo, updateVehiculo, deleteVehiculo } from "../services/vehiculoServices";
import { AgregarButton, EditarButton, EliminarButton } from "../components/Button";
import { ConfirmDialog } from "primereact/confirmdialog";
import ModalForm from "../components/ModalForm";

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ marca: "", modelo: "", placa: "" });

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = () => {
    getVehiculos()
      .then((res) => setVehiculos(res.data))
      .catch((err) => console.error("Error cargando vehículos:", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    setVehiculoSeleccionado(null);
    setFormData({ marca: "", modelo: "", placa: "" });
    setShowModal(true);
  };

  const handleEditar = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setFormData({ marca: vehiculo.marca, modelo: vehiculo.modelo, placa: vehiculo.placa });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    try {
      await deleteVehiculo(id);
      cargarVehiculos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el vehículo");
    }
  };

  const handleSubmit = async () => {
    try {
      if (vehiculoSeleccionado) {
        await updateVehiculo(vehiculoSeleccionado.id, formData);
      } else {
        await createVehiculo(formData);
      }
      setShowModal(false);
      setFormData({ marca: "", modelo: "", placa: "" });
      cargarVehiculos();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el vehículo");
    }
  };

  const columns = [
    { field: "id", header: "ID" },
    { field: "marca", header: "Marca" },
    { field: "modelo", header: "Modelo" },
    { field: "placa", header: "Placa" },
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
        <h2 style={{ marginBottom: "0.75rem" }}>Lista de Vehículos</h2>
        <AgregarButton onClick={handleAgregar} />
      </div>

      <DataTable data={vehiculos} columns={columns} />

      <ModalForm
        visible={showModal}
        onHide={() => setShowModal(false)}
        title={vehiculoSeleccionado ? "Editar Vehículo" : "Agregar Vehículo"}
        fields={[
          { name: "marca", label: "Marca", value: formData.marca, onChange: handleChange },
          { name: "modelo", label: "Modelo", value: formData.modelo, onChange: handleChange },
          { name: "placa", label: "Placa", value: formData.placa, onChange: handleChange },
        ]}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Vehiculos;