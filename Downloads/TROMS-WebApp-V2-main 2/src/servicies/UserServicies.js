import { getClient, setClient } from "../utils/apiUtils"
import ApiConstants from "../api/apiConstants"
import { create } from "apisauce"

let configApi = getClient()

export const postLoginUser = (payload) => {
  configApi = getClient()
  debugger;
  console.log(configApi.getBaseURL())
  return (
    configApi.post(ApiConstants.LOGIN, payload)
  )
}

export const forgotPassword = (payload) => {
  return (
    configApi.post(ApiConstants.FORGOT_PASSWORD, payload)
  )
}

export const resetPassword = (payload) => {
  configApi = getClient()
  return (
    configApi.post(ApiConstants.CHANGE_PASSWORD, payload)
  )
}
export const createUser = (payload) => {
  return (
    configApi.post(ApiConstants.CREATEUSER, payload)
  )
}

export const registerPassword = (payload) => {
  return (
    configApi.post(ApiConstants.REGISTER, payload)
  )
}

export const configDataGet = () => {
  return configApi.get(ApiConstants.CONFIG)
}

export const subscriptionDataGet = ()=>{
  const configApi = getClient();
  return configApi.get(ApiConstants.SUBSCRIPTION)
}

export const registerForm = (payload) => {
  const configApi = getClient()
  return configApi.put(ApiConstants.UPDATE_USER, payload)
}

export const registerUser = (payload) => {
  return (
    configApi.post(ApiConstants.CHANGE_PASSWORD, payload)
  )
}

export const getDashboardInfo = (pathway) => {
  const configApi = getClient()
  if(pathway == 'ALL'){
    return(
      configApi.get(
        ApiConstants.DASHBOARDINFO
      )
      )
  } else {
    return(
      configApi.get(
        ApiConstants.DASHBOARDINFO
      ,{pathway})
      )
  }

}
export const getrefDashboardInfo = (selectedOrg) => {
  const configApi = getClient()
  return(
  configApi.get(
    ApiConstants.ANEDASHBOARDINFO +"?org="+selectedOrg
  )
  )
}

export const getrefDashboardChartInfo = (time,selectedOrg) => {
  const configApi = getClient()
  return(
  configApi.get(
    ApiConstants.ANEDASHBOARDINFO + '?duration=' + time +'&org=' +selectedOrg
  )
  )
}


export const getPathwaysBySpecialityFlag = (specialityFlag) =>{
  console.log("GET PATHWAYS CALLED")
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.PATHWAY_FINDER + specialityFlag)
  )
}

export const postCreateCase = (payload) => {
  configApi = getClient();
  return configApi.post(ApiConstants.CREATE_CASE, payload);
};

export const getQuestions = (path) => {
  configApi = getClient();
  return configApi.get(ApiConstants.PATHWAY + path);
};

export const putSubmitCase = (payload) => {
  configApi = getClient();
  return configApi.put(ApiConstants.INJURYSUMMARY, payload);
};


export const orgSearchval = (searchval) => {
  configApi = getClient();
  return configApi.get(ApiConstants.ORG_SEARCH_VAL+searchval);
};

export function getDecisionScreenDetails(caseID,pathwayOutcome) {
  configApi = getClient();
  return configApi.get(
      `${ApiConstants.DECISION_CONTENT_API}?caseID=${caseID}&pathwayOutcome=${pathwayOutcome}`
  );
}

export function getNewDecisionScreen(caseID, endpointID, pathwayOutcome) {
  configApi = getClient();
  return configApi.get(
      `${ApiConstants.GET_ENDPOINT}?caseID=${caseID}&EUUID=${endpointID}&pathwayOutcome=${pathwayOutcome}`
  );
}

export function getSummaryLeaflets(caseID) {
  configApi = getClient();
  const caseId = caseID;
  return configApi.get(ApiConstants.INJURYSUMMARYLeaflts + '?caseid=' + caseID)
}

export function submitLeafletsApi(caseID, ids) {
  debugger;
  configApi = getClient();
  return configApi.post(ApiConstants.INJURYSUMMARYA, {
      caseID,
      ids,
  });
}

