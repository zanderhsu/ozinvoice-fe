import Utility from "./utils";
import React from "react";

/*
props
{
    row: start from 0
    item:{}
    handleChange()
}

return a row of inputs for one item
*/


function getAmount(item)
{
    let up = Utility.NANtoZero(item.unit_price);
    let q = Utility.NANtoZero(item.quantity);
    let d = Utility.NANtoZero(item.discount);
 
    try
    {
        return eval(`${up}*${q}*(100-${d})/100`);
    }
    catch(err)
    {
        console.log("error item:"+JSON.stringify(item))
        console.log(err);
        return 0;
    }
}

function getCommonStyle(isDescription)
{
    const style = { 
        textAlign:isDescription?"left":"center"
       };  

    return style;
}

function InvoiceHeader()
{
    const headerArry=["Code","Description","U/P($)","Qty","Tax%","Disc%","Amount($)"]

    return <div className="tg-single-item-container" id="tg-item-header">
        {
            headerArry.map((header, index)=>{

                let style = getCommonStyle(header === "Description");
               return <label key={index} style={style} name={header}>{header} </label>
            })
        }
    </div>
}

function transformPropName(str)
{
   const retArray={
    code:"Code",
    description:"Description",
    unit_price:"Unit Price($)",
    quantity:"Quantity",
    tax_rate:"GST Tax%",
    discount:"Disc. Rate%",
    amount:"Amount($)"
   }
   return retArray[str]
}

const getMaxInputLength = (propName)=>
{
    switch(propName)
    {   
        case 'code':
            return '6';
        
        case 'description':
            return "32"
        
        case 'tax_rate':
        case 'discount':
            return "3"
        
        default:
            break;
    }
    return "16";
}

function InvoiceItem(props)
{
  
    return <div className="tg-single-item-container">
        {
            Object.keys(props.item).map(function(p,index){
                let readonly = false;
                if(p ==='amount')
                {
                    props.item[p] = getAmount(props.item);
                    readonly = true;
                }

                let attrObj={
                    style:getCommonStyle(p==="description"),
                    placeholder:(p==="description"?"item description":""),
                    key:index, 
                    name:p,
                    readOnly:readonly,
                    maxLength:getMaxInputLength(p),
                    onChange:(e)=>{props.handleChange(e,props.row)},
                    value:props.item[p]
                }
             
                return <React.Fragment key={index}><label>{transformPropName(p)}</label><input {...attrObj} /></React.Fragment>
                
            })
        }
    </div>
}


/*
props:
{   title:xxxx,
    handleChange:
    items =[{
    },{ ...},    
    ...
    ]
}
*/
function InvoiceItemList(props)
{
   return <div className="tg-itemlist-container">
            
            {InvoiceHeader() }
            
            {
                props.items.map(
                    function(item,index)
                    { 
                        return  <InvoiceItem
                                    key={index}
                                    row={index} 
                                    handleChange={props.handleChange} 
                                    item={item}/>
                    })
            }
            </div>
    
}

export default InvoiceItemList;