
import React, { useState,useEffect } from 'react'
import './App.css'
import UserConsole from './UserConsole'
import HomeUI from './HomeUI'
import Utility from './utils'
import UserData from './UserData'

function App(props) 
{
  const [IsInUserConsole, setIsInUserConsole] = useState(false)
  const [userName, setUserName] = useState("");

  useEffect(()=>{
        
    const toVerifyEmail = async()=>{
               
         let vetoken = window.location.search.replace('?vetoken=','')
         vetoken = decodeURIComponent(vetoken)
         let ret = await UserData.verifyEmail(vetoken)
         alert(ret.message)
         window.location.href = "./"
     }
    

     if(window.location.search!=='')
     {
         toVerifyEmail();
     }

  },[])

  useEffect(()=>{
        const loginByToken = async()=>{

          let token = Utility.readToken()
          if(token !== undefined && token === "")
          {
              return;
          }
          let result = await UserData.checkToken(token)
      
          if(result.pass)
          {
              setUserName(result.userName)
              setIsInUserConsole(true)
          }
  
        }

        loginByToken();
  },[])

      if(IsInUserConsole)
      {
          return <UserConsole 
                      toReturn={()=>{setIsInUserConsole(false)}} 
                      userName={userName}
                      IsByTempPass={false} />
      }

      return<HomeUI /> 
  
}

export default App;
