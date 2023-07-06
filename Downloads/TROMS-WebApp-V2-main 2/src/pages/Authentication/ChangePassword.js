import React, { useEffect, useState } from "react"
import { Row, Col, CardBody, Card, Alert, Container,CardTitle, Form ,Input ,Modal,FormFeedback} from "reactstrap"
import  Trivicelogo  from './Trivicelogo.png'
import PropTypes from "prop-types";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch
  } from 'react-router-dom';
  import { useParams, useRouteMatch, Redirect,useLocation  } from "react-router-dom";
  
  
import useValidator from 'hooks/useValidator.js'
import AuthHeader from "pages/Authentication/AuthComponent/Header"
import AuthFooter from "pages/Authentication/AuthComponent/Footer"

import {forgotTypes,forgotCreators} from 'store/auth/forgetpwd/reducer';

import { setClient } from "utils/apiUtils"


  
//redux
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom";


// import images
import profileImg from "assets/images/profile-img.png"
import logoImg from "assets/images/logo.svg"
import Loadbtn from "components/Common/Loadbtn"


// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"



const Changepassword = props =>{

    let history = useHistory();
    const dispatch = useDispatch()
    const [, forceUpdate] = useState()

    const { token,userDetails,configdata,appReducer } = useSelector(state => ({
        userDetails: state.appReducer.userDetails,
        configdata:state.Account.configdata,
        appReducer:state.appReducer,
        token:state.appReducer.token,
      }))
console.log("token",token)
    const [validator, showValidationMessage] = useValidator()

    const [showModal, setShowModal] = useState(false)

 
    
//for eye button

const [passwordShown, setPasswordShown] = useState(false);

const togglePasswordVisiblity = () => {
  setPasswordShown(passwordShown ? false : true);
};
const [passwordShownfirst, setPasswordShownfirst] = useState(false);
const [passwordShownsecond, setPasswordShownsecond] = useState(false);

const togglePasswordVisiblitysecond = () => {
  setPasswordShownsecond(passwordShownsecond ? false : true);
};
const togglePasswordVisiblityfirst = () => {
    setPasswordShownfirst(passwordShownfirst ? false : true);
  };
    // Form Field State for 2nd route
const [passwordForm, setpasswordForm] = useState({
    oldpassword:'',
    password:'',
    newpassword: '',
  })

    // Login Form Field Error State for 2nd route
const [error, setError] = useState({
    oldpassword:'',
    password:'',
    newpassword: '',
  })


  const confirmPasswordError = 
    validator.message('confirm_password', passwordForm.password, `required|in:${passwordForm.newpassword}`)
  
// Set Login Form Field Value
const setValue= (e) => {
    setpasswordForm({...passwordForm, [e.currentTarget.name]: e.currentTarget.value})
  }
  

    const handleSubmit = (e) =>{
        console.log("passwordForm",passwordForm);

    
        e.preventDefault();
    
        // Set Login Form Field Error State
        setError({
            ...error,
            oldpassword:!validator.fieldValid('oldpassword'),
            password: !validator.fieldValid('password'),
            newpassword: !validator.fieldValid('Confirm password'),

        })
      
        if (validator.allValid() && passwordForm.password == passwordForm.newpassword) {
          console.log("passwordForm",passwordForm)
            dispatch(forgotCreators.requestResetPassword(null,passwordForm.oldpassword,passwordForm.newpassword,history,token))
        } else {
            showValidationMessage(true)
            forceUpdate(1)
        }
      
    
      }

    return(
            <>
            <Form className="form-horizontal"
                 onSubmit ={
                  handleSubmit
                }
                >
                    <Row>
                        <Col xl={6}>
                        <p className="text-muted">Enter your current password. The new
                password must be at least 8 characters and must contain one(a-z, A-Z, 0-9, @!$#)</p>
                        <div className="mb-3">
                        
                  <label>Current password <span className="text-danger">*</span></label>
                  <div className='input-group' >
                    <Input
                      name="oldpassword"
                     
                      placeholder="Enter old password"
                      type={passwordShownfirst ? "text" : "password"}
                      onChange={setValue}
                      value={passwordForm.oldpassword}
                      invalid={error.oldpassword}
                      
                
                    />
                   
                   <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" style={{background:'#556EE6'}}
                     onClick={togglePasswordVisiblityfirst}>
                    <i className="far fa-eye" id="togglePassword" 
                    style={{color:'white'}}>
                  </i>
                  </button>
                  </div>
                  <FormFeedback>{validator.message('oldpassword', passwordForm.oldpassword, 'required|strongPassword')}</FormFeedback>   
                </div>
                
                </div>

                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6}>
                        <div className="mb-3">
                  <label>Password <span className="text-danger">*</span></label>
                  <div className='input-group' >
                    <Input
                      name="password"
                     
                      placeholder="Enter password"
                      type={passwordShownsecond ? "text" : "password"}
                      onChange={setValue}
                      value={passwordForm.password}
                      invalid={error.password}
                      
                
                    />
                   
                   <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" style={{background:'#556EE6'}}
                     onClick={togglePasswordVisiblitysecond}>
                    <i className="far fa-eye" id="togglePassword" 
                    style={{color:'white'}}>
                  </i>
                  </button>
                  </div>
                  <FormFeedback>{validator.message('password', passwordForm.password, 'required|strongPassword')}</FormFeedback>   
                </div>
                
                </div>

                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6}>
                        <div className="mb-3">
                  <label>Confirm password <span className="text-danger">*</span></label>
                  <div className='input-group'>
                    <Input
                      name="newpassword"
                     
                      placeholder="Enter confirm password"
                      type={passwordShown ? "text" : "password"}
                      onChange={setValue}
                      value={passwordForm.newpassword}
                      invalid={error.newpassword}
                  
                    />
                    <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" style={{background:'#556EE6'}}
                     onClick={togglePasswordVisiblity}>
                    <i className="far fa-eye" id="togglePassword" 
                    style={{color:'white'}}>
                  </i>
                  </button>
                  </div>
                  <FormFeedback>
                {validator.message('Confirm password',passwordForm.newpassword , 'required')}
                </FormFeedback>
                
                </div>
                <div>
                <p className="text-danger" style={{fontSize:'10px'}}>{passwordForm.password !== passwordForm.newpassword ? 
                'Confirm password must be same as password':''}</p>
                </div>
                </div>
                        </Col>
                    </Row>
                 

                  
                  <Row>
                          <Col >
                        <Loadbtn btnname ={'Submit'} btnloadname={'Submit'} loading = {false} />
                        </Col>
                        </Row>
                    </Form>
{/*
        <Modal
                isOpen={showModal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Alert!
                    </h5>
                    <button
                        type="button"
                        className="btn btn-danger btn-close"
                        onClick={() => {
                            setShowModal(false);
                            
                        }}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body ">
                Are you sure you want to navigate away from this page? Press OK to continue or Cancel to stay on the current page. 
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            setShowModal(false);
                             }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                        setShowModal(false);
                        history.push("/login")                            
                        }}
                    >
                        Ok
                    </button>
                </div>
            </Modal>
            */}
      </>

    )
}


export default Changepassword;