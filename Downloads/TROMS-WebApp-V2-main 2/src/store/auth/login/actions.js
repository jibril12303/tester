import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  LOGIN_ERROR,
  SHOW_2FA,
  VERIFY_2FA,
  SUCCESS_2FA,
  FAILURE_2FA,
  RESET_STATE
} from "./actionTypes"

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  }
}

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const loginError = user => {
  return {
    type: LOGIN_ERROR,
  }
}

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  }
}

export const show2FA = () =>{
  return{
    type: SHOW_2FA,
    payload: {}
  }
}

export const verify2FA = (user, code,history) =>{
  return{
    type: VERIFY_2FA,
    payload: {user, code,history}
  }
}

export const success2FA = () =>{
  return{
    type: SUCCESS_2FA,
    payload: {}
  }
}

export const failure2FA = () =>{
  return{
    type: FAILURE_2FA,
    payload:{}
  }
}

export const resetState = () =>{
  return {
    type: RESET_STATE,
    payload:{}
  }
}