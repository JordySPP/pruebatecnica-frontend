import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { getMotoristas, createMotorista, updateMotorista, deleteMotorista } from "../services/motoristaServices";
import { AgregarButton, EditarButton, EliminarButton } from "../components/Button";
import { ConfirmDialog } from "primereact/confirmdialog";
import ModalForm from "../components/ModalForm";

function Motoristas() {
  const [motoristas, setMotoristas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [motoristaSeleccionado, setMotoristaSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", telefono: "" });

  useEffect(() => {
    cargarMotoristas();
  }, []);

  const cargarMotoristas = () => {
    getMotoristas()
      .then((res) => setMotoristas(res.data))
      .catch((err) => console.error("Error cargando motoristas:", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    setMotoristaSeleccionado(null);
    setFormData({ nombre: "", telefono: "" });
    setShowModal(true);
  };

  const handleEditar = (motorista) => {
    setMotoristaSeleccionado(motorista);
    setFormData({ nombre: motorista.nombre, telefono: motorista.telefono });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    try {
      await deleteMotorista(id);
      cargarMotoristas();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el motorista");
    }
  };

  const handleSubmit = async () => {
    try {
      if (motoristaSeleccionado) {
        await updateMotorista(motoristaSeleccionado.id, formData);
      } else {
        await createMotorista(formData);
      }
      setShowModal(false);
      setFormData({ nombre: "", telefono: "" });
      cargarMotoristas();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el motorista");
    }
  };

  const columns = [
    { field: "id", header: "ID" },
    { field: "nombre", header: "Nombre" },
    { field: "telefono", header: "Telefono" },
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
        <h2 style={{ marginBottom: "0.75rem" }}>Lista de Motoristas</h2>
        <AgregarButton onClick={handleAgregar} />
      </div>

      <DataTable data={motoristas} columns={columns} />

      <ModalForm
        visible={showModal}
        onHide={() => setShowModal(false)}
        title={motoristaSeleccionado ? "Editar Motorista" : "Agregar Motorista"}
        fields={[
          { name: "nombre", label: "Nombre", value: formData.nombre, onChange: handleChange },
          { name: "telefono", label: "Telefono", value: formData.telefono, onChange: handleChange },
        ]}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Motoristas;