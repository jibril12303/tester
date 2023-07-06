import produce from 'immer';
import { fromJS } from 'immutable';
import { createActions } from 'reduxsauce';

export const initialState = {
    Loadingpw: false,
    error: null,
    successresetpw:false,
    alertmsg:null,
    status:null,
    email:null,
}

export const { Types: forgotTypes, Creators: forgotCreators } = createActions({
    requestPassword: ['email','history'],
    successPassword: ['alertmsg','email'],
    failurePassword: ['errorMessage'],
    
    requestResetPassword:['email','oldPassword','newPassword','history','token'],
    successResetPassword:[],
    failureResetPassword: ['errorMessage'],
    
});

export const forgetPassword = (state = initialState, action) => {
    
        switch (action.type) {
            case forgotTypes.REQUEST_PASSWORD:
                return {
                  ...state,
                  Loadingpw:true,
                  error:null,
                }
            case forgotTypes.SUCCESS_PASSWORD:
                return{
                   ...state,
                   Loadingpw:false,
                   alertmsg:action.alertmsg,
                   email:action.email,
                   error:null,
                  }
            case forgotTypes.FAILURE_PASSWORD:
                return {
                  ...state,
                  Loadingpw:false,
                  error:action.error,
                }
            case forgotTypes.REQUEST_RESET_PASSWORD:
                return{
                    ...state,
                    successresetpw:true,
                    error:null,
                }
            case forgotTypes.SUCCESS_RESET_PASSWORD:
                return{
                    ...state,
                    successresetpw:false,
                    error:null,
                    }
            case forgotTypes.FAILURE_RESET_PASSWORD:
                    return{
                        ...state,
                        successresetpw:false,
                        error:action.error,
                    }
            default:
                return state;
        }
  
};


export default forgetPassword
