import { useState,useEffect} from "react"
import GroupPairInput from "./GroupPairInputs"
import Utility from "./utils";

/*
props.user = {

}
*/

var sLastSavedData = {};

//shallowCopy is fine
/*
props:
    title: 
    subject: 'user info' or ''
    elementId:
    UpdateDBFunc: provided by parent component, it should be from UserData
    returnNewData: to parent component
    hiddenProps:
    toClose:
    dataObj:
    user：
    {
       key: value,
       ...
    }
*/
function InfoEdit(props)
{
    const [myData, setMyData] = useState({...props.dataObj})

    const handleChange = (e)=>{
        let newValue = e.target.value
        let fieldName = e.target.name
        if(Utility.IsDigitField(fieldName) && newValue!=="" && newValue.match(/^\d+$/) === null)
        {
            return;
        }
        
        myData[e.target.name] = e.target.value;
        setMyData({...myData});
   }

    const toUpdateToDB = ()=>{
    
        if(Utility.shallowCompare(sLastSavedData,myData)){
            console.log("No need to update")
            props.toClose();
            return;
        }

        /*avoid frequent access*/
        if(Utility.checkIfRequestTooFrequent("UPDATE_"+props.subject))
        {
            return;
        }
      
        props.UpdateDBFunc(myData).then((result)=>{

            if(result.success)
            {
                if(props.returnNewData !== undefined){props.returnNewData(myData)};
                
                props.toClose();
            }
            else
            {
                alert(result.message)
            }
            
        }).catch((error)=>{
            console.log(error)
            alert(error+",in updating "+props.subject);
        })
        
    }


    useEffect(()=>{
        //save last data infor at the beginning
        sLastSavedData = {...props.dataObj}
    },[props.dataObj])

    
    return <fieldset className={props.className}>
        <legend style={{textAlign:"left"}}>{props.title}</legend>
        <GroupPairInput dataObj={myData} handleChange={handleChange}  hiddenProps={props.hiddenProps}/>
        <div className="uc-list-button-container">
        <button onClick={toUpdateToDB}>✔Update</button>  
        <button onClick={props.toClose}>⤴Cancel</button>
        
        </div>
    </fieldset>
}

export default InfoEdit