//import MyButton from "./MyButton";

import { useState,useEffect } from "react";
import {InvoiceEmptyData as gInvoiceEmptyData } from "./invoiceData"
import {InvoiceSampleData as gInvoiceSampleData} from "./invoiceData"
import GroupPairInputs from "./GroupPairInputs"
import InvoiceItemList from "./InvoiceItemList"
import TotalAmount from "./TotalAmount";
import "./ToGenerateUI.css"
import Utility from "./utils.js";
import MYCONSTANTS from "./consts.js"
import UserData from './UserData'

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

function toGetPDF(invoiceData)
{
    UserData.getPDF(invoiceData)
        .then((info)=>{
            /* alert can prevent frequent request*/
            alert("Your invoice PDF has been successfully generated");
            console.log(info);
            
        })
        .catch((err)=>{
            alert("Somethign wrong happened while generating PDF:"+err);
           
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

    const handleSectionChange = (e,section)=>
    {
        let newState = Utility.deepCopy(theState,5);
        newState[section][e.target.name] = e.target.value;
        setTheState(newState);
    }
    
    const handleItemChange = (e,itemIndex) => 
    {
        let newState = Utility.deepCopy(theState,5);
         
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
        setTheState(newState);
    };

    if(false){
        console.log("["+sRunTimes+"th]: theState: "+JSON.stringify(theState));
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
                    return <fieldset key={index} className="tg-section-container"> 
                        <legend><span className="step">{element.title}</span></legend>
                            <GroupPairInputs 
                                dataObj={theState[element.section]}
                                readOnlyProps = {[]}
                                handleChange={(e)=>handleSectionChange(e,element.section)}/>
                        </fieldset>
                })
            }
        
            <fieldset>
            <legend><span className="step">4. ITEMS</span></legend>
                <p id="note">*U/P is short for Unit Price(includes GST),
                which can be minus for a refund, voucher,deduct or reduction</p>
                <InvoiceItemList 
                        items={theState[SEC_ITEMS]}
                        handleChange={handleItemChange}/>
                <div className="tg-button-container">
                    <button onClick={addOneBlankItem}>Add item</button>
                    <button onClick={deleteOneItem}>Delete item</button>
                    <button  onClick={()=>toGetPDF(theState)}>Get PDF</button>
                    <button onClick={props.toReturn}>Close</button>
                    <TotalAmount items={theState[SEC_ITEMS]} />
                </div>
            </fieldset>
            <p></p>
    
        </div>
    );

}
export default ToGenerateUI;