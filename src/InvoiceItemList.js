import Utility from "./utils";
function getInputType(propName)
{
    switch(propName)
    {
        case 'unit_price':
        case 'quantity':
        case 'tax_rate':
        case 'discount':
        case 'amount':
            return "number"
        
        default:
            return "text"
    }
}

function getMinAndMax(propName)
{
    if(propName === "tax_rate"|| propName === "discount") 
    {
       return [0,100]
    }
    return undefined;
}
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

    return <div className="tg-single-item-container" >
        {
            headerArry.map((header, index)=>{

                let style = getCommonStyle(header === "Description");
               return <label key={index} style={style} name={header}>{header} </label>
            })
        }
    </div>
}
function InvoiceItem(props)
{
    function handleBlur(e)
    {
        //console.log(JSON.stringify(e))
        if(e.target.type === "number" && e.target.value ==="")
        {
            e.target.value = 0;
        }
    }

    function handleClick(e)
    {
        e.target.select();
    }
    return <div className="tg-single-item-container">
        {
            Object.keys(props.item).map(function(p,index){
                let readonly = false;
                if(p ==='amount')
                {
                    props.item[p] = getAmount(props.item);
                    readonly = true;
                }

                let m = getMinAndMax(p)
                let attrObj={
                    type:getInputType(p),
                    style:getCommonStyle(p==="description"),
                    placeholder:(p==="description"?"item description":""),
                    key:index, 
                    name:p,
                    readOnly:readonly,
                    onChange:(e)=>{props.handleChange(e,props.section,props.row)},
                    onClick:handleClick,
                    value:props.item[p]
                }
             
                if(m !== undefined){
                    attrObj = {...attrObj, min:m[0],max:m[1]}
                }
                return <input {...attrObj} />
                
            })
        }
    </div>
}


/*
props:
{   title:xxxx,
    section
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
                                    section={props.section}
                                    handleChange={props.handleChange} 
                                    item={item}/>
                    })
            }
            </div>
    
}

export default InvoiceItemList;