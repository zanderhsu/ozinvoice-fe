function transformPropName(str)
{
    return str.replace('_',' ')
}

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
        
        case 'password':
            return 'password'

        case "due_date":
        case "invoice_date":
            return "date"

        default:
            return "text"
    }
}

/*
props ={
    handleChange:
    isReadOnly:
    readOnlyProps:[]
    dataObj:{
        prop:value
    }
}

...
]

*/
function GroupPairInputs(props)
{
    const labelStyle ={
      // border:"1px solid red",
    //    display:"grid"
    }


   return  <> {
                Object.keys(props.dataObj).map(
                    function(propName,index)    
                    { 
                        let shouldBeDisabled = false;
                     /*   if(props.readOnlyProps.indexOf(propName)!=-1)
                        {
                            shouldBeDisabled = true;
                        }*/

                        if(typeof props.dataObj[propName] === 'object'||
                        props.dataObj[propName] === null||
                        props.dataObj[propName] === undefined
                        ) {
                            return null
                        }
                        //
                        return <div key={index} name={"L_"+propName}><label   style={labelStyle}>
                                {transformPropName(propName)}&nbsp;:&nbsp;</label>
                                <input
                                    type={getInputType(propName)}
                                    name={propName}
                                    disabled={shouldBeDisabled||props.readOnly?true:false}
                                    onChange={props.handleChange}
                                    value={props.dataObj[propName]}
                                /></div>
                    })
            }
        </>
}

export default GroupPairInputs;