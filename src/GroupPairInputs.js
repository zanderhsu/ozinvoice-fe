function transformPropName(str)
{
    return str.replace('_',' ')
}

/*
props:
{   title:xxxx,
    section:
    handleChange:
    dataObj ={
        key1:value1,
        key2:value2,
    ...
}
*/

function getInputType(propName)
{
    switch(propName)
    {
        case 'email':
            return "email"

        case 'ABN':
        case 'phone':
        case 'BSB':
        case 'account_number':
            return "number"
        
        case "due_date":
        case "invoice_date":
            return "date"

        default:
            return "text"
    }
}
function GroupPairInputs(props)
{
   const parirCount = Object.keys(props.dataObj).length;
   const colNumber = 2; //now it's 2. it's set in css file, grid-template-columns
   const rowNumber = (parirCount+1)/colNumber;

    /*as column number is fixed,so row number, i.e. grid-template-rows, needs to be set dynamically */
   const gridStyle = {gridTemplateRows: ("auto ").repeat(rowNumber)};
   
   return <fieldset>
            <legend><span className="step">{props.title}</span></legend>
            <div className={props.sectionClass} style={gridStyle}>
            {
                Object.keys(props.dataObj).map(
                    function(propName,index)
                    { 
                        const pairStyle = {};
                        const gridRowIndex = index+1;// it starts from 1, not zero
                        /* it fills elements to the grid column by column, not row by row
                        only when total element count is odd number, the last element needs to span two columns
                        */
                        if(  gridRowIndex === rowNumber && (parirCount%2 !== 0))
                        {
                            pairStyle.gridRow = gridRowIndex;//its current row number
                            pairStyle.gridColumn = "1 / span "+colNumber;
                            
                        }
                        //
                        let myid = props.section+index;//the id is only for label'shtmlFor
                        return  <div key={index} className={props.pairClass} style={pairStyle}>
                                <label htmlFor={myid}>{transformPropName(propName)}&nbsp;:&nbsp;</label>
                                <input 
                                    type={getInputType(propName)}
                                    style={{flexGrow:1}}
                                    id={myid}
                                    name={propName}
                                    onChange={(e)=>{props.handleChange(e,props.section)}}
                                    value={props.dataObj[propName]}
                        /></div>
                    })
            }
            </div>
        </fieldset>
    
}

export default GroupPairInputs;