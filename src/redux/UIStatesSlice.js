import { createSlice } from '@reduxjs/toolkit'
//import { sub } from 'date-fns'

export const UI_STATES = (()=>({
    HOME:"HOME",
    GEN_PDF: "GEN_PDF",
    LOGIN_SIGNUP : "LOGIN_SIGNUP",
    USER_CONSOLE:"USER_CONSOLE",
}))()

const initialState = 
{
    UI:UI_STATES.HOME,
}

const UIStateSlice = createSlice({
  name: 'UIState',
  initialState,
  reducers: {
        gotoHome: {
            reducer:(state, action)=>{
                state.UI = UI_STATES.HOME
            }
        },
        gotoGenPDF:{
            reducer:(state, action)=>{
                state.UI = UI_STATES.GEN_PDF
                state.isWithData = action.payload.isWithData
                state.payee = action.payload.payee
                state.client = action.payload.client
                state.preUI = action.payload.preUI
            }
        },
        gotoLoginSignUp:{
            reducer:(state, action)=>{
                state.UI = UI_STATES.LOGIN_SIGNUP
            }
        },
        gotoUserConsole:{
            reducer:(state, action)=> {
                state.UI = UI_STATES.USER_CONSOLE
                state.userName = action.payload.userName
                state.isByTempPass = action.payload.isByTempPass
            }
        }
    }
})

export const { gotoHome, gotoGenPDF, gotoLoginSignUp,gotoUserConsole } = UIStateSlice.actions

export default UIStateSlice.reducer