export async function postCaseConsent(payload) {
  configApi = getClient();
  return configApi.put(ApiConstants.UPDATE_CASE_CONSENT, payload);
};

export const uploadImage = async (uploadUrl, imageBody, type) => {
  debugger;
  let options;
  options = {
      headers: {
          'Content-Type': type,
      },
      method: 'PUT',
      body: imageBody,
  };
  return fetch(uploadUrl, options);
};

export const getBlob = async (fileUri) => {
  const resp = await fetch(fileUri);
  return await resp.blob();
};

export function getImageUrls(caseID, numFiles) {
  configApi = getClient();
  return configApi.get(
      ApiConstants.IMAGESURL + '?caseID=' + caseID + '&numFiles=' + numFiles 
  );
}

export function getMyReferralsService({
  selectedType,
  Status,
  page = 0,
  limit = 100,
  userRole = 'BCH_CLINICIAN',
  durtype,
  search = '',
  timeFrame = '',
  org,
  orderColumn = '',
  orderType = '',
  assignedRev = "ALL",
  owner = null,
  pathway = null,
  assignedRef = '',
  specNeeded
}) {
  const type = durtype;
  const Decision = selectedType;
  const configApi = getClient();

  if(pathway != null){
    return configApi.get(ApiConstants.DASHBOARDDETAILS, {
      Decision,
      page,
      limit,
      search,
      timeFrame,
      Status,
      type,
      org,
      orderColumn,
      orderType,
      assignedRev,
      owner,
      pathway
  });
  }
  
  return configApi.get(ApiConstants.DASHBOARDDETAILS, {
      Decision,
      page,
      limit,
      search,
      timeFrame,
      Status,
      type,
      org,
      orderColumn,
      orderType,
      assignedRev,
      owner,
      assignedRef,
      specNeeded
  });
}

export const getOneCase = (caseID) => {
  const configApi = getClient();
  return configApi.get(ApiConstants.REFERRALDDETAILS + caseID);
};

export function setOnCall(payload) {
  const configApi = getClient();
  return configApi.put(`${ApiConstants.SET_ON_CALL}`, payload);
}

export function setOnCallFromList(payload) {
  const configApi = getClient();
  return configApi.post(`${ApiConstants.SET_ON_CALL_FROM_LIST}`, payload);
}

export function getOnCall(speciality) {
  const configApi = getClient();
  const payload = {}
  if(speciality) payload.speciality = speciality;
  return configApi.get(`${ApiConstants.GET_ON_CALL}`,payload);
}

export const updateCase = (payload) => {
  const configApi = getClient();
  console.log('apiCalled');
  return configApi.put(ApiConstants.UPDATECASE, payload);
};

export const updateCaseStatus = (payload) => {
  const configApi = getClient();
  console.log('apiCalled');
  return configApi.put(ApiConstants.UPDATE_CASE_STATUS, payload);
};

export const getmessage = (caseID) => {
  const configApi = getClient();
  return configApi.get(ApiConstants.GETMESSAGE + caseID);
};

export const sendmessage = (payload) => {
  const configApi = getClient();
  return configApi.post(ApiConstants.SEND_MESSAGE,payload);
};
export function createReferral(
  caseID,
  lifeThreatening = false,
  suggestedAction,
  suggestedActionDescription,
  options
) {
  configApi = getClient();
  //INJURYSUMMARYB is /referral/create api call
  return configApi.post(ApiConstants.INJURYSUMMARYB, {
      caseID,
      lifeThreatening,
      suggestedAction,
      suggestedActionDescription,
      options
  });
}
export function caseContacted(caseID, contacted) {
  configApi = getClient();
  return configApi.post(ApiConstants.CASE_CONTACTED, {
      caseID,
      contacted,
  });
}

export function getImageMethod(caseID, numFiles) {
  configApi = getClient();
  return configApi.get(
    ApiConstants.IMAGESURL + '?caseID=' + caseID + '&numFiles=' + numFiles + '&type=query'
  );
}

