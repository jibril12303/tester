import PropTypes from 'prop-types'
import React,{useState,useEffect}  from "react"

import { Switch, BrowserRouter as Router } from "react-router-dom"
import { connect, useSelector,useDispatch } from "react-redux"

import { Route, Redirect } from "react-router-dom"
import { motion } from "framer-motion"

import isPresent from 'is-present';

import {selectToken} from 'store/app/appSelector'

// // Import Routes all
// import { authProtectedRoutes, publicRoutes } from "./routes"

// Import all middleware
import Authmiddleware from "./routes/route"

import { appTypes,appCreators } from 'store/app/appReducer'

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

import { browserName, browserVersion } from "react-device-detect";

// Import scss
import "./assets/scss/theme.scss"

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"

// import fakeBackend from "./helpers/AuthType/fakeBackend"
import { setClient, setStore } from 'utils/apiUtils'
import PagesMaintenance from 'pages/browserSupport/pageMaintanence'

//Import pages

// Profile
import UserProfile from "pages/Authentication/user-profile"

// Authentication related pages
import Login from "pages/Authentication/Login"
import Logout from "pages/Authentication/Logout"
import Register from "pages/Authentication/Register"
import ForgetPwd from "pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "pages/Dashboard/index"

import MyReferral from "pages/MyReferral/index"
import ReferralDetail from "pages/ReferralDetail/index"
import CreateReferral from "pages/CreateReferral/index"
import EcommerceProductDetail from 'pages/ReferralDetail/index'
import AboutUs from 'pages/Aboutus/Aboutus.js'
import Faqs from "pages/faqPage/faqs"
import Terms from "pages/T&C/terms.js"
import PageMaintanence from 'pages/browserSupport/pageMaintanence.js'
import UserManagement from "pages/UserManagement"
import Feedback from "pages/Feedback"
import checkPermission from 'functions/checkPermission'
import CreateEmailTemplates from 'pages/CreateEmailTemplates'
import EmailTemplate from "./pages/EmailTemplate"; 
import OwnershipRequests from 'pages/OwnershipRequests/index'

// Activating fake backend
// fakeBackend()

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// }

// init firebase backend
// initFirebaseBackend(firebaseConfig)

const App = props => {
  
  const dispatch = useDispatch()
  function getLayout() {
    let layoutCls = VerticalLayout
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()

  const { tokenExpiry, token,unsupportedBrowser, userType } = useSelector(
    (state) => ({
      tokenExpiry: new Date(state.appReducer?.tokenExpiryDate),
      token: state.appReducer.token,
      unsupportedBrowser:state.appReducer.unsupportedBrowser,
      userType: state.appReducer?.userDetails?.accountType
    })
    );
  
    const isDesktopApp = localStorage.getItem('isDesktopApp')
    const authProtectedRoutes = [
      { path: "/dashboard", component: Dashboard },
    
      // //profile
      { path: "/profile", component: UserProfile },
      { path: "/ownership-requests", component: OwnershipRequests },
      { path: "/my-referral", component: MyReferral },
      { path: "/create-referral", component: CreateReferral },
      { path: "/referral-detail", component: EcommerceProductDetail },
      { path: "/about", component: AboutUs },
      { path: "/faqs", component: Faqs },
      { path: "/terms", component: Terms },
      // { path: "/email-template/create",component: CreateEmailTemplates},
      // { path: "/email-template/edit/:templateId",component: CreateEmailTemplates},
      // { path: "/email-templates", component: EmailTemplate },
      // { path: "/User-Management", component:UserManagement},
      // { path: "/feedback", component:Feedback},
      // this route should be at the end of all other routes
      // eslint-disable-next-line react/display-name
      { path: "/", exact: true, component: () => <Redirect to={isDesktopApp == "true" && userType == "REFERRING" ? '/create-referral' :"/dashboard"} /> },
    
    ]
    if(userType != "REFERRING"){
      authProtectedRoutes.splice(4,1)
    }
    if(checkPermission('user-management') && !authProtectedRoutes.find(item => item.path == "/User-Management")) {
      authProtectedRoutes.push({ path: "/User-Management", component:UserManagement})
    }
    if(checkPermission('email-admin') && !authProtectedRoutes.find(item => item.path == "/email-template/create")) {
      authProtectedRoutes.push({ path: "/email-template/create",component: CreateEmailTemplates})
    }
    if(checkPermission('email-admin') && !authProtectedRoutes.find(item => item.path == "/email-template/edit/:templateId")) {
      authProtectedRoutes.push({ path: "/email-template/edit/:templateId",component: CreateEmailTemplates})
    }
    if(checkPermission('email-admin') && !authProtectedRoutes.find(item => item.path == "/email-templates")) {
      authProtectedRoutes.push({ path: "/email-templates",component: EmailTemplate})
    }
    const publicRoutes = [
      { path: "/logout", component: Logout },
      { path: "/login", component: Login },
      { path: "/forgot-password" , component: ForgetPwd },
      { path: "/reset-password", component: ForgetPwd },
      { path: "/register-email", component: Register },
      { path: "/register-password", component: Register },
      { path: "/update-profile", component: Register },
      { path: "/termsconditions", component: Register },
      { path: '/register-authcode', component: Register},
      { path: "/setup2fa", component: Register},
      { path: "/unsupportedbrowser", component: PageMaintanence},
      
    
    ]

  useEffect(()=>{
        if(props.app.token){
          console.log("props.app.token",props.app.token);
          setClient(props.app.token);
          setStore(props.store)
         }
 
 },[])
 
 console.log("unsupportedBrowser==",browserName)
if(browserName === "IE"){
  return(<PagesMaintenance/>)
}else{
return (

    <React.Fragment>
      
      <Router>
   
        <Switch>
          {publicRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              unsupportedBrowser={unsupportedBrowser!=null && unsupportedBrowser==true}
              browserName={browserName}
              exact
            />
          ))}

          {authProtectedRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              isLoggedIn={token != null && new Date() < tokenExpiry}
               exact
            />
          ))}
          <Redirect to='/' />
        </Switch>
      </Router>
    </React.Fragment>
  )
          }
}

App.propTypes = {
  layout: PropTypes.any,
  token:PropTypes.any,
  app:PropTypes.any,
  store: PropTypes.any
}

const mapStateToProps = state => {
  return {
    token:selectToken(),
    layout: state.Layout,
    app:state.appReducer,
  }
}

export default connect(mapStateToProps, null)(App)
