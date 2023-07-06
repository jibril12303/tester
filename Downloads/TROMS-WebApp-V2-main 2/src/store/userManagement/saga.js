import React from 'react';
import {call, put, takeLatest} from 'redux-saga/effects';
import {userManageTypes, userManageCreators} from "./reducer";
import {userList,userApprove, userReject, userDisable} from "servicies/UserServicies";
import {appTypes,appCreators} from "store/app/appReducer"
import { showToast } from 'utils/toastnotify';

export function* getUserData(action){
    try{
        //debugger;
        
        const response = yield call(userList,action.page,action.limit,action.status,action.search)
        if(response.ok){
            yield put(userManageCreators.successFetchUsers(response.data))
        }
        else if(response.error == "Expired or invalid token - please log in again"){
            showToast(response.error,"error");
            yield put(appCreators.clearToken())
        }
        console.log(response.data)
    }
    catch(err){
        console.log(err)
        }
}

export function* getUserApprove(action){
    try{
        const response = yield call(userApprove,action.email,action.date,action.subscriptions,action.permissions)
        if(response.ok){
            showToast(response?.data?.message,'success')
            // const listresponse = yield call(userList)
            //yield put(userManageCreators.successFetchUsers(listresponse.data))
        }else {
            //showToast('Something went wrong','error')
        }
    }
    catch(err){
        showToast(err,"error")
    }
}

export function* getUserReject(action){
    try{
        const response = yield call(userReject,action.email)
        if(response.ok){
            showToast(response?.data?.message,'success')
            // const listresponse = yield call(userList)
            //yield put(userManageCreators.successFetchUsers(listresponse.data))
        } else {
           // showToast('Something went wrong','error')
        }
    }
    catch(err){
        showToast(err,"error")
    }
}

export function* getUserDisable(action){
    try{
        const response = yield call(userDisable,action.email)
        if(response.ok){
            showToast(response?.data?.message,'success')
            // const listresponse = yield call(userList)
            //yield put(userManageCreators.successFetchUsers(listresponse.data))
        } else {
           // showToast('Something went wrong','error')
        }
    }
    catch(err){
        showToast(err,"error")
    }
}


function* userManagementSaga(){
    yield takeLatest(userManageTypes.REQUEST_FETCH_USERS,getUserData)
    yield takeLatest(userManageTypes.APPROVE_USER_SUCCESS, getUserApprove);
    yield takeLatest(userManageTypes.REJECT_USER_SUCCESS, getUserReject);
    yield takeLatest(userManageTypes.DISABLE_USER_SUCCESS, getUserDisable)
}

export default userManagementSaga;