import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React, { useEffect, useState } from "react"
import { Row, Col, CardBody, Card, Alert, Container, Form ,Input,FormFeedback } from "reactstrap"

import AuthHeader from "pages/Authentication/AuthComponent/Header"
//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter} from "react-router-dom";

import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from 'react-router-dom';
import { useParams, useRouteMatch, Redirect } from "react-router-dom";
import AuthFooter from "pages/Authentication/AuthComponent/Footer"
import { motion } from "framer-motion" 

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import CarouselPage from "./CarouselPage";
import  Trivicelogo  from './Trivicelogo.png';
import useValidator from 'hooks/useValidator.js'
import Forgotfirstpage from 'pages/Authentication/Forgotpwpages/Forgotfirstpage.js'
import ResetPassword from "pages/Authentication/Forgotpwpages/ResetPassword";

// action
import { userForgetPassword } from "../../store/actions";

import {forgotTypes,forgotCreators} from 'store/auth/forgetpwd/reducer';

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import { borderRadius } from "@mui/system";
import Loadbtn from "components/Common/Loadbtn"

const ForgetPasswordPage = props => {

  const [, forceUpdate] = useState()
  const dispatch = useDispatch()

  return (

      <switch>
      

       
    <React.Fragment>
        <div>
          <MetaTags>
            <title>Forgot Password</title>
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />

                                            {/*1st route forgot password*/}

                                            
            <Route exact path='/forgot-password'>

              <Col xl={3}>
              <motion.div exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
                 <Forgotfirstpage/>
                 </motion.div>
              </Col>
           
              </Route>
                                          {/*2nd route for reset code*/}

              <Route exact path='/reset-password'>
              <Col xl={3}>
              <motion.div  exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
               <ResetPassword/>
               </motion.div>
              </Col>

              </Route>
             </Row>
          </Container>
        </div>
      </React.Fragment>
  
      

       
        
       
      </switch>



  )}

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
  error: PropTypes.string,
}

export default withRouter(ForgetPasswordPage)
