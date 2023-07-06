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
    error: null,
    userDetails: null,
    alertBoxData: null,
    token: null,
    unsupportedBrowser: null,
    incompletProfile: false,
    profileSubmitted: false,
    backtrack: '',
    fromNotifs: false
}

export const { Types: appTypes, Creators: appCreators } = createActions({
    setToken: ['token', 'tokenExpiryDate', 'userDetails'],
    updateTokenExpiry: [],
    clearToken: [],
    clearAlert: [],
    setUnsupportedBrowser: [],
    setIncompleteProfileModalOpen: [],
    setIncompleteProfileModalClose: [],
    showAlertModal: ['title', 'description', 'alertType', 'okButtonText', 'cancelButtonText', 'okButtonHandle', 'cancelButtonHandle'],
    updateBacktrack: ['path'],
    setFromNotifs: ['fromNotifs']
});

/* eslint-disable default-case, no-param-reassign */
export const appReducer = (state = initialState, action) => {
    //  debugger;
    console.log("ACTION", action)
    switch (action.type) {
        case appTypes.SET_UNSUPPORTED_BROWSER:
            return {
                ...state,
                unsupportedBrowser: true,
            }
        case appTypes.SET_INCOMPLETE_PROFILE_MODAL_OPEN:
            return {
                ...state,
                incompletProfile: true,
            }

        case appTypes.SET_INCOMPLETE_PROFILE_MODAL_CLOSE:
            return {
                ...state,
                incompletProfile: false,
            }
        case appTypes.SET_TOKEN:
            return {
                ...state,
                token: action.token,
                tokenExpiryDate: action.tokenExpiryDate,
                userDetails: action.userDetails,
            }
        case appTypes.UPDATE_TOKEN_EXPIRY:
            // debugger;
            let newExpiry = new Date()
            newExpiry.setHours(newExpiry.getHours() + 1);
            let userDetail = { ...state.userDetails, tokenExpiryDate: newExpiry }
            return {
                ...state,
                tokenExpiryDate: newExpiry,
                userDetails: userDetail
            }
        case 'UPDATE_TOKEN_EXPIRY':
            let expiry = new Date()
            expiry.setHours(expiry.getHours() + 1);
            let userDetails = { ...state.userDetails, tokenExpiryDate: expiry }
            return {
                ...state,
                tokenExpiryDate: expiry,
                userDetails: userDetails
            }
        case appTypes.CLEAR_TOKEN:
            return {
                ...state,
                token: null,
                userDetails: null,
            }
        case appTypes.SHOW_ALERT_MODAL:
            return {
                ...state,
                alertBoxData: action,
            }
        case appTypes.CLEAR_ALERT:
            return {
                ...state,
                alertBoxData: null,
            }
        case appTypes.UPDATE_BACKTRACK:
            return {
                ...state,
                backtrack: action.path
            }
        case appTypes.SET_FROM_NOTIFS:
        return {
            ...state,                
            fromNotifs: action.fromNotifs
        }
        
        default:
            return state;
    }
}

export default appReducer;
