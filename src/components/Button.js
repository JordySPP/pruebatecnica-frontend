import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

function AgregarButton({ label = "Agregar", onClick }) {
  return (
    <Button
      label={label}
      className="p-button-success"
      onClick={onClick}
    />
  );
}

function EditarButton({ onClick }) {
  return (
    <Button
      icon="pi pi-pencil"
      className="p-button-outlined p-button-sm"
      onClick={onClick}
    />
  );
}

function EliminarButton({ onClick }) {
  const confirmar = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas eliminar este registro?",
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: onClick,
    });
  };

  return (
    <Button
      icon="pi pi-trash"
      className="p-button-outlined p-button-danger p-button-sm"
      onClick={confirmar}
    />
  );
}

export { AgregarButton, EditarButton, EliminarButton };

