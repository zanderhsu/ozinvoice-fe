


import './PDFInvoiceUI.css'
import { useEffect, useState } from "react";


export default function PDFInvoiceUI({pdfURL, doneFunc}){

    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])
    return (
        <div id="pdf-invoice-UI">
            <div id="pdf-header-container">
                <button onClick={doneFunc}>Close</button>         
            </div>
            <iframe id="pdf-iframe" src={pdfURL} />
        </div>
    )
}