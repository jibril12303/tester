import React, { useEffect, useState } from "react"
import { Row, Col, CardBody, Card, Alert, Container,CardTitle, Form ,Input ,Modal,FormFeedback} from "reactstrap"
import  Trivicelogo  from '../Trivicelogo.png'
import AuthHeader from "pages/Authentication/AuthComponent/Header"
import { useParams, useRouteMatch, Redirect,useLocation  } from "react-router-dom";
import {registerTypes,registerCreators} from 'store/auth/register/reducer';
import PropTypes from "prop-types";
import useValidator from 'hooks/useValidator.js'
import AuthFooter from "pages/Authentication/AuthComponent/Footer"
import Loadbtn from "components/Common/Loadbtn"

import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch
  } from 'react-router-dom';


//redux
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom";
import {forgotTypes,forgotCreators} from 'store/auth/forgetpwd/reducer';





const Forgotfirstpage = () => {
   
    
  const [, forceUpdate] = useState()
  const dispatch = useDispatch()
  let history =useHistory()
  const [passwordShown, setPasswordShown] = useState(false);
  const [validator, showValidationMessage] = useValidator()


  const { user, registrationError, loading,email,role,configdata,Loadingpw } = useSelector(state => ({
    user: state.Account.user,
    registrationError: state.Account.registrationError,
    Loadingpw:state.ForgetPassword.Loadingpw,
    email:state.Account.email,
    role:state.Account.role,
    configdata:state.Account.configdata,
  }))



    // Login Form Field State
const [FogetpwForm, setFogetpwForm] = useState({
    Email: '',   
})


// Login Form Field Error State
const [error, setError] = useState({
    Email:false,
  })
  
  // Set Login Form Field Value
 const setValue = (e) => {
 
    setFogetpwForm({...FogetpwForm, [e.currentTarget.name]: e.currentTarget.value})
   
  }

  const onSubmit = (e) => {
    console.log(FogetpwForm)

   e.preventDefault();


            setError({
                ...error,
                Email: !validator.fieldValid('Email'),
                
            })

            if (validator.allValid()) {
              console.log('in validator')
                dispatch(forgotCreators.requestPassword(FogetpwForm.Email,history));
            } else {
                showValidationMessage(true)
                forceUpdate(1)
                console.log('message')
            }
 }



return(
        <div>
        <div className="auth-full-page-content p-md-5">
          <div className="w-100">
            <div className="d-flex flex-column h-100">
            <AuthHeader/>

              <div className="m-0">
                <div>
                  <h5 className="text-primary">Forgot Password</h5>
                  <p className="text-muted " >Confirm your email to send the instructions</p>
                </div>

                <div className="mt-4 grid">

                  <Form 
                  className="form-horizontal"
                  onSubmit={onSubmit}>
            

                    

                    <div className="mb-3">
                        <label>Email <span className="text-danger">*</span></label>
                      <Input 
                        name="Email" 
                        className="form-control"
                        placeholder="Enter your NHS or work email"
                        type="email"
                        value={FogetpwForm.Email}
                        invalid={error.Email}
                        onChange={setValue}
                      />
                      <FormFeedback>{validator.message('Email', FogetpwForm.Email,'required')}</FormFeedback>
                    </div>

                    
                      <div className="mt-3 d-grid">

                            <Loadbtn btnname ={'Request password'} btnloadname={'Request password'}
                                loading = {Loadingpw} />
                          </div>


                  </Form>
                  <div className="mt-3 text-center">
                    <p>Remember It? <a > <Link to='/login' className="fw-medium text-primary" > Sign in here</Link> </a> </p>
                  </div>
                
                </div>
              </div>


              <AuthFooter/>
            </div>
          </div>
        </div>
        </div>
    
     
    )

}

Forgotfirstpage.propTypes = {
  validator: PropTypes.any,
  showValidationMessage:PropTypes.any,
}

export default Forgotfirstpage