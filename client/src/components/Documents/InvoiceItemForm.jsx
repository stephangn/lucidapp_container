import React, { useState } from "react";
import { MDBInput, MDBRow, MDBCol } from "mdb-react-ui-kit";

function InvoiceItemForm(props) {
  const [itemTerm, setItemTerm] = useState();

  function useInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setItemTerm({
      [name]: value,
    });
  }

  return (
    <div>
      <h5>Rechnungsposten {props.id}</h5>

      <MDBInput
        className="mb-4"
        name="invoiceItemName"
        label="Produktname"
        type="text"
        onChange={useInputChange}
        required
      />
      <MDBRow>
        <MDBCol>
          <MDBInput
            className="mb-4"
            name="invoiceItemQuantity"
            label="Anzahl"
            type="number"
            onChange={useInputChange}
            required
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            className="mb-4"
            iname="invoiceItemUnit"
            label="Einheit"
            type="text"
            onChange={useInputChange}
            required
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            className="mb-4"
            name="invoiceItemValue"
            label="Preis pro Enheit"
            type="number"
            onChange={useInputChange}
            required
          />
        </MDBCol>
      </MDBRow>
    </div>
  );
}

export default InvoiceItemForm;
