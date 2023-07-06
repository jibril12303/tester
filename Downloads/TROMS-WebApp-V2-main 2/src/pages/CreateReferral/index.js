import React, {useEffect, useState, useRef} from "react"
import PropTypes from "prop-types"
import {withTranslation} from "react-i18next"
import MetaTags from 'react-meta-tags';
import {appCreators} from "store/app/appReducer";
import {
    Container,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Card,
    CardBody,
    Button,
    Modal
} from "reactstrap"
import logoLightPng from "../../assets/images/triViceHeaderlogo.svg";
import profileupdateValidator from "hooks/profileupdateValidator"

//incomplete modal prop
import IncompleCaseModal from "components/Common/IncompletecaseModal";

// Rating Plugin
import RatingTooltip from "react-rating-tooltip"

import Select from "react-select"
import {Link, withRouter} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {useHistory} from "react-router-dom";
import classnames from "classnames"
import {ReactComponent as CloseIcon} from 'assets/icon/modalclose.svg';
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {createReferralTypes, createReferralCreators} from "store/create-referral/reducer";
import {bchDashboardTypes, bchDashboardCreators} from "store/dashboard/reducer"
//toast
import {showToast} from 'utils/toastnotify'

import {setClient} from "utils/apiUtils";
//Components
import SpecialityPicker from "./SpecialityPicker";
import PatientDetails from "./PatientDetails";
import PathwaySelector from "./PathwaySelector";
import Response from "./Response";
import Summary from "./Summary";
import ImageUpload from "./ImageUpload";
import {setIn} from "immutable";
import Endpoint from "./Endpoint";
import Slider from "react-slick";
import ClipLoader from 'react-spinners/ClipLoader'
// availity-reactstrap-validation
import {AvForm, AvField, AvRadioGroup, AvRadio} from "availity-reactstrap-validation"
import {propTypes} from "react-spinkit";
import InfoBar from "./InfoBar";

import CasePdfViewerModal from "./Modals/CasePdfViewerModal";
import apiConstants from "api/apiConstants";
import { saveContactedData } from "store/create-referral/saga";

const optionGroup = [
    {
        label: "Birmingham Women's and Childrens Hospital",
        options: [
            {label: "Plastic Surgery", value: "Plastic Surgery", flag: "RQ3160"},
            {label: "Ophthalmology", value: "Ophthalmology", flag: "RQ3130"},
            // { label: "Relish", value: "Relish" },
        ],
    },
    {
        label: "Salisbury Distrct Hospital",
        options: [
            {label: "Ophthalmology", value: "Ophthalmology", flag: "RNZ130"},
        ],
    },
]

