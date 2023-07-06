import { call, put, takeEvery, all, fork, takeLatest, takeLeading } from "redux-saga/effects"

// Crypto Redux States
import { GET_CHARTS_DATA } from "./actionTypes"
import { apiSuccess, apiFail } from "./actions"

import { bchDashboardTypes, bchDashboardCreators } from "./reducer"
import {appTypes,appCreators} from "store/app/appReducer"
import { mainReducerCreators,mainReducerTypes } from "store/reducers";
import { createReferralCreators } from "store/create-referral/reducer";


const { REQUEST_BCH_DASHBOARD_INFO, SUCCESS_DASHBOARD_INFO, REQUEST_REF_DASHBOARD_INFO,REQUEST_CHART_DATA,UPDATE_ON_CALL_REGISTRAR, EXTEND_TOKEN,REQUEST_DASHBOARD_REFERRALS,REQUEST_UPDATE_ON_CALL_REGISTRAR_WITH_ID, COUNT_AUDIT_FAILS, GET_AUDIT_FAILS, UPDATE_AUDIT,UPDATE_AUDIT_FAIL,UPDATE_AUDIT_SUCCESS} = bchDashboardTypes

import { getDashboardInfo ,getrefDashboardInfo,getrefDashboardChartInfo,setOnCall,extendToken,getInstitutionalDashBoardData,setOnCallFromList, getAuditFails, getAuditFailsCount, updateAudit } from "servicies/UserServicies"
import {showToast} from 'utils/toastnotify';
//Include Both Helper File with needed methods
import {
  getWeeklyData,
  getYearlyData,
  getMonthlyData
}
  from "../../helpers/fakebackend_helper"
import { fromPairs } from "lodash"

function* getChartsData(action) {
try{
  const time = action.time; 
  const selectedOrg=action.selectedOrg;
   const response = yield call(getrefDashboardChartInfo,time,selectedOrg); 
  if (response.ok) {
    console.log(response.data)
    yield put(bchDashboardCreators.successChartData(response.data))
  } else {
    if (
      response.error === "Expired or invalid token - please log in again"
      
    ) {
      showToast(response.error,"error");
      yield put(appCreators.clearToken())
    }

    console.log(response.data)

  }
} catch (e) {
  debugger;
  console.log(e)
}

 
 
  {/*
  try {
    var response
   
     if (periodType == "monthly") {
      response = yield call(getWeeklyData, periodType)
    }
    if (periodType == "yearly") {
      response = yield call(getYearlyData, periodType)
    }
    if (periodType == "weekly") {
      response = yield call(getMonthlyData, periodType)
    }

    yield put(apiSuccess(GET_CHARTS_DATA, response))
  } catch (error) {
    yield put(apiFail(GET_CHARTS_DATA, error))
  }
*/}
}


export function* getBchDashboardInfo(action) {
  try {
    const response = yield call(getDashboardInfo,action.pathway);
    console.log(response)
  
    if (response.ok) {
      console.log(response.data)
      yield put(bchDashboardCreators.successDashboardInfo(response.data))
    } else {
      if (
        response.error === "Expired or invalid token - please log in again"
      ) {
        showToast(response.error,"error");
        yield put(appCreators.clearToken())
      }
      let error =
            response.data.error ||
            'Something Went Wrong, please try again later!';
        console.log(response.data);
        showToast(error,"error");


      console.log(response.data)

    }
  } catch (e) {
    debugger;
    console.log(e)
  }
}

export function* getRefDashboardInfo(action) {
  try {
    const response = yield call(getrefDashboardInfo,action.selectedOrg);
    console.log(response)
  
    if (response.ok) {
      console.log(response.data)
      yield put(bchDashboardCreators.successRefDashboardInfo(response.data))
    } else {
      if (
        response.data.error === "Expired or invalid token - please log in again"
      ) {
        
        yield put(appCreators.clearToken())
      }
      let error =
            response.data.error ||
            'Something Went Wrong, please try again later!';
      showToast(error,"error")

      console.log(response.data)

    }
  } catch (e) {
    debugger;
    console.log(e)
  }
}

export function* setOnCallRegistrar(action) {
  console.log('running')
  let payload={
      token:action.token,
  }

  const response = yield call(setOnCall,payload)
  console.log(response);
}

export function* setOnCallRegistrarWithId(action) {
  console.log('running')
  const {clinicianId,user} = action;

  const speciality = user?.speciality == "Orthoptics" ? "Orthoptics" : "";

  let payload={
      "_id":clinicianId,
  }

  const response = yield call(setOnCallFromList,payload)
  if(response.ok){
  showToast("updated successfully","success");
  yield put(createReferralCreators.requestOnCallRegistrarDetails(speciality))
  yield put(bchDashboardCreators.successUpdateOnCallRegistrarWithId())
  } 

  console.log(response);
}


