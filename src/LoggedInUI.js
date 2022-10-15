import { useState } from "react";
import GroupPairInputs from "./GroupPairInputs";
import "./LoggedInUI.css"
import Utility from "./utils";

const userEmptyInfo = {"user_name":"",  "password":""}

function LoggedInUI(props)
{

    const [theState,setTheState] = useState(Utility.deepCopy(userEmptyInfo,3))
    const startLogging = () =>{

    }

    const handleChange = (e)=>{
        let newState = Utility.deepCopy(theState,5);
        newState[e.target.name] = e.target.value;
        setTheState(newState);
    }

    const propsForGP = {
        title:" Log In or Sign Up",
        dataObj:theState,
        section:"loggin",
        sectionClass:"lg-section",
        pairClass:"lg-pair",
        handleChange:handleChange
        
    }

    return  <div id="loggin-UI">
                <GroupPairInputs {...propsForGP} />
                <div className="lg-button-container">
                    <button onClick={startLogging}>Log In</button>
                    <button onClick={()=>{}}>Sign Up</button>
                    <button onClick={()=>props.ToHomeUI()}>Close</button>
                </div>
            </div>

}
export default LoggedInUI;