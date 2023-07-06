import produce from 'immer';
import {fromJS} from 'immutable';
import {createActions} from 'reduxsauce';

export const {
    Types: faqTypes,
    Creators: faqCreators
} = createActions({
    requestFetchFaqList: [],
    successFetchFaqList: ['faqList'],
    failureFetchFaqList: ['error'],
});

const InitialState = {
   faqList:[],
   loading:null,
   error:null
};

const FaqlistReducer = (state = InitialState, action) =>{
        switch (action.type) {
            case faqTypes.REQUEST_FETCH_FAQ_LIST:
                return{
                    ...state,
                    loading:false,
                    error:null
                } 
            case faqTypes.SUCCESS_FETCH_FAQ_LIST:
                return {
                    ...state,
                    loading:false,
                    error:null,
                    faqList:action.faqList
                }
            case faqTypes.FAILURE_FETCH_FAQ_LIST:
                return{
                    ...state,
                    loading:false,
                    error:action.error
                } 
            default:
                    return state
        }
    };

export default FaqlistReducer;