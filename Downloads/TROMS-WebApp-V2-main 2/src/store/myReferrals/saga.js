import React from 'react';
import {call, put, takeLatest} from 'redux-saga/effects';
import {myReferralTypes, myReferralCreators} from "./reducer";
import {getMyReferralsService, getClinicianList,reassignCase, acceptNewOwner, getSpecificClinicianList} from "servicies/UserServicies";
import {appTypes,appCreators} from "store/app/appReducer"
import { showToast } from 'utils/toastnotify';
export function* getMyReferrals(action) {
    console.log('potato', action)

    try {
        const {pageNumber,Status, category, submission,durtype ,search = null,selectedOrg,orderColumn,orderType,assignedRev,owner, pathway, assignedRef, specNeeded} = action;
        const payload = {
            selectedType: category, page: pageNumber, limit:10, search,
        }
        if (category) {
            payload.selectedType = category
        }
        if (submission) {
            payload.timeFrame = submission
        }
        if(Status){
            payload.Status = Status
        }
        if(durtype){
            payload.durtype = durtype
        }
        if(selectedOrg){
            payload.org=selectedOrg
        }
        if(orderColumn){
            payload.orderColumn = orderColumn
        }
        if(orderType){
            payload.orderType = orderType
        }
        if (assignedRev){
            payload.assignedRev = assignedRev
        }
        if (owner){
            payload.owner = owner
        }
        if (pathway){
            payload.pathway = pathway
        }
        if (assignedRef){
            payload.assignedRef = assignedRef
        }
        if (specNeeded){
            payload.specNeeded = specNeeded
        }
        const response = yield call(getMyReferralsService, payload);
        // console.log(response.data)
        if (response.ok) {
            yield put(myReferralCreators.successFetchReferrals(response.data));
            // showNotification(response.data.message, NOTIFICATION_TYPE.SUCCESS);
        } else {
            if (
                response.error === "Expired or invalid token - please log in again"
                
              ) {
                showToast(response.error,"error");
                yield put(appCreators.clearToken())
              }
          
              console.log(response.data)
            yield put(myReferralCreators.failureFetchReferrals());
        }
    } catch (e) {
        console.log(e);
        yield put(myReferralCreators.failureFetchReferrals(e));
    }
}
export function* getClinicians(action){
    console.log('getClinicians saga', action)
    try {
        const response = yield call(getClinicianList,action?.onCall,action?.speciality)
        if(response.ok){
            let clinicians = response.data.map((item,index)=>{
                return{
                    value: item._id,
                    label: `${item.firstName + " " + item.lastName}`
                }
            })
            yield put(myReferralCreators.successClinicianList(clinicians))
        } else {
            yield put(myReferralCreators.failureClinicianList())
        }
    } catch (error) {
        console.log("getclinician",error)
        yield put(myReferralCreators.failureClinicianList())
        showToast('Error fetching clinician list', 'error')
    }
}
export function* putReassignCase(action){
    try {
        const response = yield call(reassignCase,action.caseID,action.assignee.value,action.additionalComment)
        if(response.ok){
            yield put(myReferralCreators.successReassignCase(response.data))
            showToast('Case reassignment request sent','success')
        } else {
            yield put(myReferralCreators.failureReassignCase())
            showToast('Failed to reassign case','error')
        }
    } catch (error) {
        yield put(myReferralCreators.failureReassignCase())
        showToast('Failed to reassign case','error')
    }
}

export function* assignNewOwner(action){
    try {
        const response = yield call(acceptNewOwner, action)
        if (response.ok){
            showToast('Case reassignment handled','success')
        }
    }
    catch(err){
        console.log(err)
    }
}


export function* getCliniciansByUser(action){
    console.log('getClinicians saga', action)
    try {
        const response = yield call(getSpecificClinicianList ,action)
        if(response.ok){
            let clinicians = response.data.map((item,index)=>{
                return{
                    value: item._id,
                    label: `${item.firstName + " " + item.lastName}`
                }
            })
            yield put(myReferralCreators.successClinicianList(clinicians))
        } else {
            yield put(myReferralCreators.failureClinicianList())
        }
    } catch (error) {
        console.log("getclinician",error)
        yield put(myReferralCreators.failureClinicianList())
        showToast('Error fetching clinician list', 'error')
    }
}


function* myReferralsaga(){
    yield takeLatest(myReferralTypes.REQUEST_FETCH_REFERRALS, getMyReferrals);
    yield takeLatest(myReferralTypes.REQUEST_CLINICIAN_LIST, getClinicians);
    yield takeLatest(myReferralTypes.REASSIGN_CASE, putReassignCase);
    yield takeLatest(myReferralTypes.ACCEPT_NEW_OWNER, assignNewOwner);
    yield takeLatest(myReferralTypes.REQUEST_CLINICIAN_LIST_BY_USER, getCliniciansByUser)
}

export default myReferralsaga