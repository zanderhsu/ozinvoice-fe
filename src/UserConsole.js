import { useEffect, useState } from "react";

import Utility from "./utils"

import { useDispatch,useSelector } from 'react-redux'
import  {gotoGenPDF, gotoHome, UI_STATES} from "./redux/UIStatesSlice"

import UserData from "./UserData";
import InfoEdit from "./InfoEdit";
import InfoList from "./InfoList";
import CountDownButton from "./CountDownButton"
import "./UserConsole.css"

const clientEmptyObj = { //Clients is a array

   business_name:"",
   abn:"",
   address: "",
   phone:"",
   email:""
 }

 const payeeEmptyObj = { //the information will turn up in the invoice payee section
   business_name:"",
   abn:"",
   address: "",
   phone:"",
   email:"",
   account_name:"",
   bsb:"",
   account_number:"",
   note:"pleae user invoice number as reference"
 }

function UserConsole()
{
   const isByTempPass = useSelector((state) => state.UIState.payload?.isByTempPass)

   const [user,setUser] = useState({});
   const [IsEditingBasics, setIsEditingBasics] = useState(false)
   const [IsInChangingPwd, setIsInChangingPwd] = useState(false)
   const [IsInChangingEmail, setIsInChangingEmail] = useState(false)
   const [IsUsingTempPassword, setIsUsingTempPassword] = useState(isByTempPass)

   const dispatch = useDispatch()
   
   const addEmptyClient = ()=>{
      user.clients.push({...clientEmptyObj});
      setUser({...user, clients:[...user.clients]})
  }

  const addEmptyPayee=()=>{
   user.payees.push({...payeeEmptyObj});
   setUser({...user, payees:[...user.payees]})
  }

  const updateForClientDeleted  = (index)=>{
      user.clients.splice(index,1)
      setUser({...user, clients:[...user.clients]})
  }

  const updateForPayeeDeleted  = (index)=>{
      user.payees.splice(index,1)
      setUser({...user, payees:[...user.payees]})
   }
   //just do shallow copy is fine
   const updateBasicsFromEdit = (basics)=>
   {
      user.basics = basics
      setUser({...user})
   }

   const updateEmailFromEdit = (dataObj)=>
   {
      user.email = dataObj.new_email
      setUser({...user})
   }

   const updatePayeeFromEdit = (index, payee)=>{
      user.payees[index] = payee;
      setUser({...user, payees:[...user.payees]})
   }

   const updateClientFromEdit = (index,client)=>{
      user.clients[index] = client;
      setUser({...user, clients:[...user.clients]})
   }

   const invoiceToButton = (index) =>{
      return <button onClick={()=>{
         dispatch(gotoGenPDF({
               isWithData:true,
               payee:{...user.payees[0]},
               client:{...user.clients[index]},
               preUI:UI_STATES.USER_CONSOLE
            })
      )}}>????Invoice To</button>
   }

   const setDaultPayeeButton =(index)=>{
      const setDefaultPayee = ()=>{
         let temp = {...user.payees[index]}
         user.payees.splice(index,1)
         user.payees.unshift(temp)

         for(let i in user.payees)     {  user.payees[i].payee_id = i   }
         setUser({...user, payees:[...user.payees]})

      }
      
      return (parseInt(index) === 0)?<span>[Default]</span>:<button onClick={setDefaultPayee}>Set as Default</button>
   }

   const toLogout = ()=>{
         Utility.saveToken("");//empty the cookie
         dispatch(gotoHome())
   }

   const getVerificationEmail = async()=>{
      if(!Utility.validateEmail(user.email).pass)
      {
         return false;
      }
      let ret = await UserData.sendVerifycationEmail(user.email)
      alert(ret.message)
      return true;
   }
/*
   {
      dataObj={ 
     "current_password":"",
     "new_password":"",
     "new_pasword_again":""}
     */
   const toChangePassword = async(dataObj)=>{
      let result = Utility.validatePassword(dataObj.new_password)
      if(!result.pass)
      {
        return {success: false, message:result.reason}
      }
      return await UserData.changePassword(dataObj)
   }
   
   /*
   {new_email:""}
   */
   const toChangeEmail = async(dataObj)=>{

      dataObj.new_email = dataObj.new_email.toLowerCase();

      let result = Utility.validateEmail(dataObj.new_email)
      if(!result.pass)
      {
        return {success: false, message:result.reason}
      }

      if(user.email ===  dataObj.new_email )
      {
          return {success:false, message:"New email is same as old one"}
      }

      return await UserData.changeEmail(dataObj)
   }

   useEffect(()=>{
      const fetchUserByName = async ()=>{
         if(Utility.checkIfRequestTooFrequent("GET_USER_BY_NAME"))
         {
             return;
         }
   
         UserData.getUser()
         .then((userObj)=>{
            if(userObj != null)
            {
                setUser(Utility.deepCopy(userObj,5))
                if(IsUsingTempPassword && userObj.temp_password !== undefined)
                {
                  setIsInChangingPwd(true)
                }
            }
            else
            {
                alert("Empty user data fetched");
            }
         }).catch((error)=>{
            alert("something wrong while fetching user data:"+error);
         })
     }

      fetchUserByName();
    },[IsUsingTempPassword])
  
    return (
      
      <div id="user-console-left-part">
      
      {false&&<button onClick={()=>{ alert(document.cookie)}}>showCookie</button>}
      
            <fieldset >
               <h2>
             Hi {(user.basics && user.basics.nickname)?user.basics.nickname:user.user_name}
             , welcome back to OZ Invoice</h2><div id="uc-user-basic-fieldset">

             {IsEditingBasics?<InfoEdit 
                  title="Edit User Information"
                  subject="USER_INFO"
                  className="edit-basics"
                  UpdateDBFunc={UserData.updateBasics}
                  returnNewData={updateBasicsFromEdit}
                  hiddenProps={['create_at','last_login_at']}
                  toClose={()=>setIsEditingBasics(false)}
                  dataObj={user.basics}
               />:<button onClick={()=>{setIsEditingBasics(true)}}>???Edit Basic Information</button>} 

               {IsInChangingPwd?<InfoEdit 
                  title={IsUsingTempPassword?"Please reset your password in ten minutes":"Changing Password"}
                  subject="CHANGE_PASSWORD"
                  className="eidt-basics"
                  UpdateDBFunc={toChangePassword}
                  returnNewData={()=>{setIsUsingTempPassword(false)}}
                  hiddenProps={["user_name"]}
                  toClose={()=>setIsInChangingPwd(false)}

                  dataObj={{
                     current_password:(IsUsingTempPassword&&user.temp_password !== undefined)?user.temp_password.password:"",
                     new_password:"",
                     new_password_again:""
                  }}
               />:<button onClick={()=>{setIsInChangingPwd(true)}}>Change Password????</button>}
             
               {IsInChangingEmail?<InfoEdit 
                  title={`Changing Email [${user.email}]`}
                  subject="CHANGE_EMAIL"
                  className="eidt-basics"
                  UpdateDBFunc={toChangeEmail}
                  returnNewData={updateEmailFromEdit}
                  hiddenProps={[]}
                  toClose={()=>setIsInChangingEmail(false)}
                  dataObj={{new_email:""}}
               />:<button onClick={()=>setIsInChangingEmail(true)}>Change Email????</button>}
               <button onClick={toLogout}>Log Out???????</button>
               
               {!user.email_verified &&<p style={{color:"tomato"}}>????Your Email {user.email} hasn't been verified yet. 
            Please check your inbox for the verification email or change email if it's not correct
            <CountDownButton onClick={getVerificationEmail}
                     text="Resend Verification Email????"
                     seconds={60}
                     /></p>}
                     </div>
             </fieldset>   

            <p></p>
             <fieldset>
               <h2>Manage My Payees</h2>
               <p>*For users owning multiple businesses, they may need to add multiple payees</p>
             <InfoList
                  containerIdName="uc-payee-list"
                  dataArray={user.payees}
            
                  subject="PAYEE"
                  addEmptyItem={addEmptyPayee}
                  deleteItemFromDB={UserData.deletePayee}
                  updateForItemDeleted={updateForPayeeDeleted}
                  updateItemFromEdit={updatePayeeFromEdit}
                  addItemToDB={UserData.addPayee}
                  updateItemToDB={UserData.updatePayee}
                  specialButton={setDaultPayeeButton}
                  hiddenProps={['payee_id']}
               />
            </fieldset>
            <p></p>
            <fieldset>
               <h2>Manage My Clients</h2>
            
           
            <InfoList
               containerIdName="uc-client-list"
                  dataArray={user.clients}
         
                  subject="CLIENTS"
                  addEmptyItem={addEmptyClient}
                  deleteItemFromDB={UserData.deleteClient}
                  updateForItemDeleted={updateForClientDeleted}
                  updateItemFromEdit={updateClientFromEdit}
                  addItemToDB={UserData.addClient}
                  updateItemToDB={UserData.updateClient}
                  specialButton={invoiceToButton}
                  hiddenProps={['client_id']}
               />
      
             </fieldset>
          
            </div>
    )
            
}

export default UserConsole;