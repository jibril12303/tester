import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

//App Reducer

import  appReducer  from "./app/appReducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

//E-commerce
import ecommerce from "./e-commerce/reducer"

//Calendar
import calendar from "./calendar/reducer"

//chat
import chat from "./chat/reducer"

//crypto
import crypto from "./crypto/reducer"

//invoices
import invoices from "./invoices/reducer"

//projects
import projects from "./projects/reducer"

//tasks
import tasks from "./tasks/reducer"

//contacts
import contacts from "./contacts/reducer"

//mails
import mails from "./mails/reducer";

//Dashboard 
import Dashboard from "./dashboard/reducer";

//Dasboard saas
import DashboardSaas from "./dashboard-saas/reducer";
//Create Referral 
import CreateReferral from "./create-referral/reducer"

import MyReferralsContainerReducer from "./myReferrals/reducer"

import caseDetails from "./caseDeatils/reducer"

import FaqlistReducer from "./faq/reducer"

import UserManagementReducer from "./userManagement/reducer"
import mfaReducer from "./auth/mfa/reducer"

import EmailTemplateReducer from "./email-templates/reducer"

import produce from 'immer';
import { fromJS } from 'immutable';
import { createActions } from 'reduxsauce';

export const {
  Types: mainReducerTypes,
  Creators: mainReducerCreators,
} = createActions({
  
  userLogout: []
});

const appMainReducer = combineReducers({
  // public
  Layout,
  appReducer,
  Login,
  Account,
  ForgetPassword,
  Profile,
  MyReferralsContainerReducer,
  caseDetails,
  ecommerce,
  calendar,
  chat,
  mails,
  crypto,
  invoices,
  projects,
  tasks,
  contacts,
  Dashboard,
  DashboardSaas,
  CreateReferral,
  FaqlistReducer,
  UserManagementReducer,
  mfaReducer,
  EmailTemplateReducer

})

const rootReducer = (state,action)=>{
  if(action.type === 'USER_LOGOUT'){
    return appMainReducer(undefined,action)
  }
  return appMainReducer(state,action)
}

export default rootReducer