export function getReauScreenFields(){
  configApi = getClient();
  return configApi.get(
    ApiConstants.GET_REAU_SCREENS + '?type=rheuTreat,rheuClini,rheuInves,rheuVital,rheuInves2,rheuInves3'
  );
}

export function extendToken(){
  configApi = getClient();
  return configApi.get(
    ApiConstants.EXTEND_TOKEN
  )
}

export const getFeedbackqna = () => {
  const configApi = getClient()
  return(
  configApi.get(
    ApiConstants.GETFEEDBACK
  )
  )
}

export const getFaqlists = () => {
  const configApi = getClient()
  return(
  configApi.get(
    ApiConstants.FAQ_LIST
  )
  )
}

export const uploadVisual = (payload) => {
  const configApi = getClient()
  
  return (
    configApi.put(ApiConstants.UPLOAD_VISUAL, {
      visualReport: payload?.visualReport,
      caseID: payload?.caseID
    })
  )
}
export const userList =(page=1,limit=10,status=null,search=null)=>{
  // debugger;
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.GET_UNAUTHORISED_LIST + `?page=${page}&limit=${limit}&status=${status}&search=${search}`)
  )
}

export const userApprove =(email,date,subscription=null,permissions=null)=>{
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.AUTHORISE_USER,{email:email,expiryDate: date, subscription: subscription == null ? 'null' : subscription,permissions: permissions == null ? 'null' : permissions})
  )
}

export const getDrugs = () =>{
  const configApi = getClient()

  return (
    configApi.get(ApiConstants.GET_DRUGS)
  )
}

export const getPatientFormdata = (number) =>{
  const configApi = getClient()

  return (
    configApi.get(ApiConstants.GET_Patient_Data +`${number}` )
  )
}

export const ophthalmologyRequestSignedUrls = (caseID, payload)=>{
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.OPTHO_UPLOAD_IMAGE + `?caseID=${caseID}`, payload)
  )
}

export const rheumatalogyRequestSignedUrls = (caseID)=>{
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.GET_RHEU_IMAGE_URLS + `?caseID=${caseID}`)
  )
} 

export const rheumatalogyMidRequestSignedUrls = (caseID)=>{
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.MID_RHEU_IMAGE_URLS +caseID)
  )
} 

export const drugNotFound = (name) =>{
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.CHECK_DRUG + name)
  )
}

export const putMidResponse = (payload) =>{
  const configApi = getClient();
  return configApi.put(ApiConstants.MID_RESPONSE_SAVE, payload);
}
export const getClinicianList = (onCall=0,speciality) =>{
  const configApi = getClient()
  const payload = {
    onCall:onCall,
    speciality:speciality
  }
  return(
    configApi.get(ApiConstants.GET_CLINICIAN_LIST,payload)
  )
}


export const reassignCase = (caseID, assignee,additionalComment) =>{
  const configApi = getClient()
  return(
    configApi.put(ApiConstants.REASSIGN_CASE,{
      caseID:caseID,
      switcher: assignee,
      additionalComment: additionalComment
    })
  )
}

export const putRubberStamp = (caseID, rubberStamp) =>{
  const configApi = getClient()
  return(
    configApi.put(ApiConstants.RUBBER_STAMP,{
      caseID:caseID,
      rubberStamp:rubberStamp
    })
  )
}

export const getRubberStamp = (caseID) =>{
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.GET_RUBBER_STAMP+'?caseID='+caseID)
  )
}

export const verifyOTP = (email,password,code) =>{
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.VERIFY_USER_2FA,{email,password,code})
  )
}

export const requestQR = (token) =>{
  debugger;
  if(token)  setClient(token)
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.REQUEST_QR_CODE_WITH_AUTH)
  )
}

export const setupMFA = (code)=>{
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.SETUP_2FA, {code})
  )
}

export const destroyToken = ()=>{
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.DESTROY_TOKEN)
  )
}

export const getRheuNextQuestionId = (pathway,caseID,currentID,progress)=>{
  const configApi = getClient();
  return(
    configApi.post(ApiConstants.REAU_CALC,{pathway:pathway,caseID: caseID, currentID: currentID,progress:progress})

  )
}

