import { useState } from "react";
import "./LoggedInUI.css"
import Utility from "./utils";
import UserData from "./UserData";
import MYCONSTANTS from "./consts.js";

const SORRY_INFO = "Sorry, this function is still being developed"
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

    const checkDataBeforeSubmit = ()=>
    {
        let result = true;
        if(userName.length <=MYCONSTANTS.MIN_USER_NAME_LENGTH || userName.length > MYCONSTANTS.MAX_USER_NAME_LENGTH) 
        {
            showRedInfo(`user name length should be between ${MYCONSTANTS.MIN_USER_NAME_LENGTH} and ${MYCONSTANTS.MAX_USER_NAME_LENGTH}`)
            result = false;
        }
        else if(password.length < MYCONSTANTS.MIN_PWD_LENGTH || password.length > MYCONSTANTS.MAX_PWD_LENGTH)
        {
            showRedInfo(`password length should be between ${MYCONSTANTS.MIN_PWD_LENGTH} and ${MYCONSTANTS.MAX_PWD_LENGTH}`)   
            result = false;
        }
        return result;
    }

    const startLogging = () =>{

        return props.ToUserConsole('zhengxu');

        if(checkDataBeforeSubmit() === true)
        {
            Utility.actionForWaiting(true)
            UserData.checkPassword(userName,password)
            .then((pass)=>{
                if(pass){
                    props.ToUserConsole(userName);
                }
                else
                {
                    showRedInfo("Wrong user name or password")
                }
            })
            .catch((err)=>{
                showRedInfo(err)
            })
        }
    }


    const handleTitleClick = (e)=>
    {
        const newCardState = e.target.getAttribute("name");
        setCardState(newCardState);
        setIsRedInfoShown(false);
    }

    return  <div id="loggin-UI">
                
                <div id="loggin-UI-card-titles">
                    <label name={IN_LOGIN_CARD} style={getCardTitleStyle(IN_LOGIN_CARD,cardSate)} onClick={handleTitleClick}>Log In</label>
                    <label name={IN_SIGNUP_CARD} style={getCardTitleStyle(IN_SIGNUP_CARD,cardSate)} onClick={handleTitleClick}>Sign Up</label>
                    <label name={IN_FORGET_CARD} style={getCardTitleStyle(IN_FORGET_CARD,cardSate)} onClick={handleTitleClick}>Forget Password</label>
                </div>
                
                 <div id="loggin-UI-card">
                        {cardSate!==IN_FORGET_CARD?<><label>User Name</label><input type="text"  value={userName} onChange={(e)=>setUserName(e.target.value)}></input></>:null}
                        {cardSate!==IN_FORGET_CARD?<><label>Password</label><input type="password"  value={password} onChange={(e)=>setPassword(e.target.value)}></input></>:null}
                        {cardSate===IN_SIGNUP_CARD?<><label>Password again</label><input type="password"  value={passwordAgain} onChange={(e)=>setPasswordAgain(e.target.value)}></input></>:null}
                        {cardSate!==IN_LOGIN_CARD?<><label>Email</label><input type="email" onChange={(e)=>setEmail(e.target.value)}></input></>:null}
                        {IsRedInfoShown?<label style={{color:"red",gridColumn:"1/3"}}>{RedInfo}</label>:null}
                      <div id="loggin-UI-button-container">
                        {cardSate===IN_LOGIN_CARD?<button onClick={startLogging}>Log In</button>:null}
                        {cardSate===IN_SIGNUP_CARD?<button onClick={()=>{}}>Sign Up</button>:null}
                        {cardSate===IN_FORGET_CARD?<button onClick={()=>{showRedInfo(SORRY_INFO)}}>Send Temporary Password</button>:null}
                        <button onClick={()=>props.ToReturn()} style={{justifySelf:"start"}}>Close</button>
                        </div>
                    </div>
              
            </div>

}
export default LoggedInUI;