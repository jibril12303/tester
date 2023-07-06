import produce from 'immer';
import {fromJS} from 'immutable';
import {createActions} from 'reduxsauce';


import {
    REGISTER_USER,
    REGISTER_USER_SUCCESSFUL,
    REGISTER_USER_FAILED,
} from "./actionTypes"

const initialState = {
    error: null,
    message: null,
    isLoading: null,
    user: null,
    email: null,
    role: null,
    configdata: null,
    subscriptionData: null,
    orgval: null,
    showUnapprovedModal: false


}

export const {Types: registerTypes, Creators: registerCreators} = createActions({
    requestEmail: ['role', 'email', 'history'],
    successEmail: ['alertmsg', 'email'],
    failEmail: [''],


    requestRegisterPassword: ['email', 'code', 'password', 'history','setmodal_standard'],
    successRegisterPassword: ['configdata', 'user', 'subscriptionData'],
    failRegisterPassword: [''],

    requestForm: ['payload', 'token', 'history'],
    successForm: ['user'],
    failForm: [''],

    requestUpdateProfile: ['payload', 'token', 'history'],
    successUpdateProfile: [''],

    requestGetOrg: ['searchval'],
    successGetOrg: ['orgval'],

    requestNewAuthCode: ['email'],
    responseNewAuthCode: ['message'],
    setShowUnapprovedModal: ['bool']
});

const account = (state = initialState, action) => {
    switch (action.type) {
        case registerTypes.REQUEST_EMAIL:

            return {
                ...state,
                isLoading: true,
                error: null,
            }

        case registerTypes.SUCCESS_EMAIL:
            return {
                ...state,
                isLoading: false,
                email: action.email,
                message: action.alertmsg,
                error: null,
            }
        case registerTypes.FAIL_EMAIL:
            return {
                ...state,
                isLoading: false,
                error: null,
            }
        case registerTypes.REQUEST_REGISTER_PASSWORD:
            return {
                ...state,
                isLoading: true,
                error: null,
                user:null,
            }
        case registerTypes.SUCCESS_REGISTER_PASSWORD:

            return {
                ...state,
                isLoading: false,
                error: null,
                configdata: action.configdata,
                user: action.user
            }
        case registerTypes.FAIL_REGISTER_PASSWORD:

            return {
                ...state,
                isLoading: false,
                error: null,
            }
        case registerTypes.REQUEST_FORM:
            return {
                ...state,
                isLoading: true,
                error: null,
            }
        case registerTypes.SUCCESS_FORM:

            return {
                ...state,
                isLoading: false,
                error: null,
                user: action.user,
            }
        case registerTypes.REQUEST_UPDATE_PROFILE:
            return {
                ...state,
            }
        case registerCreators.SUCCESS_UPDATE_PROFILE:
            return {
                ...state
            }
        case registerTypes.FAIL_FORM:

            return {
                ...state,
                isLoading: false,
                error: null,
            }
        case registerTypes.REQUEST_GET_ORG:
            return {
                ...state,
            }
        case registerTypes.SUCCESS_GET_ORG:
            return {
                ...state,
                orgval: action.orgval,
            }
        case registerTypes.RESPONSE_NEW_AUTH_CODE:
        case registerTypes.REQUEST_NEW_AUTH_CODE:
            return state;
        case registerTypes.SET_SHOW_UNAPPROVED_MODAL:
            return {
                ...state,
                showUnapprovedModal: action.bool
            }
        default:
            return state;

    }
    return state
}

export default account
