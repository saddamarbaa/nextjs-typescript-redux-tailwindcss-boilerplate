import { AnyAction } from 'redux'

import {
  AUTH_LOGIN_LOADING, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILER, AUTH_LOGIN_REST,
} from 'constants/ActionTypes'

import { _authPrototypeReducerState as ReducerState } from 'types'

const initialState: ReducerState = {
  loginUser: {},
  loginUserIsLoading: false,
  loginUserIsSuccess: false,
  loginUserIsError: false,
  loginMessage: '',

}

export default function actionReducer(action: AnyAction, state = initialState) {
  switch (action?.type) {
    case AUTH_LOGIN_LOADING:
      return {
        ...state,
        loginUserIsLoading: true,
        loginUserIsSuccess: false,
        loginUserIsError: false,
        loginMessage: 'PENDING',
      }
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isADmin: action.payload.data.user.role || false,
        loginUser: action.payload.data || {},
        loginUserIsLoading: false,
        loginUserIsSuccess: true,
        loginUserIsError: false,
        loginMessage: action.payload.message || 'Success',
        isAuthenticated: true,
      }
    case AUTH_LOGIN_FAILER:
      return {
        ...state,
        loginUser: {},
        loginUserIsLoading: false,
        loginUserIsSuccess: false,
        loginUserIsError: true,
        loginMessage: action.payload.message || action.payload.error || 'Error',
      }
    case AUTH_LOGIN_REST:
      return {
        ...state,
        loginUser: {},
        loginUserIsLoading: false,
        loginUserIsSuccess: false,
        loginUserIsError: false,
        loginMessage: '',
      }

    default:
      return state
  }
}
