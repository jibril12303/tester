import { createActions } from 'reduxsauce';


export const {
    Types:emailTemplateTypes,
    Creators:emailTemplateCreators
}  = createActions({
    requestFetchEmails:['page','limit'],
    successFetchEmails:['emailList'],
    
    saveEmailDataLocally:['localData'],


    requestCopyEmail:['templateName','templateDescription','emailTo','emailCC','emailBCC','subject','emailBody','triggers','speciality','history','api','caseSpeciality'],
    successCopyEmail:['emailData'],

    requestAddEmail:['templateName','templateDescription','emailTo','emailCC','emailBCC','subject','emailBody','triggers','speciality','api','caseSpeciality'],
    successAddEmail:[],

    requestEmailTriggers:[''],
    successEmailTriggers:['triggers'],

    requestEmailEvent:[''],
    successEmailEvent:['event'],

    requestSingleEmailTemplate:['id'],
    successSingleEmailTemplate:['templateData'],

    requestDeleteEmailTemplate:['id','refreshList'],
    successDeleteEmailTemplate:[],

    requestUpdateEmailTemplate:['id','templateName','templateDescription','emailTo','emailCC','emailBCC','subject','emailBody','triggers','speciality','history','api','caseSpeciality'],
    successUpdateEmailTemplate:[],

    requestClearLocalStateData:[],

});

const INIT_STATE = {    
    loading:false,
    error:"",
    emailList:[],
    emailData:null,    
    localEmailTemplateData:{
        templateName:"",
        templateDescription:"",
        emailTo:[],
        emailCC:[],
        emailBCC:[],
        subject:"",
        emailBody:"",
        triggers:{},
        api:"",
        caseSpeciality:"",
    },
    emailTriggers:null,
    emailEvents:null,
    copyEmailData:{},
    singleEmailTemplate:{}, // templateData while editing,
    requestTemplateLoading: false
}

const EmailTemplate = (state=INIT_STATE, action)=>{
    switch(action.type){
        case emailTemplateTypes.REQUEST_FETCH_EMAILS:
            return{
                ...state,
            }
        case emailTemplateTypes.SUCCESS_FETCH_EMAILS:
            return{
                ...state,
                emailList: action.emailList
            }
        case emailTemplateTypes.SAVE_EMAIL_DATA_LOCALLY:
            return{
                ...state,
                localEmailTemplateData:{...state.localEmailTemplateData,...action.localData}
            }
        case emailTemplateTypes.REQUEST_ADD_EMAIL:
            return{
                ...state
            }
        case emailTemplateTypes.SUCCESS_ADD_EMAIL:
            return{
                ...state
            }
        case emailTemplateTypes.REQUEST_DELETE_EMAIL_TEMPLATE:
            return{
                ...state
            }
        case emailTemplateTypes.SUCCESS_DELETE_EMAIL_TEMPLATE:
            return{
                ...state
            }

        case emailTemplateTypes.REQUEST_COPY_EMAIL:
            return{
                ...state
            }
        case emailTemplateTypes.SUCCESS_COPY_EMAIL:
            return {
                ...state,
                copyEmailData: action.emailData,
            }

        case emailTemplateTypes.REQUEST_EMAIL_TRIGGERS:
            return{
                ...state
            }
        case emailTemplateTypes.SUCCESS_EMAIL_TRIGGERS:
            return{
                ...state,
                emailTriggers: action.triggers
            }
        case emailTemplateTypes.REQUEST_EMAIL_EVENT:
            return{
                ...state
            }
        case emailTemplateTypes.SUCCESS_EMAIL_EVENT:
            return{
                ...state,
                emailEvents: action.event
            }
        case emailTemplateTypes.REQUEST_SINGLE_EMAIL_TEMPLATE:
            return{
                ...state,
                requestTemplateLoading: true
            }
        case emailTemplateTypes.SUCCESS_SINGLE_EMAIL_TEMPLATE:
            return{
                ...state,
                singleEmailTemplate: action.templateData,
                requestTemplateLoading: false
            }
        case emailTemplateTypes.REQUEST_UPDATE_EMAIL_TEMPLATE:
            return{
                ...state
            }
        case emailTemplateTypes.SUCCESS_UPDATE_EMAIL_TEMPLATE:
            return{
                ...state,
                singleEmailTemplate: action.templateData
            }
        case emailTemplateTypes.REQUEST_CLEAR_LOCAL_STATE_DATA:
            return{
                ...state,
                singleEmailTemplate:{}
            }
        default:
            return state;
    }

}

export default EmailTemplate;