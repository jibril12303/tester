import React, { Component,useState,useEffect } from "react"
import MetaTags from 'react-meta-tags';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Media,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form ,
  Input ,
  Modal,
  FormFeedback 
} from "reactstrap"
import { useSelector } from "react-redux";
import profileupdateValidator from "hooks/profileupdateValidator"
import { appCreators } from "store/app/appReducer";
import { motion } from "framer-motion"

import classnames from "classnames"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory,Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const AboutUs = () =>{

    const dispatch = useDispatch();

  const { apiVersion,userDetails } = useSelector(
      (state) => ({
        apiVersion: state.Dashboard.apiVersion,
        userDetails:state.appReducer.userDetails,
      })
      );

  const history = useHistory()

  const [activeTab,setActiveTab] = useState('1')

  const toggleTab = (tab)=> {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }
  const profileupdatevalidator = profileupdateValidator()


  useEffect(() => {
    if(userDetails?.consultantCode == null ||userDetails?.firstName == null || userDetails?.lastName == null
      ||userDetails?.email == null || userDetails?.phoneNumber == null || userDetails?.grade == null
      || userDetails?.speciality == null || userDetails?.speciality == false  ){
      dispatch(appCreators.setIncompleteProfileModalOpen())
      }
  }, [])


    return (
      <React.Fragment>
        <motion.div className="page-content" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
          <MetaTags>
            <title>About | TriVice - Triage, Referral & Advice</title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Dashboard" breadcrumbItem="About" />

            
            <div className="checkout-tabs">
              <Row>
                <Col lg="2">
                  <Nav className="flex-column" pills>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active:activeTab === "1",
                        })}
                        onClick={() => {
                          toggleTab("1")
                        }}
                      >
                        <i className="bx bx-info-circle d-block check-nav-icon mt-4 mb-2" />
                        <p className="font-weight-bold mb-4">
                        About TriVice
                        </p>
                      </NavLink>
                    </NavItem>
                   
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === "2",
                        })}
                        onClick={() => {
                          toggleTab("2")
                        }}
                      >
                        <i className="bx bx-cog d-block check-nav-icon mt-4 mb-2" />
                        <p className="font-weight-bold mb-4">System Information</p>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === "3",
                        })}
                        onClick={() => {
                          toggleTab("3")
                        }}
                      >
                        <i className="bx bx-link d-block check-nav-icon mt-4 mb-2" />
                        <p className="font-weight-bold mb-4">Important Links</p>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
                <Col lg="10">
                  <Card>
                    <CardBody>
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                        <CardTitle className="h4">About TriVice</CardTitle>
                    <p className="card-title-desc">
                    TriVice™ is an Artificial Intelligence assisted solution developed with an aim of minimising avoidable referrals and decreasing direct dependency on availability of specialist clinicians. This is a clinician to clinician digital solution to :
                    <ul>
                      <li >Process routine referrals into predetermined pathways of care</li>
                      <li >Send feedback and tailored clinical advice to the referrer</li>
                    </ul>
                    Available on Mobile and Web apps to referrers, reviewers and the admin staff. Smartphone coverage within the UK is 85% and message delivery is instant and trackable, providing the ideal channel to ensure easy access the triaging information.
                    </p>
                         
                       
                        </TabPane>
                        <TabPane tabId="2">
                          <CardTitle>System Information</CardTitle>
                          <dl className="row mb-0">
                      <dt className="col-sm-3">Application Name</dt>
                      <dd className="col-sm-9">
                        TriVice - Triage, Referral and Advice Application
                        
    
                      </dd>

                      <dt className="col-sm-3">API Version</dt>
                      <dd className="col-sm-9">
                        {apiVersion != null ? apiVersion : "N/A"}
                      </dd>

                      <dt className="col-sm-3">Last Updated</dt>
                      <dd className="col-sm-9">
                        17 November 2022
                      </dd>
                      <dt className="col-sm-3">Supported Browsers</dt>
                      <dd className="col-sm-9">
                        Chrome, Safari, Microsoft Edge, FireFox
           
                      </dd>

                      <dt className="col-sm-3">Country</dt>
                      <dd className="col-sm-9">
                        United Kingdom
                      </dd>
                      <div className="mb-4"></div>
                         
                    </dl>
                        </TabPane>
                        <TabPane tabId="3">
                    
                          <CardTitle className="h4">Important Links</CardTitle>
                            <p className="card-title-desc">
                              <ul>
                                  <li><Link  to="/faqs">Frequently asked questions</Link></li>
                                  <li> <Link to="/terms">Terms and Conditions</Link></li>
                                  <li> <a href="https://bwc.nhs.uk/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a></li>
                                  <li><a href="https://desk.zoho.com/portal/caprihealthcare/en/home" target="_blank" rel="noreferrer">Customer Support</a></li>  
                              </ul>
                            </p>
                          <CardTitle className="h4">Copyright</CardTitle>
                            <p className="card-title-desc">
                            Copyright 2021-22 | <strong>Capri Healthcare Ltd</strong>
                            <p>TriVice is developed and supported by <a href="https://caprihealthcare.co.uk" target="_blank" rel="noreferrer">Capri Healthcare Ltd.</a></p>
                              
                          </p>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
       
          </Container>
          </motion.div>
      </React.Fragment>
    )
}

export default AboutUs
