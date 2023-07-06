import React, { useEffect, useState } from "react"
import { Row, Col, CardBody, Card, Alert, Container,CardTitle, Form ,Input ,Modal,FormFeedback} from "reactstrap"
import  Trivicelogo  from '../Trivicelogo.png'
import PropTypes from "prop-types";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch
  } from 'react-router-dom';
  import { useParams, useRouteMatch, Redirect,useLocation  } from "react-router-dom";
  import {registerTypes,registerCreators} from 'store/auth/register/reducer';
  
import useValidator from 'hooks/useValidator.js'
import AuthHeader from "pages/Authentication/AuthComponent/Header"
import AuthFooter from "pages/Authentication/AuthComponent/Footer"


  
//redux
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom";


// import images
import profileImg from "assets/images/profile-img.png"
import logoImg from "assets/images/logo.svg"
import Loadbtn from "components/Common/Loadbtn"


// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"



const Regpassword = props =>{

    let history = useHistory();
    const dispatch = useDispatch()
    const [, forceUpdate] = useState()

    const { user, registrationError, loading,email,role,configdata, unapprovedModal } = useSelector(state => ({
        user: state.Account.user,
        registrationError: state.Account.registrationError,
        loading: state.Account.isLoading,
        email:state.Account.email,
        role:state.Account.role,
        configdata:state.Account.configdata,
        unapprovedModal: state.Account.showUnapprovedModal
      }))

    const [validator, showValidationMessage] = useValidator()

    const [showModal, setShowModal] = useState(false)

    
//for eye button

const [passwordShown, setPasswordShown] = useState(false);

const togglePasswordVisiblity = () => {
  setPasswordShown(passwordShown ? false : true);
};

const [passwordShownsecond, setPasswordShownsecond] = useState(false);

const togglePasswordVisiblitysecond = () => {
  setPasswordShownsecond(passwordShownsecond ? false : true);
};

    // Form Field State for 2nd route
const [passwordForm, setpasswordForm] = useState({
    resetcode: '',
    password:'',
    newpassword: '',
    email: email
  })

    // Login Form Field Error State for 2nd route
const [error, setError] = useState({
    resetcode: '',
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
        console.log(passwordForm);

    
        e.preventDefault();
    
        // Set Login Form Field Error State
        setError({
            ...error,
            resetcode: !validator.fieldValid('Authorisation code'),
            password: !validator.fieldValid('password'),
            newpassword: !validator.fieldValid('Confirm password'),

        })
      
        if (validator.allValid() && passwordForm.password == passwordForm.newpassword) {
          console.log("passwordForm",passwordForm)
            dispatch(registerCreators.requestRegisterPassword(passwordForm.email,passwordForm.resetcode,passwordForm.newpassword,history))
        } else {
            showValidationMessage(true)
            forceUpdate(1)
        }
      
    
      }
    

    return(
        <div className="auth-full-page-content p-md-5 p-4">
        <div className="w-100">
          <div className="d-flex flex-column h-100">
            <AuthHeader/>
            <div className="m-0">
              <div>
                <h5 className="text-primary">Register</h5>
                <p className="text-muted " >
                Enter your authorisation code and password. The password must be at least 8 characters and must contain one(a-z, A-Z, 0-9, @!$#).
                </p>
              </div>

              <div className="mt-4">
                <Form className="form-horizontal"
                 onSubmit ={
                  handleSubmit
                }
                >
                   <div className="mb-3">
                    <label>Authorisation code <span className="text-danger">*</span></label>
                    <Input
                      name="resetcode"
                      className="form-control"
                      placeholder="Enter authorisation code"
                      type="text"
                      onChange={setValue}
                      value={passwordForm.resetcode}
                      invalid={error.resetcode}
                      maxlength='8'
                    />
                     <FormFeedback>{validator.message('Authorisation code', passwordForm.resetcode, 'required|alpha_num|max:8|min:8')}</FormFeedback>
                     
                  </div>

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
              
                  <div className="mt-3 d-grid">
                    <Loadbtn btnname ={'Submit'} btnloadname={'Submit'}
                                loading = {loading} />
                  </div>

                </Form>

          
                <div className="mt-3 text-center">
                  <p>
                  Already have an account?&nbsp; 
                    <span
                      className="fw-medium text-primary" style={{cursor:'pointer'}}
                      onClick={()=>setShowModal(true)}
                    >
                      Login
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <AuthFooter/>
          </div>
        </div>
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
            <Modal
                isOpen={unapprovedModal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Authorisation Required
                    </h5>
                    <button
                        type="button"
                        className="btn btn-danger btn-close"
                        onClick={() => {
                            dispatch(registerCreators.setShowUnapprovedModal(false));
                        }}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body ">
                    <p>
                        Your request has been forwarded to TriVice Admin Team for Authorisation.
                        You will be notified as soon as your access has been granted.
                    </p>
                </div>
                <div className="modal-footer">

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            dispatch(registerCreators.setShowUnapprovedModal(false));
                        }}
                    >
                        Understood
                    </button>
                </div>
            </Modal>
      </div>

    )
}


export default Regpassword;