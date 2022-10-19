
import React, { useState } from 'react';
//import ReactDOM from 'react-dom/client';
import './App.css';


import HomeUI from './HomeUI'
import LoggedInUI from './LoggedInUI';
import ToGenerateUI from './ToGenerateUI';
import UserConsole from './UserConsole'

const STATUS_IN_HOMEPAGE = 11;
const STATUS_LOGGED_IN = 22;
const STATUS_IN_GENERATE_UI = 33;
const STATUS_IN_USER_CONSOLE = 44;

function App(props) {

  const [UIStatus,setUIStatus] =  useState(STATUS_IN_HOMEPAGE);
  const [userName, setUserName] = useState("");

  const toUserConsole = (uname)=>{
    setUserName(uname)
    setUIStatus(STATUS_IN_USER_CONSOLE);
  }
  function whichToShow(status)
  {
    switch(status)
    {
      case STATUS_IN_HOMEPAGE:
        return  <HomeUI 
        ToGenerateUI={()=>setUIStatus(STATUS_IN_GENERATE_UI)} 
        ToLoginUI={()=>setUIStatus(STATUS_LOGGED_IN)} />;
        
      case STATUS_LOGGED_IN:
        return <LoggedInUI ToReturn={()=>setUIStatus(STATUS_IN_HOMEPAGE)} ToUserConsole={(uname)=>{toUserConsole(uname)}}/>
      
      case STATUS_IN_GENERATE_UI:
        return <ToGenerateUI toReturn={()=>setUIStatus(STATUS_IN_HOMEPAGE)}/>
      case STATUS_IN_USER_CONSOLE:
        return <UserConsole toReturn={()=>setUIStatus(STATUS_IN_HOMEPAGE)} userName={userName} />
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
