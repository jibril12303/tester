import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

import MyReferral from "pages/MyReferral/index"
import OwnershipRequests from "pages/OwnershipRequests/index"
import ReferralDetail from "../pages/ReferralDetail/index"
import CreateReferral from "pages/CreateReferral/index"
import EcommerceProductDetail from 'pages/ReferralDetail/index'
import AboutUs from 'pages/Aboutus/Aboutus.js'
import Faqs from "pages/faqPage/faqs"
import Terms from "pages/T&C/terms.js"
import PageMaintanence from 'pages/browserSupport/pageMaintanence.js'
import UserManagement from "pages/UserManagement"
import Feedback from "pages/Feedback"
const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

  // //profile
  { path: "/profile", component: UserProfile },
  { path: "/ownership-requests", component: OwnershipRequests},
  { path: "/my-referral", component: MyReferral },
  { path: "/create-referral", component: CreateReferral },
  { path: "/referral-detail", component: EcommerceProductDetail },
  { path: "/about", component: MyReferral },
  { path: "/faqs", component: Faqs },
  { path: "/terms", component: Terms },
  { path: "/User-Management", component:UserManagement},
  // { path: "/feedback", component:Feedback},
 


  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to={isDesktopApp == "true" ? '/create-referral' :"/dashboard"} /> },

]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password" , component: ForgetPwd },
  { path: "/reset-password", component: ForgetPwd },
  { path: "/register-email", component: Register },
  { path: "/register-password", component: Register },
  { path: "/register-authcode", component:Register},
  { path: "/update-profile", component: Register },
  { path: "/termsconditions", component: Register },
  { path: '/setup2fa', component: Register},
  { path: "/unsupportedbrowser", component: PageMaintanence},

]

export { publicRoutes, authProtectedRoutes }
