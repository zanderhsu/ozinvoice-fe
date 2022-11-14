import RequestWorker from "./RequestWorker";
import MYCONSTANTS from "./consts.js";
import Utility from "./utils";

const UserData = (function(){

        function _handleError(action,error){
            //alert(error)
            console.log(`[${action} ERROR]${JSON.stringify(error)}`)
        }

        /*return {user_name:"xxx", pass:}*/
        const checkToken = async(token)=>{

            let result = {user_name:"", pass:false}
            try
            {
                    let theURL = MYCONSTANTS.CHECK_TOKEN_URL
                    let response = await RequestWorker.HttpJSONRequest('POST',theURL,{token:token})
                    
                    return response
                }
                catch(error)
                {
                    _handleError("checkToken()",error)
                }
                return result
        }

        /*dataObj

        new_email:
        */
        const changeEmail = async(dataObj)=>{

            dataObj.new_email = dataObj.new_email.toLowerCase();

            if(dataObj.new_email === "")
            {
                return {success:false, message:"New email is empty"}
            }

            try
            {
                let token = Utility.readToken();
                //1st to check the original password
                let theURL = MYCONSTANTS.EMAIL_RESOURCE_URL
                let response = await RequestWorker.HttpJSONRequest('PUT',theURL,{token:token,new_email:dataObj.new_email})
                if(response.token !== undefined && response.token !== "")
                {
                    Utility.saveToken(response.token)
                }
        
                return response
            }
            catch(error)
            {
                _handleError("changeEmail()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }
        /*
        {
        dataObj={ 
        "current_password":"",
        "new_password":"",
        "new_pasword_again":""}
        */
        const changePassword = async(dataObj)=>{

            if(dataObj.current_password === "" || dataObj.new_password ==="")
            {
                return {success:false, message:"Empty passwords!"}
            }

            if(dataObj.new_password !== dataObj.new_password_again)
            {
                return {success:false, message:"two times of new passwords are not same"}
            }

            try
            {
                let token = Utility.readToken();

                //1st to check the original password
                let theURL = MYCONSTANTS.PASSWORD_RESOURCE_URL
                return await RequestWorker.HttpJSONRequest('PUT',theURL,{
                        token:token,
                        current_password:dataObj.current_password,
                        new_password:dataObj.new_password})
            }
            catch(error)
            {
                _handleError("changingPassword()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }
        /*true or false*/
        const checkPassword = async(userName, password)=>{
            
        let ret = {pass:false, isByTempPass:false}
        try
        {
                let theURL = MYCONSTANTS.CHECK_PASSWORD_URL
                let response = await RequestWorker.HttpJSONRequest('POST',theURL,{user_name:userName,password:password})
                if(response.token !== undefined && response.token !== "")
                {
                    
                    Utility.saveToken(response.token)
                }
            
                return {pass:response.pass,isByTempPass: response.isByTempPass}
            }
            catch(error)
            {
                _handleError("checkPassword()",error)
            
            }
            return ret
            
        }

        const verifyEmail = async(vetoken)=>
        {
            try
            {
                let theURL =  MYCONSTANTS.VERIFY_EMAIL_URL;
                let response = await RequestWorker.HttpJSONRequest("POST",theURL,{vetoken:vetoken})      
                return response
            }
            catch(error)
            {
                _handleError("verifyEmail()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }

        const sendTempPassword = async(email)=>{
            try
            {
                let theURL =  MYCONSTANTS.SEND_TEMP_PASSWORD_URL;
                let response = await RequestWorker.HttpJSONRequest("POST",theURL,{email:email})      
                return response
            }
            catch(error)
            {
                _handleError("sendTempPassword()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }

        const sendVerifycationEmail = async(email)=>{
            try
            {
                let token = Utility.readToken();
                let theURL =  MYCONSTANTS.SEND_VERYFICATION_EMAIL_URL;
                let response = await RequestWorker.HttpJSONRequest("POST",theURL,{email:email,token:token})      
                return response
            }
            catch(error)
            {
                _handleError("sendVerifycationEmail()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }
        /*userObj = {
                        user_name:userName,
                        password:password,
                        email:email
                    }*/
        const addUser = async(userObj) =>{
            try
            {
                let theURL =  MYCONSTANTS.ADD_USER_URL;
                let response = await RequestWorker.HttpJSONRequest("PUT",theURL,userObj)
                if(response.token!== undefined && response.token !== "")
                {
                    Utility.saveToken(response.token)
                }
            
                return response
            }
            catch(error)
            {
                _handleError("addUser()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }


        const addClient = async(client) =>{
            try
            {
                let token = Utility.readToken();
                let theURL =  MYCONSTANTS.ADD_CLIENT_URL
                return await RequestWorker.HttpJSONRequest("PUT",theURL,{token:token, client:client})
            }
            catch(error)
            {
                _handleError("addClient()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }


        const updateClient = async(index,client) =>{
            try
            {
                let token = Utility.readToken();
                let theURL =  MYCONSTANTS.CLIENT_RESOURCE+'/'+index;
                return await RequestWorker.HttpJSONRequest("PUT",theURL,{token:token, client:client})
            }
            catch(error)
            {
                _handleError("updateClient()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }

        const addPayee = async(payee) =>{
            try
            {
                let token = Utility.readToken();
                let theURL =  MYCONSTANTS.ADD_NEW_PAYEE;
                return await RequestWorker.HttpJSONRequest("PUT",theURL,{token:token,payee:payee})
            }
            catch(error)
            {
                _handleError("addPayee()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }

        const updatePayee = async(index,payee) =>{
            try
            {
                let token = Utility.readToken();
                let theURL =  MYCONSTANTS.PAYEE_RESOURCE+"/"+index;
                return await RequestWorker.HttpJSONRequest("PUT",theURL,{token:token,payee:payee})
            }
            catch(error)
            {
                _handleError("updatePayee()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }

        const deletePayee = async(index) =>{
            try
            {
                let token = Utility.readToken();
                let theURL =  MYCONSTANTS.PAYEE_RESOURCE+"/"+index;
                return await RequestWorker.HttpJSONRequest("DELETE",theURL,{token:token})
            }
            catch(error)
            {
                _handleError("deletePayee()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }


        const deleteClient = async(index) =>{
            try
            {
                let token = Utility.readToken();
                let theURL =  MYCONSTANTS.CLIENT_RESOURCE+"/"+index;
                return await RequestWorker.HttpJSONRequest("DELETE",theURL,{token:token})
            }
            catch(error)
            {
                _handleError("deleteClient()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }

        const updateBasics = async(basics)=>{
            try
            {
                let token = Utility.readToken();
                let theURL =  MYCONSTANTS.BASICS_RESOURCE
                return await RequestWorker.HttpJSONRequest("PUT",theURL,{token:token, basics:basics})
            }
            catch(error)
            {
                _handleError("updateBasics()",error)
                return {success:false, message:JSON.stringify(error)}
            }
        }

        const getUser = async() => {
            try
            {
                let token = Utility.readToken();
                let theURL = MYCONSTANTS.USER_RESOURCE
                return await RequestWorker.HttpJSONRequest("POST", theURL,{token:token});
            }
            catch(error)
            {
                _handleError("getUserByName()",error)
                return null;
            }
        }

        /*maybe no need this function*/
        const getClients = async ()=>{
            try
            {
                let token = Utility.readToken();
                let theURL = MYCONSTANTS.ALL_CLIENTS_RESOURCE
                return await RequestWorker.HttpJSONRequest("GET",theURL,{token:token});
            } 
            catch(error)
            {
                _handleError("getClients()",error)
                return []
            }
        }

        /*it doesn't require a token, as it can be used without logging in*/
        const getPDF = async (invoiceData)=>{
            try
            {
                return await RequestWorker.getPDF(MYCONSTANTS.GET_PDF_URL,invoiceData)
            }
            catch(error)
            {
                _handleError("getPDF()",error)
                return null;
            }
        }

return {
    checkToken:checkToken,
    changeEmail:changeEmail,
    changePassword:changePassword,
    checkPassword:checkPassword,
    verifyEmail:verifyEmail,
    sendTempPassword:sendTempPassword,
    sendVerifycationEmail:sendVerifycationEmail,
    addUser:addUser,
    addClient:addClient,
    updateClient:updateClient,
    addPayee:addPayee,
    updatePayee:updatePayee,
    deletePayee:deletePayee,
    deleteClient:deleteClient,
    updateBasics:updateBasics,
    getUser:getUser,
    getClients:getClients,
    getPDF:getPDF,
}
})();

export default UserData;