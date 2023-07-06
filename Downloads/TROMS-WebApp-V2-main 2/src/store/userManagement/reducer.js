import produce from 'immer';
import {fromJS} from 'immutable';
import {createActions} from 'reduxsauce';

export const {
    Types: userManageTypes,
    Creators: userManageCreators
} = createActions({
    requestFetchUsers: ['page','limit', 'status','search'],
    successFetchUsers: ['users'],
    failureFetchUsers: ['error'],
    approveUserSuccess:['email','date', 'subscriptions','permissions'],
    approveUserFailure:['error'],
    rejectUserSuccess:['email'],
    rejectUserFailure:['error'],
    disableUserSuccess:['email'],
    disableUserFailure:['error'],
});

const InitialState = {
   users:[],
   loading:null,
   error:null
};

const UserManagementReducer = (state = InitialState, action) =>{
        switch (action.type) {
            case userManageTypes.REQUEST_FETCH_USERS:
                //debugger;
                return{
                    ...state,
                    loading:true,
                    error:null
                } 
            case userManageTypes.SUCCESS_FETCH_USERS:
                return {
                    ...state,
                    loading:false,
                    error:null,
                    users:action.users
                }
            case userManageTypes.FAILURE_FETCH_USERS:
                return{
                    ...state,
                    loading:false,
                    error:action.error
                }
            case userManageTypes.APPROVE_USER_SUCCESS:
                return{
                    ...state,
                }
            case userManageTypes.APPROVE_USER_FAILURE:
                return{
                    ...state,
                    error:action.error
                } 
            case userManageTypes.REJECT_USER_SUCCESS:
                return{
                ...state,
                }
            case userManageTypes.REJECT_USER_FAILURE:
                return{
                ...state,
                error:action.error
                } 
            case userManageTypes.DISABLE_USER_SUCCESS:
                return{
                ...state,
                }
            case userManageTypes.DISABLE_USER_FAILURE:
                return{
                ...state,
                error:action.error
                } 
            default:
                    return state
        }
    };

export default UserManagementReducer;