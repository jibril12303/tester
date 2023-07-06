import produce from 'immer';
import { fromJS } from 'immutable';
import { createActions } from 'reduxsauce';


import {
    API_SUCCESS,
    API_FAIL,
    GET_CHARTS_DATA
} from "./actionTypes";

export const {
    Types: createReferralTypes,
    Creators: createReferralCreators,
  } = createActions({

    requestCasePDF:['caseID','lifeThreatening','suggestedAction','suggestedActionDescription'],

    requestCasePDFDetails:['caseID','lifeThreatening','suggestedAction','suggestedActionDescription'],
    successCasePDFDetails:['CasePdfData','CasePdfUrl','pdfName'],
    clearCasePDFDetails:[],

    resetState: [],
    setTabIndex: ['tab'],
    setReauIndex: ['tab'],

    getSubscriptions: [],
    successSubscriptions: ['response'],
  
    getReauScreens:[],
    successReauScreens:['response'],

    getAvailablePathways: ['speciality'],
    successAvailablePathways: ['pathways'],

    setPatientDetails: ['patientInfo', 'ParentInfo'],
    createCase: ['speciality', 'patientInfo', 'parentInfo', 'orgID' ,'isTransmittable', 'covid', 'childProtectionConcern','GPmcode','gpFirstName','gpLastName','gpEmailAddress'],

    successCreateCase: ['caseDetails'],
    failureCreateCase: ['errorMessage'],


    getInjuryQuestions: ['selectedInjuryType', 'endpoint',],
    successInjuryQuestions: ['questions', 'endpoint'],
    failureInjuryQuestions: ['errorMessage'],

    setQuestionAnswers: ['answers'],

    setEditQuestionIndex: ['questionIndex'],
    setQuestionsFinished: ['bool'],
    setDecisionAndQuestionAnswers: ['endpoint', 'answers'],

    submitInjurySummary: ['caseID', 'summary','euuid', 'pathwayOutcome', 'pathway', 'specialitySelected','questions' ,'needEndpoint'],
    successInjurySummary: ['response'],
    failureInjurySummary: ['errorMessage'],

    requestEndpoint: ['caseID', 'pathwayOutcome'],
    successEndpoint: ['response'],
    failureEndpoint: ['errorMessage'],

    requestLeaflets: ['caseID'],
    successLeaflets: ['response'],
    failureLeaflets: ['errorMessage'],

    submitConsentAndImages:  ['caseID', 'treatment', 'research', 'fileList', 'dutyConsultantNumber', 'dutyConsultantName', 'dutyConsultantExtension'],
    successConsentAndImages: ['response'],
    failureConsentAndImages: ['errorMessage'],

    setAction: ['content'],

    requestOnCallRegistrarDetails: ['speciality'],
    successOnCallRegistrarDetails: ['onCallNumber','onCallDetails'],

    submitCaseAtEndpoint: ['caseID', 'options', 'suggestedAction','suggestedActionDescription','ids'],
    successCaseAtEndpoint: ['response'],
    failureCaseAtEndpoint: ['errorMessage'],

    sendLeaflets: ['caseID', 'ids'],
    successSendLeaflets: [],

    requestIncompleteCase: ['caseID'],
    successIncompleteCase: ['response', 'currentTab'],
    setIncompleteFalse: [],

    requestFeedbackQna:[],
    successFeedbackQna:['feedbackqna'],
    submitVisualAcuity: [],
    successVisualAcuity:[],
    failureVisualAcuity:[],

    getDrugs: [],
    successDrugs: ['drugList'],
    failureDrugs: [],

    searchPatientData: ['params'], // this is for firstname, lastname, dateofbirth search
    requestPatientData:['number'], //this is for NHSNumber search
    successPatientData:['patientData'], //reusing the same responses for both search functions.
    failurePatientData:[],
    sendUnknownDrugEmail:['name'],
    saveMidResponse: ['caseID', 'summary', 'pathway', 'specialitySelected'],
    successMidResponse: ['response'],
    failureMidResponse: ['error'],
    setQuestionID: ['id'],

    addLeaflet: ['leaflet'],
    setEuuid: ['EUUID'],

    updateRheuScreenPrefillStatus:['status'],


    requestReauNextId:['pathway','casID','currentID','progress'],
 
    successReauNextId:['ReauNextId'],
    setLifeThreatening: ['val'],
    requestCaseCancel:['caseID','refreshlist','userId'],
    successCaseCancel:[],

    successDownloadedRheuImages:['downloadRheuImages'],

    saveContactData: ['caseID','contacted'],
    successSaveContactData:['response'],
    failureSaveContactData:['error'],

    successPrefillRheu2Images:[],
    successPrefillRheu3Images:[],

    findLocalHospital:['pathway','caseID','currentID','progress'],
    findLocalHospitalSuccess:['response']
   
  });

