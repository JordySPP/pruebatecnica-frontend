import { DataTable as PrimeDataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function DataTable({ data, columns }) {
  return (
    <PrimeDataTable
      value={data}
      paginator
      rows={10}
      stripedRows
      showGridlines
      responsiveLayout="scroll"
      tableStyle={{ minWidth: "50rem" }}
    >
      {columns.map((col, index) => (
        <Column
          key={index}
          field={col.field}
          header={col.header}
          body={col.body}
        />
      ))}
    </PrimeDataTable>
  );
}

export default DataTable;