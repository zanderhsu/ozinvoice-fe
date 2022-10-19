import Utility from "./utils";

import UserData from "./UserData";
import { useEffect, useState } from "react";
import GroupPairInputs from "./GroupPairInputs";

function ClientsInfo(props){
    const [clients, setClients] = useState([])
    

    const fetchClientsData = async ()=>{
        if(Utility.checkIfRequestTooFrequent("GET_CLIENTS"))
        {
            return;
        }

        let clientsArray = await UserData.getClients(props.userName)
        setClients(clientsArray)
    }

    useEffect(()=>{
        fetchClientsData();

        return ()=>{

        }
    },[props.userName])
    
    return <div>
               {

               clients.map((client,index)=>{
                    return <fieldset key={index}>
                        <legend>{client.business_name}</legend>
                        <GroupPairInputs dataObj={client} handleChange={()=>{}} readOnly={true} />
                        <button>Edit</button><button>Delete</button><button>Invoice To</button>
                    </fieldset>
               
                    })
                  /*  JSON.stringify(clients)*/
               }
               <button onClick={fetchClientsData}>get clients</button>
        </div>
}

export default ClientsInfo;