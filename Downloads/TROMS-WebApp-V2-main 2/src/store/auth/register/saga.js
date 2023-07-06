import { takeEvery, fork, put, all, call, takeLatest } from "redux-saga/effects"
import {showToast} from 'utils/toastnotify'

import { useHistory } from "react-router-dom"

//Account Redux states
import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed, } from "./actions"
import { mainReducerCreators,mainReducerTypes } from "store/reducers";


//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postFakeRegister,
  postJwtRegister,
} from "../../../helpers/fakebackend_helper"

import {createUser,registerPassword,configDataGet,registerForm,subscriptionDataGet,orgSearchval, requestNewAuthCode} from 'servicies/UserServicies';

import { setClient } from 'utils/apiUtils';



import {registerTypes,registerCreators} from './reducer';
import {appTypes,appCreators} from 'store/app/appReducer';
import { mfaCreators } from "../mfa/reducer"

const {REQUEST_EMAIL,REQUEST_REGISTER_PASSWORD,REQUEST_FORM,REQUEST_GET_ORG,REQUEST_UPDATE_PROFILE, REQUEST_NEW_AUTH_CODE} = registerTypes;




// Is user register successfull then direct plot user in redux.
function* RegisterUser(action) {
  try{
  const email = action.email;
  const appRole = action.role;
  const history = action.history
  debugger;
      const response = yield call(createUser,{email,appRole})
      yield put(registerUserSuccessful(response))
      const data = response.data;
      console.log("response",data.message );
      console.log(response);

      

      if(response.ok){

        if(data.message == "User has been created and email sent"){
          yield put(registerCreators.successEmail(data.message,action.email));
          history.push('/register-password');
         
        }else{  
          yield put(registerCreators.failEmail()); 
          //showToast(data.map(x=>x.msg),error)
          showToast('Something went wrong.\nPlease contact TriVice support team','error')
          
        }
         
        
      }
      else {
     // alert(data.error);
     yield put(registerCreators.failEmail());
     showToast(data.error,"error")
      }
    }
    catch(error){
      yield put(registerCreators.failEmail());
      showToast("Something went wrong","error")
    }
}
let tokendata = null;

function* RegisterPassword(action){
  try{

  const email = action.email;
  const authorisationCode = action.code;
  const password = action.password;
  const history = action.history;
  //const setmodal_standard = action.setmodal_standard;


  const response = yield call(registerPassword,{email,authorisationCode,password})
  const data = response.data;
  console.log("response pass",data);
      console.log(response);
      tokendata = data.token;
    if(response.ok){
     setClient(data.token);
      
      const configdata = yield call(configDataGet);
      //const subscriptionData = yield call (subscriptionDataGet)

      console.log("configdata",configdata);
      //console.log(subscriptionData, 'subdata')

      yield put(registerCreators.successRegisterPassword(configdata.data,data));
      yield put(appCreators.setToken(data.token, data?.tokenExpiryDate ,data.user));

      if(data.user.approved == false){
        console.log('config unapproved')
        history.push('/update-profile')
       // yield put(registerCreators.setShowUnapprovedModal(true))   
      }else{
        //console.log('unapproved user')
        //setmodal_standard(true)
        
      
        history.push('/update-profile');
      }
      //}
    }
    else{
      yield put(registerCreators.failRegisterPassword());
      showToast(data.error)

    }
  }
  catch(error){
    yield put(registerCreators.failRegisterPassword());
    showToast("Something went wrong","error")
  }
}

function* RegisterForm(action){
  try{
  console.log("registerForm running")

  const token = action.token;
  const payload = action.payload;
  console.log("token",token)
  setClient(tokendata);

  
  const response = yield call(registerForm,payload)
  const history = action.history;
  const data = response.data;
  console.log("User detail"+data.user)
  if(response.ok){
    yield put(registerCreators.successForm(data.user));
    yield put(mfaCreators.requestQRCodeWAuth(token))
    history.push('/setup2fa');
  }
  else{
    yield put(registerCreators.failForm());
    showToast(data.error)
  }

  }
  catch(error){
    yield put(registerCreators.failForm());
    showToast("Something went wrong","error") 
  }


}


function* UpdateForm(action){
  try{
  console.log("registerForm running",action)

  const token = action.token;
  const payload = action.payload;
  console.log("token",token)
  setClient(token);

  
  const response = yield call(registerForm,payload)
  const history = action.history;
  const data = response.data;
  console.log(response)
  if(response.ok){
    
    yield put(registerCreators.successUpdateProfile());
    showToast("Profile update successfully","success")
    history.push("/login")
    yield put (mainReducerCreators.userLogout())
    

  }
  else{
    showToast(data.error)
  }

  }
  catch(error){
    
    showToast("Something went wrong","error") 
  }


}
function* GetOrgValues(action){

  const response = yield call(orgSearchval,action.searchval)
  console.log("searchresponse=",response)
  if(response.ok){
    yield put(registerCreators.successGetOrg(response.data))
  } 
}

function* getNewAuthCode(action){
  try {
    const response = yield call(requestNewAuthCode, action.email)
    if(response.ok){
      if(response.data?.message){
        showToast(response.data.message,'info')
      }
      yield put(registerCreators.responseNewAuthCode())
    } else {
      if(response.data?.message){
        showToast(response.data.message,'info')
      }
    }
  } catch (error) {
    showToast("Something went wrong",'error')
  }
}

export function* watchUserRegister() {
  yield takeEvery(REQUEST_EMAIL, RegisterUser)
  yield takeEvery(REQUEST_REGISTER_PASSWORD, RegisterPassword)
  yield takeEvery(REQUEST_FORM,RegisterForm)
  yield takeEvery(REQUEST_GET_ORG,GetOrgValues)
  yield takeEvery(REQUEST_UPDATE_PROFILE,UpdateForm)
  yield takeLatest(REQUEST_NEW_AUTH_CODE,getNewAuthCode)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
