import { useState } from "react";
import "./LoggedInUI.css"
import Utility from "./utils";
import UserData from "./UserData";
import UserConsole from "./UserConsole";
import CountDownButton from "./CountDownButton";

const IN_LOGIN_CARD = "logIn";
const IN_SIGNUP_CARD ="signUp";
const IN_FORGET_CARD = "forgetPassword";

function getCardTitleStyle(cardState, whichTitle)
{
    const borderStyle = "var(--border-style)";
    const isFocus = cardState === whichTitle;
    return  {
        borderTop:isFocus?borderStyle:"none",
        borderLeft: isFocus?borderStyle:"none",
        borderRight:isFocus?borderStyle:"none",        
        borderBottom:isFocus?"none":borderStyle
    }
}

function LoggedInUI(props)
{
    const [IsLogged, setIsLogged] = useState(false)
    const [IsByTempPass,setIsByTempPass] = useState(false)
    const [cardSate, setCardState] = useState(IN_LOGIN_CARD);
    const [IsRedInfoShown, setIsRedInfoShown] = useState(false);
    const [RedInfo, setRedInfo] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [email, setEmail] = useState("");
    
    const showRedInfo = (message)=>{
        setRedInfo(message);
        setIsRedInfoShown(true);
    }

    const checkDataBeforeLogin = ()=>
    {
        if(userName.length<5 || userName.length>32 || password.length<8 || password.length > 32)
        {
            showRedInfo("Invalid inputs:User name length:5~32, password length:8~32")
            return false;
        }
        return true;
    }

    const checkDataBeforeSignup = ()=>
    {
        let result
       
        result = Utility.validateUserName(userName)

        if(!result.pass) 
        {
            showRedInfo(result.reason)
            return false;
        }

        result = Utility.validatePassword(password)
        if(!result.pass) 
        {
            showRedInfo(result.reason)
            return false;
        }

        if(password !== passwordAgain)
        {
            showRedInfo(`Two password inputs are different`)   
            return false;
        }
        
        result = Utility.validateEmail(email)
        if(!result.pass )
        {
            showRedInfo(result.reason);
            return false;
        }
        
        return true;
    }

    const startSignUp = async()=>{
        if(checkDataBeforeSignup())
        {
            if(Utility.checkIfRequestTooFrequent("SIGN_UP"))
            {
                return;
            }

            let userObj = {
                user_name:userName,
                password:password,
                email:email
            }
            let result = await UserData.addUser(userObj)
            if(result.success)
            {
                setIsLogged(true)
            }
            else
            {
                showRedInfo("Sign up failed:"+result.message)
            }
        }
    }

    const startLogging = async() =>{

        if(checkDataBeforeLogin())
        {
            let result = await UserData.checkPassword(userName,password)
           
            if(result.pass){
                setIsLogged(true)
                setIsByTempPass(result.isByTempPass)
            }
            else
            {
                showRedInfo("Wrong user name or password")
            }
        }
    }

    const toSendTempPassword = async()=>{
        let result = Utility.validateEmail(email)
        if(result.pass)
        {
            let ret = await UserData.sendTempPassword(email)
            alert(ret.message)
            showRedInfo(ret.message)
            return true
        }
        else
        {
            showRedInfo(result.reason)
            return false;
        }
    }

    const handleTitleClick = (e)=>
    {
        const newCardState = e.target.getAttribute("name");
        setCardState(newCardState);
        setIsRedInfoShown(false);
    }

    if(IsLogged)
    {
        return <UserConsole  /*When UserConsol logout, it will return to Home UI*/
                    toReturn={()=>{
                        setIsLogged(false)
                        props.toReturn()
                           }} 
                    userName={userName}
                    IsByTempPass={IsByTempPass} />
    }

    return  <div id="loggin-UI">
                
                <div id="loggin-UI-card-titles">
                    <label name={IN_LOGIN_CARD} style={getCardTitleStyle(IN_LOGIN_CARD,cardSate)} onClick={handleTitleClick}>Log In</label>
                    <label name={IN_SIGNUP_CARD} style={getCardTitleStyle(IN_SIGNUP_CARD,cardSate)} onClick={handleTitleClick}>Sign Up</label>
                    <label name={IN_FORGET_CARD} style={getCardTitleStyle(IN_FORGET_CARD,cardSate)} onClick={handleTitleClick}>Forget Password</label>
                </div>
                
                 <div id="loggin-UI-card">
                        {cardSate!==IN_FORGET_CARD&&<><label>User Name</label><input type="text"  value={userName} onChange={(e)=>setUserName(e.target.value)}></input></>}
                        {cardSate!==IN_FORGET_CARD&&<><label>Password🗝</label><input type="password"  value={password} onChange={(e)=>setPassword(e.target.value)}></input></>}
                        {cardSate===IN_SIGNUP_CARD&&<><label>Password🗝 again</label><input type="password"  value={passwordAgain} onChange={(e)=>setPasswordAgain(e.target.value)}></input></>}
                        {cardSate!==IN_LOGIN_CARD&&<><label>📧Email</label><input type="email" onChange={(e)=>setEmail(e.target.value)}></input></>}
                        {IsRedInfoShown&&<label style={{color:"red",gridColumn:"1/3"}}>{RedInfo}</label>}
                      <div id="loggin-UI-button-container">
                        {cardSate===IN_LOGIN_CARD&&<button onClick={startLogging}>Log In</button>}
                        {cardSate===IN_SIGNUP_CARD&&<button onClick={startSignUp}>Sign Up</button>}
                        {cardSate===IN_FORGET_CARD&&<CountDownButton 
                                onClick={toSendTempPassword}
                                text="Get Temporary Password🗝"
                                seconds={60}
                                />}
                        <button onClick={props.toReturn} style={{justifySelf:"start"}}>Close</button>
                        </div>
                    </div>
              
            </div>

}
export default LoggedInUI;