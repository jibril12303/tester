import produce from 'immer';
import { fromJS } from 'immutable';
import { createActions } from 'reduxsauce';

export const {
    Types: myReferralTypes,
    Creators: myReferralCreators
} = createActions({
    requestFetchReferrals: ['pageNumber', 'Status', 'category', 'submission', 'durtype', 'search', 'selectedOrg', 'orderColumn', 'orderType', 'assignedRev', 'owner', 'pathway','assignedRef', 'specNeeded'],
    successFetchReferrals: ['referrals'],
    failureFetchReferrals: ['error'],

    requestClinicianList: ['onCall','speciality'],
    successClinicianList: ['response'],
    failureClinicianList: [],

    requestClinicianListByUser: ['user'],

    reassignCase: ['caseID', 'assignee', 'additionalComment'],
    successReassignCase: ['response'],
    failureReassignCase: [],

    acceptNewOwner: ['accepted', 'caseID']
});

const InitialState = {
    referrals: [],
    loading: null,
    error: null,
    clincians: [],
    reassignLoad: null
};

const MyReferralsContainerReducer = (state = InitialState, action) => {
    switch (action.type) {
        case myReferralTypes.REQUEST_FETCH_REFERRALS:
            return {
                ...state,
                loading: true,
                error: null,
                referrals: null
            }
        case myReferralTypes.SUCCESS_FETCH_REFERRALS:
            return {
                ...state,
                loading: false,
                error: null,
                referrals: action.referrals
            }
        case myReferralTypes.FAILURE_FETCH_REFERRALS:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case myReferralTypes.REQUEST_CLINICIAN_LIST:
            return {
                ...state,
                clincianLoad: true
            }
        case myReferralTypes.SUCCESS_CLINICIAN_LIST:
            return {
                ...state,
                clincianLoad: false,
                clincians: action.response
            }
        case myReferralTypes.FAILURE_CLINICIAN_LIST:
            return {
                ...state,
                clincianLoad: false,
                error: true
            }
        case myReferralTypes.REASSIGN_CASE:
            return {
                ...state,
                reassignLoad: true,
                error: false
            }
        case myReferralTypes.SUCCESS_REASSIGN_CASE:
            return {
                ...state,
                reassignLoad: false,
                error: false
            }
        case myReferralTypes.FAILURE_REASSIGN_CASE:
            return {
                ...state,
                reassignLoad: false,
                error: true
            }
        case myReferralTypes.ACCEPT_NEW_OWNER:
            return {
                ...state
            }
        case myReferralTypes.REQUEST_CLINICIAN_LIST_BY_USER:
            return {
                ...state
            }
        default:
            return state
    }
};

export default MyReferralsContainerReducer;