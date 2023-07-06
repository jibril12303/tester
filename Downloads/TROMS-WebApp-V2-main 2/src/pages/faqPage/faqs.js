import React, { Component,useState,useEffect } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Media,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Input,
} from "reactstrap"
import PropTypes from "prop-types";
import classnames from "classnames"
import { faqTypes,faqCreators } from "store/faq/reducer";
//redux
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import profileupdateValidator from "hooks/profileupdateValidator"
import { appCreators } from "store/app/appReducer";

const FAQOption = ({spec, setSpec})=>{
  return (
    <>
    <Input type="select" value={spec} onChange={(e)=>{
      setSpec(e.currentTarget.value)
    }}>
      <option value="Ophthalmology">Ophthalmology</option>
      <option value="Plastic Surgery">Plastic Surgery</option>
    </Input>
    </>

  )

}

const Faqs = ()=> {

const dispatch = useDispatch();

const [activeTab,setActiveTab] = useState('1')
const [spec, setSpec] = useState('Plastic Surgery')

const {Faqlist,userDetails} = useSelector(state=>({
  Faqlist:state.FaqlistReducer.faqList,
  userDetails:state.appReducer.userDetails,
}))

useEffect(()=>{
  if(userDetails?.speciality == "Ophthalmology") setSpec('Ophthalmology')
},[])

const profileupdatevalidator = profileupdateValidator()

console.log("Faqlist",Faqlist)

const toggleTab = (tab)=> {
  setActiveTab(tab)
 }


useEffect(()=>{
dispatch(faqCreators.requestFetchFaqList())

if(userDetails?.consultantCode == null ||userDetails?.firstName == null || userDetails?.lastName == null
  ||userDetails?.email == null || userDetails?.phoneNumber == null || userDetails?.grade == null
  || userDetails?.speciality == null || userDetails?.speciality == false  ){
  dispatch(appCreators.setIncompleteProfileModalOpen())
  }
},[])
    if (spec == "Ophthalmology"){
      return (
        <React.Fragment>
                 <motion.div className="page-content" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
            <MetaTags>
              <title>FAQs | TriVice - Triage, Referral & Advice</title>
            </MetaTags>
            <Container fluid>
              {/* Render Breadcrumbs */}
              <Breadcrumbs title="Dashboard" breadcrumbItem="FAQs">
              <FAQOption spec={spec} setSpec={setSpec} />
              </Breadcrumbs>
              <div className="checkout-tabs">
                <Row>
                  <Col lg="2">
                    <Nav className="flex-column" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "1",
                          })}
                          onClick={() => {
                            toggleTab("1")
                          }}
                        >
                          <i className="bx bx-question-mark d-block check-nav-icon mt-4 mb-2" />
                          <p className="font-weight-bold mb-4">
                            Clinical FAQs
                          </p>
                        </NavLink>
                      </NavItem>
                     
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active:activeTab === "2",
                          })}
                          onClick={() => {
                            toggleTab("2")
                           
                          }}
                        >
                          <i className="bx bx-support d-block check-nav-icon mt-4 mb-2" />
                          <p className="font-weight-bold mb-4">Support</p>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col lg="10">
                    <Card>
                      <CardBody>
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="1">
                            <CardTitle className="mb-5 h4">
                              Clinical FAQs
                            </CardTitle>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What is TriVice?
                                </h5>
                                <p className="text-muted">
                                TriVice is a purpose-built application, developed by the Department of Ophthalmology at Birmingham Children’s Hospital in collaboration with colleagues in Birmingham & Midland Eye Centre, primary care physicians and optometrists in the West Midlands. 
