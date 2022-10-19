import RequestWorker from "./RequestWorker";
import MYCONSTANTS from "./consts.js";
const UserData = {}

/*true or false*/
UserData.checkPassword = async(userName, password)=>{
    let theURL = MYCONSTANTS.CHECK_PASSWORD_URL
    let response = await RequestWorker.HttpJSONRequest('POST',theURL,{user_name:userName,password:password})
    if(response.body.pass === true) {return true}
    return false;
}

UserData.updateUser = async(userObj)=>{
    let theURL =  MYCONSTANTS.USER_RESOURCE+"/"+userObj.user_name;
       
    let response = await RequestWorker.HttpJSONRequest("PUT",theURL,userObj)
    console.log("response.="+JSON.stringify(response))
    if(response.statusCode == 200)
    {
        return {
            success:true,
            message:"User information updated!"
        }
    }
    else
    {
        // console.log(JSON.stringify(response.data)); 
        return {
            success:false,
            message:"something wrong happend during updateing"
        }
    }
    
}

UserData.getUserByName = async(userName) => {
    let theURL = MYCONSTANTS.USER_RESOURCE+"/"+userName
    let response= await RequestWorker.HttpJSONRequest("GET", theURL);
    if(response.statusCode == 200)
    {
        return response.body;
    }
    
    return null; 
    
}


UserData.getClients = async (userName)=>{
    let theURL = MYCONSTANTS.USER_RESOURCE+"/"+userName+"/clients"
    let response = await RequestWorker.HttpJSONRequest("GET",theURL);
   // console.log(JSON.stringify(response))
    if(response.statusCode == 200)
    {
        return response.body.clients;
    }
    else
    {
        return [];
    }
}

UserData.getPDF = async (invoiceData)=>{
    
    return await RequestWorker.getPDF(MYCONSTANTS.GET_PD_URL,invoiceData)
}
export default UserData;