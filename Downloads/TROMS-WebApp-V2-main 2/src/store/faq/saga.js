import React from 'react';
import {call, put, takeLatest} from 'redux-saga/effects';
import {faqTypes, faqCreators} from "./reducer";
import {getFaqlists} from "servicies/UserServicies";
import {appTypes,appCreators} from "store/app/appReducer"

export function* getFaqlist(action) {
    try {
        
        
        const response = yield call(getFaqlists);
        // console.log(response.data)
        if (response.ok) {
            yield put(faqCreators.successFetchFaqList(response.data));
            // showNotification(response.data.message, NOTIFICATION_TYPE.SUCCESS);
        } else {
            if (
                response.error === "Expired or invalid token - please log in again"
                
              ) {
                showToast(response.error,"error");
                yield put(appCreators.clearToken())
              }
          
              console.log(response.data)
            yield put(myReferralCreators.failureFetchFaqList());
        }
    } catch (e) {
        console.log(e);
        yield put(myReferralCreators.failureFetchFaqList(e));
    }
}


function* faqSaga(){
    yield takeLatest(faqTypes.REQUEST_FETCH_FAQ_LIST, getFaqlists);
}

export default faqSaga