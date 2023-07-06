import React, { useEffect, useState } from "react"
import { Row, Col, CardBody, Card, Alert, Container,CardTitle, Form ,Input ,Modal,FormFeedback} from "reactstrap"
  import {registerTypes,registerCreators} from 'store/auth/register/reducer';
  
import useValidator from 'hooks/useValidator.js'
import AuthHeader from "pages/Authentication/AuthComponent/Header"
import AuthFooter from "pages/Authentication/AuthComponent/Footer"


  
//redux
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom";


// import images
import Loadbtn from "components/Common/Loadbtn"
import { showToast } from "utils/toastnotify";


const RequestNewAuthCode = props =>{

    let history = useHistory();
    const dispatch = useDispatch()
    const [, forceUpdate] = useState()

    const { user, registrationError, loading,role,configdata } = useSelector(state => ({
        user: state.Account.user,
        registrationError: state.Account.registrationError,
        loading: state.Account.isLoading,
        role:state.Account.role,
        configdata:state.Account.configdata,
      }))

    const [validator, showValidationMessage] = useValidator()
    const [showModal, setShowModal] = useState(false)


    // Form Field State for 2nd route
const [passwordForm, setpasswordForm] = useState({
    email: '',
  })

    // Login Form Field Error State for 2nd route
const [error, setError] = useState({
    email: '',
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
            email: !validator.fieldValid('Email'),
        })
      
        
        if(validator.fieldValid('Email')){
            dispatch(registerCreators.requestNewAuthCode(passwordForm.email))
          } else {
            showValidationMessage(true)
          }
      
    
      }
    

    return(
        <div className="auth-full-page-content p-md-5 p-4" style={{overflow:scroll}}>
        <div className="w-100">
          <div className="d-flex flex-column h-100">
            <AuthHeader/>
            <div className="m-0">
              <div>
                <h5 className="text-primary">Request new code</h5>
                <p className="text-muted " >
                Please enter your email used for registration
                </p>
              </div>

              <div className="mt-4">
                <Form className="form-horizontal"
                 onSubmit ={
                  handleSubmit
                }
                >
                    <div className="mb-3">
                    <label>Email <span className="text-danger">*</span></label>
                    <Input
                      name="email"
                      className="form-control"
                      placeholder="Enter email"
                      type="text"
                      onChange={setValue}
                      value={passwordForm.email}
                      invalid={error.email}
                    />
                     <FormFeedback>{validator.message('Email', passwordForm.email, 'required|email')}</FormFeedback>
                     
                  </div>              
                  <div className="mt-3 d-grid">
                    <Loadbtn btnname ={'Submit'} btnloadname={'Submit'}
                                loading = {loading} />
                  </div>

                </Form>

                <div className="mt-3 text-center">
                  <p> 
                    <span
                      className="fw-medium text-primary" style={{cursor:'pointer'}}
                      onClick={()=>{
                        debugger;
                        history.push('/register-authcode')
                        
                      }}
                    >
                      Back to register&nbsp;
                    </span>
                  </p>
                  <p>
                  Already have an account?&nbsp; 
                    <span
                      className="fw-medium text-primary" style={{cursor:'pointer'}}
                      onClick={()=>history.push('/login')}
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
      </div>

    )
}


export default RequestNewAuthCode;