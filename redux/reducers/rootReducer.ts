import { combineReducers } from 'redux'
import authReducer from './authReducer'

export const rootReducer = combineReducers({
  auth: authReducer,
})

// RootState[type]
export type ReducerType = ReturnType<typeof rootReducer>;
export default rootReducer
