import { useEffect } from "react";
import './PDFInvoiceUI.css'

export default function PDFInvoiceUI({pdfURL, doneFunc}){

    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <div id="pdf-invoice-UI">
            <div id="pdf-header-container">
                <button onClick={doneFunc}>✖Close</button>         
            </div>
            <iframe id="pdf-iframe" title="PDF Invoice" src={pdfURL} />
        </div>
    )
}