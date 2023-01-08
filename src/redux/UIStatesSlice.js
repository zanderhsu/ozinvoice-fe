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
                state.payload = action.payload
            }
        },
        gotoGenPDF:{
            reducer:(state, action)=>{
                state.UI = UI_STATES.GEN_PDF
                state.payload  = action.payload
            }
        },
        gotoLoginSignUp:{
            reducer:(state, action)=>{
                state.UI = UI_STATES.LOGIN_SIGNUP
                state.payload = action.payload
            }
        },
        gotoUserConsole:{
            reducer:(state, action)=> {
                state.UI = UI_STATES.USER_CONSOLE
                state.payload  = action.payload
            }
        }
    }
})

export const { gotoHome, gotoGenPDF, gotoLoginSignUp,gotoUserConsole } = UIStateSlice.actions

export default UIStateSlice.reducer
