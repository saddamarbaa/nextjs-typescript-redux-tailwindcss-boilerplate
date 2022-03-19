import {

  AUTH_LOGIN_LOADING,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILER,
} from 'constants/ActionTypes'

import { UserType } from 'types'

import apiRequests from 'utils/api'

const getHostUrl = 'http://localhost:5000/api/v1'

// AUTH
export const LogIn = (user: UserType) => async (dispatch: any) => {
  dispatch({ type: AUTH_LOGIN_LOADING })
  try {
    const response = await apiRequests({
      method: 'post',
      url: `${getHostUrl}/auth/login`,
      data: user,
    })
    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: response })
  } catch (error: any) {
    dispatch({
      type: AUTH_LOGIN_FAILER,
      payload: { error: error?.data?.message || error.statusText },
    })
  }
}
