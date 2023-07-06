/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import { fromJS } from 'immutable';
import { createActions } from 'reduxsauce';

export const initialState = {
    loading: false,
    updateloading:false,
    error: null,
    caseDetails:{},
    messages:null,
    messageload:false,
    messageSend:false,
    imgSend:false,
    downloading: true,
    clincians:[],
    clincianLoad:false,
    reassignLoad:false,
    rubberStampQuestions: [],
    rsqloading: false,
    rsfloading: false
}

export const { Types: caseTypes, Creators: caseCreators } = createActions({

    requestCaseDetails: ['selectedCaseID'],
    successCaseDetails: ['caseDetail'],

    downloadImages:['images'],
    downloadImagesRes:['res'],
    downloadImagesRheu:['rheu'],

    updateCaseDetails: ['payload','history'],
    successUpdateCaseDetails: ['selectedCaseDetails', 'activeCase'],
    failureUpdateCaseDetails: [],

    requestGetMessage:['caseID'],
    successGetMessage:['messages'],
    FailureGetMessage:[],

    requestSendMessage:['caseID','content'],
    successSendMessage:[''],
    FailureSendMessage:[''],

    requestSendImg:['caseID','imgFile'],
    successSendImg:[''],
    FailureSendImg:[''],

    requestClinicianList:['onCall'],
    successClinicianList:['response'],
    failureClinicianList:[],

    reassignCase:['caseID', 'assignee','additionalComment'],
    successReassignCase: ['response'],
    failureReassignCase:[],

    requestRubberStampQuestions: ['caseID'],
    successRubberStampQuestions: ['response'],
    failureRubberStampQuestions: ['error'],

    submitRubberStampForm: ['caseID', 'rubberStamp','history'],
    successRubberStampForm:['response'],
    failureRubberStampForm:['error'],

    getAudit: ['caseID'],
    successGetAudit: ['response'],
    failureGetAudit: ['response']

 });

/* eslint-disable default-case, no-param-reassign */
export const caseDetails = (state = initialState, action) =>
{
        switch (action.type) {
            case caseTypes.REQUEST_CASE_DETAILS:
                    return{
                        ...initialState,
                        loading:true,
                        downloading: true,
                        }
            case caseTypes.SUCCESS_CASE_DETAILS:
                return{
                    ...state,
                    loading:false,
                    caseDetails:action.caseDetail,
                    }
            case caseTypes.DOWNLOAD_IMAGES:
                return{
                    ...state,
                    downloading: true,
                }
            case caseTypes.DOWNLOAD_IMAGES_RES:
                if (Array.isArray(action.res)){
                    return{
                        ...state,
                        downloading: false,
                        caseDetails:{
                            ...state.caseDetails,
                            images: action.res
                        }
                    }
                } else {
                    return{
                        ...state,
                        downloading: false,
                        caseDetails:{
                            ...state.caseDetails,
                            ophthalmologyImages: action.res
                        }
                    }
                }
            case caseTypes.DOWNLOAD_IMAGES_RHEU:
                return{
                    ...state,
                    caseDetails:{
                        ...state.caseDetails,
                        rheuImages: action.rheu
                    }
                }

            case caseTypes.UPDATE_CASE_DETAILS:
                    return{
                        ...state,
                        }
            case caseTypes.SUCCESS_UPDATE_CASE_DETAILS:
                return{
                    ...state,
                    updateloading:true,
                    }
            case caseTypes.FAILURE_UPDATE_CASE_DETAILS:
                return state
            
            case caseTypes.REQUEST_GET_MESSAGE:
                return{
                    ...state,
                    messages:action.messages,
                    messageload:true,
                }
            case caseTypes.SUCCESS_GET_MESSAGE:
                return{
                    ...state,
                    messages:action.messages,
                    messageload:false,
                }
            case caseTypes.FAILURE_GET_MESSAGE:
                return{
                    ...state,
                    messageload:false,
                }
            case caseTypes.REQUEST_SEND_MESSAGE:
                return{
                    ...state,
                    messageSend:true,
                }
            case caseTypes.SUCCESS_SEND_MESSAGE:
                return{
                    ...state,
                    messages:action.messages,
                    messageSend:false,
                }
            case caseTypes.FAILURE_SEND_MESSAGE:
                return{
                    ...state,
                    messageSend:false,
                }            
            case caseTypes.REQUEST_SEND_IMG:
                return{
                    ...state,
                    imgSend:true,
                }
            case caseTypes.SUCCESS_SEND_IMG:
                return{
                    ...state,
                    messages:action.messages,
                    imgSend:false,
                }
            case caseTypes.FAILURE_SEND_IMG:
                return{
                    ...state,
                    imgSend:false,
                }
            case caseTypes.REQUEST_CLINICIAN_LIST:
                return{
                    ...state,
                    clincianLoad: true
                }
            case caseTypes.SUCCESS_CLINICIAN_LIST:
                return{
                    ...state,
                    clincianLoad:false,
                    clincians: action.response
                }
            case caseTypes.FAILURE_CLINICIAN_LIST:
                return{
                    ...state,
                    clincianLoad:false,
                    error: true
                }
            case caseTypes.REASSIGN_CASE:
                return{
                    ...state,
                    reassignLoad:true,
                    error:false
                }
            case caseTypes.SUCCESS_REASSIGN_CASE:
                return{
                    ...state,
                    reassignLoad: false,
                    error: false
                }
            case caseTypes.FAILURE_REASSIGN_CASE:
                return{
                    ...state,
                    reassignLoad: false,
                    error: true
                }
            case caseTypes.REQUEST_RUBBER_STAMP_QUESTIONS:
                return{
                    ...state,
                    rsqloading: true,
                }
            case caseTypes.SUCCESS_RUBBER_STAMP_QUESTIONS:
                return{
                    ...state,
                    rsqloading: false,
                    rubberStampQuestions: action.response,
                }
            case caseTypes.FAILURE_RUBBER_STAMP_QUESTIONS:
                return{
                    ...state,
                    rsqloading: false,
                }
            case caseTypes.SUBMIT_RUBBER_STAMP_FORM:
                return{
                    ...state,
                    rsfloading: true
                }
            case caseTypes.SUCCESS_RUBBER_STAMP_FORM:
                return{
                    ...state,
                    rsfloading: false,
                }
            case caseTypes.SUCCESS_RUBBER_STAMP_FORM:
                return{
                    ...state,
                    rsfloading: false,
                }
                case caseTypes.GET_AUDIT:
                    return{
                        ...state,
                    }
            default:
                return state;
        }
    }

export default caseDetails;
