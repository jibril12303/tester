import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import { Row, Col, CardBody, Card, Alert, Container,CardTitle, Form ,Input,Label ,Modal,FormFeedback} from "reactstrap"
import { withRouter} from "react-router-dom"
import  Trivicelogo  from './Trivicelogo.png'
import PropTypes from "prop-types";
import Iframe from 'react-iframe';
import useValidator from 'hooks/useValidator.js'
import Regpassword from './RegisterPages/Registerpassword'
import Updateprofile from './RegisterPages/UpdateProfile'
import {PASSWORD_VALIDATION_RULE} from 'utils/validationUtils.js'
import Loadbtn from "components/Common/Loadbtn"
import AuthFooter from "pages/Authentication/AuthComponent/Footer"
import Spinner from 'react-spinkit'
import './Register.css';
import RenderPopupData from "pages/Dashboard/RenderPopupData"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import  { ReactComponent as CloseIcon } from 'assets/icon/modalclose.svg';
import { motion } from "framer-motion"  

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert"



import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useHistory
} from 'react-router-dom';
import { useParams, useRouteMatch, Redirect,useLocation  } from "react-router-dom";
import {registerTypes,registerCreators} from 'store/auth/register/reducer';

// action
import { registerUser, apiError } from "../../store/actions"

//redux
import { useSelector, useDispatch } from "react-redux"

import CarouselPage from "./CarouselPage"


// import images
import profileImg from "../../assets/images/profile-img.png"
import logoImg from "../../assets/images/logo.svg"
import AuthHeader from "./AuthComponent/Header"
import { fontFamily } from "@mui/system"
import EnableMFA from "./EnableMFA"
import AuthCode from "react-auth-code-input"
import { mfaCreators } from "store/auth/mfa/reducer"
import RegpasswordWEmail from "./RegisterPages/RegisterpasswordWEmail"

