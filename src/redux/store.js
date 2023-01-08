import { configureStore}from '@reduxjs/toolkit'

import UIStateReducer from './UIStatesSlice'

export default configureStore({
  reducer: {
    UIState: UIStateReducer,
  },
})