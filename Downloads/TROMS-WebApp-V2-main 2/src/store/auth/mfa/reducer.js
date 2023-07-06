/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import { fromJS } from 'immutable';
import { createActions } from 'reduxsauce';

export const initialState = {
    loading: null,
    qrcode: null
}

export const { Types: mfaTypes, Creators: mfaCreators } = createActions({

    requestQRCodeWAuth: ['token'],
    successQRCodeWAuth: ['response'],
    failureQRCodeWAuth: ['response'],

    verifyTOTP: ['code','history'],
    successTOTP: ['response'],
    failureTOTP: ['response'],

    requestEmailTwoFA: ['email'],
    successEmailTwoFA: ['response'],
    failureEmailTwoFA: ['response']

 });

/* eslint-disable default-case, no-param-reassign */
export const mfaReducer = (state = initialState, action) =>
{
        switch (action.type) {
            case mfaTypes.REQUEST_QR_CODE_W_AUTH:
                return {
                    ...state,
                    loading: true
                }
            case mfaTypes.SUCCESS_QR_CODE_W_AUTH:
                return {
                    ...state,
                    qrcode: action.response,
                    loading: false
                }
            case mfaTypes.FAILURE_QR_CODE_W_AUTH:
                return {
                    ...state,
                    loading: false
                }
            
            case mfaTypes.VERIFY_TOTP:
                return{
                    ...state,
                    loading: true
                }
            case mfaTypes.SUCCESS_TOTP:
                return{
                    ...state,
                    loading: false
                }
            case mfaTypes.FAILURE_TOTP:
                return{
                    ...state,
                    loading: false
                }
            case mfaTypes.REQUEST_EMAIL_TWO_FA:
                return{
                    ...state,
                }
            case mfaTypes.SUCCESS_EMAIL_TWO_FA:
                return{
                    ...state,
                }
            case mfaTypes.FAILURE_EMAIL_TWO_FA:
                return{
                    ...state,
                }

            default:
                return state;
        }
    }

export default mfaReducer;