export const requestBackupCode = (email)=>{
  const configApi = getClient()
  return (
    configApi.post(ApiConstants.REQUEST_2FA_BACKUP,{
      email: email
    })
  )
}

export const requestNewAuthCode = (email)=>{
  const configApi = getClient()
  return (
    configApi.post(ApiConstants.REQUEST_AUTHCODE,{
      email: email
    })
  )
}

export const userReject =(email)=>{
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.REJECT_USER,{email:email})
  )
}

export const userDisable =(email)=>{
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.DISABLE_USER,{email:email})
  )
}

export const requestCasePdfDownload = (caseID,lifeThreatening,suggestedAction,suggestedActionDescription)=>{
  const configApi = getClient();
  return(
      configApi.put(ApiConstants.REQUEST_CASE_PDF,{caseID:caseID,lifeThreatening: lifeThreatening, suggestedAction: suggestedAction,suggestedActionDescription:suggestedActionDescription},{
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        }
      })
  )
}

export const getInstitutionalDashBoardData = (payload)=>{
  console.log("payload",payload);
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.INSTITUTIONAL_DASHBOARD,payload)
  )
}

export const setCaseCanceled = (caseID,userId) => {
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.CANCEL_CASE+`?caseID=${caseID}&userId=${userId}`)
  )
}

export const submitEmailTemplate = (payload) => {
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.SUBMIT_EMAIL,payload)
  )
}

export const updateEmailTemplate = (id,payload) => {
  const configApi = getClient()
  let payloadData ={
    uID:id,
    ...payload
  }
  return(
    configApi.put(ApiConstants.UPDATE_EMAIL,payloadData)
  )
}
export const getEmailTemplateList = (page=1,limit=10) =>{
  const configApi = getClient();

  return(
      configApi.get(ApiConstants.GET_EMAIL_LIST+`?page=${page}&limit=${limit}`)
  )
}

export const getEmailTemplateTriggers = () =>{
  const configApi = getClient()
  return(
      configApi.get(ApiConstants.EMAIL_TRIGGERS)
  )
}
export const getEmailTemplateEvents = () =>{
  const configApi = getClient()
  return(
      configApi.get(ApiConstants.EMAIL_EVENTS)
  )
}


export const getSingleEmailTemplate = (id) =>{
  const configApi = getClient()
  return(
      configApi.get(ApiConstants.GET_ONE_EMAILTEMPLATE+`?uID=${id}`)
  )
}

export const getDeleteEmailTemplate = (id) =>{
  const configApi = getClient()
  return(
      configApi.post(ApiConstants.DELETE_EMAILTEMPLATE+`?uID=${id}`)
  )
}

export const getAuditFails = (payload) => {
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.GET_AUDIT_FAILS, payload)
  )
}

export const getAuditFailsCount = () => {
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.GET_AUDIT_FAILS_COUNT)
  )
}

export const updateAudit = (payload)=>{
  const configApi = getClient();
  return configApi.put(ApiConstants.UPDATE_AUDIT,payload)
}

export const getPimsPathway = ()=>{
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.PATHWAY+"rheu-pims")
  )
}

// export const getPDSSearch = (params)=>{
//   const configApi = getClient()
//   return(
//     configApi.get(ApiConstants.GET_PDS_SEARCH,params)
//   )
// }

export const getPDSSearch = (params)=>{
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.GET_PDS_SEARCH,params)
  )
}

export const saveContactedData = (payload)=>{
  console.log('spiderpig',payload)
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.SAVE_CONTACTED_DATA, payload)
  )
}


export const acceptNewOwner = (payload)=>{
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.ACCEPT_NEW_OWNER, payload)
  )
}


export const getSpecificClinicianList = (payload) =>{
  const items = {
    user:payload.user,
    query: payload.user
  }
  const configApi = getClient()
  return(
    configApi.get(ApiConstants.GET_CLINICIAN_LIST, items)
  )
}

export const findLocalHospitalBMEC = (payload) => {
  const configApi = getClient()
  return(
    configApi.post(ApiConstants.FIND_LOCAL_HOSPITAL, payload)
  )
}

