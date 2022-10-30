import { useState } from "react";
import {InvoiceEmptyData as gInvoiceEmptyData } from "./invoiceData"
import {InvoiceSampleData as gInvoiceSampleData} from "./invoiceData"
import GroupPairInputs from "./GroupPairInputs"
import InvoiceItemList from "./InvoiceItemList"
import TotalAmount from "./TotalAmount";
import Utility from "./utils.js";
import UserData from './UserData'

import "./ToGetPDFUI.css"
import CountDownButton from "./CountDownButton";

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

function ToGetPDFUI(props)
{
    const getInvoiceData = (props)=>{
        let intialInvoiceData = Utility.deepCopy(gInvoiceEmptyData,5)
        if(props.IsWithData)
        {
            if(props.payee !== undefined && props.payee !==null &&  Object.keys(props.payee).length > 0)
            {
                intialInvoiceData.payee = {
                    business_name:props.payee.business_name,
                    ABN:props.payee.abn,
                    address:props.payee.address,
                    phone:props.payee.phone,
                    email:props.payee.email,
                     }


                intialInvoiceData.payment = {
                    ...intialInvoiceData.payment,
                    account_name:props.payee.account_name,
                    BSB: props.payee.bsb,
                    account_number: props.payee.account_number,
                    note:props.payee.note
                }
            }


            intialInvoiceData.payer = {
                business_name:props.client.business_name,
                ABN:props.client.abn,
                address:props.client.address,
                phone:props.client.phone,
                email:props.client.email
            }

     
        }

        return intialInvoiceData;

    }
    const [theState,setTheState] = useState(getInvoiceData(props));
   
    const toGetPDF = async()=>
    {
        if(theState.payee.business_name === "" ||theState.payee.ABN === "")
        {
            alert("Payee's name and ABN cannot be empty")
            return false
        }

        try
        {
            let info = await UserData.getPDF(theState)  
            console.log(info);
        }
        catch(err)
        {
            alert("Somethign wrong happened while generating PDF:"+err);
        }
        return true;
    }

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
    
    const handleSectionChange = (e,section)=>
    {
        let newValue = e.target.value
        let fieldName = e.target.name
        if(Utility.IsDigitField(fieldName) && newValue!=="" && newValue.match(/^\d+$/) === null)
        {
            return;
        }

        let newState = Utility.deepCopy(theState,5);
        newState[section][e.target.name] = e.target.value;
        setTheState(newState);
    }
    
    const handleItemChange = (e,itemIndex) => 
    {
        
        let newValue = e.target.value
        let fieldName = e.target.name

        if(Utility.IsDigitField(fieldName))
        {
            
            if(newValue !== '0') 
            {
                newValue = newValue.replace(/^0+/, '')//remove leading zero
            }

            if(fieldName === 'unit_price' && newValue.match(/^-?\d*\.?\d{0,2}$/)===null)
            {
                //only unit price can be minus for a deduction,
                return;
            }
           
            if( (fieldName === "tax_rate" || fieldName ==="discount") && null === newValue.match(/^([0-9]?|[1-9][0-9]|100)$/))
            {
                //they are 0-100
                return;
            }
                
            if(fieldName==='quantity' && newValue.match(/^\d*\.?\d{0,2}$/) === null)
            {
                //quantity is positive numbers with up to 2 digits after decimals
                return;
            }
            
        }

        let newState = Utility.deepCopy(theState,5);
    
        newState[SEC_ITEMS][itemIndex][e.target.name] = newValue;
        setTheState(newState);
    };

    return (
        <div className="to-generate-ui" >
            <div className="tg-button-container">
                <button onClick={fillSampleData}>Fill Sample data</button>
                <button onClick={clearData}>Clear</button>
                <button onClick={props.toReturn}>✖Close</button>
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
        
            <fieldset id="tg-itemlist-fieldset">
            <legend><span className="step">4. ITEMS</span></legend>
            <p id="note">👉U/P is short for Unit Price(includes GST),
                which can be minus for a refund, voucher,deduct or reduction</p>
                <InvoiceItemList 
                        items={theState[SEC_ITEMS]}
                        handleChange={handleItemChange}/>
                        <TotalAmount items={theState[SEC_ITEMS]} />
                <div className="tg-button-container">
                    <button onClick={addOneBlankItem}>✚Add item</button>
                    <button onClick={deleteOneItem}>✘Delete item</button>
                    <CountDownButton 
                        onClick={toGetPDF}
                        text ="Get PDF📋"
                        seconds={20}/>
                    
                    <button onClick={props.toReturn}>✖Close</button>
                </div>
                
            </fieldset>
            <p></p>
       
        </div>
    );

}
export default ToGetPDFUI;