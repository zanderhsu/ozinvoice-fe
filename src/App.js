
import React, { useState } from 'react';
//import ReactDOM from 'react-dom/client';
import './App.css';


import HomeUI from './HomeUI'
import LoggedInUI from './LoggedInUI';
import ToGenerateUI from './ToGenerateUI';


const STATUS_IN_HOMEPAGE = 11;
const STATUS_LOGGED_IN = 22;
const STATUS_IN_GENERATE_UI = 33;

function App(props) {

  const [UIStatus,setUIStatus] =  useState(STATUS_IN_HOMEPAGE);

  function whichToShow(status)
  {
    switch(status)
    {
      case STATUS_IN_HOMEPAGE:
        return  <HomeUI 
        ToGenerateUI={()=>setUIStatus(STATUS_IN_GENERATE_UI)} 
        ToLoginUI={()=>setUIStatus(STATUS_LOGGED_IN)} />;
        
      case STATUS_LOGGED_IN:
        return <LoggedInUI ToHomeUI={()=>setUIStatus(STATUS_IN_HOMEPAGE)}/>;
      
      case STATUS_IN_GENERATE_UI:
        return <ToGenerateUI toReturn={()=>setUIStatus(STATUS_IN_HOMEPAGE)}/>;
      default:
        return <></>;
    }
  }

  return (
    <div className="App">
      {whichToShow(UIStatus) }
    </div>
  );
}

export default App;
