//import logo from './logo.svg';
import React, { useState } from 'react';
import './HomeUI.css'

function HomeUI(props)
{
    return (

        <div id="home">
            <p>
            Welcome to use OZ Invoice!<br/>         It can help you generate PDF invoices quickly
            <br/>It will be more easy for registered users
            </p>
            <div id="home-buttons-container">
                <button onClick={props.ToGenerateUI}>Get PDF invoices<br/>Without Logging In</button>
                <button title="more functions for registered users" onClick={props.ToLoginUI}>Login/Sign up</button>
            </div>
            <div id="intro">
            <p>This is a single page application with React, designed by Zheng(Zander) Hsu, a fullstack developer 
                located in Sydney,Australia.<br/>You can contact me via email:  
                <a href="mailto:xuzheng0617@gmail.com">xuzheng0617@gmail.com</a></p>
            </div>
        </div>
    );
}

export default HomeUI;