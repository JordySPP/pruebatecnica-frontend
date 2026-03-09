import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

function ModalForm({ visible, onHide, title, fields, onSubmit }) {
  const footer = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label="Guardar" icon="pi pi-check" onClick={onSubmit} />
    </div>
  );

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "420px" }}
      onHide={onHide}
      footer={footer}
      draggable={false}
      resizable={false}
    >
      <div className="p-fluid">
        {fields.map((field, index) => (
          <div className="p-field" key={index} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>{field.label}</label>
            <InputText
              type={field.type || "text"}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              placeholder={`Ingresa ${field.label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>
    </Dialog>
  );
}

export default ModalForm;