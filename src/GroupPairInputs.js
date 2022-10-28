function transformPropName(str)
{
    return str.replace(/_/g,' ')
}

function getInputType(propName)
{
    switch(propName)
    {
        case 'email':
        case 'current_email':
        case 'new_email':
            return "email"

        case 'phone':
        case 'abn':
        case 'ABN':
        case 'bsb':
        case 'BSB':
        case 'account_number':
            return "text"
        
        case 'password':
        case 'current_password':
        case 'new_password':
        case 'new_password_again':
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
    hiddenProps:[]
    dataObj:{
        prop:value
    }
}

...
]

*/
function GroupPairInputs(props)
{
    const getMaxInputLength = (propname)=>
    {
        switch(propname)
        {   
            case 'bsb':
                return "6";

            case 'account_number':
                return "15";

            case 'phone':
                return "10";

            case 'abn':
            case 'ABN':
                return "11";
            
            case 'account_name':
                return '48';
            
            case 'business_name':
                return "64";

            case 'email':
            case 'current_email':
            case 'new_email':
                return "64";

            case 'nickname':
                return "32";
            case 'password':
            case 'current_password':
            case 'new_password':
            case 'new_password_again':
                return "32";
            default:
                break;
        }
        return "128";
    }

   return  <> {
                Object.keys(props.dataObj).map(
                    function(propName,index)    
                    { 
                        if(Array.isArray(props.hiddenProps) && props.hiddenProps.indexOf(propName)!== -1)
                        {
                            return null;
                        }

                        if(typeof props.dataObj[propName] === 'object'||
                            props.dataObj[propName] === null||
                            props.dataObj[propName] === undefined) 
                        {
                            return null
                        }
                        //
                        return <div key={index} name={"L_"+propName}>
                                <label>
                                {transformPropName(propName)}</label>
                                <input
                                    type={getInputType(propName)}
                                    name={propName}
                                    maxLength={getMaxInputLength(propName)}
                                    disabled={props.readOnly?true:false}
                                    onChange={props.handleChange}
                                    value={props.dataObj[propName]}
                                    
                                />
                                </div>
                    })
            }
        </>
}

export default GroupPairInputs;