The purpose is to provide a tool for communication between referrer and receiver for all referrals from primary care to a hospital setting. 
TriVice will capture patient demographics, contact details and essential clinical information including imaging. Based on an embedded algorithm, the application will recommend an appropriate action: a time-frame for the appointment or, in some instances, recommend management in the community. The receiving eye-care professional has over-sight of this process and real time updates for emergency appointments.

                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What is the scope of TriVice?
                                </h5>
                                <p className="text-muted" style={{whiteSpace:'pre-line'}}>
                                {`
                                1) To allow referrers to track the appropriate processing of their referral including confirmation of receipt of the referral and a clear time-frame for the patient’s hospital appointment.
                                2) To avoid duplication of work i.e. to enable direct referral from optometry without GP approval; to send a single referral to one hospital to prevent duplicate appointments
                                3) Ability to easily append high quality images/videos to referrals including technical ocular imaging in optometry (OCT/fundus pics/visual fields)
                                4) A robust pathway with 0% 'lost' referrals
                                5) Easy access to relevant advice/information/leaflets etc for parents and referrers
                                6) A two-way communication portal so that if further clinical information is required for  effective triage this can be requested quickly
                                7) Faster, more robust processes than current paper-dependent semi-digital systems
                                8) More accurate and complete information at triage to enable fast assessment of  serious and urgent cases at risk of irreversible sight loss.                                
                                `}
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                 Who can use TriVice?
                                </h5>
                                <p className="text-muted">
                                TriVice has two interfaces- one for the Eye Department clinicians who wish to receive  patients and the other for the referring primary care provider who wish to refer patients. In order to use TriVice, the app must be downloaded from App Store or Google Play store and the user is required to register. Alternatively there is a version which runs on desktop computers.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                 How can I make the best use of TriVice?
                                </h5>
                                <p className="text-muted">
                                Please ensure that all required fields are filled in accurately. We request that clinical photographs and images are included to enable us to get as accurate a picture as possible. Please also use the free textbox to provide any additional information that you think is pertinent and useful.
                                </p>
                              </Media>
                            </Media>

                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What happens if I disagree with the advice given by TriVice?
                                </h5>
                                <p className="text-muted">                               
                                If you feel that the advice given by TriVice is inappropriate or compromises patient safety based on the suggested time-frame or clinical recommended actions, you have the ability to decline the advice and proceed differently. 
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do if there is a technical error?
                                </h5>
                                <p className="text-muted">
                                Please contact Capri Healthcare by email- support@caprihealthcare.co.uk or phone for technical support on 0330 133 4047 If you think there may be an error related to the clinical pathways, please contact Ophthalmology through the switchboard at BWC.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What if the patient or carer refuses permission for clinical photographs to be taken for the referral?
                                </h5>
                                <p className="text-muted">  
                                It is not obligatory to upload images, though by declining this opportunity parents lose access to remote expertise, increasing the likelihood of unnecessary hospital appointments and less well suited advice.  If the patient or carer refuses photographs to be taken, the clinician making the referral will have be required to proceed based on their judgement.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do if a patient does not want to share parent details?
                                </h5>
                                <p className="text-muted">
                                  Please read the NHS guidelines on getting consents:  https://www.nhs.uk/nhsengland/aboutnhsservices/documents/consent_%20aguideforparentsdh_4117353.pdf
                                </p>
                              </Media>
                            </Media>
                         
                          </TabPane>
                          <TabPane tabId="2">
                            <CardTitle className="mb-5">Support</CardTitle>
  
                           
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  How to check the primary Gmail account on an Android phone?
                                </h5>
                                <p className="text-muted">
                                <ul>
                                    <li>Go to your Settings. ( Home key, Menu key, then Settings)</li>
                                    <li>Tap Accounts. It might say “Accounts and sync” or it might just say “Accounts”</li>
                                    <li> Look for your Gmail. Your Gmail should be shown on the Accounts page. It might be listed under Google. It should end with @gmail.com.</li>
                                </ul>
                                </p>
                              </Media>
                            </Media>
  
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  How to find your Apple ID on iOS devices:
                                </h5>
                                <p className="text-muted">
                                  <ul>
                                    <li>Go to Settings, select your name, you will find your Apple ID under your name.</li>
                                    <li>Go to Settings select your name, iTunes and App Stores. There is your Apple ID on the top.</li>
                                    <li>If you have already set up Facetime details, you could go to Settings Facetime to find your Apple ID.</li>
                                    <li>On the same condition, you could go to Settings then Messages, if you have already set up your iMessage account.</li>
                                  </ul>
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do when TriVice is down?
                                </h5>
                                <p className="text-muted">
                                  If TriVice goes down:
                                  Telephone the clinician you have been discussing the patient with
                                  Inform the clinician that TriVice is down and the referral will now be managed via the telephone
                                  If you are unable to contact the clinician, telephone Switchboard and ask to be put through to this person
                                  If you are unable to speak to this person, ask Switchboard to put you through to the on-call consultant
                                </p>
                              </Media>
                            </Media>
  
                            <Media className="faq-box">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do when TriVice is back online?
                                </h5>
                                <p className="text-muted">
                                  Once TriVice is back online all referrals must be managed via TriVice. Any telephone discussions that have taken place whilst TriVice was down will need to be recorded in TriVice as soon as possible. Once TriVice is back online, please follow the steps below:
                                  Telephone the clinician you have been discussing the patient with
                                  Inform the clinician that TriVice is back online and the referral will now be managed via TriVice
                                  If you unable to contact the clinician, telephone Switchboard and ask to be put through to this person
                                  If you are unable to speak to this person, ask Switchboard to put you through to the on-call consultant
                                </p>
                              </Media>
                            </Media>
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
    } else {
      return (
        <React.Fragment>
                 <motion.div className="page-content" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
            <MetaTags>
              <title>FAQs | TriVice - Triage, Referral & Advice</title>
            </MetaTags>
            <Container fluid>
              {/* Render Breadcrumbs */}
              <Breadcrumbs title="Dashboard" breadcrumbItem="FAQs" >
              <FAQOption spec={spec} setSpec={setSpec} />
              </Breadcrumbs>
  
              <div className="checkout-tabs">
                <Row>
                  <Col lg="2">
                    <Nav className="flex-column" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "1",
                          })}
                          onClick={() => {
                            toggleTab("1")
                          }}
                        >
                          <i className="bx bx-question-mark d-block check-nav-icon mt-4 mb-2" />
                          <p className="font-weight-bold mb-4">
                            Clinical FAQs
                          </p>
                        </NavLink>
                      </NavItem>
                     
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active:activeTab === "2",
                          })}
                          onClick={() => {
                            toggleTab("2")
                           
                          }}
                        >
                          <i className="bx bx-support d-block check-nav-icon mt-4 mb-2" />
                          <p className="font-weight-bold mb-4">Support</p>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col lg="10">
                    <Card>
                      <CardBody>
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="1">
                            <CardTitle className="mb-5 h4">
                              Clinical FAQs
                            </CardTitle>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What is TriVice?
                                </h5>
                                <p className="text-muted">
                                  TriVice is a purpose-designed application developed 
                                  by the Department of Plastic surgery in collaboration 
                                  with Capri healthcare which will handle all acute 
                                  referrals to the on-call plastic surgery team at BWC. 
                                  TriVice will capture patient demographics including 
                                  contact details, essential details of the injury and 
                                  will facilitate uploading of clinical photographs and 
                                  images as appropriate. Based on the embedded clinical 
                                  algorithm the app will then suggest a course of action 
                                  which in cases of patient transfer will be validated 
                                  by the on call plastic surgery team at BWC.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What is the scope of TriVice?
                                </h5>
                                <p className="text-muted">
                                  Currently, TriVice can be used to refer all soft tissue injuries, hand and wrist fractures as well as upper limb birth-related injuries to the Department of Plastic Surgery. In future, we hope to expand the use to other conditions such as burn injuries and in-house extravasation referrals.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                 Who can use TriVice?
                                </h5>
                                <p className="text-muted">
                                 TriVice has two separate interfaces- one for the Emergency Department clinicians who wish to refer patients to Plastic Surgery and the other for the on call plastic surgical team who will receive these referrals. In order to use TriVice, the app must be downloaded from App Store or Google Play store and register as a user. Only those with valid NHS email address will be authorised to use the app.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                 What are the advantages of using TriVice?
                                </h5>
                                <p className="text-muted">
                                 TriVice will streamline referral pathways and obviate the need to speak to the on-call plastic surgery team at BWC for every referral unless an injury is serious or threatens limb or life. In most instances, TriVice will offer an action plan. The BWC clinician will endeavour to respond urgently if the injury suggests such a response is required. The app has a built in feature that enables the ED clinician to contact the BWC on-call team directly, at the press of a button, where required. The information that is captured on the app will be incorporated into BWC clinical systems and be part of patient records.
                                </p>
                              </Media>
                            </Media>
                            
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  How can I make the best use of TriVice?
                                </h5>
                                <p className="text-muted">
                                  Please ensure that all required fields are filled inaccurately. We request that clinical photographs and images are included to enable us to get as accurate a picture of the injury as possible. Please also use the free textbox to provide any additional information that you think is pertinent and useful.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What happens if I disagree with the advice given by TriVice?
                                </h5>
                                <p className="text-muted">                               
                                  If you feel that the advice given by TriVice is inappropriate or compromises patient safety please contact the on-call plastics as a team at BWC by telephone through the switchboard.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do if I do not receive a response from the BWC clinician?
                                </h5>
                                <p className="text-muted">
                                  If the action plan suggested by the app is to manage the patient in-house please do so. Clinical guidance and information leaflets are available within the app that you may choose to use at your own discretion. If the app suggests that the patient can be seen at BWC on a semi elective basis, the patient can be sent home with instructions as suggested by the app and the BWC team will contact the patient with necessary starving and attending instructions. If the advice is to send the patient to BWC immediately, please speak to the on-call team and agree on the details of the transfer. In case of immediate referrals, if the BWC plastics team are busy, they will attempt to contact you at the earliest. In case of limb or life-threatening emergencies, you may speak to the Emergency Department at BWC, if you are unable to contact the Plastic surgery team.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do if there is a technical error?
                                </h5>
                                <p className="text-muted">
                                  Please contact Capri Healthcare by email- support@caprihealthcare.co.uk or phone for technical support on 0330 133 4047
                                  If you think there may be an error related to the clinical pathways, please contact the on-call Plastic surgery through the switchboard at BWC.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What if the patient or carer refuses permission for clinical photographs to be taken for the referral?
                                </h5>
                                <p className="text-muted">  
                                  The on-call Plastic surgery team require every piece of information including photographs to make an accurate assessment of the nature of the injury. If the patient or carer refuses photographs to be taken, the clinician making the referral will have to make a decision on how to proceed based on their judgement.
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do if a patient does not want to share parent details?
                                </h5>
                                <p className="text-muted">
                                  Please read the NHS guidelines on getting consents:  https://www.nhs.uk/nhsengland/aboutnhsservices/documents/consent_%20aguideforparentsdh_4117353.pdf
                                </p>
                              </Media>
                            </Media>
                         
                          </TabPane>
                          <TabPane tabId="2">
                            <CardTitle className="mb-5">Support</CardTitle>
  
                           
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  How to check the primary Gmail account on an Android phone?
                                </h5>
                                <p className="text-muted">
                                <ul>
                                    <li>Go to your Settings. ( Home key, Menu key, then Settings)</li>
                                    <li>Tap Accounts. It might say “Accounts and sync” or it might just say “Accounts”</li>
                                    <li> Look for your Gmail. Your Gmail should be shown on the Accounts page. It might be listed under Google. It should end with @gmail.com.</li>
                                </ul>
                                </p>
                              </Media>
                            </Media>
  
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  How to find your Apple ID on iOS devices:
                                </h5>
                                <p className="text-muted">
                                  <ul>
                                    <li>Go to Settings, select your name, you will find your Apple ID under your name.</li>
                                    <li>Go to Settings select your name, iTunes and App Stores. There is your Apple ID on the top.</li>
                                    <li>If you have already set up Facetime details, you could go to Settings Facetime to find your Apple ID.</li>
                                    <li>On the same condition, you could go to Settings then Messages, if you have already set up your iMessage account.</li>
                                  </ul>
                                </p>
                              </Media>
                            </Media>
                            <Media className="faq-box mb-4">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do when TriVice is down?
                                </h5>
                                <p className="text-muted">
                                  If TriVice goes down:
                                  Telephone the clinician you have been discussing the patient with
                                  Inform the clinician that TriVice is down and the referral will now be managed via the telephone
                                  If you are unable to contact the clinician, telephone Switchboard and ask to be put through to this person
                                  If you are unable to speak to this person, ask Switchboard to put you through to the on-call consultant
                                </p>
                              </Media>
                            </Media>
  
                            <Media className="faq-box">
                              <div className="faq-icon me-3">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <Media body>
                                <h5 className="font-size-15">
                                  What do I do when TriVice is back online?
                                </h5>
                                <p className="text-muted">
                                  Once TriVice is back online all referrals must be managed via TriVice. Any telephone discussions that have taken place whilst TriVice was down will need to be recorded in TriVice as soon as possible. Once TriVice is back online, please follow the steps below:
                                  Telephone the clinician you have been discussing the patient with
                                  Inform the clinician that TriVice is back online and the referral will now be managed via TriVice
                                  If you unable to contact the clinician, telephone Switchboard and ask to be put through to this person
                                  If you are unable to speak to this person, ask Switchboard to put you through to the on-call consultant
                                </p>
                              </Media>
                            </Media>
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

  
}


FAQOption.propTypes = {
  spec: PropTypes.any,
  setSpec: PropTypes.func
}

export default Faqs
