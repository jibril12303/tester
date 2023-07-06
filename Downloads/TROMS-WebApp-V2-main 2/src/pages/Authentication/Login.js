import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React,{useState,useEffect} from "react"
import useValidator from 'hooks/useValidator.js'

import { Row, Col, CardBody, Card, Alert, Container, Form ,Input,FormFeedback, Label } from "reactstrap"
import styled from 'styled-components';

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link } from "react-router-dom"

import Loadbtn from "components/Common/Loadbtn"


// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// actions
import { loginUser, apiError, socialLogin, verify2FA, resetState } from "../../store/actions"
import {showToast} from 'utils/toastnotify'

// import images  
import logodark from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"
import CarouselPage from "./CarouselPage"
import AuthHeader from "pages/Authentication/AuthComponent/Header"
import AuthFooter from "pages/Authentication/AuthComponent/Footer"
import  Trivicelogo  from './Trivicelogo.png';
import Ioslogo from 'assets/icon/ioslogo.svg';
import Iosbarcode from 'assets/icon/iosbarcode.svg';
import Androidlogo from 'assets/icon/androidlogo.svg';
import Androidbarcode from 'assets/icon/androidbarcode.svg';
import { motion } from "framer-motion"

//input eye icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { NONE } from "apisauce"
import { STATEMENT_OR_BLOCK_KEYS } from "@babel/types"
const eye = <FontAwesomeIcon icon={faEye} />;
import CapriLogo from 'assets/images/CapriLogo1.png'
import AuthCode from 'react-auth-code-input'
import QRCode from 'react-qr-code'
import {mfaCreators} from '../../store/auth/mfa/reducer'

const CapriImg = styled.img`
    display: block;
    width: auto;
    height: auto;
    margin: 0 auto;
`;


