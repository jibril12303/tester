import {mfaTypes,mfaCreators} from "./reducer"
import { call, put, takeEvery, all, fork, takeLatest } from "redux-saga/effects"
import {showToast} from 'utils/toastnotify'

const {REQUEST_QR_CODE_W_AUTH, VERIFY_TOTP, REQUEST_EMAIL_2FA} =mfaTypes;

import { requestBackupCode, requestQR, setupMFA} from "servicies/UserServicies";
import { setClient } from "utils/apiUtils";


console.log("TYPES",mfaTypes)

export function* requestQRCodeWithAuth(action){
    try {
        if(typeof action.token == "string"){
            setClient(action.token)
        }
        const response = yield call(requestQR, action.token)
        if (response.ok){
            yield put(mfaCreators.successQRCodeWAuth(response.data.qr))
        }
    } catch (error) {
        
    }
}

export function* verifySetupMFA(action){
    try {
        const response = yield call(setupMFA,action.code)
        if(response.ok){
            yield put(mfaCreators.successTOTP())
            debugger;
            if(action.history.location.pathname == "/setup2fa"){
                action.history.push('/termsconditions')
            } else {
                action.history.push('/logout')
            }
            showToast('2FA set up succesfully','success')
        } else {
            yield put(mfaCreators.failureTOTP())
            showToast(response.data.message,'error')
        }
    } catch (error) {
        yield put(mfaCreators.failureTOTP())
        showToast(response.data.message,'error')
    }
}

export function* requestEmail2fa(action){
    try {
        const response = yield call(requestBackupCode, action.email)
        if(response.ok){
            showToast(response.data.message,'success')
            yield put(mfaCreators.successEmailTwoFA())
        } else {
            showToast(response.data.message,'error')
            yield put(mfaCreators.failureEmailTwoFA())
        }
    } catch (error) {
        showToast('Something went wrong','error')
        yield put(mfaCreators.failureEmailTwoFA())
    }
}

function* mfaSaga(){
    yield takeLatest(mfaTypes.REQUEST_QR_CODE_W_AUTH,requestQRCodeWithAuth)
    yield takeLatest(mfaTypes.VERIFY_TOTP, verifySetupMFA)
    yield takeLatest(mfaTypes.REQUEST_EMAIL_TWO_FA,requestEmail2fa)
}

export default mfaSaga