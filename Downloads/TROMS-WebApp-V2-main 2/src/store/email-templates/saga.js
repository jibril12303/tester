import { call, put, takeEvery, all, fork, takeLatest } from "redux-saga/effects"
import {emailTemplateTypes,emailTemplateCreators} from "./reducer"
import {getClinicianList, getEmailTemplateList, submitEmailTemplate, updateEmailTemplate,getEmailTemplateTriggers,getSingleEmailTemplate,getDeleteEmailTemplate} from "servicies/UserServicies"
import {myReferralCreators} from "../myReferrals/reducer";
import { showToast } from "utils/toastnotify"
import {getEmailTemplateEvents} from "../../servicies/UserServicies";

const {REQUEST_FETCH_EMAILS,REQUEST_ADD_EMAIL,REQUEST_COPY_EMAIL,REQUEST_EMAIL_TRIGGERS,REQUEST_SINGLE_EMAIL_TEMPLATE,REQUEST_DELETE_EMAIL_TEMPLATE,REQUEST_UPDATE_EMAIL_TEMPLATE} = emailTemplateTypes;

function* getEmailList(action){
    const response = yield call(getEmailTemplateList,action.page,action.limit)
    if(response.ok){
        yield put(emailTemplateCreators.successFetchEmails(response.data))
    }
    
    return null;
}

function* submitEmailTemplateData(action){
    console.log("submit email",action)
    const {templateName,templateDescription,emailTo,emailCC,emailBCC,subject,emailBody,triggers,speciality, api, caseSpeciality} = action;
    let payload ={
        name:templateName,
        htmlString:emailBody,
        recipients:{
            to:emailTo ? emailTo.map((item)=>item.value) :[] ,
            cc:emailCC ? emailCC.map((item)=>item.value) : [],
            bcc:emailBCC ? emailBCC.map((item)=>item.value) : [],
        },
        subject:subject,
        description:templateDescription,
        triggers:triggers || {},
        //speciality:speciality || "",
        api:api,
        caseSpeciality:caseSpeciality
    };
    try{
        console.log("payload",payload)
        const response  = yield call(submitEmailTemplate,payload);
        if(response.ok){
            showToast("Email template created successfully","success");
            yield put(emailTemplateCreators.successAddEmail())
        }
    }
    catch(err){
        console.log("error",err);
    }
}


function* submitCopyyEmailTemplateData(action){

    const {templateName,templateDescription,emailTo,emailCC,emailBCC,subject,emailBody,triggers,speciality,history,api,caseSpeciality} = action;
    let payload ={
        name:templateName,
        htmlString:emailBody,
        recipients:{
            to:emailTo ? emailTo:[] ,
            cc:emailCC ? emailCC : [],
            bcc:emailBCC ? emailBCC: [],
        },
        subject:subject,
        description:templateDescription,
        triggers:triggers || {},
        //speciality:speciality || "",
        api:api,
        caseSpeciality:caseSpeciality
    };
    try{
        const response  = yield call(submitEmailTemplate,payload);
        if(response.ok){
            showToast("Email template copy successfully","success");
            yield put(emailTemplateCreators.successCopyEmail(response.data));
            history.push(`/email-template/edit/${response.data.data.uID}`)
        }
        else{
            response.error && showToast(response.error,"error");
        }
    }
    catch(err){
        console.log("error",err);
    }
}

function* getEmailTriggers(action){
    try{
        const responseTriggers = yield call(getEmailTemplateTriggers)
        const responseEvent = yield call(getEmailTemplateEvents)
        if(responseTriggers.ok){
            yield put(emailTemplateCreators.successEmailTriggers(responseTriggers.data))
        }
        if(responseEvent.ok){
            yield put(emailTemplateCreators.successEmailEvent(responseEvent.data))
        }
    }
    catch(err){
    }
}

function* getSingleEmailTemplatData(action){
   const {id} = action;
    try{
        const response = yield call(getSingleEmailTemplate,id)
        if(response.ok){
            yield put(emailTemplateCreators.successSingleEmailTemplate(response.data))
        }
        else{
            showToast(response.error,"error")
        }
    }
    catch(err){
    }
}
function* deleteEmailTemplatData(action){
    const {id,refreshList} = action;
    try{
        const response = yield call(getDeleteEmailTemplate,id)
        if(response.ok){
            showToast("Email template delete successfully","success");
            refreshList();
            //yield put(emailTemplateCreators.successDeleteEmailTemplate(''))
        }
        else{
            showToast(response.error,"error")
        }
    }
    catch(err){
    }
}

function* updateEmailTemplateData(action){
    const {id,templateName,templateDescription,emailTo,emailCC,emailBCC,subject,emailBody,triggers,speciality,history,api,caseSpeciality} = action;
    let payload ={
        name:templateName,
        htmlString:emailBody,
        recipients:{
            to:emailTo ? emailTo.map((item)=>item.value) :[] ,
            cc:emailCC ? emailCC.map((item)=>item.value) : [],
            bcc:emailBCC ? emailBCC.map((item)=>item.value) : [],
        },
        subject:subject,
        description:templateDescription,
        triggers:triggers || {},
        speciality:speciality || "",
        api:api,
        caseSpeciality:caseSpeciality
    };
    try{
        console.log("payload",payload)
        const response  = yield call(updateEmailTemplate,id,payload);
        if(response.ok){
            showToast("Email template updated successfully","success");
            history.push("/email-templates")
        }else{
            showToast("Error updating Template","error");
        }
    }
    catch(err){
        console.log("error",err);
    }
}


export function* watchgetEmailTemplateSaga(){
    yield takeLatest(REQUEST_FETCH_EMAILS,getEmailList)
    yield takeLatest(REQUEST_ADD_EMAIL,submitEmailTemplateData)
    yield takeLatest(REQUEST_COPY_EMAIL,submitCopyyEmailTemplateData)
    yield takeLatest(REQUEST_EMAIL_TRIGGERS,getEmailTriggers)
    yield takeLatest(REQUEST_SINGLE_EMAIL_TEMPLATE,getSingleEmailTemplatData)
    yield takeLatest(REQUEST_DELETE_EMAIL_TEMPLATE,deleteEmailTemplatData)
    yield takeLatest(REQUEST_UPDATE_EMAIL_TEMPLATE,updateEmailTemplateData)
    
}

function* emailTemplateSaga(){
    yield all([fork(watchgetEmailTemplateSaga)])
}

export default emailTemplateSaga;
