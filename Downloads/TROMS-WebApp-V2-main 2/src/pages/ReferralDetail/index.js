import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import 'moment-timezone';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
  Collapse,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Media,
  CardText
} from "reactstrap";
import classnames from "classnames";
import { isEmpty, map } from "lodash";
import { useParams, useRouteMatch, Redirect, useLocation, useHistory } from "react-router-dom";
import GenerateCaseDetails from "components/GeneratecaseDetails";
import Accordians from "pages/ReferralDetail/Accordians";
import CdImages from "pages/ReferralDetail/CdImages";
import CdBasicInfo from "pages/ReferralDetail/CdBasicInfo"
import profileupdateValidator from "hooks/profileupdateValidator"
import { motion, useMotionValue, useTransform } from "framer-motion"
import PathwayResponse from './PathwayResponse'
import { setClient } from "utils/apiUtils";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

import img1 from 'assets/images/product/img-1.png'

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import Query from "pages/Querypage/QueryPage"



//redux
import { useSelector, useDispatch } from "react-redux"

import caseDetails, { caseTypes, caseCreators } from "store/caseDeatils/reducer"
import ContactsAndGDPR from "./ContactsAndGDPR";
import Referrer from './Referrer'
import Leaflets from "./Leaflets";
import Action from "./Action";
import Images from "./Images"
import VisualAcuity from './VisualAcuity'
import RubberStamp from "./RubberStamp";
import OffCanvasRheuScreens from "./OffCanvasRheuScreens";
import { createReferralTypes, createReferralCreators } from "store/create-referral/reducer";
import CasePdfViewerModal from "../CreateReferral/Modals/CasePdfViewerModal";
import OffcanvasCasePdfViewer from "./OffcanvasCasePdfViewer";


