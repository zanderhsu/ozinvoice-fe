import Utility from "./utils";

const  TotalAmount = (props)=>{

    let totalAmount = 0;
    let totalTax= 0;
    
    for(var i in props.items)
    {
        let item = props.items[i];
        let tr = Utility.NANtoZero(item.tax_rate);
        //calculate gst for each item
        let tax = 0;
        let evalStr = ""
        try
        {
           evalStr = `${item.amount}*${tr}/(100+${tr})`
           tax  = eval(evalStr);
        }
        catch(err)
        {
            console.log("[TotalAmount]string for eval():"+evalStr);
            console.log("[TotalAmount]"+err);
        }
        totalTax += tax
        totalAmount += item.amount;
    }
    
    return <div id="tg-total-amount">
        <label>&nbsp;GST : {Utility.getNumberFormat(totalTax,true)}</label>
        <label>Total Amount : {Utility.getNumberFormat(totalAmount,true)}</label>
    </div>
}

export  default TotalAmount;