const INIT_STATE = {
    CaseMode:null, // Create || Edit
    loading: false,
    subscriptions: null,
    pathways: [],
    reauScreens:[],
    error: null,
    patientInfo: null,
    parentInfo: null,
    caseDetails: null,
    questions: [],
    questionIndex: null,
    questionsFinished: false,
    decision: null,
    questionAnswers: [],
    questionAnswersCopy: [], // Stores the Duplication of questionAnswers states when case summary is generated
    speciality: null,
    selectedPathway: [],
    leaflets: {
        clinicianLeaflets:[],
        patientLeaflets:[]
    },
    images: [],
    tabIndex: "1",
    reauScreensIndex:"1",
    rheuScreenPrefillStatus:{
        'CLINFEAT':false,
        'VITALSIG':false,
        'CLININVES3':false,
        'CLININVES2':false,
        'CLININVES':false,
        'CLINTREAT':false,
        'BPCALC': false
    },
    endpoint: null,
    actionContent: null,
    currentOnCall: null,
    onCallNumber: null,
    incompleteCase: false,
    feedbackqna:[],
    drugList: [],
    patientData:[],
    questionID: null,
    loadingPatient: false,
    euuid: null,
    ReauNextId: null,
    loadingCalcQuestion:false,
    lifeThreatening: null,
    CasePdfDetails:{
        CasePdfData:"",
        CasePdfUrl:null,
        CasePdfName:"",
    },
    downloadRheuImages:{},
    contacted:false,
    localHospital: null,

};

