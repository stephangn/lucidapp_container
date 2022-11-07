import { React, useRef, useEffect } from "react";
import WebViewer from "@pdftron/pdfjs-express-viewer";

// ALT - Nicht mehr in Gebrauch
function PDFViewer() {
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        licenseKey: "3g5U797yZMxP40tBY7xV",
        path: "/pdftron",
        initialDoc: "/files/Invoice-PDF-Template.pdf",
      },
      viewer.current
    ).then((instance) => {
      // now you can access APIs through the WebViewer instance
      const { Core } = instance;

      // adding an event listener for when a document is loaded
      Core.documentViewer.addEventListener("documentLoaded", () => {
        console.log("document loaded");
      });

      // adding an event listener for when the page number has changed
      Core.documentViewer.addEventListener(
        "pageNumberUpdated",
        (pageNumber) => {
          console.log(`Page number is: ${pageNumber}`);
        }
      );
    });
  }, []);

  return (
    <div className="PDFViewer">
      <div className="header">PDF Viewer</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
}

export default PDFViewer;