const EcommerceProductDetail = props => {

  const dispatch = useDispatch();
  var appState = JSON.parse(localStorage.getItem('applicationState'));
  const token = appState && appState.appReducer && appState.appReducer && appState.appReducer.token;
  useEffect(() => {
    setClient(token);
    debugger;
    dispatch(caseCreators.requestCaseDetails(caseID))
    dispatch(caseCreators.requestGetMessage(caseID))
  }, [])
  const history = useHistory();
  const location = useLocation();

  const [showRS, setShowRS] = useState(false);
  const [showRheuScreen, setShowRheuScreen] = useState(false);
  const [offCanvasCustomActiveTab, setOffCanvasCustomActiveTab] = useState("1");
  const [isCaseEditable, setIsCaseEditable] = useState("true");

  const caseval = location && location.state && location.state.caseID;
  const durationval = location && location.state && location.state.duration;
  const decisionval = location && location.state && location.state.decision;
  const statusval = location && location.state && location.state.status;
  const searchval = location && location.state && location.state.search;
  const pageval = location && location.state && location.state.page;
  const orderTypeval = location && location.state && location.state.ordertype;
  const orderColumnval = location && location.state && location.state.ordercolumn;
  const assignedval = location && location.state && location.state.assignedval;
  const caseID = caseval ? caseval : 1602100003;

  // caseID for images:1602100003 ,1302100071
  //console.log("location state referral detail",location.state);


  const {
    match: { params },
  } = props


  const { caseDetail, messages, updateloading, userID, appReducer, userDetails, loading, reauScreens, backtrack, caseAudits, caseLoading, failAudits, fromNotifs } = useSelector(state => ({
    caseDetail: state.caseDetails.caseDetails,
    messages: state.caseDetails.messages,
    updateloading: state.caseDetails.updateloading,
    userID: state.appReducer.userDetails._id,
    appReducer: state.appReducer,
    userDetails: state.appReducer.userDetails,
    loading: state.appReducer.loading,
    reauScreens: state.CreateReferral.reauScreens,
    backtrack: state.appReducer.backtrack,
    caseAudits: state.caseDetails.caseDetails.caseAudits,
    caseLoading: state.caseDetails.loading,
    failAudits: state.Dashboard.auditFails,
    fromNotifs: state.appReducer.fromNotifs

  }))
  if (loading) return;
  const appRole = userDetails && userDetails.appRole;

  const fName = caseDetail && caseDetail.case && caseDetail.case.parent && caseDetail.case.parent.firstName;
  const lNmae = caseDetail && caseDetail.case && caseDetail.case.parent && caseDetail.case.parent.lastName
  const parentEmail = caseDetail && caseDetail.case && caseDetail.case.parent && caseDetail.case.parent.emailAddress
  const parentContactNumber = caseDetail && caseDetail.case && caseDetail.case.parent && caseDetail.case.parent.contactNumber
  const Case = caseDetail && caseDetail.case;
  let imgUrl = caseDetail && caseDetail.images;


  let createdName = Case && Case.createdBy && Case.createdBy.firstName
  let createdLname = Case && Case.createdBy && Case.createdBy.lastName
  let createdHospital = Case && Case.createdBy && Case.createdBy.hospital
  let createdPnum = Case && Case.createdBy && Case.createdBy.phoneNumber

  const [modalvisible, setModal] = useState(false);
  const [modalvisiblePDF, setModalVisiblePDF] = useState(false);
  const [activeTab, setActiveTab] = useState(fromNotifs ? "3" : "1")

  useEffect(() => {
    if (Case?.referralAccepted) {
      setShowRS(true)
    }

  }, [Case])

  useEffect(() => {
    if (location && location.state && location.state.query === "true") {
      toggleTab("6")
    }
  }, [location])


  // useEffect(()=>{
  //   dispatch(caseCreators.requestCaseDetails(caseID))
  //   dispatch(caseCreators.requestGetMessage(caseID))
  //   //dispatch(caseCreators.getAudit(caseID))
  // },[])

  useEffect(() => {
    const Case = caseDetail && caseDetail.case;
    if (Case?.specialitySelected == "Rheumatology") dispatch(createReferralCreators.getReauScreens())
  }, [caseDetail])

  useEffect(() => {
    dispatch(caseCreators.requestCaseDetails(caseID))
  }, [updateloading])


  useEffect(() => {
    const caseEditable = location && location.state && location.state.caseEditable;
    if (caseEditable) setIsCaseEditable(caseEditable)
  }, [location])





  function toggleTab(tab) {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  function checkErrors(id) {

    if (failAudits != []) {
      let failureList = failAudits?.map((i, ind) => (i?.caseData?.caseID))
      if (userDetails.accountType == "REVIEWER") {
        if (failureList.includes(id)) {
          return (<i style={{ color: "red", fontSize: 16 }} className="bx bxs-error" />)
        }
        else { null }
      }
      else { null }
    }
  }


  const orderedTriage = () => {
    let order = [{}, {}, {}]
    caseDetail.allTriage?.map(item => {
      if (item.code == "IMMEDIATE") order[0] = item
      if (item.code == "URGENT") order[1] = item
      //if(item.code == "ROUTINE")  order[2] = item
      if (item.code == "LOCAL") order[2] = item
    })
    return order
  }
  return (
    <React.Fragment>
      {/* <script src="http://localhost:8097"></script> */}
      <div className="page-content">
        <MetaTags>
          <title>Referral Detail | TriVice - Triage, Referral & Advice</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Home" breadcrumbItem="Referral Detail" />

          <div className="checkout-tabs">
            <Row>
              <Col lg="2" sm="3">
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
                      <div style={{ display: 'flex', alignItems: 'center', }}>
                        <i className="bx bx-file" style={{ display: 'inline-block', fontSize: '22px', marginRight: '10px' }} />
                        <p className="mt-3">Response</p>
                      </div>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "7",
                      })}
                      onClick={() => {
                        toggleTab("7")
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', }}>
                        <i className="bx bx bx-camera" style={{ display: 'inline-block', fontSize: '22px', marginRight: '10px' }} />
                        <p className="mt-3">Images</p>
                      </div>
                    </NavLink>
                  </NavItem>
                  {Case?.specialitySelected == "Ophthalmology" && (
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === "8",
                        })}
                        onClick={() => {
                          toggleTab("8")
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', }}>
                          <i className="mdi mdi-glasses" style={{ display: 'inline-block', fontSize: '22px', marginRight: '10px' }} />
                          <p className="mt-3">Visual Acuity</p>
                        </div>
                      </NavLink>
                    </NavItem>
                  )}

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "2",
                      })}
                      onClick={() => {
                        toggleTab("2")
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="bx bx-user-pin" style={{ display: 'inline-block', fontSize: '22px', marginRight: '10px' }} />
                        <p className="mt-3">Contacts</p>
                      </div>
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="bx bx-user-voice" style={{ display: 'inline-block', fontSize: '22px', marginRight: '10px' }} />
                        <p className="mt-3">History        </p>
                        {checkErrors(caseDetail?.case?.caseID)}

                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "4",
                      })}
                      onClick={() => {
                        toggleTab("4")
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', }}>
                        <i className="bx bx-task" style={{ display: 'inline-block', fontSize: '22px', marginRight: '10px' }} />
                        <p className="mt-3">{userDetails?.accountType == "REFERRING" ? 'Summary' : 'Action'}</p>
                      </div>
                    </NavLink>
                  </NavItem>
                  {/* {((Case?.specialitySelected == "Ophthalmology" && showRS && appRole == "BCH_CLINICIAN"))&& (
                  <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "9",
                    })}
                    onClick={() => {
                      toggleTab("9")
                    }}
                  >
                    <div style={{display:'flex',alignItems:'center',}}>
                    <i className="mdi mdi-stamper" style={{display:'inline-block',fontSize:'22px',marginRight:'10px'}}/>
                    <p className="mt-3">Rubber Stamp</p>
                    </div>
                  </NavLink>
                </NavItem>
                  )} */}
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "5",
                      })}
                      onClick={() => {
                        toggleTab("5")
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', }}>
                        <i className="bx bx bx-book" style={{ display: 'inline-block', fontSize: '22px', marginRight: '10px' }} />
                        <p className="mt-3">Leaflets</p>
                      </div>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "6",
                      })}
                      onClick={() => {
                        toggleTab("6")
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', }}>
                        <i className="bx bx-comment-add" style={{ display: 'inline-block', fontSize: '22px', marginRight: '10px' }} />
                        <p className="mt-3">Query</p>
                      </div>
                    </NavLink>
                  </NavItem>
                </Nav>
                <p
                  // innerRef={nextButton}
                  onClick={(e) => {
                    history.push({
                      pathname: ('/' + backtrack),
                      state: {
                        search: searchval,
                        status: statusval,
                        decision: decisionval,
                        duration: durationval,
                        page: pageval,
                        ordertype: orderTypeval,
                        ordercolumn: orderColumnval,
                        assignedval: assignedval,
                        DirectedFrom: "referralDetail"
                      }
                    })
                  }}
                  className="btn text-muted d-none d-sm-inline-block btn-link"
                >
                  <p><i className="mdi mdi-arrow-left me-1" /> Back {" "}</p>
                </p>
              </Col>
              <Col lg="10" sm="9">
                <Card color="primary" className="text-white-50">
                  <CardBody>
                    <CdBasicInfo Case={Case} appRole={appRole} />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <PathwayResponse Case={Case} openCaseCanvas={() => setShowRheuScreen(true)} setOffCanvasCustomActiveTab={setOffCanvasCustomActiveTab} />
                      </TabPane>
                      <TabPane
                        tabId="2"
                        id="v-pills-payment"
                        role="tabpanel"
                        aria-labelledby="v-pills-payment-tab"
                      >
                        <ContactsAndGDPR Case={Case} />
                      </TabPane>
                      <TabPane
                        tabId="3"
                        id="v-pills-payment"
                        role="tabpanel"
                        aria-labelledby="v-pills-payment-tab"
                      >
                        <Referrer Messages={messages} Case={Case} userDetails={userDetails} referringOrg={caseDetail?.practise?.name || "Not Available"} caseAudits={caseAudits} loading={caseLoading} />
                      </TabPane>
                      <TabPane
                        tabId="4"
                      >
                        <Action Case={Case} appRole={appRole} Dropitems={orderedTriage()} setShowRS={setShowRS} snippet={caseDetail?.snippet} />
                      </TabPane>
                      <TabPane tabId="5">
                        <Leaflets leaflets={Case?.sentLeaflets} Case={Case} />
                      </TabPane>
                      <TabPane tabId="6">
                        <Query caseID={caseID} userID={userID} />
                      </TabPane>
                      <TabPane tabId="7">
                        <Images rheuImages={Case?.specialitySelected == "Rheumatology" ? caseDetail?.rheuImages : {}} images={(Case?.specialitySelected == "Plastic Surgery" || Case?.specialitySelected == "Rheumatology") ? caseDetail?.images : caseDetail?.ophthalmologyImages} speciality={Case?.specialitySelected} />
                      </TabPane>
                      {Case?.specialitySelected == "Ophthalmology" && (
                        <TabPane tabId="8">
                          <VisualAcuity visualReport={Case?.visualReport} />
                        </TabPane>
                      )}
                      {/* {((Case?.specialitySelected == "Ophthalmology" && showRS && appRole == "BCH_CLINICIAN"))&& (
                      <TabPane tabId="9">
                        <RubberStamp />
                      </TabPane>
                      )} */}
                    </TabContent>
                  </CardBody>

                </Card>
                {userDetails?.accountType == "REFERRING" && Case?.triageID?.code != "UNKNOWN" && activeTab == "4" ?
                  (<div style={{ marginRight: '1vw', display: 'inline' }}>
                    <Button className="btn btn-secondary float-end"
                      onClick={() => {
                        dispatch(createReferralCreators.requestCasePDFDetails(Case.caseID))
                        setModalVisiblePDF(true)
                      }}>Download pdf</Button>
                  </div>) : ''
                }
              </Col>
            </Row>
          </div>

          {Case?.specialitySelected == "Rheumatology" && Case?.pathway == "Paediatric Inflammatory Multisystem Syndrome" && (
            <OffCanvasRheuScreens showRheuScreen={showRheuScreen} toggleRheuScreen={() => setShowRheuScreen(false)} offCanvasCustomActiveTab={offCanvasCustomActiveTab} setOffCanvasCustomActiveTab={setOffCanvasCustomActiveTab} caseDetail={caseDetail && caseDetail} setActiveTab={setActiveTab} />
          )}
          <OffcanvasCasePdfViewer showModal={modalvisiblePDF} modalClose={() => setModalVisiblePDF(false)} openFeedbackModal={() => setModal(true)} />
        </Container>
      </div>

    </React.Fragment>
  )
}

EcommerceProductDetail.propTypes = {
  product: PropTypes.object,
  match: PropTypes.any,
  onGetProductDetail: PropTypes.func,
}

export default EcommerceProductDetail
