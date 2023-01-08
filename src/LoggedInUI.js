import {  useReducer } from "react";
import "./LoggedInUI.css"
import Utility from "./utils";
import UserData from "./UserData";
import CountDownButton from "./CountDownButton";
import { useDispatch } from 'react-redux'
import {gotoHome,gotoUserConsole} from "./redux/UIStatesSlice"

const LOGIN_CARD = "LOG_IN";
const SIGNUP_CARD ="SIGN_UP";
const FORGOT_CARD = "FORGET_PWD";
const TO_SHOW_INFO ="SHOW_INFO";
const SET_USER_NAME = "SET_USER_NAME" 
const SET_PWD = "SET_PWD"
const SET_PWD_AGAIN = "SET_PWD_AGAIN"
const SET_EMAIL = "SET_EMAIL"

const initialState =  {
    card:LOGIN_CARD,
    userName: "demo_account",
    pwd: "123456789H",
    pwdAgain:undefined,
    email:undefined,
    loginBtn:true,
    signUpBtn:false,
    getTemPwdBtn:false,
    redInfo:"",
}
const UIStateReducer = (state, action)=>{
    switch(action.type)
    {
        case LOGIN_CARD:
            return {
                ...state,
                card:LOGIN_CARD,
                userName: "demo_account",
                pwd: "123456789H",
                pwdAgain:undefined,
                email:undefined,
                loginBtn:true,
                signUpBtn:false,
                getTemPwdBtn:false,
                redInfo:"",
            }
           
        case SIGNUP_CARD:
            return {
                ...state,
                card: SIGNUP_CARD,
                userName: "",
                pwd: "",
                pwdAgain:"",
                email:"",
                loginBtn:false,
                signUpBtn:true,
                getTemPwdBtn:false,
                redInfo:"",
            }
           
        case FORGOT_CARD:
            return {
                ...state,
                card:FORGOT_CARD,
                userName: undefined,
                pwd:undefined,
                pwdAgain:undefined,
                email:"",
                loginBtn:false,
                signUpBtn:false,
                getTemPwdBtn:true,
                redInfo:"",
            }

        case TO_SHOW_INFO:
            return  {
                ...state,
                redInfo:action.payload.redInfo
            }

        case SET_USER_NAME:
            return {
                ...state,
                userName:action.payload.userName
            }

        case SET_PWD:
            return {
                ...state,
                pwd:action.payload.pwd
            }

        case SET_PWD_AGAIN:
            return {
                ...state,
                pwdAgain:action.payload.pwdAgain
            }

        case SET_EMAIL:
            return {
                ...state,
                email:action.payload.email
            }

        default:
            return state;
    }
}

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

function LoggedInUI()
{
    const [UIState, dispatch] = useReducer(UIStateReducer,initialState)
    const globalDispatch = useDispatch();
    
    const showRedInfo = (message)=>{
        dispatch({type:TO_SHOW_INFO,payload:{redInfo:message}})
    }

    const checkDataBeforeLogin = ()=>
    {
        if(UIState.userName.length<5 || UIState.userName.length>32 || UIState.pwd.length<8 || UIState.pwd.length > 32)
        {
            showRedInfo("Invalid inputs:User name length:5~32, password length:8~32")
            return false;
        }
        return true;
    }

    const checkDataBeforeSignup = ()=>
    {
        let result
       
        result = Utility.validateUserName(UIState.userName)

        if(!result.pass) 
        {
            showRedInfo(result.reason)
            return false;
        }

        result = Utility.validatePassword(UIState.pwd)
        if(!result.pass) 
        {
            showRedInfo(result.reason)
            return false;
        }

        if(UIState.pwd !== UIState.pwdAgain)
        {
            showRedInfo(`Two password inputs are different`)   
            return false;
        }
        
        result = Utility.validateEmail(UIState.email)
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
                user_name:UIState.userName,
                password:UIState.pwd,
                email:UIState.email
            }
            let result = await UserData.addUser(userObj)
            if(result.success)
            {
                globalDispatch(gotoUserConsole({isByTempPass:false}))
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
            let result = await UserData.checkPassword(UIState.userName,UIState.pwd)
           
            if(result.pass)
            {
                globalDispatch(gotoUserConsole({isByTempPass:result.isByTempPass}))
            }
            else
            {
                showRedInfo("Wrong user name or password")
            }
        }
    }

    const toSendTempPassword = async()=>{
        let result = Utility.validateEmail(UIState.email)
        if(result.pass)
        {
            let ret = await UserData.sendTempPassword(UIState.email)
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
        const newCard = e.target.getAttribute("name");
        dispatch({type:newCard})
    }

    return  (
            <div id="loggin-UI">
            <h1 style={{textAlign:"left"}}>OZ Invoice</h1>
                <div id="loggin-UI-card-titles">
                    <label name={LOGIN_CARD} style={getCardTitleStyle(LOGIN_CARD,UIState.card)} onClick={handleTitleClick}>Log In</label>
                    <label name={SIGNUP_CARD} style={getCardTitleStyle(SIGNUP_CARD,UIState.card)} onClick={handleTitleClick}>Sign Up</label>
                    <label name={FORGOT_CARD} style={getCardTitleStyle(FORGOT_CARD,UIState.card)} onClick={handleTitleClick}>Forgot Password</label>
                </div>
                
                <div id="loggin-UI-card">
                        {UIState.userName!==undefined &&<><label>User Name</label><input type="text"  value={UIState.userName} onChange={(e)=>dispatch({type:SET_USER_NAME,payload:{userName:e.target.value}})}></input></>}
                        {UIState.pwd !== undefined && <><label>Password🗝</label><input type="password"  value={UIState.pwd} onChange={(e)=>dispatch({type:SET_PWD,payload:{pwd:e.target.value}})}></input></>}
                        {UIState.pwdAgain !== undefined && <><label>Password🗝 again</label><input type="password"  value={UIState.pwdAgain} onChange={(e)=>dispatch({type:SET_PWD_AGAIN,payload:{pwdAgain:e.target.value}})}></input></>}
                        {UIState.email !== undefined && <><label>📧Email</label><input type="email" value={UIState.email} onChange={(e)=>dispatch({type:SET_EMAIL,payload:{email:e.target.value}})}></input></>}
                        {UIState.redInfo && <label style={{color:"red",gridColumn:"1/3"}}>{UIState.redInfo}</label>}
                    
                    <div id="loggin-UI-button-container">
                        {UIState.loginBtn &&<button onClick={startLogging}>Log In</button>}
                        {UIState.signUpBtn && <button onClick={startSignUp}>Sign Up</button>}
                        {UIState.getTemPwdBtn &&<CountDownButton 
                                onClick={toSendTempPassword}
                                text="Get Temporary Password🗝"
                                seconds={60}
                                />}
                        <button onClick={()=>globalDispatch(gotoHome())} style={{justifySelf:"start"}}>Close</button>
                    </div>
                </div>

                <h4>Note: you can use the prefilled user name and password to login directly for demo usage.
                    All information you see with this demo account is only for demo purpose.
                </h4>
              
            </div>)
}
export default LoggedInUI;