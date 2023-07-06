import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React, { useEffect, useState } from "react"
import { Row, Col, CardBody, Card, Alert, Container, Form ,Input,FormFeedback } from "reactstrap"

import AuthHeader from "pages/Authentication/AuthComponent/Header"
//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter,useHistory} from "react-router-dom";

import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from 'react-router-dom';
import { useParams, useRouteMatch, Redirect } from "react-router-dom";
import AuthFooter from "pages/Authentication/AuthComponent/Footer"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import CarouselPage from "pages/Authentication/CarouselPage";
import  Trivicelogo  from 'pages/Authentication/Trivicelogo.png';
import useValidator from 'hooks/useValidator.js'
import Forgotfirstpage from 'pages/Authentication/Forgotpwpages/Forgotfirstpage.js'

// action
import { userForgetPassword } from "store/actions";

import {forgotTypes,forgotCreators} from 'store/auth/forgetpwd/reducer';

// import images
import profile from "assets/images/profile-img.png";
import logo from "assets/images/logo.svg";
import Loadbtn from "components/Common/Loadbtn"


const ResetPassword = ()=>{

    const [, forceUpdate] = useState()
    let history = useHistory()
    const dispatch = useDispatch()

    const { alertmsg ,sendemail,Loadingpw,successresetpw } = useSelector(state => ({
        alertmsg:state.ForgetPassword.alertmsg,
        sendemail:state.ForgetPassword.email,
        Loadingpw:state.ForgetPassword.Loadingpw,
        successresetpw:state.ForgetPassword.successresetpw,    
    
      }))
      
    let email = sendemail;
    
    
    
// Login Form Field State
const [Forgetform, setForgetform] = useState({
      Resetcode: '',
      firstpassword: '',
      secondpassword: '',
  })

// Login Form Field Error State
const [error, setError] = useState({
  Resetcode: false,
  firstpassword: false,
  secondpassword: false,
})

// Set Login Form Field Value
   const setValue = (e) => {
    setForgetform({...Forgetform, [e.currentTarget.name]: e.currentTarget.value})
  
}

    // Login Form Validation
    const [validator, showValidationMessage] = useValidator()



    const onSubmit = (e) => {
        console.log("values",Forgetform);
        //dispatch(loginUser(values, props.history))
    
        e.preventDefault();
    
            // Set Login Form Field Error State
            setError({
                ...error,
                Resetcode: !validator.fieldValid('authorization code'),
                firstpassword: !validator.fieldValid('Password'),
                secondpassword:!validator.fieldValid('Confirm password')
            })
    
    if (validator.allValid() && Forgetform.firstpassword == Forgetform.secondpassword) {
        dispatch(forgotCreators.requestResetPassword(email,Forgetform.Resetcode,Forgetform.secondpassword,history))
     } else {
                showValidationMessage(true)
                forceUpdate(1)
            }
      }

const [passwordShown, setPasswordShown] = useState(false);
const togglePasswordVisiblity = () => {
  setPasswordShown(passwordShown ? false : true);
};

const [passwordShownsecond, setPasswordShownsecond] = useState(false);

const togglePasswordVisiblitysecond = () => {
  setPasswordShownsecond(passwordShownsecond ? false : true);
};

const [loading,setLoading] =useState(false)




    return(
        <div className="auth-full-page-content p-md-5 p-4">
        <div className="w-100">
          <div className="d-flex flex-column h-100">
          <AuthHeader/>
             

            <div>
              <div className="m-0 p-0">
                <h5 className="text-primary">Update Password</h5>
                <p className="text-muted">Enter your temporary password. The new
                password must be at least 8 characters and must contain one(a-z, A-Z, 0-9, @!$#)</p>
              </div>

              <div className="mt-4">
              <Form className="form-horizontal"
               onSubmit={onSubmit}>
                <div className="mb-3">
                <label>Temporary password <span className="text-danger">*</span></label>
                  <Input
                    name="Resetcode"
                    className="form-control"
                    placeholder="Enter temporary password"
                    type="text"
                    value={Forgetform.Resetcode}
                    invalid={error.Resetcode}
                    onChange={setValue}
                    maxlength='8'
                  />
                  <FormFeedback>{validator.message('authorization code', Forgetform.Resetcode, 'required')}</FormFeedback>
                </div>
                <div className="mb-3">
                <label>Password <span className="text-danger">*</span></label>
                    <div className='input-group'>
                  <Input
                    name="firstpassword"
                    className="form-control"
                    placeholder="Enter password"
                    type={passwordShown? "text" : "password"}
                    value={Forgetform.firstpassword}
                    invalid={error.firstpassword}
                    onChange={setValue}
                    
                  />
                  <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={togglePasswordVisiblity}
                         style={{background:'#556EE6'}}>
                        <i className="far fa-eye" id="togglePassword" style={{color:'white'}}   >
                      </i>
                      </button>
                      </div>
                      <FormFeedback>{validator.message('Password', Forgetform.firstpassword,['required','strongPassword'])}</FormFeedback>
                  </div>
                  
                </div>

                <div className="mb-3">
                <label>Confirm password <span className="text-danger">*</span></label>
                <div  className='input-group'>
                  <Input
                    name="secondpassword"
                    className="form-control"
                    placeholder="Enter confirm password"
                    type={passwordShownsecond ? "text" : "password"}
                    value={Forgetform.secondpassword}
                    invalid={error.secondpassword}
                    onChange={setValue}
                    
                  />
                  <div className="input-group-append">
                        <button className="btn btn-outline-secondary" style={{background:'#556EE6'}} type="button" onClick={togglePasswordVisiblitysecond}>
                        <i className="far fa-eye" id="togglePassword" style={{color:'white'}}   >
                      </i>
                      </button>
                      </div>
                       <FormFeedback>{validator.message('Confirm password', Forgetform.secondpassword,['required'])}</FormFeedback>
                  
                  </div>
                  <div>
      <p className="text-danger" style={{fontSize:'10px'}}>{Forgetform.firstpassword !== Forgetform.secondpassword ? 
      'Confirm password must be same as password':''}</p>
      </div>
                 
                </div>


                <div className="mt-3 d-grid">
                  
                  <Loadbtn btnname ={'Update Password'} btnloadname={'Update Password'}
                      loading = {successresetpw} />
                </div>

              </Form>

        
              <div className="mt-3 text-center">
                <p>
                  Don&apos;t have an account?<span> </span>
                  <Link
                    to="/register-email"
                    className="fw-medium text-primary"
                  >
                     Signup now
                  </Link>
                </p>
              </div>
            </div>
            </div>


            <AuthFooter/>
          </div>
        </div>
      </div>
    )
}

export default ResetPassword;