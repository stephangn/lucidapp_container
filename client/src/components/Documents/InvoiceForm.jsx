import React, { useState, useEffect, isValidElement } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBBadge,
  MDBIcon,
} from "mdb-react-ui-kit";
import { init, createRechnung, createZollanmeldung } from "../../Web3Client";
import { useParams } from "react-router-dom";
import {} from "json2csv";
import LZString from "lz-string";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

var crypto = require("crypto");
var blockchaintx = "";
function InvoiceForm(props) {
  const axiosInstance = useAxiosPrivate();

  const [invoiceFields, setInvoiceFields] = useState({
    type: "Rechnung",
    description: "",
    blockchainID: blockchaintx,
    issue_date: "",
    invoice_text: "",
    currency: "",
    transaction: "",
    invoiceItem: [],
    priceTotal: "",
    transport_costs: "",
  });

  const [invoiceItemFields, setInvoiceItemFields] = useState([
    {
      product: "",
      amount: "",
      unit: "",
      price: "",
    },
  ]);
  const { transactionId } = useParams();

  // -- Loading Backdrop --
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

  // Eingabe handlen
  function handleItemChange(index, event) {
    const values = [...invoiceItemFields];
    values[index][event.target.name] = event.target.value;
    setInvoiceItemFields(values);

    invoiceFields.invoiceItem = invoiceItemFields;

    setInvoiceFields({ ...invoiceFields, transaction: transactionId });
  }

  // Abschicken
  async function handleSubmit(e) {
    // Check Formular Validierung
    var forms = document.getElementById("invoiceForm");
    if (forms.checkValidity() == false) {
      console.log("Formular Eingabe inkorrekt.");
      return;
    }

    handleToggleBackdrop();
    var crypto = require("crypto");
    let total = calculatePriceTotal();

    //Blockchain Transaktion
    createRechnung(
      total.toString(),
      props.transactionData?.partnership.partner.publickey,
      invoiceFields.currency,
      invoiceFields.issue_date,
      crypto.createHash("sha512").update(invoiceItemFields).digest("hex"),
      invoiceFields.transport_costs
    )
      .then((tx) => {
        console.log("Transaktion erfolgreich: " + tx);
        blockchaintx = tx;
        //Übermittel und anlegen der Rechnung
        axiosInstance
          .post("/invoice/", {
            blockchain_id: tx - 1, //Blockchain RechnungsID wird gespeichert
            currency: invoiceFields.currency,
            description: invoiceFields.description,
            invoiceItem: invoiceFields.invoiceItem,
            invoice_text: invoiceFields.invoice_text,
            issue_date: invoiceFields.issue_date,
            priceTotal: invoiceFields.priceTotal,
            transaction: invoiceFields.transaction,
            transport_costs: invoiceFields.transport_costs,
            type: invoiceFields.type,
          })
          .then((res) => {
            console.log("Rechnung erfolgreich hochgeladen.");
            props.setNewDocument(!props.newDocument);
            props.setSnackbarSuccess(true);
            props.setSnackbarMessage("Rechnung erfolgreich hochgeladen.");
            handleCloseBackdrop();
            props.handleOpenSnackbar();
            props.setNewDocument(!props.newDocument);
            props.toggleAddDocumentModal();
          })
          .catch((error) => {
            console.error("There was an error!", error);
            props.setSnackbarSuccess(false);
            props.setSnackbarMessage("Fehler beim hochladen der Rechnung.");
            handleCloseBackdrop();
            props.handleOpenSnackbar();
            props.toggleAddDocumentModal();
          });
      })
      .catch((err) => {
        console.log("Transaktion fehlgeschlagen: " + "  " + err);
        props.setSnackbarSuccess(false);
        props.setSnackbarMessage("Fehler bei der Verarbeitung der Rechnung.");
        handleCloseBackdrop();
        props.handleOpenSnackbar();
        props.toggleAddDocumentModal();
      });
  }

  // Rechnungsposten hinzufügen
  function handleAddFields(event) {
    event.preventDefault();
    setInvoiceItemFields([
      ...invoiceItemFields,
      {
        product: "",
        amount: "",
        unit: "",
        price: "",
      },
    ]);
  }

  // Rechnungsposten entfernen
  function handleRemoveFields(event, index) {
    event.preventDefault();
    const values = [...invoiceItemFields];

    // ALT:
    // values.splice(
    //   values.findIndex((value) => value.index === index),
    //   1
    // );

    values.pop();
    setInvoiceItemFields(values);
  }

  function calculatePriceTotal() {
    const items = invoiceItemFields;
    let total = 0;

    for (let i = 0; i < items.length; i++) {
      total += items[i].amount * items[i].price;
    }
    setInvoiceFields({ ...items, priceTotal: total });

    return total;
  }

  return (
    <>
      <MDBContainer>
        <form id="invoiceForm" onSubmit={(e) => e.preventDefault()}>
          <MDBRow>
            <MDBCol>
              <MDBInput
                className="mb-4"
                name="issue_date"
                id="issue_date"
                label="Rechnungsdatum"
                type="date"
                required
                onChange={(e) =>
                  setInvoiceFields({
                    ...invoiceFields,
                    issue_date: e.target.value,
                  })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                className="mb-4"
                name="currency"
                value={invoiceFields.currency}
                id="currency"
                label="Währung"
                type="text"
                required
                onChange={(e) =>
                  setInvoiceFields({
                    ...invoiceFields,
                    currency: e.target.value,
                  })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                className="mb-4"
                name="transport_costs"
                id="transport_costs"
                label="Lieferkosten"
                type="number"
                required
                onChange={(e) =>
                  setInvoiceFields({
                    ...invoiceFields,
                    transport_costs: e.target.value,
                  })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBInput
            wrapperClass="mb-4"
            textarea
            name="description"
            id="description"
            rows={3}
            label="Beschreibung"
            required
            onChange={(e) =>
              setInvoiceFields({
                ...invoiceFields,
                description: e.target.value,
              })
            }
          />
          <hr />

          {invoiceItemFields.map((inputField, index) => (
            <div key={index}>
              <h6>Rechnungsposten {index + 1}</h6>
              <MDBInput
                className="mb-4"
                name="product"
                label="Produktname"
                type="text"
                value={inputField.product}
                required
                onChange={(event) => handleItemChange(index, event)}
              />
              <MDBRow>
                <MDBCol>
                  <MDBInput
                    className="mb-4"
                    name="amount"
                    label="Anzahl"
                    type="number"
                    value={inputField.amount}
                    required
                    onChange={(event) => handleItemChange(index, event)}
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    className="mb-4"
                    name="unit"
                    label="Einheit"
                    type="text"
                    value={inputField.unit}
                    required
                    onChange={(event) => handleItemChange(index, event)}
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    className="mb-4"
                    name="price"
                    label="Preis pro Enheit"
                    type="number"
                    value={inputField.price}
                    required
                    onChange={(event) => handleItemChange(index, event)}
                  />
                </MDBCol>
                <MDBCol>
                  <MDBBadge className="mt-2 me-4 float-end" color="primary">
                    Betrag : {inputField.amount * inputField.price}{" "}
                    {invoiceFields.invoiceCurrency}
                  </MDBBadge>
                </MDBCol>
              </MDBRow>
            </div>
          ))}
          <br />

          <MDBBtn
            className="me-3 mb-3"
            color="success"
            onClick={handleAddFields}
          >
            <MDBIcon size="lg" className="me-2" fas icon="plus" />
            Rechnungsposten hinzufügen
          </MDBBtn>
          {invoiceItemFields.length > 1 && (
            <MDBBtn
              className="me-3 mb-3"
              color="danger"
              onClick={handleRemoveFields}
            >
              <MDBIcon size="lg" className="me-2" fas icon="minus" />
              Rechnungsposten entfernen
            </MDBBtn>
          )}

          <MDBBtn
            type="submit"
            className="float-end"
            color="primary"
            onClick={handleSubmit}
          >
            <MDBIcon size="lg" className="me-2" fas icon="paper-plane" />
            Abschicken
          </MDBBtn>
        </form>
      </MDBContainer>

      {/* Loading Backdrop bei Meta Mask Dialog*/}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default InvoiceForm;
