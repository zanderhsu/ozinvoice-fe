//import MyButton from "./MyButton";

import { useState,useEffect } from "react";
import {InvoiceEmptyData as gInvoiceEmptyData } from "./invoiceData"
import {InvoiceSampleData as gInvoiceSampleData} from "./invoiceData"
import GroupPairInputs from "./GroupPairInputs"
import InvoiceItemList from "./InvoiceItemList"
import RequestWorker from "./RequestWorker";
import TotalAmount from "./TotalAmount";
import "./ToGenerateUI.css"
import Utility from "./utils.js";
import MYCONSTANTS from "./consts.js"

let sRunTimes = 0;

//they are the same as property names in invoiceData
const SEC_PAYEE = "payee";
const SEC_PAYER = "payer";
const SEC_ITEMS = "items";
const SEC_PAYMENT = "payment";

const gSectionArray = [
    {section:SEC_PAYEE,title:"1. Your Business Information"},
    {section:SEC_PAYMENT,title:"2. Invoice Number, Date and Payment Details"},
    {section:SEC_PAYER,title:"3. Bill to"},   
]

function actionForWaiting(isWaiting)
{
    if(isWaiting)
    {
        document.body.style.cursor = "wait";
    }
    else
    {
        document.body.style.cursor = "pointer";
    }
}

function sumbitRequestForGeneratingPDF(invoiceData)
{
      const sURL = MYCONSTANTS+"invoice2pdf";
 //   const sURL = "http://localhost:3001/invoice2pdf"; 
 //   const sURL = "http://localhost:3000/invoice2pdf"; 

    actionForWaiting(true)
    RequestWorker.postJSONByaxios(sURL,invoiceData)
        .then((info)=>{
            alert("Your invoice PDF has been successfully generated");
            console.log(info);
            actionForWaiting(false)
        })
        .catch((err)=>{
            alert("Somethign wrong happened while generating PDF:"+err);
            actionForWaiting(false);
        })
}

function ToGenerateUI(props)
{
    const [theState,setTheState] = useState(Utility.deepCopy(gInvoiceEmptyData,5));

    const addOneBlankItem = ()=>{
        theState.items.push(Utility.deepCopy(gInvoiceEmptyData.items[0],3));
        setTheState({...theState});
    }

    const deleteOneItem = ()=>{
        theState.items.pop();
        setTheState({...theState});
    }

    const clearData = ()=>{
        setTheState(Utility.deepCopy(gInvoiceEmptyData,5));
    }

    const fillSampleData = ()=>{
        setTheState(Utility.deepCopy(gInvoiceSampleData,5));
    }
    
    useEffect(() => {
        
        
        return () => {
           
        };
      },[]);

    const handleChange = (e,section,itemIndex) => 
    {
        let newState = Utility.deepCopy(theState,5);
       // let newState = theState;
      //  console.log(`section:${section},itemIndex:${itemIndex},e.target.name:${e.target.name}`);
        if(section === SEC_ITEMS)
        {   
            let value = e.target.value;
            if(e.target.type === "number"){
                if(isNaN(value)) // isNaN(empty string) will return false, but that's fine.
                {
                    alert('The input should be a number')
                    return;//don't update
                }

                value = parseFloat(value); // remove multiple zeros, such as 000
                if(e.target.name === "tax_rate" || e.target.name ==="discount" )
                {
                    if(value<0 || value >100)
                    {
                        alert('This rate should be between 0 and 100');
                        return;//don't update
                    }
                }
            
                if(e.target.name ==="quantity" && value < 0)
                {
                    alert('This number should be positive');
                    return;
                }
                
                if(Utility.afterDecimal(value)>2){
                    value = parseFloat(value).toFixed(2);
                }
            }
        
            newState[SEC_ITEMS][itemIndex][e.target.name] = value;
        }
        else
        {   
            newState[section][e.target.name] = e.target.value;
        }
        setTheState(newState);
    };

    if(false){
        console.log("["+sRunTimes+"th]: theState: "+JSON.stringify(theState));
     // console.log(sRunTimes+"th: gInvoiceSampleData: "+JSON.stringify(gInvoiceSampleData));
        sRunTimes++;
    }

    return (
        <div className="to-generate-ui" >
            <div className="tg-button-container">
                <button onClick={fillSampleData} style={{width:"15em"}}>Fill Sample data</button>
                <button onClick={clearData} style={{width:"15em"}}>Clear</button>
                <button onClick={props.toReturn}>Close</button>
            </div>
            {
                gSectionArray.map((element,index)=>{
                    return <GroupPairInputs 
                        key={index}
                        sectionClass="tg-section-container"
                        pairClass="tg-pair-container" 
                        title={element.title}
                        section={element.section} 
                        dataObj={theState[element.section]}
                        handleChange={handleChange}/>
                })
            }
        
            <fieldset>
            <legend><span className="step">4. ITEMS</span></legend>
                <p id="note">*U/P is short for Unit Price(includes GST),
                which can be minus for a refund, voucher,deduct or reduction</p>
                <InvoiceItemList 
                        section={SEC_ITEMS} 
                        items={theState[SEC_ITEMS]}
                        handleChange={handleChange}/>
                <div className="tg-button-container">
                    <button onClick={addOneBlankItem}>Add item</button>
                    <button onClick={deleteOneItem}>Delete item</button>
                    <button  onClick={()=>sumbitRequestForGeneratingPDF(theState)}>Get PDF</button>
                    <button onClick={props.toReturn}>Close</button>
                    <TotalAmount items={theState[SEC_ITEMS]} />
                </div>
            </fieldset>
            <p></p>
    
        </div>
    );

}
export default ToGenerateUI;