function* extendUserToken(){
  const response = yield call(extendToken)
  if (!response.ok){
    yield put(mainReducerCreators.userLogout())
  }else{
    yield put(bchDashboardCreators.successExtendToken())
  }
}
function* getReferralForDashboard(action){
  // const statuses = [{label:"underReview",status:'UNDER_REVIEW'},{label:"queries",status:'QUERIES'},{label:"incomplete",status:'INCOMPLETE'},{label:"responseRequired",status:"ALL"}];
  let referralCases ={};
  
  // const payload ={
    //   page:1,
    //   selectedType:"ALL",
    //   submission:"ALL",
    //   durtype:null,
    //   search:null,
    //   org:selectedOrg,
    //   orderColumn:"DATE_TIME",
    //   orderType:"DESC",
    //   assignedRev:assignedRev,
    //   limit:10,
    //   timeFrame:"ALL",
    // }
    
    // const error = false;

    // statuses.map(async(item)=>{
      //   if(error === false) {
        //   payload.Status = item.status;
        //   const response = await getMyReferralsService(payload);
        //   if(response.ok){
          //     referralCases[item.label] = response?.data?.cases;
          //   }
          //   else{
            //     if(response.error === "Expired or invalid token - please log in again"){
              //       showToast(response.error,"error");
              //       // yield put(appCreators.clearToken())
              //       error = true;
              //     }
              //   }
              // }
              // })
              
              // if(error === false){
                //   yield put(bchDashboardCreators.successDashboardReferrals(referralCases))
                // }
    const {selectedOrg,assignedRev,pathway} = action;
                
    try {
      let payload = {}

      if(selectedOrg){
        payload.selectedOrg = selectedOrg;
      }
      if(assignedRev){
        payload.cases = assignedRev;
      }

      if (pathway == "Extravasation"){
        payload.pathway = pathway
      }


    const response = yield call(getInstitutionalDashBoardData,payload);
    if (response.ok) {
      console.log(response.data)
      yield put(bchDashboardCreators.successDashboardReferrals(response.data))
    } else {
      if (
        response.data.error === "Expired or invalid token - please log in again"
      ) {
        
        yield put(appCreators.clearToken())
      }
      let error =
            response.data.error ||
            'Something Went Wrong, please try again later!';
      showToast(error,"error")

      console.log(response.data)

    }

} catch (e) {
    console.log(e);
}

}


export function* getAuditFailures(action) {
	try {
		const response = yield call(getAuditFails, action.caseID);
		if (response.ok) {
			yield put(bchDashboardCreators.successAuditFails(response.data.audits));
		} else {
			yield put(bchDashboardCreators.failureAuditFails());
		}
	} catch (error) {
		showToast(error, "error");
	}
}

export function* countAuditFailures(action) {
	try {
		const response = yield call(getAuditFailsCount);
		if (response.ok) {
			yield put(bchDashboardCreators.successCountAuditFails(response.data.count));
		} else {
			yield put(bchDashboardCreators.failureCountAuditFails());
		}
	} catch (error) {
		showToast(error, "error");
	}
}

export function* sendNewAuditStatus(action) {
	try {
		const response = yield call(updateAudit(action));
		if (response.ok) {
      debugger
			yield put(bchDashboardCreators.updateAuditSuccess());
		} else {
			yield put(bchDashboardCreators.updateAuditFail());
		}
	} catch (error) {
		null;
	}
}




export function* watchGetChartsData() {

  yield takeLatest(REQUEST_BCH_DASHBOARD_INFO, getBchDashboardInfo)
  yield takeLeading(REQUEST_REF_DASHBOARD_INFO, getRefDashboardInfo)
  yield takeEvery(REQUEST_CHART_DATA, getChartsData)
  yield takeEvery(UPDATE_ON_CALL_REGISTRAR, setOnCallRegistrar)
  yield takeEvery(EXTEND_TOKEN, extendUserToken)
  yield takeLeading(REQUEST_DASHBOARD_REFERRALS,getReferralForDashboard)
  yield takeEvery(REQUEST_UPDATE_ON_CALL_REGISTRAR_WITH_ID,setOnCallRegistrarWithId)
  yield takeLatest(GET_AUDIT_FAILS, getAuditFailures)
  yield takeLatest(COUNT_AUDIT_FAILS, countAuditFailures)
  yield takeEvery(UPDATE_AUDIT, sendNewAuditStatus)
}

function* dashboardSaga() {
  yield all([fork(watchGetChartsData)])
}

export default dashboardSaga
