import { useDispatch } from 'react-redux'
import {UI_STATES, gotoGenPDF,  gotoLoginSignUp} from "./redux/UIStatesSlice"

import './HomeUI.css'

function HomeUI()
{ 
    const dispatch = useDispatch()

    return (
    <div id="home-animaiton-container">
        <div id="home">
            <div className="floatblock" id="fb1">
                <p>INVOICE<br/><br/>
                   TO: xxxx<br/><br/>
                    ________________ $<br/><br/>
                    ________________ $<br/><br/>
                    ________________ $<br/><br/>
                   
                    GST:__ $      Total: ___ $


                </p></div>
            
            <h1>Welcome to OZ Invoice</h1><p> It can help you generate PDF invoices quickly
            <br/>It will be more easy for registered users
            </p>
            <div id="home-buttons-container">
                <button onClick={()=>{dispatch(gotoGenPDF({isWithData:false,preUI:UI_STATES.HOME}))}}>Get PDF invoices<br/>Without Logging In</button>
                <button title="more functions for registered users" onClick={()=>{dispatch(gotoLoginSignUp())}}>Login/Sign up</button>
            </div>
            <div id="intro">
            <p id="introduction" style={{fontFamily: "Monospace"}}>
            <br/><br/>Frontend: React+Redux
                 <br/> Backend  : AWS Lambda(Node.js runtime) + AWS DynamoDB
            <br/><br/>For any queries regarding this application, please feel free to contact its developer: Zheng(Zander) Xu,  <a href="mailto:xuzheng0617@gmail.com">xuzheng0617@gmail.com</a>
            </p>
            </div>
        </div>
        </div>
    );
}

export default HomeUI;