const CreateReferral = (state = INIT_STATE, action) => {
    console.log("CReate Referral: ",action)
    switch (action.type) {
        case 'LOGOUT_USER':
            return INIT_STATE
        case "LOGIN_USER":
            return INIT_STATE
        case createReferralTypes.RESET_STATE:
            return INIT_STATE

        case createReferralTypes.SET_TAB_INDEX:
            return{
                ...state,
                tabIndex: action.tab
            }
        case createReferralTypes.SET_REAU_INDEX:
            return{
                ...state,
                reauScreensIndex:action.tab
            }
        case createReferralTypes.GET_SUBSCRIPTIONS:
            return{
                ...state,
                loading: true
            }
        case createReferralTypes.SUCCESS_SUBSCRIPTIONS:
            return{
                ...state,
                loading: false,
                subscriptions: action.response
            }
        case createReferralTypes.GET_AVAILABLE_PATHWAYS:
            console.log("HMM")
            return{
                ...state,
                loading:true,
                pathways: [],
                speciality: action.speciality
                }
        case createReferralTypes.SUCCESS_AVAILABLE_PATHWAYS:
            console.log("SUCCESS ACTION:",action)
            return{
                ...state,
                error: null,
                loading:false,
                pathways:action.pathways,
            }
        case createReferralTypes.GET_REAU_SCREENS:
            return{
                ...state,
                loading:true,
                reauScreens: []
                }
        case createReferralTypes.SUCCESS_REAU_SCREENS:
            console.log("SUCCESS ACTION:",action)
            return{
                ...state,
                error: null,
                loading:false,
                reauScreens:action.response,
            }            
        case createReferralTypes.CREATE_CASE:
            return{
                ...state,
                loading: true,
            }

        case createReferralTypes.FAILURE_CREATE_CASE:
            return{
                ...state,
                loading: false,
                error: action.errorMessage,
                CaseMode:null
            }
        case createReferralTypes.SUCCESS_CREATE_CASE:
            return{
                ...state,
                loading: false,
                caseDetails: action.caseDetails,
                error: null,
                questionAnswers:[],
                questions: [],
                CaseMode:"Create"
            }
        case createReferralTypes.GET_INJURY_QUESTIONS:
            return{
                ...state,
                loading: true,
                error: null,
                selectedPathway: action.selectedInjuryType,
                questions: []
            }
        case createReferralTypes.SUCCESS_INJURY_QUESTIONS:
            return{
                ...state,
                loading: false,
                error: null,
                questions: action.questions.pathway,
                endpoint: action.endpoint
                // questionAnswers: []
            }
        case createReferralTypes.FAILURE_INJURY_QUESTIONS:
            return{
                ...state,
                loading: false,
                error: action.errorMessage
            }

        case createReferralTypes.SET_EDIT_QUESTION_INDEX:
            return{
                ...state,
                questionIndex: action.questionIndex
            }
        case createReferralTypes.SET_QUESTION_ID:
            return{
                ...state,
                questionID: action.id
            }
        case createReferralTypes.SET_QUESTIONS_FINISHED:
            return{
                ...state,
                questionsFinished: action.bool
            }
        case createReferralTypes.SET_QUESTION_ANSWERS:
            return{
                ...state,
                questionAnswers: action.answers
            }
        case createReferralTypes.SET_DECISION_AND_QUESTION_ANSWERS:
            if (action.endpoint?.EUUID != undefined){
                return{
                    ...state,
                    decision: action.endpoint?.priority,
                    questionAnswers: action.answers,
                    euuid: action.endpoint.EUUID,
                    questionAnswersCopy:action.answers,
                    rheuScreenPrefillStatus:{
                            'CLINFEAT':false,
                            'VITALSIG':false,
                            'CLININVES3':false,
                            'CLININVES2':false,
                            'CLININVES':false,
                            'CLINTREAT':false,
                            'BPCALC': false
                    }

                }
            } else {
                return{
                    ...state,
                    decision: action.endpoint,
                    questionAnswers: action.answers,
                }
            }

        case createReferralTypes.SUBMIT_INJURY_SUMMARY:
            return{
                ...state,
                loading: true,
                error: null
            }
        case createReferralTypes.SUCCESS_INJURY_SUMMARY:
            return{
                ...state,
                loading: false,
                error: null
            }
        case createReferralTypes.FAILURE_INJURY_SUMMARY:
            return{
                ...state,
                loading: false,
                error: action.errorMessage
            }
        case createReferralTypes.REQUEST_ENDPOINT:
            return{
                ...state,
                loading: true,
                endpoint: null
            }
        case createReferralTypes.SUCCESS_ENDPOINT:
            return{
                ...state,
                loading: false,
                endpoint: action.response
            }
        case createReferralTypes.FAILURE_ENDPOINT:
            return{
                ...state,
                loading: false,
                error: action.errorMessage
            }
        case createReferralTypes.REQUEST_LEAFLETS:
           return{
               ...state,
               loading: true,
           }
        case createReferralTypes.SUCCESS_LEAFLETS:
            debugger;
            try{
                return{
                    ...state,
                    loading: false,
                    leaflets: {
                        clinicianLeaflets: [...state.leaflets.clinicianLeaflets, ...action.response.clinicianLeaflets],
                        patientLeaflets: [...state.leaflets.patientLeaflets, ...action.response.patientLeaflets]
                    }
                }
            } catch(e){
                return{
                    ...state,
                    loading: false,
                    leaflets: action.response
                }
            }

        case createReferralTypes.FAILURE_LEAFLETS:
            return{
                ...state,
                loading: false,
                error: action.errorMessage
            }
        case createReferralTypes.SUBMIT_CONSENT_AND_IMAGES:
            return{
                ...state,
                loading: true,
            }
        case createReferralTypes.SUCCESS_CONSENT_AND_IMAGES:
            return{
                ...state,
                loading: false
            }
        case createReferralTypes.FAILURE_CONSENT_AND_IMAGES:
            return{
                ...state,
                loading: false
            }
        case createReferralTypes.SET_ACTION:
            return{
                ...state,
                actionContent: action.content
            }
        case createReferralTypes.REQUEST_ON_CALL_REGISTRAR_DETAILS:
            return{
                ...state
            }
        case createReferralTypes.SUCCESS_ON_CALL_REGISTRAR_DETAILS:
            return{
                ...state,
                onCallNumber: action.onCallNumber,
                currentOnCall: action.onCallDetails
            }
        case createReferralTypes.SUBMIT_CASE_AT_ENDPOINT:
            return{
                ...state,
                loading: true
            }
        case createReferralTypes.SUCCESS_CASE_AT_ENDPOINT:
            return{
                ...state,
                loading: false
            }
        case createReferralTypes.FAILURE_CASE_AT_ENDPOINT:
            return{
                ...state,
                loading: false,
                error: action.errorMessage
            }
        case createReferralTypes.SEND_LEAFLETRS:
            return{
                ...state,
                loading: true
            }
        case createReferralTypes.SUCCESS_SEND_LEAFLETS:
            return{
                ...state,
                loading: false
            }
        case createReferralTypes.REQUEST_INCOMPLETE_CASE:
            return{
                ...state,
                loading: true,
                incompleteCase: true,
            }
        case createReferralTypes.SUCCESS_INCOMPLETE_CASE:
            debugger
            if(action.currentTab == "3"){
                return{
                    ...state,
                    loading: false,
                    caseDetails: action.response.caseDetails,
                    speciality: action.response.speciality,
                    incompleteCase: false,
                    CaseMode:"Create"

                }
            } else if(action.currentTab == "5"){
                return{
                    ...state,
                    loading: false,
                    caseDetails: action.response.caseDetails,
                    speciality: action.response.speciality,
                    questionAnswers: action.response.questionAnswers,
                    decision: action.response.decision,
                    selectedPathway: action.response.selectedPathway,
                    incompleteCase: false,
                    euuid: action.response.euuid,
                    questionAnswersCopy:action.response.questionAnswers,
                    CaseMode:"Edit"
                }
            } else if(action.currentTab == "4"){
                return{
                    ...state,
                    loading: false,
                    caseDetails: action.response.caseDetails,
                    speciality: action.response.speciality,
                    questionAnswers: action.response.questionAnswers,
                    selectedPathway: action.response.selectedPathway,
                    questionID: action.response.questionID,
                    lastResponse: action.response.lastResponse,
                    incompleteCase: false,
                    questionAnswersCopy:action.response.questionAnswers,
                    CaseMode:"Edit"
                }
            }
        case createReferralTypes.SET_INCOMPLETE_FALSE:
            return{
                ...state,
                incompleteCase: false 
            }
        case createReferralTypes.REQUEST_FEEDBACK_QNA:
            return{
                ...state,     
            }
        case createReferralTypes.SUCCESS_FEEDBACK_QNA:
            return{
                ...state,
                feedbackqna:action.feedbackqna,
            }        
        case createReferralTypes.SUBMIT_VISUAL_ACUITY:
            return{
                ...state
            }
        case createReferralTypes.SUCCESS_VISUAL_ACUITY:
            return{
                ...state
            }
        case createReferralTypes.FAILURE_VISUAL_ACUITY:
            return{
                ...state
            }
        case createReferralTypes.GET_DRUGS:
            return{
                ...state,
                loading: true
            }
        case createReferralTypes.SUCCESS_DRUGS:
            return{
                ...state,
                loading: false,
                drugList: action.drugList
            }
        case createReferralTypes.FAILURE_DRUGS:
            return{
                ...state,
                loading: false
            }
        case createReferralTypes.SEARCH_PATIENT_DATA:
        case createReferralTypes.REQUEST_PATIENT_DATA:
            return{
                ...state,
                loadingPatient: true
            }
        case createReferralTypes.SUCCESS_PATIENT_DATA:
            return{
                ...state,
                patientData:action.patientData,
                loadingPatient: false
            }
        case createReferralTypes.FAILURE_PATIENT_DATA:
            return{
                ...state,
                loadingPatient: false
            }
        case createReferralTypes.SEND_UNKNOWN_DRUG_EMAIL:
            return state
        case createReferralTypes.SAVE_MID_RESPONSE:
            return{
                ...state,
                loading: true
            }
        case createReferralTypes.SUCCESS_MID_RESPONSE:
            return{
                ...state,
                loading: false
            }
        case createReferralTypes.FAILURE_MID_RESPONSE:
            return{
                ...state,
                loading:false
            }
        case createReferralTypes.ADD_LEAFLET:
            if(action?.leaflet?.type?.toLowerCase() === "patient" && state.leaflets.patientLeaflets.find(it => it.id === action.leaflet._id) == undefined){
                return{
                    ...state,
                    leaflets:{
                        ...state.leaflets,
                        patientLeaflets: [...state.leaflets.patientLeaflets, {Name:action.leaflet.name, id:action.leaflet._id, s3Url: action.leaflet.url}]
                    }
                }
            } else if(action?.leaflet?.type?.toLowerCase() === "clinician" && state.leaflets.clinicianLeaflets.find(it => it.id === action.leaflet._id) == undefined){
                return{
                    ...state,
                    leaflets:{
                        ...state.leaflets,
                        clinicianLeaflets: [...state.leaflets.clinicianLeaflets, {Name:action.leaflet.name, id:action.leaflet._id, s3Url: action.leaflet.url}]
                    }
                }
            }

        case createReferralTypes.SET_EUUID:
            return{
                ...state,
                euuid:action.EUUID
            }
        case createReferralTypes.REQUEST_REAU_NEXT_ID:
            return{
                ...state,
                loadingCalcQuestion:true,
            }
        case createReferralTypes.SUCCESS_REAU_NEXT_ID:
            return{
                ...state,
                ReauNextId:action.ReauNextId,
                loadingCalcQuestion:false
            }
        case createReferralTypes.REQUEST_CASE_PDF:
            return{
                ...state
            }
        case createReferralTypes.REQUEST_CASE_PDF_DETAILS:
            return{
                ...state
            }
        case createReferralTypes.SUCCESS_CASE_PDF_DETAILS:
            return{
                ...state,
                CasePdfDetails:{
                    CasePdfData:action.CasePdfData,
                    CasePdfUrl:action.CasePdfUrl,
                    CasePdfName:action.pdfName
                }
            }
            case createReferralTypes.CLEAR_CASE_PDF_DETAILS:
                return{
                    ...state,
                    CasePdfDetails:{
                        CasePdfData:"",
                        CasePdfUrl:null,
                        CasePdfName:"",
                    }
                }
        case createReferralTypes.SET_LIFE_THREATENING:
            return{
                ...state,
                lifeThreatening: action.val
            }
 		case createReferralTypes.REQUEST_CASE_CANCEL:
            return{
                ...state
            }
        case createReferralTypes.SUCCESS_CASE_CANCEL:
            return{
                ...state
            }
        case createReferralTypes.SUCCESS_DOWNLOADED_RHEU_IMAGES:
            return{
                ...state,
                downloadRheuImages:action.downloadRheuImages
            }
        case createReferralTypes.SUCCESS_PREFILL_RHEU2_IMAGES:
            // const rimg2 = state.downloadRheuImages;
            // alert(rimg2)
            // delete rimg2.rheuInves2;
            return{
                ...state
            }                
        case createReferralTypes.SUCCESS_PREFILL_RHEU3_IMAGES:
            const rimg3 = state.downloadRheuImages;
            delete rimg3.rheuInves3;
            return{
                ...state,
                downloadRheuImages:rimg3
            }   
        case createReferralTypes.FIND_LOCAL_HOSPITAL:
            return{
                ...state
            } 
        case createReferralTypes.FIND_LOCAL_HOSPITAL_SUCCESS:
            return{
                ...state,
                localHospital: action.response
            }            
        default:
            return state;
    }
}


export default CreateReferral;