const Register = props => {


  const [, forceUpdate] = useState()


 // Login Form Validation
 const [validator, showValidationMessage] = useValidator()

  const location = useLocation();
  const dispatch = useDispatch()
  const history = useHistory()
  console.log("param",location.pathname);

    //col xl for carousel and rightside div
  let carousel = '';
  let rightside = '';

  const { user, registrationError, isLoading,email,role,configdata,userDetails, qrcode, token, unapprovedModal, orgVal } = useSelector(state => ({
    user: state.Account.user,
    registrationError: state.Account.registrationError,
    isLoading: state.Account.isLoading,
    email:state.Account.email,
    role:state.Account.role,
    configdata:state.Account.configdata,
    userDetails:state.appReducer.userDetails,
    qrcode: state.mfaReducer.qrcode,
    token: state.appReducer?.token,
    unapprovedModal: state.Account.showUnapprovedModal,
    orgVal: state.Account.orgval

  }))

  const [loading,setLoading] =useState(false)

  let appRole = userDetails && userDetails.appRole;

  const [modal_standard, setmodal_standard] = useState(false);
  const [newUser,setNewUser] = useState(false)

  // MODAL/POPUP FUNCTION

  function tog_standard() {
    dispatch(registerCreators.setShowUnapprovedModal(!unapprovedModal));
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  let sendemail = email;
  let dataconfig = configdata && configdata.hospitals;
  let specialityselect = configdata && configdata.specialities;
  let gradeselect = configdata && configdata.grades;
  let hospitals = dataconfig ? Object.keys(dataconfig) : dataconfig;
  let termsconditions = configdata && configdata.termsAndConditions;
  console.log("hospitals",hospitals);


  const [basic, setbasic] = useState(false)
  const [selectedRole,setSelectedRole] = useState('');
  const [formemail,setEmail] = useState('');
  const [iframeLoad,setIframeLoad] = useState(true)
  const [showModal, setShowModal] = useState(false)
  let [pageData,setpage]= useState({}) 
  const [pageload,setpageLoad] =useState(false)
  const [page,setPage] = useState(1)
  const [nonNHSEmail, setNonNHSEmail] = useState(false)
  const [twoFA, setTwoFA] = useState('')

  let urlData = null;
  let html = null;
  const url = appRole == "REFERRING_CLINICIAN" ? termsconditions && termsconditions.referrer :
      termsconditions && termsconditions.reviewer;
  if(location.pathname == "/update-profile" || location.pathname == "/termsconditions" ){
    carousel = 7;
    rightside =4;    
  }

  useEffect(()=>{
    if(location.pathname == "/termsconditions"){

      let urlData = url;
      
      fetch(url)
      .then(result => {
      
        return result.text();
      })
      .then(page => {
      
        setpage(page)
        setpageLoad(true)
      
      });
    }
  },[location.pathname])
 

  const hideSpinner = () => {
    setIframeLoad(false)
   // const frame = document.getElementById('inneriframe');
   // frame.contentWindow.postMessage( 'http://your-second-site.com');
   // document.frm.document.body.style.fontFamily = "Tahoma";
  };
  

  const [RegisterForm, setRegisterForm] = useState({
      Role: '',
      Email: '',
     
  })
  
  const mfaSubmit = (e) =>{
    e.preventDefault()
    if(twoFA.length == 6){
        dispatch(mfaCreators.verifyTOTP(twoFA,history))
    }
}

  const setValue = (e) => {
    setRegisterForm({...RegisterForm, [e.currentTarget.name]: e.currentTarget.value})
    //console.log("RegisterForm",RegisterForm);
    }

  const [error, setError] = useState({
  Role: false,
  Email: false,
})

 // handleValidSubmit
 const handleValidSubmit = (e) => {
 
  e.preventDefault();
    
  // Set Login Form Field Error State
  setError({
    ...error,
    Role: !validator.fieldValid('Role'),
    Email: !validator.fieldValid('email'),

})

if (validator.allValid()) {
  setLoading(isLoading)
  //setbasic(true)
  setShowModal(true)

//dispatch(registerCreators.requestEmail(RegisterForm.Role,RegisterForm.Email,props.history))
} else {
    showValidationMessage(true)
    forceUpdate(1)
}
console.log(RegisterForm);  

//setEmail(RegisterForm.Email)

//dispatch(registerCreators.requestEmail(values.select,values.email,props.history))

}

  
 const goto =  ()=>{
 const history= props.history;
 localStorage.setItem('newUser','true');
 history.push('/logout');
 }

 
const titleRole = RegisterForm.Role== "BCH_CLINICIAN"? "Reviewer " :RegisterForm.Role== "REFERRING_CLINICIAN"? "Referrer":'';
const title = "You are registering as " + titleRole + ". Click OK to continue." ;

const style={
  height:'200px',
  fontFamily:'Poppins',
  background:'red'
}

let slider= null;

const next=()=> {
  slider.slickNext();

}
const previous=()=> {
  slider.slickPrev();
}


const settings = {
  arrows:false,
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const { height, width } = useWindowDimensions();



  return (
    <switch>
    <React.Fragment>
      <div>
        <MetaTags>
          <title>Register | TriVice</title>
        </MetaTags>
        <Container fluid className="p-0">
          <Row className="g-0">
            <CarouselPage carousel = {carousel} />

            {/*-------------1st route-------------------*/}
            <Route exact path="/register-email">
            <Col xl={3} >

              <Modal
                isOpen={showModal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
           
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Confirmation
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
                    {title}
                    {nonNHSEmail && (
                      <div>
                        {"As you are registering using a non NHS email, your account will require manual review."}
                      </div>
                    )}
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
                          dispatch(registerCreators.requestEmail(RegisterForm.Role,RegisterForm.Email,props.history));
                            setShowModal(false);
                            
                        }}
                    >
                        Ok
                    </button>
                </div>
            </Modal>
            

              <div className="auth-full-page-content p-md-5 ">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <AuthHeader/>
                    <div className="m-0">
                      <div>
                        <h5 className="text-primary">Register</h5>
                        <p className="text-muted " >
                        Get your TriVice account now
                        </p>
                      </div>


                      <motion.div className="mt-4" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
                        
                        <Form className="form-horizontal"
                         onSubmit={
                          handleValidSubmit
                        }
                        >
                          <div className="mb-3">
                          <label>Role <span className="text-danger">*</span></label>
                          <div>
                          <select 
                           type="select"
                           name="Role"
                           className="form-select form-control required"
                           onChange={setValue}
                           invalid={error.Role}
                           value={RegisterForm.Role}  
                           
                           >
                             
                            <option value='' selected disabled>Select...</option>
                            <option value="REFERRING_CLINICIAN">Referrer (I want to refer a patient)</option>
                            <option value="BCH_CLINICIAN">Reviewer (I want to review a referral)</option>
                          </select>
                          </div>
                          <span style={{
                                fontSize: '80%',
                                color: '#f46a6a',
                          }}>{validator.message('Role', RegisterForm.Role, 'required')}</span>
                          
                          </div>
                          
                          <div className="mb-3 ">
                            <label>Email <span className="text-danger">*</span></label>
                            <Input
                              name="Email"
                              className="form-control"
                              placeholder="Enter your NHS or work email"
                              type="email"
                              value={RegisterForm.Email}
                              onChange={setValue}
                              invalid={error.Email}

                              //validate={{
                              //  required: { value: true },
                               // maxLength: { value: 11, errorMessage: "Max 11 chars." },
                                //pattern: {
                                //  value: "@nhs.net$",
                                //  errorMessage: "Invalid Email",
                               // },
                             // }}
                            />
                          <div className="form-check mt-1">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={nonNHSEmail}
                              onChange={()=>setNonNHSEmail(!nonNHSEmail)}
                              id="defaultCheck1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="defaultCheck1"
                            >
                              I do not have an NHS email
                            </label>
                          </div>
                            <FormFeedback>{validator.message('email', RegisterForm.Email, nonNHSEmail ? 'required' : 'required|emailEndWithNhs') && (
                              <>
                              {validator.message('email', RegisterForm.Email, 'required|emailEndWithNhs')}

                              </>
                            )}</FormFeedback>          
                          </div>


                          <div className="mt-3 d-grid">
                            <Loadbtn btnname ={'Submit'} btnloadname={'Submit'}
                                loading = {isLoading} />
                          </div>

                        </Form>

                  
                        <div className="mt-3 text-center">
                          <p>
                            Already have an account?&nbsp; 
                            <Link
                              to="/login"
                              className="fw-medium text-primary"
                            >
                              Login
                            </Link>
                          </p>
                        </div>
                        </motion.div>
                    </div>
                    <AuthFooter/>
                  </div>
                </div>
              </div>
            </Col>

            </Route>
            <Route exact path="/register-authcode">
              <Col xl={3} >
              <RegpasswordWEmail />
              </Col>

            </Route>
                          {/*2nd route update account*/}
            <Route exact path="/register-password">
            <Col xl={3}>
              <Regpassword/>

           
            </Col>

            </Route>

                          {/*3rd route update account*/}
            <Route exact path="/update-profile">
            <Col xl={5} className="h-100 ">
            <Updateprofile/>
            
            </Col>

            </Route>
              
            <Route exact path='/setup2fa'>
              <Col xl={3}>
              <div style={{display:'flex',marginTop:'5vh',flexDirection:'column',alignItems:'center', textAlign:'center'}}>
                            <div>
                              <h5 className="text-primary">Setup Two Factor Authentication</h5>
                            </div>
                            <div className="avatar-md mx-auto mb-3">
                                                  <div className="avatar-title rounded-circle bg-light">
                                                    <i className="bx bxs-devices h1 mb-0 text-primary"></i>
                                                  </div>
                            </div>
                            <ol style={{alignContent:'normal'}} >
                                            <li>
                                                Go to your phones App store
                                            </li>
                                            <li>
                                                Install the Google Authenticator app
                                            </li>
                                            <li>
                                                Scan the barcode below
                                            </li>
                                        </ol>
                            {qrcode != null && (
                              <img src={qrcode} className="mb-2" />
                            )}
                            {/* <h5>Setup 2FA</h5> */}
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
                              history.push('/termsconditions')
                            }}
                        className="btn text-muted d-none d-sm-inline-block btn-link"
                      >
                        { <p>Skip setup{" "}</p>}
                      </p>
                          </div>
              </Col>
            </Route>

            {/*4th route*/}
            <Route exact path="/termsconditions">
            <Col xl={5} className="h-100">

              <div className="auth-full-page-content p-md-5 p-4" >
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <AuthHeader/>
                    <div className="m-0">
                      <div>
                        <h5 className="text-primary">Terms & Conditions</h5>
                        <p className="text-muted " >
                        
                        </p>
                      </div>

                        
                     
                  <div className="mt-2">
                       <div style={{height:'100%'}}>
                        {pageload? (
                            <div style={{height:(height*65)/100,width:"100%",overflowY:'scroll',overflowX:'none'}}>
                            <div 
                                dangerouslySetInnerHTML={{ __html: pageData && pageData }} />
                           </div>
                        ) : <p>Loading...</p>}
                        </div>

                         
                          <div className="mt-3 d-grid">
                            <button
                        
                            type="button"
                            onClick={() => {
                              if(appRole == "REFERRING_CLINICIAN"){
                                debugger;
                                  
                                    if(orgVal[0].name == "THE DUDLEY GROUP NHS FOUNDATION TRUST"){
                                      if(!user.approved){
                                      tog_standard()
                                    }else{
                                      setNewUser(true);
                                    }

                                      
                                  }else{
                                      setNewUser(true);
                                  }
                              }
                              else{
                                  tog_standard();
                              }
                              
                            }}
                            data-toggle="modal"
                            data-target="#myModal"
                              className="btn btn-primary btn-block "
                            >
                              I accept
                            </button>


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
                          tog_standard();
                          history.push("/login")
                            
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
                          tog_standard();
                          setNewUser(true);
                          history.push("/login");
                         
                        }}
                    >
                      Understood
                    </button>
                </div>
            </Modal>

               {/*swiper modal*/}
               <Modal
                isOpen={newUser}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
                size="lg"
              
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i>
                        
                    </h5>
                    <button
                        type="button"
                        className="btn"
                        style={{
                          float:'right',
                          cursor:'pointer'
                        }}
                        onClick={() => {
                        setNewUser(false);
                        goto();
                      
                         
                        }}
                    ><div>
                       <CloseIcon style={{color:'black'}}/>
                       </div>
                    </button>
                </div>
                <div className="modal-body" style={{overflow:'none',width:'auto',height:'300px'}}>
              <div style={{overflow:'none',width:'auto'}}>
                          <Slider
                           {...settings}
                          ref={c => (slider = c)}
                          afterChange={index=>setPage(index)}
                          style={{overflow:'none'}} 
                          >
                    <div  key={1}>
                    <RenderPopupData index = {1} />
                    </div>
                    <div key={2}>
                      <RenderPopupData index = {2} />
                    </div>
                    <div key={3}>
                    <RenderPopupData index = {3} />
                    </div>
                    <div key={4}>
                    <RenderPopupData index = {4} />
                    </div>
                    <div key={5}>
                    <RenderPopupData index = {5} />
                    </div>
                    <div key={6}>
                    <RenderPopupData index = {6} />
                    </div>
                    <div key={7}>
                    <RenderPopupData index = {7} />
                    </div>
                    <div key={8}>
                    <RenderPopupData index = {8} />
                    </div>
                  </Slider>
                  </div>

                </div>
                <div className="modal-footer">
                  {page == 1 && (
                <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          previous()
                        }}
                    >
                        back 
                    </button>
                  )}

                <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          if(page == 7){
                            goto();
                          }
                         next()
                        }}
                    >
                       {page == 7 ?"Login":"next"}  
                    </button>
                    
                </div>
            </Modal>

            
                          
                    </div>

                   

              
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            </Route>         
         
          </Row>
        </Container>
      </div>
    </React.Fragment>
      </switch>
  )}

  Register.propTypes = {
    history: PropTypes.object,
    
  }
  
export default withRouter(Register)
