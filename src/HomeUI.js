//import logo from './logo.svg';
import React, { useReducer } from 'react';
import './HomeUI.css'
import ToGetPDFUI from './ToGetPDFUI'
import LoggedInUI from './LoggedInUI'

const IN_LOGIN_UI = 11;
const IN_GETPDF_UI = 22;
const IN_MYSELF_UI = 33;

const UIStateReducer = (state, action)=>{
    switch(action)
    {
        case IN_LOGIN_UI:
            return IN_LOGIN_UI;
        case IN_GETPDF_UI:
            return IN_GETPDF_UI;

        default:
            return IN_MYSELF_UI;
    }
}

function HomeUI()
{ 
    /*useState is enough here*/
    const [UIState, UIStateDispatch] = useReducer(UIStateReducer, IN_MYSELF_UI)
  
   if(UIState === IN_LOGIN_UI)
    {
        return <LoggedInUI toReturn={()=>{UIStateDispatch(IN_MYSELF_UI)}}/>
    }

  
    if(UIState === IN_GETPDF_UI)
    {
        return <ToGetPDFUI toReturn={()=>UIStateDispatch(IN_MYSELF_UI)} IsWithData={false}/>
    }

    //UIState === IN_MYSELF_UI
    return (

        <div id="home">
            <p>
            Welcome to use OZ Invoice!<br/>         It can help you generate PDF invoices quickly
            <br/>It will be more easy for registered users
            </p>
            <div id="home-buttons-container">
                <button onClick={()=>{UIStateDispatch(IN_GETPDF_UI)}}>Get PDF invoices<br/>Without Logging In</button>
                <button title="more functions for registered users" onClick={()=>{UIStateDispatch(IN_LOGIN_UI)}}>Login/Sign up</button>
            </div>
            <div id="intro">
            <p>This is a React single page application, designed by Zheng(Zander) Hsu, a fullstack developer 
                located in Sydney,Australia.<br/>You can contact me via email:  
                <a href="mailto:xuzheng0617@gmail.com">xuzheng0617@gmail.com</a></p>
            </div>
        </div>
    );
}

export default HomeUI;