const CreateReferral = props => {
    const dispatch = useDispatch()
    let history = useHistory();
    var appState = JSON.parse(localStorage.getItem('applicationState'));
    var isDesktopApp = localStorage.getItem('isDesktopApp')
    const appReducer = appState && appState.appReducer && appState.appReducer;
    const token = appReducer.token
    const [activeTab, setActiveTab] = useState("1");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedPathway, setSelectedPathway] = useState();
    const [pathway, setPathway] = useState([]);
    const [patientInfo, setPatientInfo] = useState();
    const [parentInfo, setParentInfo] = useState();
    const [patientDetailsSubmit, setPatientDetailsSubmit] = useState(false);
    const [responseNextButton, setResponseNextButton] = useState(false);
    const [endpointSaveClose, setEndpointSaveClose] = useState(false);
    const [sectionNames, setSectionNames] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalvisible, setModal] = useState(false);
    const [modalvisiblePDF, setModalVisiblePDF] = useState(false);
    const [def, setdef] = useState("");
    const [submitbtn, setSubmitbtn] = useState(false);
    const [slideIndex, setSlideIndex] = useState('');
    const [print, setPrint] = useState(false) // for on leaflet selected and no email is there
    const [incompleCaseAlert, setIncompleCaseAlert] = useState(false);
    const [savenexitAlert, setsavenexitAlert] = useState(false);
    const [saveButton, setSavebutton] = useState(false);
    const [preLoader, setPreLoader] = useState(false);
    const [org, setOrg] = useState(null);
    const [modal, setmodal] = useState(false); // for org select
    const nextButton = useRef();
    const textArea = useRef();

    useEffect(() => {
        const handleEsc = (event) => {
            console.log("REF", textArea, document.activeElement)
            if (event.code === "Enter" && textArea.current !== document.activeElement) {
                event.preventDefault();
                nextButton.current.click()
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    // useEffect(()=>{
    //   if(preLoader){
    //     document.getElementById("preloader").style.display = "block"
    //     document.getElementById("status").style.display = "block"
    //   } else{
    //     document.getElementById("preloader").style.display = "none"
    //     document.getElementById("status").style.display = "none"
    //   }
    // },[preLoader])

    const {tabIndex, userDetails, pathways, questionsFinished, questionAnswers, caseDetails, outcome, euuid, chosenPathway, speciality, leaflets, incompleteCase, endpoint, feedbackqna, questions, refcaseAmounts, organisations, selectedOrg, reauScreensIndex, lifeThreatening, contacted} = useSelector(state => ({
        tabIndex: state.CreateReferral.tabIndex,
        pathways: state.CreateReferral.pathways,
        questionsFinished: state.CreateReferral.questionsFinished,
        questionAnswers: state.CreateReferral.questionAnswers,
        caseDetails: state.CreateReferral.caseDetails,
        outcome: state.CreateReferral.decision,
        euuid: state.CreateReferral.euuid,
        chosenPathway: state.CreateReferral.selectedPathway,
        speciality: state.CreateReferral.speciality,
        leaflets: state.CreateReferral.leaflets,
        incompleteCase: state.CreateReferral.incompleteCase,
        endpoint: state.CreateReferral?.endpoint?.result || state.CreateReferral?.endpoint,
        feedbackqna: state.CreateReferral?.feedbackqna?.feedback,
        userDetails: state.appReducer.userDetails,
        questions: state.CreateReferral.questions,
        refcaseAmounts: state.Dashboard.refcaseAmounts,
        organisations: state.appReducer.userDetails.organisation,
        selectedOrg: state.Dashboard.orgID,
        reauScreensIndex: state.CreateReferral.reauScreensIndex,
        lifeThreatening: state.CreateReferral?.lifeThreatening,
        contacted: state.CreateReferral.contacted
    }))

    const orgOption = organisations && organisations.map((item) => {
        return {label: item.name, value: item.name, orgID: item._id}
    })
    const profileupdatevalidator = profileupdateValidator()
    useEffect(() => {
        //page load reset appstate
        dispatch(createReferralCreators.getReauScreens())

        setClient(token);
        if (!incompleteCase) {
            dispatch(createReferralCreators.resetState())
            setClient(token);
            dispatch(createReferralCreators.getSubscriptions())
        }


        if (userDetails?.consultantCode == null || userDetails?.firstName == null || userDetails?.lastName == null
            || userDetails?.email == null || userDetails?.phoneNumber == null || userDetails?.grade == null
            || userDetails?.speciality == null || userDetails?.speciality == false || userDetails?.organisation?.length == 0) {
            return dispatch(appCreators.setIncompleteProfileModalOpen())
        }

        if (selectedOrg != null) {
            setOrg(organisations && organisations.map((item) => {
                if (item._id == selectedOrg)
                    return {label: item.name, value: item.name, orgID: item._id}
            }))
        }
        if (org == null && selectedOrg == null && organisations.legnth > 1) return setmodal(true)
        if (selectedOrg) dispatch(bchDashboardCreators.requestRefDashboardInfo(selectedOrg))
    }, [])

    useEffect(() => {
        if (incompleteCase) return setPreLoader(true)
        if (!incompleteCase) return setPreLoader(false)
    }, [incompleteCase])
    console.log("feedbackqna=", feedbackqna)
    console.log(tabIndex)
    console.log("OUTCOME:", outcome)

    async function handleBackButton() {
        switch (tabIndex) {
            case "2":
                return dispatch(createReferralCreators.setTabIndex("1"))
            case "3":
                break;
            case "4":
                if (questionAnswers.length == 0) {
                    return dispatch(createReferralCreators.setTabIndex("3"))
                } else {
                    return dispatch(createReferralCreators.setEditQuestionIndex(questionAnswers.length - 1))
                }
            case "5":
                return setShowModal(true)

            default:
                break;
        }
    }

    async function handleNext() {
        console.log(activeTab)
        debugger;
        switch (tabIndex) {
            case "1":
                setClient(token)
                console.log("TOKENL", token)
                try {
                    return dispatch(createReferralCreators.getAvailablePathways(selectedGroup))
                    //return toggleTab("2")
                } catch (error) {
                    console.log(error)
                }
                break;
            case "2":
                try {
                    return setPatientDetailsSubmit(true);
                    //return toggleTab("3")
                } catch (error) {
                    console.log(error)
                }
            case "3":
                setPatientDetailsSubmit(false)
                try {
                    setClient(token)
                    console.log(selectedPathway)
                    return dispatch(createReferralCreators.getInjuryQuestions(selectedPathway))
                } catch (error) {
                    console.log("ERROR IN PATH GET:", error)
                }
            case "4":
                try {
                    return setResponseNextButton(true)

                } catch (error) {
                    console.log(error)
                    debugger;
                }
            case "5":
                try {
                    setClient(token)
                    return dispatch(createReferralCreators.submitInjurySummary(caseDetails.caseID, questionAnswers, euuid, outcome, chosenPathway, speciality, questions, (endpoint?.title != undefined) ? false : true))
                } catch (error) {
                    console.log(error)
                }
            // case "6":
            //   return setImageUploadNext(true);
            //   // await new Promise(r=>setTimeout(r,250))
            //   // return toggleTab("7")
            case "7":
                return setEndpointSaveClose(true)
            default:
                break;
        }
    }

    function toggleTab(tab) {
        if (activeTab !== tab) {
            setActiveTab(tab)
        }
    }

    //console.log("feedbackquestions",feedbackquestions)
    function renderQuestions(feedbackquestions) {
        return (
            <div>
                {
                    feedbackquestions && feedbackquestions.map((item, key) => {

                        let ansval = item && item.answers;
                        let answers = null;
                        if (item.type == "radio") {
                            return (
                                <div className="mb-3" key={key}>
                                    <label className="font-size-16">{item.question} <span
                                        className="text-danger">*</span></label>
                                    <AvRadioGroup name={item.question} required errorMessage="Pick one!">
                                        {Object.keys(item.answers).map((ans, index) => {
                                            return (
                                                <div style={{display: 'inline-block', padding: "5px"}} key={index}>
                                                    <AvRadio label={ans} value={item.answers[ans].score.toString()}
                                                             key={index}/>
                                                </div>
                                            )
                                        })}
                                    </AvRadioGroup>
                                </div>

                            )
                        }

                        if (item.type == "textarea") {
                            return (
                                <div className="mb-3" key={key}>
                                    <label className="font-size-16">{item.question} <span
                                        className="text-danger">*</span></label>
                                    <AvField
                                        className="form-control"
                                        id={item.question}
                                        name={item.question}
                                        type="textarea"
                                        required
                                    />
                                </div>
                            )
                        }
                    })
                }
            </div>
        )
    }

    const styleConfig = {
        counterStyle: {
            height: "40px",
            backgroundColor: "#F58220",
            paddingLeft: "12px",
            paddingRight: "12px",
            color: "#FFF",
            lineHeight: "28px"
        },
        starContainer: {
            fontSize: "40px",
            backgroundColor: "#F2F2F2",
            height: "40px"
        },
        statusStyle: {
            height: "40px",
            backgroundColor: "#F58220",
            paddingLeft: "12px",
            paddingRight: "12px",
            color: "#FFF",
            lineHeight: "40px",
            minWidth: "100px",
            fontSize: "18px",
            textAlign: "center"
        },
        tooltipStyle: {
            fontSize: "40px",
            padding: "3px"
        }
    }

    const handleresetSubmit = (e, v) => {
        console.log("v= ", v)
        dispatch(createReferralCreators.resetState());
        setModal(false)
        history.push("/dashboard")
        showToast('Thank you very much for your feedback', 'success')
    }

    const settings = {
        arrows: false,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };


    let slider = null;

    const next = () => {
        slider.slickNext();

    }

    useEffect(() => {
        setPathway(pathways)
        console.log("PATHWAY:", pathway)
    }, [pathways])

    useEffect(() => {
        setResponseNextButton(false)
    }, [responseNextButton])

    console.log("pathways:", pathways)
    let handleSelectGroup = selectedGroup => {
        setSelectedGroup(selectedGroup)
    }
    let handleInfoForm = (patientInfo, parentInfo) => {
        console.log("CALLED")
        setPatientInfo(patientInfo)
        setParentInfo(parentInfo)
    }

    let handlePathwaySelect = pathway => {
        setSelectedPathway(pathway)
        console.log(pathway)
    }

    let responseSubmit = () => {
        toggleTab("5")
    }

    console.log(selectedGroup)
    return (
        <>
        <React.Fragment>
            <div style={isDesktopApp == 'true' ? {border: '5px solid black', position: 'sticky'} : {}}>
                <script src="http://localhost:8097"></script>
                <div className="page-content">
                    <MetaTags>
                        <title>Create Referral | TriVice - Triage, Referral & Advice</title>
                    </MetaTags>
                    <Container fluid>
                        <div>

                        </div>
                        {/* Render Breadcrumb */}
                        <Breadcrumbs title="Home" breadcrumbItem="Create Referral"/>
                        <div className="checkout-tabs">
                            <Row>
                                <Col lg="2" sm="3">
                                    <Nav className="flex-column" pills>
                                        <NavItem>
                                            <NavLink
                                                disabled={tabIndex !== "1"}
                                                className={classnames({
                                                    active: tabIndex === "1",
                                                })}
                                                onClick={() => {
                                                    toggleTab("1")
                                                }}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center',}}>
                                                    <i className="bx bx-clinic" style={{
                                                        display: 'inline-block',
                                                        fontSize: '22px',
                                                        marginRight: '10px'
                                                    }}/>
                                                    <p className="mt-3">Speciality</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                disabled={tabIndex !== "2"}
                                                className={classnames({
                                                    active: tabIndex === "2",
                                                })}
                                                onClick={() => {
                                                    toggleTab("2")
                                                }}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <i className="bx bx-user" style={{
                                                        display: 'inline-block',
                                                        fontSize: '22px',
                                                        marginRight: '10px'
                                                    }}/>
                                                    <p className="mt-3">Patient Info</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                disabled={tabIndex !== "3"}
                                                className={classnames({
                                                    active: tabIndex === "3",
                                                })}
                                                onClick={() => {
                                                    toggleTab("3")
                                                }}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <i className="bx bx-select-multiple" style={{
                                                        display: 'inline-block',
                                                        fontSize: '22px',
                                                        marginRight: '10px'
                                                    }}/>
                                                    <p className="mt-3">Pathway</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                disabled={tabIndex !== "4"}
                                                className={classnames({
                                                    active: tabIndex === "4",
                                                })}
                                                onClick={() => {
                                                    toggleTab("4")
                                                }}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center',}}>
                                                    <i className="bx bx-question-mark" style={{
                                                        display: 'inline-block',
                                                        fontSize: '22px',
                                                        marginRight: '10px'
                                                    }}/>
                                                    <p className="mt-3">Response</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                disabled={tabIndex !== "5"}
                                                className={classnames({
                                                    active: tabIndex === "5",
                                                })}
                                                onClick={() => {
                                                    toggleTab("5")
                                                }}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center',}}>
                                                    <i className="bx bx bx-file" style={{
                                                        display: 'inline-block',
                                                        fontSize: '22px',
                                                        marginRight: '10px'
                                                    }}/>
                                                    <p className="mt-3">Summary</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        {/* <NavItem>
                      <NavLink
                        disabled={tabIndex !== "6"}
                        className={classnames({
                          active: tabIndex === "6",
                        })}
                        onClick={() => {
                          toggleTab("6")
                        }}
                      >
  
                        <div style={{display:'flex',alignItems:'center',}}>
                        <i className="bx bx-camera" style={{display:'inline-block',fontSize:'22px',marginRight:'10px'}}/>
                        <p className="mt-3">Images</p>
                        </div>
                      </NavLink>
                    </NavItem> */}
                                        <NavItem>
                                            <NavLink
                                                disabled={tabIndex !== "7"}
                                                className={classnames({
                                                    active: tabIndex === "7",
                                                })}
                                                onClick={() => {
                                                    toggleTab("7")
                                                }}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center',}}>
                                                    <i className="bx bx-directions" style={{
                                                        display: 'inline-block',
                                                        fontSize: '22px',
                                                        marginRight: '10px'
                                                    }}/>
                                                    <p className="mt-3">Outcome</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                                <Col lg="10" sm="9">
                                    {tabIndex != "1" && tabIndex != "2" && (
                                        <Card color="primary" className="text-white-50">
                                            <CardBody>
                                                <InfoBar Case={caseDetails} priority={outcome}/>
                                            </CardBody>
                                        </Card>
                                    )}
                                    <Card>
                                        <CardBody>

                                            <TabContent activeTab={incompleteCase ? "loading" : tabIndex}>
                                                {/* {tabComponents.map((item, index)=>{
                       const Component = item.component;
                       return(
                        <TabPane {...item.tabpanProps} key={index} >
                          <Component {...item.props} />
                        </TabPane>
                       )
                     })} */}

                                                <TabPane tabId="1">
                                                    <SpecialityPicker value={selectedGroup} onChange={handleSelectGroup}
                                                                      options={optionGroup}/>
                                                </TabPane>
                                                <TabPane
                                                    tabId="2"
                                                    id="v-pills-payment"
                                                    role="tabpanel"
                                                    aria-labelledby="v-pills-payment-tab"
                                                >
                                                    <PatientDetails onSubmit={handleInfoForm}
                                                                    shouldSubmit={patientDetailsSubmit}
                                                                    setPatientDetailsSubmit={setPatientDetailsSubmit}/>
                                                </TabPane>
                                                <TabPane
                                                    tabId="3"
                                                    id="v-pills-payment"
                                                    role="tabpanel"
                                                    aria-labelledby="v-pills-payment-tab"
                                                >
                                                    <PathwaySelector pathway={pathway} onClick={handlePathwaySelect}/>
                                                </TabPane>
                                                <TabPane
                                                    tabId="4"
                                                >
                                                    <Response disabled={tabIndex != "4"} ref={textArea}
                                                              nextButtonCalled={responseNextButton}
                                                              onSubmit={responseSubmit}
                                                              setNextButton={setResponseNextButton} save={saveButton}
                                                              setSave={setSavebutton}/>
                                                </TabPane>
                                                <TabPane tabId="5">
                                                    <Summary disabled={tabIndex != "5"}/>
                                                </TabPane>
                                                {/* <TabPane tabId="6">
                          <ImageUpload disabled={tabIndex != "6"} nextButtonClicked={imageUploadNext} setImageUploadNext={setImageUploadNext}/>
                        </TabPane> */}
                                                <TabPane tabId="7">
                                                    <Endpoint disabled={tabIndex != "7"}
                                                              nextButtonClicked={endpointSaveClose}
                                                              setEndpointSaveClose={setEndpointSaveClose}
                                                              setModal={setModal} setPrint={setPrint}
                                                              openPdfModal={()=>setModalVisiblePDF(true)}
                                                              setSectionNames={setSectionNames}/>
                                                </TabPane>
                                                <TabPane tabId="loading">
                                                    <div style={{height: '50vh'}}>
                                                        <h4>Fetching Case</h4>
                                                        <h5>If the case contains large files this could take a
                                                            while</h5>
                                                        <div id="preloader" style={{
                                                            display: preLoader ? "block" : "block",
                                                            position: 'relative',
                                                            marginTop: '5vh'
                                                        }}>
                                                            <div id="status"
                                                                 style={{display: preLoader ? "block" : "block"}}>
                                                                <div className="spinner-chase">
                                                                    <div className="chase-dot"></div>
                                                                    <div className="chase-dot"></div>
                                                                    <div className="chase-dot"></div>
                                                                    <div className="chase-dot"></div>
                                                                    <div className="chase-dot"></div>
                                                                    <div className="chase-dot"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                    <Row className="mt-4">
                                        <Col sm="6">
                                            <p
                                                hidden={tabIndex == "1" || tabIndex == "3" || tabIndex == "5" || tabIndex == "6" || tabIndex == "7"}
                                                onClick={(e) => {
                                                    if (!e.currentTarget.hidden) handleBackButton()
                                                    //dispatch(createReferralCreators.setTabIndex((parseInt(tabIndex) - 1).toString()))
                                                    //toggleTab((parseInt(activeTab) - 1).toString())
                                                }}
                                                className="btn text-muted d-none d-sm-inline-block btn-link"
                                            >
                                                {tabIndex == "1" || tabIndex == "3" || tabIndex == "5" || tabIndex == "6" || tabIndex == "7" ? null :
                                                    <p><i className="mdi mdi-arrow-left me-1"/> Back{" "}</p>}
                                            </p>
                                        </Col>
                                        <Col sm="6">
                                            <div className="mb-3 text-end">

                                                {((tabIndex == "4" && questionAnswers?.length > 0) || (tabIndex == "7" && chosenPathway.name === "Extravasation" && outcome === "IMMEDIATE" ) ) && (
                                                    <div style={{marginRight: '1vw', display: 'inline'}}>
                                                        <Button
                                                            disabled={selectedGroup == null && tabIndex == "1"}
                                                            type="button"
                                                            onClick={(e) => {
                                                                if (tabIndex == "7") {
                                                                    if(chosenPathway?.name === "Extravasation" && outcome === "IMMEDIATE"){
                                                                        console.log(sectionNames.filter((item)=>item=='Section2').length,'batman')
                                                                        if (sectionNames.filter((item)=>item=='Section2').length != 0){
                                                                            
                                                                            //dispatch(createReferralCreators.saveContactData(caseDetails.caseID, true))
                                                                            
                                                                        }else{
                                                                            dispatch(createReferralCreators.saveContactData(caseDetails.caseID, false))
                                                                        }
                                                                        console.log(contacted, 'mikey')
                                                                        ;
                                                                        setsavenexitAlert(true)
                                                                    }
                                                                } else {
                                                                    setSavebutton(true)
                                                                }
                                                            }}
                                                            color="primary"
                                                        >
                                                            Save & Exit{" "}
                                                        </Button>
                                                    </div>
                                                )}

                                                {/*{userDetails?.accountType == "REFERRING"   && tabIndex == "7"?*/}
                                                {/*    (*/}
                                                {/*        <Button className="btn btn-secondary mx-2"*/}
                                                {/*                onClick={() => dispatch(createReferralCreators.requestCasePDF(caseDetails.caseID, lifeThreatening, endpoint?.Section1?.suggestedAction, endpoint?.Section1?.content, leaflets))}>Download</Button>*/}
                                                {/*    ) : ''*/}
                                                {/*}*/}

                                                <Button
                                                    disabled={selectedGroup == null && tabIndex == "1"}
                                                    type="button"
                                                    innerRef={nextButton}   
                                                    onClick={(e) => {
                                                        handleNext()
                                                    }}
                                                    className="btn btn-success"
                                                >
                                                    {tabIndex == "6" ? "Submit" : tabIndex == "7" ? outcome?.toLowerCase() == "unknown" ? "Close" : "Submit" : "Next"}{" "}
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Container>
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
                            <i className="fa fa-warning"></i> Alert
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div
                        className="modal-body">{"By clicking back this will take you to to the pathway select tab.\nIf you wish to edit a question please use the table."}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                                dispatch(createReferralCreators.setTabIndex("3"));
                                setShowModal(false)
                            }}
                        >
                            Take me back
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowModal(false)}
                        >
                            Keep me here
                        </button>
                    </div>
                </Modal>
                <Modal
                    isOpen={modal}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i className="fa fa-warning"></i> Select your organisation
                        </h5>
                    </div>
                    <div className="modal-body">
                        <Col>
                            <div>
                                {orgOption && orgOption.map((item, key) => {
                                    console.log("org option", item)
                                    return (
                                        <div key={key + "radioORG"} className="mb-3 form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="orgOption"
                                                value={item.orgID}
                                                onClick={(e) => setOrg(e.currentTarget.value)}
                                            />
                                            <label>
                                                {item.label}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                            {/* <Select
                                value={org}
                                onChange={(e)=>{setOrg(e),console.log(e)}}
                                options={orgOption}
                                className="select2"
                                placeholder="Select your organisation you are referring from"
                                classNamePrefix="select2 select2-selection"
                            /> */}
                        </Col>

                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            disabled={org == null}
                            className="btn btn-success"
                            onClick={() => {
                                if (org != null) {
                                    dispatch(bchDashboardCreators.setUserOrganisation({orgID: org}));
                                    setmodal(false);
                                }
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </Modal>
                {/*casePdfmodal*/}
                <CasePdfViewerModal showModal={modalvisiblePDF} modalClose={()=>setModalVisiblePDF(false)} openFeedbackModal={()=>setModal(true)} />
                {/*swiper modal*/}
                {chosenPathway?.endpoint === "burns" ? (
                    <Modal
                        isOpen={modalvisible}
                        backdrop={'static'}
                        centered={true}
                        id="staticBackdrop"
                    >
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">
                                <i className="fa fa-warning"></i> Contact BWC on-call Registrar
                            </h5>
                        </div>
                        <div className="modal-body">
                            {"Please contact the on-call plastic surgery registrar through BWC switchboard on 0121 333 9999."}
                            <br/>
                            {"Note that you will still need to submit your referral through NORSe."}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    setModal(false)
                                    dispatch(createReferralCreators.resetState());
                                    history.push("/")
                                }}
                            >
                                Understood
                            </button>
                        </div>
                    </Modal>
                ) : (
                    <Modal
                        isOpen={modalvisible}
                        scrollable={true}
                        backdrop={'static'}
                        centered={true}
                        id="staticBackdrop"
                        size="lg"

                    >
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">
                                <i className="fa fa-warning"></i>
                                Feedback
                            </h5>
                            <button
                                type="button"
                                onClick={() => {
                                    setModal(false)
                                    dispatch(createReferralCreators.resetState());
                                    history.push("/")
                                }}
                                className="btn"
                                style={{
                                    float: 'right',
                                    cursor: 'pointer'
                                }}>
                                <div>
                                    <CloseIcon style={{color: 'black'}}/>
                                </div>
                            </button>
                        </div>
                        <div className="modal-body" style={{overflow: 'none', width: 'auto', height: '300px'}}>
                            <div style={{overflow: 'none', width: 'auto'}}>
                                <Slider
                                    {...settings}
                                    ref={c => (slider = c)}
                                    afterChange={(index) => {
                                        index == 1 ? setSubmitbtn(true) : setSubmitbtn(false);
                                        setSlideIndex(index)
                                    }}
                                    style={{overflow: 'none'}}
                                >
                                    <div key={1}>
                                        <div className="p-0 text-center">
                                            <div className="logo-lg mb-20">
                                                <img src={logoLightPng} alt="" height="60" style={{margin: 'auto'}}/>
                                            </div>
                                            <h2 className="font-16 mt-3">
                                                How would you rate TriVice?
                                            </h2>
                                            <RatingTooltip
                                                max={5}
                                                styleConfig={styleConfig}
                                                onChange={rate => {
                                                    setdef(rate)
                                                }}
                                                ActiveComponent={
                                                    <i
                                                        className="mdi mdi-star text-primary"

                                                    />
                                                }
                                                InActiveComponent={
                                                    <i
                                                        className="mdi mdi-star-outline text-muted"

                                                    />
                                                }
                                            />{" "}
                                            <div className="mt-4">
                                                <p className="font-size-18">Your opinion is very important to us.
                                                    We appreciate your feedback and will use it to make improvements.
                                                    This survey takes about 1 minute to complete.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div key={2}>
                                        {slideIndex == 1 && <AvForm className="form-horizontal mb-20" id="my-form"
                                                                    onValidSubmit={(e, v) => {
                                                                        handleresetSubmit(e, v)
                                                                    }}>
                                            <div style={{width: "80%", margin: 'auto'}}>
                                                {renderQuestions(feedbackqna)}
                                            </div>
                                        </AvForm>
                                        }


                                    </div>

                                </Slider>
                            </div>

                        </div>
                        <div className="modal-footer">
                            {
                                slideIndex != 1 &&
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        def == null && showToast('Please select a star rating', 'error')
                                        if (def) {
                                            setModal(false)
                                            dispatch(createReferralCreators.resetState());
                                            history.push("/")
                                            showToast('Thank you very much for your feedback', 'success')

                                        }
                                    }}
                                >
                                    Submit
                                </button>
                            }
                            {slideIndex == 0 &&
                            <button
                                type="button"
                                className="btn btn-success"
                                disabled={submitbtn}
                                onClick={() => {
                                    dispatch(createReferralCreators.requestFeedbackQna());
                                    next();
                                }}
                            >
                                Take survey
                            </button>
                            }
                            {
                                slideIndex == 1 &&
                                <button
                                    form="my-form"
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Submit
                                </button>
                            }

                        </div>
                    </Modal>
                )}

                
                {/*when email is not provided*/}
                {/* const [incompleCaseAlert,setIncompleCaseAlert] = useState(false) */}
                <Modal
                    isOpen={print}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i className="fa fa-warning"></i> Advice
                        </h5>
                        <button
                            type="button"
                            className="btn btn-danger btn-close"

                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body ">
                        <p>No email has been provided. Please give parent/carer a printed copy.</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setPrint(false);

                            }}
                        >
                            Understood
                        </button>
                    </div>
                </Modal>

                                {/* save and exit modal */}
                <Modal
                    isOpen={savenexitAlert != false}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i className="fa fa-warning"></i> Alert
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setsavenexitAlert(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        Note that you have not submitted the case. Non submitted cases will not be processed.
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>{
                                setsavenexitAlert(false)
                                history.push('/dashboard')
                                showToast("Case saved successfully","success")
                            }}
                        >
                            Understood
                        </button>
                    </div>
                </Modal>

                {/*when incomplete case is pending*/}
                <IncompleCaseModal modalopen={incompleCaseAlert} modalclose={setIncompleCaseAlert}/>
            </div>
        </React.Fragment>
        <script type="text/javascript">
        addressNow.load();
    </script>
    </>
        
    )
}


CreateReferral.propTypes = {
    t: PropTypes.any,
    pathways: PropTypes.any,
    questions: PropTypes.any,
    loading: PropTypes.bool,
    questionIndex: PropTypes.any,

}

export default withRouter(CreateReferral)



/*

chosenPathway.name === "Extravasation" && decision === "IMMEDIATE"

*/