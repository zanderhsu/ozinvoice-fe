
import React, { useEffect } from 'react'
import './App.css'
import UserConsole from './UserConsole'
import HomeUI from './HomeUI'
import Utility from './utils'
import UserData from './UserData'
import { useSelector,useDispatch } from 'react-redux'
import {UI_STATES,gotoUserConsole} from "./redux/UIStatesSlice"
import LoggedInUI from './LoggedInUI'
import ToGetPDFUI from './ToGetPDFUI'

function App() 
{

  const gUIState = useSelector((state) => state.UIState)
  const dispatch = useDispatch()

  useEffect(()=>{
        
        const toVerifyEmail = async()=>
        {
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
            dispatch(gotoUserConsole({isByTempPass:false}))
          }
  
        }

        loginByToken();
  },[dispatch])
 
  switch(gUIState.UI)
  {
        case UI_STATES.HOME:
            return (<HomeUI />)
        
        case UI_STATES.LOGIN_SIGNUP:
            return <LoggedInUI />
    
        case UI_STATES.GEN_PDF:
            return <ToGetPDFUI />
        
        case UI_STATES.USER_CONSOLE:
            return (<UserConsole />)

        default:
            return <div>Unknown State!!It shouldn't be here</div>   
    }
}

export default App;
