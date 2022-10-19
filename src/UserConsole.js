import { useEffect, useState } from "react";
import MYCONSTANTS from "./consts";
import RequestWorker from "./RequestWorker";
import UserInfoEdit from "./UserInfoEdit";
import Utility from "./utils"
import "./UserConsole.css"
import axios from "axios";
import ClientsInfo from "./ClientsInfo"


function UserConsole(props)
{
       // console.log("user[in console]="+JSON.stringify(user))
    return <div id="user-console-UI">
                
              <UserInfoEdit userName={props.userName} /> 
               
             <ClientsInfo userName={props.userName}/>
             <p></p>
             <button onClick={()=>{}}>Refresh</button> 
             <button onClick={props.toReturn}>Log Out</button>
            </div>
}

export default UserConsole;