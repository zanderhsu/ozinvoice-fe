import Utility from "./utils";

import UserData from "./UserData";
import { useEffect, useState } from "react";
import GroupPairInputs from "./GroupPairInputs";


const clientEmptyObj = { //Clients is a array
    client_id:"",//same as index
    business_name:"",
    abn:"",
    address: "",
    phone:"",
    email:""
  }

function ClientsInfo(props){
   
    //const [clients,setClients] = useState([]);
    const [curEditIndex,setCurEditIndex] = useState(-1);
    const [curEditClient, setCurEditClient] = useState(null);
    const [isInEditNewClient, setIsInEditNewClient] = useState(false);

    const addEmptyClient = ()=>{
        props.addEmptyClient();
        let curIndex = props.clients.length-1;
        setCurEditIndex(curIndex);
        setCurEditClient({...clientEmptyObj,client_id:curIndex})
        setIsInEditNewClient(true);
    }

    const deleteClientFromDB = async(index)=>{

        if(false === window.confirm(`Are you deleting [${props.clients[index].business_name}]?`))
        {
            return
        }

        let result = {succes:false,message:"doing nothing"};
          
        result = await UserData.deleteClient(index)
   
        if(result.success)
        {
            //notify parent componentn to udpate its clients array
            props.updateForClientDeleted(index);
            setCurEditIndex(-1)
        }
        alert(result.message); 
    }

    const onCancelButtonCick = (index)=>{
        setCurEditIndex(-1);
        if(isInEditNewClient)
        {
            props.updateForClientDeleted(index);
            setIsInEditNewClient(false);
        }
    }

    const onEditButtonClick = (index)=>{
        setCurEditIndex(index)
        setCurEditClient(props.clients[index])
    }

    const handleInputChange = (e)=>{
        curEditClient[e.target.name] = e.target.value;
        setCurEditClient({...curEditClient})
    }

    const updateClientToDB = async()=>{
        
        let result = {success:false,message:"doing nothing"};
        //add a new client
        let  client = Utility.deepCopy(curEditClient,5)

        if(isInEditNewClient)
        {
             result = await UserData.addClient(client)
        }
        else
        {
            //do updating client
            result = await UserData.updateClient(client);
        }

        if(result.success)
        {
            //notify parent componentn to udpate its clients array
            props.updateClientFromEdit(curEditIndex,curEditClient);  
            setCurEditIndex(-1)
            if(isInEditNewClient) {setIsInEditNewClient(false)}
        }
       
        alert(result.message); 
    }
        useEffect(()=>{
       
    },[])
    
    return <div>
           {
               Array.isArray(props.clients)?props.clients.map((client,index)=>{

                    const isBeingEditing = (curEditIndex===index);
               
                    const dataObject = isBeingEditing?curEditClient:client

                    return <fieldset key={index}>
                        <legend>{client.business_name}</legend>
                        <GroupPairInputs dataObj={dataObject} handleChange={handleInputChange} readOnly={!isBeingEditing} />
                        {isBeingEditing?null:<button onClick={()=>{onEditButtonClick(index)}}>Edit</button>}
                        {isBeingEditing?<button onClick={updateClientToDB}>{isInEditNewClient?"Add":"Update"}</button>:null}
                        {isBeingEditing?<button onClick={()=>{onCancelButtonCick(index)}}>Cancel</button>:null}
                        {isBeingEditing?null:<button onClick={()=>deleteClientFromDB(index)}>Delete</button>}
                        {isBeingEditing?null:<button>Invoice To</button>}
                    
                    </fieldset>

                    }):null
                  
               }
               <button onClick={()=>{alert("to be implemented")}}>get clients</button>
               <button onClick={addEmptyClient}>Add client</button>
        </div>
}

export default ClientsInfo;