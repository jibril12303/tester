import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN, VERIFY_2FA } from "./actionTypes"
import { apiError, failure2FA, loginSuccess, logoutUserSuccess, show2FA, success2FA , } from "./actions"

import {postLoginUser, configDataGet, verifyOTP, destroyToken} from '../../../servicies/UserServicies'

import { appCreators} from 'store/app/appReducer'

import { getClient, setClient } from "utils/apiUtils"
import {showToast} from 'utils/toastnotify'

import {bchDashboardCreators} from '../../dashboard/reducer'
//Include Both Helper File with needed methods




function* loginUser({ payload: { user, history } }) {
  try {

      const response = yield call(postLoginUser, {
        email: user.email,
        password: user.password,
      })
      const data = response.data;

    if(response.ok && data.token){

      debugger;
      yield put(loginSuccess(response))
      yield put(bchDashboardCreators.setUserOrganisation({orgID: null}))
      const configdata = yield call(configDataGet);
      yield put(bchDashboardCreators.setApiVersion(configdata.data.API_VERSION,configdata.data))
      console.log({demo: data.token})
      //setClient(data.token)
      if(!data.user.profileAvailable) {
          console.log('Profile Unavailable, need to add new step in next PR');

        }else if (!data.user.policyAccepted) {
          console.log( 'Policy not accepted, need to add new step in next PR') ;
        }else if(data.message == "You account exists but hasn't been activated, Please contact your admin"){
          showToast(data.message,"error")    
        }

        window.sessionStorage.setItem("shouldShowOnCallRegistrarModal", true);
        window.sessionStorage.setItem("shouldShowIncompleteCaseModal", true);
        yield put(appCreators.setToken(data.token, data.tokenExpiryDate,data.user));
        if(data.user.accountType == "REVIEWER" && data.user.speciality == "Orthoptics"){
          window.sessionStorage.setItem("shouldShowOrthopticsRegistrarModal", true);
        }
        history.push('/')
        
      console.log('its running');
    } else if (response.status == "403"){
      yield put(show2FA())
    }
    else{
      if(data.error){
        showToast(data.error,"error")
        yield put(apiError(data.error))
      }
      else if(data.message){
        showToast(data.message,"error")   
        yield put(apiError(data.error))
      }
      
            
    }

  } catch (error) {
    yield put(apiError(error))
    showToast("Something went wrong","error")
  
}
}


function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")
    let response = yield call(destroyToken)
    yield put(bchDashboardCreators.setUserOrganisation({orgID: null}))
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* verifyUser({payload: {user, code, history}}){
    try {
      debugger;
      const response = yield call(verifyOTP,user.email,user.password,code)
      const data = response.data;
      if (response.ok && data.token){
        yield put(loginSuccess(response))
        yield put(success2FA())
        yield put(bchDashboardCreators.setUserOrganisation({orgID: null}))
        const configdata = yield call(configDataGet);
        yield put(bchDashboardCreators.setApiVersion(configdata.data.API_VERSION,configdata.data))
        window.sessionStorage.setItem("shouldShowOnCallRegistrarModal", true);
        window.sessionStorage.setItem("shouldShowIncompleteCaseModal", true);
        yield put(appCreators.setToken(data.token, data.tokenExpiryDate,data.user));
        if(data.user.accountType == "REVIEWER" && data.user.speciality == "Orthoptics"){
          window.sessionStorage.setItem("shouldShowOrthopticsRegistrarModal", true);
        }
        history.push('/')

      } else {
        showToast(response.data.message,'error')
        yield put(failure2FA())
      }
    } catch (error) {
      yield put(failure2FA())
    }
}


function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(LOGOUT_USER, logoutUser)
  yield takeLatest(VERIFY_2FA, verifyUser)
}

export default authSaga
