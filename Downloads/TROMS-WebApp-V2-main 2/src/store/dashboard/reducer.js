import produce from 'immer';
import { fromJS } from 'immutable';
import { createActions } from 'reduxsauce';


import {
    API_SUCCESS,
    API_FAIL,
    GET_CHARTS_DATA
} from "./actionTypes";

export const {
    Types: bchDashboardTypes,
    Creators: bchDashboardCreators,
} = createActions({

    requestBchDashboardInfo: ['days', 'time', 'pathway'],
    successDashboardInfo: ['caseAmounts'],

    requestRefDashboardInfo: ['selectedOrg', 'pathway'],
    successRefDashboardInfo: ['refcaseAmounts'],

    requestChartData: ['time', 'selectedOrg'],
    successChartData: ['chartdata'],

    updateOnCallRegistrar: ['token'],
    setUserOrganisation: ['organisation'],
    setApiVersion: ['apiVersion', 'configData'],
    extendToken: [],
    successExtendToken: [],
    setPathway: ['pathway'],

    requestDashboardReferrals: ['selectedOrg', 'assignedRev', 'pathway'],
    successDashboardReferrals: ['referrals'],

    requestUpdateOnCallRegistrarWithId: ['clinicianId', 'user'],
    successUpdateOnCallRegistrarWithId: [],
    errorUpdateOnCallRegistrarWithId: ['clinicianId'],

    getAuditFails: ['caseID'],
    successAuditFails: ['audits'],
    failureAuditFails: [],

    countAuditFails: [],
    successCountAuditFails: ['count'],
    failureCountAuditFails: [],

    wipeAuditNotifs:[],

    updateAudit:['_id','actioned','actionTaken','actionComments'],
    updateAuditFail:[],
    updateAuditSuccess:[]

});

const INIT_STATE = {
    chartsData: {},
    loading: null,
    caseAmounts: {},
    refcaseAmounts: {},
    orgID: null,
    apiVersion: null,
    extendingToken: false,
    configData: {},
    pathway: 'ALL',
    referrals: [],
    onCallStatus: null,
    auditFails: [],
    auditFailsCount: [],
    auditFailsCopy: [],

};

const Dashboard = (state = INIT_STATE, action) => {
    switch (action.type) {
        case bchDashboardTypes.SET_USER_ORGANISATION:
            return {
                ...state,
                orgID: action.organisation.orgID,
                extendingToken: false
            }
        case bchDashboardTypes.SET_API_VERSION:
            return {
                ...state,
                apiVersion: action.apiVersion,
                configData: action.configData,
                extendingToken: false

            }
        case bchDashboardTypes.REQUEST_BCH_DASHBOARD_INFO:
            return {
                ...state,
                loading: true,
                extendingToken: false
            }
        case bchDashboardTypes.SUCCESS_DASHBOARD_INFO:
            return {
                ...state,
                loading: false,
                caseAmounts: action.caseAmounts,
                extendingToken: false
            }
        case bchDashboardTypes.REQUEST_REF_DASHBOARD_INFO:
            return {
                ...state,
                loading: false,
                extendingToken: false
            }
        case bchDashboardTypes.SUCCESS_REF_DASHBOARD_INFO:
            return {
                ...state,
                loading: true,
                refcaseAmounts: action.refcaseAmounts,
                extendingToken: false
            }
        case bchDashboardTypes.REQUEST_CHART_DATA:
            return {
                ...state,
                loading: false,
                extendingToken: false
            }
        case bchDashboardTypes.SUCCESS_CHART_DATA:
            return {
                ...state,
                loading: false,
                chartsData: action.chartdata,
                extendingToken: false
            }
        case bchDashboardTypes.EXTEND_TOKEN:
            return {
                ...state,
                extendingToken: true
            }
        case bchDashboardTypes.SUCCESS_EXTEND_TOKEN:
            return {
                ...state,
                extendingToken: false
            }
        case bchDashboardTypes.SET_PATHWAY:
            return {
                ...state,
                pathway: action.pathway
            }
        case bchDashboardTypes.UPDATE_ON_CALL_REGISTRAR:
            return state;
        case bchDashboardTypes.REQUEST_DASHBOARD_REFERRALS:
            return {
                ...state,
                referrals: null
            };

        case bchDashboardTypes.SUCCESS_DASHBOARD_REFERRALS:
            return {
                ...state,
                referrals: action.referrals
            };
        case bchDashboardTypes.REQUEST_UPDATE_ON_CALL_REGISTRAR_WITH_ID:
            return {
                ...state,
                onCallStatus: null
            };

        case bchDashboardTypes.SUCCESS_UPDATE_ON_CALL_REGISTRAR_WITH_ID:
            return {
                ...state,
                onCallStatus: "Registrar updated"
            };
        case bchDashboardTypes.GET_AUDIT_FAILS:
            return {
                ...state,
            };
        case bchDashboardTypes.SUCCESS_AUDIT_FAILS:
            return {
                ...state,
                auditFails:action.audits,
                auditFailsCopy:action.audits
            };
        case bchDashboardTypes.FAILURE_AUDIT_FAILS:
            return {
                ...state,
            };
        case bchDashboardTypes.COUNT_AUDIT_FAILS:
            return {
                ...state,
            };
        case bchDashboardTypes.SUCCESS_COUNT_AUDIT_FAILS:
            return {
                ...state,
                auditFailsCount:action.count
            };
        case bchDashboardTypes.FAILURE_COUNT_AUDIT_FAILS:
            return {
                ...state,
            };
        case bchDashboardTypes.WIPE_AUDIT_NOTIFS:
            return{
                ...state,
                auditFails: [],
                auditFailsCount: 0
            }
        case bchDashboardTypes.UPDATE_AUDIT:
            return{
                ...state,
            }
        case bchDashboardTypes.UPDATE_AUDIT_FAIL:
            return{
                ...state
            }
        case bchDashboardTypes.UPDATE_AUDIT_SUCCESS:
            return{
                ...state
            }

        default:
            return state;
    }
}


export default Dashboard;