const Login = props => {


  const {loading,show2fa} = useSelector(state=>({
    loading:state.Login.loading,
    show2fa: state.Login.show2FA
  }))

  console.log("loading",loading);

  const [, forceUpdate] = useState()

  const dispatch = useDispatch()

    // Login Form Field State
    const [login, setLogin] = useState({
      email: '',
      password: ''
  })

  // Set Login Form Field Value
  const setValue = (e) => {
    setLogin({...login, [e.currentTarget.name]: e.currentTarget.value})

}

// Login Form Field Error State
const [error, setError] = useState({
  email: false,
  password: false
})

//for eye button

const [passwordShown, setPasswordShown] = useState(false);
const [twoFA, setTwoFA] = useState('')
const togglePasswordVisiblity = () => {
  setPasswordShown(passwordShown ? false : true);
};

 // Login Form Validation
 const [validator, showValidationMessage] = useValidator()

  const qr = "img data"
  // handleValidSubmit
  const onSubmit = (e) => {
    //console.log("values",values);
    //dispatch(loginUser(values, props.history))
    
    e.preventDefault();

        // Set Login Form Field Error State
        setError({
            ...error,
            email: !validator.fieldValid('email'),
            password: !validator.fieldValid('password')
        })

        if (validator.allValid()) {
            dispatch(loginUser(login, props.history))
        } else {
            showValidationMessage(true)
            forceUpdate(1)
        }
  }

  const mfaSubmit = (e) =>{
    e.preventDefault()
    if(twoFA.length == 6){
      dispatch(verify2FA(login,twoFA,props.history))
    }
  }

  useEffect(()=>{
    dispatch(resetState())
  },[])

  {/*
    
    const signIn = (res, type) => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.history, type))
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.history, type))
    }
  }
*/}


  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>TriVice</title>
        </MetaTags>
        <Container fluid className="p-0">
          <Row className="g-0" >
            <CarouselPage />

            <Col xl={3} >
              <div className="auth-full-page-content pt-md-5 px-md-5 ">
                <div className="w-100">
                  <div className="d-flex flex-column h-100"  >
                    <AuthHeader/>
                    {show2fa ? (
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center', textAlign:'center'}}>
                            <div>
                              <h5 className="text-primary">Two Factor Authentication</h5>
                            </div>
                            <div className="avatar-md mx-auto mb-3">
                                                  <div className="avatar-title rounded-circle bg-light">
                                                    <i className="bx bxs-devices h1 mb-0 text-primary"></i>
                                                  </div>
                            </div>
                            <h5>We need to verify who you are</h5>
                          <AuthCode
                            characters={6}
                            onChange={(code) => setTwoFA(code)}
                            className="form-control form-control-lg text-center"
                            allowedCharacters="^[0-9]"
                            inputStyle={{
                            width: "35px",
                            height: "calc(1.5em + 1rem + 2px)",
                            padding: ".25rem .5rem",
                            borderRadius: "8px",
                            fontSize: "1.01562rem",
                            textAlign: "center",
                            marginRight: "8px",
                            border: "1px solid #ced4da",
                            textTransform: "uppercase",
                            borderRadius: ".4rem"
                            }}
                            />
                            <Label style={{textAlign:'center'}}>Please input the code from your authenticator app.</Label>
                            <Form onSubmit={mfaSubmit}>
                            <Loadbtn disabled={twoFA.length != 6} btnname ={'Continue'} btnloadname={'Verifying'} loading={loading} />
                            </Form>
                            <p
                            onClick={(e)=>{
                              dispatch(mfaCreators.requestEmailTwoFA(login.email))
                            }}
                        className="btn text-muted d-none d-sm-inline-block btn-link"
                      >
                        { <p>Send code to email{" "}</p>}
                      </p>
                          </div>
                    ) : (
                      <div className="m-0" >
                      <div>
                        <h5 className="text-primary">Welcome Back!</h5>
                      </div>
                
                
                      <motion.div className="mt-4" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
                        
                                <Form onSubmit={onSubmit}>
                      <div className="mt-3 d-grid">
                           <div className="mb-3">
                             <label>Email <span className="text-danger">*</span></label>
                               <Input
                                   type="text"
                                   name="email"
                                   onChange={setValue}
                                   className="form-control"
                                   placeholder="Enter your NHS or work email"
                                   value={login.email}
                                   invalid={error.email}
                               />
                               <FormFeedback>{validator.message('email', login.email, 'required')}</FormFeedback>
                           </div>
                           <div className="  mb-3">
                           <label>Password <span className="text-danger">*</span></label>
                           <div className="float-end">
                             <Link
                               to='/forgot-password'
                               className="text-muted"
                             >
                               Forgot password?
                             </Link>
                           </div>
                           <div className='input-group'> 
                           <Input
                                   type={passwordShown ? "text" : "password"}
                                   name="password"
                                   onChange={setValue}
                                   className="form-control"
                                   placeholder="Enter password"
                                   value={login.password}
                                   invalid={error.password}
                                   aria-describedby="basic-addon2"
                                   
                               />
                
                               <div className="input-group-append">
                                  <button className="btn btn-outline-secondary" type="button" style={{background:'#556EE6'}}
                                   onClick={togglePasswordVisiblity}>
                                  <i className="far fa-eye" id="togglePassword" 
                                  style={{color:'white'}}>
                                </i>
                                </button>
                                </div>
                               <FormFeedback>{validator.message('password', login.password, 'required')}</FormFeedback>
                           
                              
                             </div>
                              </div>
                
                                <Loadbtn btnname ={'Login'} btnloadname={'Login In'}
                                loading = {loading} />
                                
                             </div>
                        </Form>
                        
                  
                        <div className="mt-3">
                          <p>
                            Don&apos;t have an account?&nbsp;
                            <Link
                              to="/register-email"
                              className="fw-medium text-primary"
                            >
                              Signup now
                            </Link>
                          </p>
                        </div>
                        <div className="mt-3">
                          <p>
                            Have an auth code?&nbsp;
                            <Link
                              to="/register-authcode"
                              className="fw-medium text-primary"
                            >
                              Complete registration
                            </Link>
                          </p>
                        </div>
                        </motion.div>
                    </div>
                    )}
                    
                    {/* <img src={qr} /> */}
{/*                 
                    <div className="mt-5">
                           
                        <h5 className="text-primary ml-0">Download our TriVice app</h5>
                        </div> */}
                    
                     {/* <div >
                  
                        
                        <Row>
                          <Col xl="6" md="6" >
                          <div>
                            <p>Get it on<br/> <strong>Google Play</strong></p>
                     {/* <img src={Androidlogo} className="img-fluid mx-auto d-block"/>*/}
                        {/* <img src={Androidbarcode} className="img-fluid mx-auto d-block"
                         style={{height:"80px",float:'left'}}/>
                        </div>
                          </Col>
                          <Col xl="6" md="6" >
                          <div>
                            
                          <p>Download on<br/> the <strong>App Store</strong></p> */}
                       
                       {/* <img src={Ioslogo} className="img-fluid mx-auto d-block"/>*/}
                      
                        {/* <img src={Iosbarcode} style={{height:"80px",float:'left'}} className="img-fluid mx-auto d-block "/>
                        </div>
                          </Col>
                        </Row>


                    </div>  */}
                    
                    <AuthFooter/>
                  </div>
                </div>
               
              </div>
              
            </Col>
            
          </Row>
          
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}







{/*
                          <AvForm className="form-horizontal"
                         onValidSubmit={(e, v) => {
                          handleValidSubmit(e, v)
                        }}>
                          <div className="mb-3">
                            <AvField
                              name="email"
                              label="Email *"
                              className="form-control"
                              placeholder="Enter email"
                              type="email"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <div className="float-end">
                              <Link
                                to='/forgot-password'
                                className="text-muted"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <div style={{position:'relative'}} >
                            <AvField
                              name="password"
                              label="Password *"
                              className="form-control"
                              placeholder="Enter password"
                              type="password"
                              required
                              style={{display:'flex',justifyContent:'center',alignItems:'center',flex:'1',
                                            border:'2px solid black'}}
                                
                              >
                                
                              </AvField>
                            <i className="far fa-eye" id="togglePassword" 
                           style={{ position:'absolute',right: '20',marginTop: '-23px', 
                                  cursor: 'pointer',background:'red',height:'inherit',width:'inherit'}}
                             >
                             </i>
                            </div>
                            </div>

                          <div className="form-check">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="auth-remember-check"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="auth-remember-check"
                            >
                              Remember me
                            </label>
                          </div>

                          <div className="mt-3 d-grid">
                            <button
                              className="btn btn-primary btn-block "
                              type="submit"
                            >
                              Log In
                            </button>
                          </div>

                        </AvForm>
                        */}
