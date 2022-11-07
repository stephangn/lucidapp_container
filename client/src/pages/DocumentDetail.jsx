import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PreviewInvoice from "../components/Documents/PreviewInvoice";
import PreviewOther from "../components/Documents/PreviewOther";
import { MDBSpinner } from "mdb-react-ui-kit";
import "./css/LoadingSpinner.css";

function DocumentDetail() {
  //URL Parameter abfragen
  const { documentID } = useParams();
  const axiosInstance = useAxiosPrivate();
  const [documentData, setDocumentData] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [transactionData, setTransactionData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [fileLink, setFileLink] = useState();

  const [isInvoice, setIsInvoice] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/documents/${documentID}/`).then((res) => {
      setDocumentData(res.data);
      axiosInstance
        .get(`/transactions/${res.data.transaction}/`)
        .then((resT) => {
          setTransactionData(resT.data);
          if (res.data.type == "Rechnung") {
            axiosInstance.get(`/invoice/${documentID}/`).then((res) => {
              setInvoiceData(res.data);
              if (res.data.type == "Rechnung") {
                setIsInvoice(true);
                setIsLoading(false);
              }
            });
          } else {
            axiosInstance.get(`/file/${res.data.file}/`).then((resF) => {
              setFileLink(resF.data.file);
              setIsLoading(false);
            });
          }
        });
    });
  }, []);

  useEffect(() => {}, []);

  return (
    <>
      {isLoading ? (
        <div className="loadingSpinner">
          <MDBSpinner>
            <span className="visually-hidden">Lädt..</span>
          </MDBSpinner>
        </div>
      ) : isInvoice ? (
        <PreviewInvoice
          invoiceData={invoiceData}
          transactionData={transactionData}
        ></PreviewInvoice>
      ) : (
        <PreviewOther
          documentData={documentData}
          transactionData={transactionData}
          fileLink={fileLink}
        ></PreviewOther>
      )}
    </>
  );
}

export default DocumentDetail;
