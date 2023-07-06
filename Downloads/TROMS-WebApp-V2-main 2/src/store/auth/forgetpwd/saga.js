import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import {showToast} from 'utils/toastnotify'

// Login Redux States
import {forgotTypes,forgotCreators} from './reducer';


const {REQUEST_PASSWORD ,REQUEST_RESET_PASSWORD} = forgotTypes;
import {forgotPassword ,resetPassword } from 'servicies/UserServicies';
import { setClient } from "utils/apiUtils"
import { appCreators } from 'store/app/appReducer';



function* ForgotPassword(action){
  try{
      console.log({email:action.email});
      const history = action.history;
        
      const responce = yield call(forgotPassword,{email: action.email});
      const data = responce.data;
      console.log("responce",data.message );
      console.log(responce);
      //alert(responce.ok);
      if(responce.ok){
        yield put(forgotCreators.successPassword(data.message,action.email));
        showToast(data.message,"info");
        history.push('/reset-password');
        
      }
      else{
        yield put(forgotCreators.failurePassword());
        showToast(data.message,"error");

      }
        }
        catch(error){
          yield put(forgotCreators.failurePassword());
          showToast("Something went wrong","error")
    
        }
      
    }

function* ResetPassword(action){
  try{
  console.log(action);
  const oldPassword = action.oldPassword;
  const newPassword = action.newPassword;
  const email = action.email ? action.email : null
  const history =action.history;
  const token = action.token;
  console.log("toen in reducer",token)
  
  setClient(token); 
   
  const responce = yield call(resetPassword,{email,oldPassword,newPassword})
  const data = responce.data;
  console.log("responce.ok=",responce.ok)
  console.log(responce);
  if(responce.ok){
    yield put(forgotCreators.successResetPassword());
    showToast(data?.message,"success");
    if(data?.message !== "Incorrect password. Please try again"){
      history.push("/login")
      yield put(appCreators.clearToken())
      
    }
    
  }
  else{
    yield put(forgotCreators.failureResetPassword());
    showToast(data.message,"error");
  }
}
catch(error){
  yield put(forgotCreators.failureResetPassword());
  console.log("error",error)
  showToast("Something went wrong","error")
}

}


export function* watchUserPasswordForget() {
  yield takeEvery(REQUEST_PASSWORD, ForgotPassword)
  yield takeEvery(REQUEST_RESET_PASSWORD, ResetPassword)
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)])
}

export default forgetPasswordSaga
