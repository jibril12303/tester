import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  LOGIN_ERROR,
  SHOW_2FA,
  VERIFY_2FA,
  SUCCESS_2FA,
  FAILURE_2FA,
  RESET_STATE
} from "./actionTypes"

const initialState = {
  error: "",
  loading: null,
  show2FA: false
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
      }
    case LOGIN_ERROR:
      state = {
        ...state,
        loading: false,
      }
      break
    case LOGOUT_USER:
      state = { ...state,loading: false, }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state,loading: false, }
      break
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false }
      break
    case SHOW_2FA:
      state = {
        ...state,
        show2FA: true,
        loading: null,
        error:""
      }
      break;
    case VERIFY_2FA:
      state ={
        ...state,
        loading: true
      }
      break;
    case SUCCESS_2FA:
      state = {
        ...state,
        loading: null,
      }
      break;
    case FAILURE_2FA:
      state = {
        ...state,
        loading: null
      }
      break;
    case RESET_STATE:
      state = initialState
      break;
    default:
      state = { ...state,loading: null, }
      break
  }
  return state
}

export default login
