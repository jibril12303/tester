import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardBody,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Media,
    Table,
    Label,
    UncontrolledTooltip,
    Badge
} from "reactstrap"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from "react-router-dom";
import Select from 'react-select'
import classNames from "classnames"
import { appCreators } from "store/app/appReducer"
import Scanner from "components/Barcodescanner/Scanner"
import moment from "moment"
import {caseCreators } from "store/caseDeatils/reducer"
import ReferralsDataTable from "./ReferralsDataTable"
import Tooltip from "components/Tooltip"
import _ from "lodash"
//incomplete modal prop
import IncompleCaseModal from "components/Common/IncompletecaseModal";

//modals
import OrthopticsCheckModal from "components/Common/OrthopticsCheckModal"

//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert"
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss';

//import Charts
import StackedColumnChart from "./StackedColumnChart"

//import action
import { getChartsData as onGetChartsData } from "../../store/actions"

import modalimage1 from "../../assets/images/product/img-7.png"
import modalimage2 from "../../assets/images/product/img-4.png"

import { createReferralTypes, createReferralCreators } from "store/create-referral/reducer";
import {myReferralCreators,myReferralTypes} from 'store/myReferrals/reducer'
// Pages Components
import WelcomeComp from "./WelcomeComp"
import ReferralTypePieChartBox from "./ReferralTypePieChartBox"
import ReviewerTypePieChartBox from "./ReviewerTypePieChartBox "
import PathwaysPieChartBox from "./PathwaysPieChartBox"
import PendingCasesBox from "./PendingCasesBox"
import SocialSource from "./SocialSource"
import ActivityComp from "./ActivityComp"
import TopCities from "./TopCities"

import profileupdateValidator from "hooks/profileupdateValidator"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

//redux
import { useSelector, useDispatch } from "react-redux"

import { bchDashboardTypes, bchDashboardCreators } from "store/dashboard/reducer"


import { setClient } from "utils/apiUtils"
import Revmodal from "components/Common/Revmodal"

const Dashboard = props => {


    const dispatch = useDispatch()
    let history = useHistory();
    const {caseAmounts,chartsData,refcaseAmounts, organisations, selectedOrg,feedbackqna,appReducer,userDetails, globalPathway,referralCases, referrerCheck, failCount, auditFails} = useSelector(state => ({
        caseAmounts:state.Dashboard.caseAmounts,
        chartsData:state.Dashboard.chartsData,
        refcaseAmounts:state.Dashboard.refcaseAmounts,
        organisations: state.appReducer.userDetails.organisation,
        selectedOrg: state.Dashboard.orgID,
        feedbackqna:state.CreateReferral.feedbackqna,
        appReducer:state.appReducer,
        userDetails:state.appReducer.userDetails,
        globalPathway: state.Dashboard.pathway,
        referralCases:state.Dashboard.referrals,
        referrerCheck:state.appReducer.accountType,
        failCount:state.Dashboard.auditFailsCount,
        auditFails:state.Dashboard.auditFails

    }))


    const appRole = userDetails && userDetails.appRole;
    const speciality = userDetails && userDetails.speciality
    let firstName = userDetails && userDetails.firstName ;
    let lastName = userDetails && userDetails.lastName;
    let profilename = {
        firstName:firstName,
        lastName:lastName
    };
    let token = appReducer.token;


    const [modal, setmodal] = useState(false)
    const [subscribemodal, setSubscribemodal] = useState(false)

    const [periodData, setPeriodData] = useState([])
    const [periodType, setPeriodType] = useState("WEEK")
    const [referral , setReferral] = useState(false)
    const [reviewer , setReviewer] = useState(false)
    const [basic, setbasic] = useState(false) // for on call popup visibility
    const [orthopticsModal, setOrthopticsModal] = useState(false) // for on orthoptics popup visibility
    const [gmcalert,setGmcalert] = useState(true)
    const [revmodal,setRevmodal] = useState(false)
    const [watching,setWatching] = useState(false)
    const [qrvalue,setQrValue] = useState('')
    const [delay,setDelay] = useState(100)
    const [pathway, setPathway] = useState(typeof globalPathway != 'undefined' ? globalPathway : 'ALL')
    const [dashboard, setDashboard] = useState('ME')
    const [incompleCaseAlert, setIncompleCaseAlert] = useState(false);

    const onFind = (value) => {

        setQrValue(value)
        setWatching(false)
    }

    const [org, setOrg] = useState(null) // Referrer setting current organisation
    console.log("SELCTE ORG",JSON.stringify(org))



    const handleError = (err)=>{
        console.error(err)
    }

    const casedata = [
        {
            date: "13/02/2022",
            patient: "Patient",
            priority: "I",
            color: ""
        },
        {
            date: "14/02/2022",
            patient: "Patient",
            priority: "I",
            color: ""
        },
        {
            date: "15/02/2022",
            patient: "Patient",
            priority: "I",
            color: ""
        }
    ]

    console.log("SELECTED ORG:", selectedOrg)
    const [swiperRef, setSwiperRef] = useState(null);


    const getDashboardReferrals = (selectedOrg,assignedRev)=>{

        if (selectedOrg != null){
            dispatch(bchDashboardCreators.requestDashboardReferrals(selectedOrg,assignedRev,pathway))
            dispatch(bchDashboardCreators.countAuditFails())
            dispatch(bchDashboardCreators.getAuditFails()),
            dispatch(appCreators.setFromNotifs(false))
            
        }
      }


    useEffect(() => {


        setClient(token);
        if (sessionStorage.getItem("shouldShowOnCallRegistrarModal") === "true" && appRole == 'BCH_CLINICIAN' && speciality == "Plastic Surgery") {
            console.log("session running");
            setbasic(true)
        }
        sessionStorage.removeItem("shouldShowOnCallRegistrarModal");

        if(sessionStorage.getItem("shouldShowOrthopticsRegistrarModal") === "true"){
            //show relative modal
            setOrthopticsModal(true);
            sessionStorage.removeItem("shouldShowOrthopticsRegistrarModal");
        }

        if(appRole == 'BCH_CLINICIAN'){
            dispatch(createReferralCreators.requestFeedbackQna())
            setReviewer(true)
            dispatch(bchDashboardCreators.requestBchDashboardInfo(48, "hour",pathway))
        }
        else if(appRole == 'REFERRING_CLINICIAN'){
            setReferral(true)
            if(organisations.length == 1){
                dispatch(bchDashboardCreators.setUserOrganisation({orgID:organisations[0]._id}));
                dispatch(bchDashboardCreators.requestRefDashboardInfo(organisations[0]._id))
                dispatch(bchDashboardCreators.requestChartData(periodType,organisations[0]._id))
                return;
            }
            if (selectedOrg != null){
                setOrg(organisations && organisations.map((item)=>{
                    if(item._id == selectedOrg)
                        return {label: item.name, value: item.name, orgID: item._id}
                }))
            }
            if(org == null && selectedOrg == null && organisations.legnth > 1) return setmodal(true)
            if(selectedOrg) dispatch(bchDashboardCreators.requestRefDashboardInfo(selectedOrg))
            if(selectedOrg && periodType) dispatch(bchDashboardCreators.requestChartData(periodType,selectedOrg))
        }
        if(userDetails?.consultantCode == null ||userDetails?.firstName == null || userDetails?.lastName == null
            ||userDetails?.email == null || userDetails?.phoneNumber == null || userDetails?.grade == null
            || userDetails?.speciality == null || userDetails?.speciality == false  ){
            dispatch(appCreators.setIncompleteProfileModalOpen())
        }

    },[])

    useEffect(()=>{
        debugger;
        if (sessionStorage.getItem("shouldShowIncompleteCaseModal") === "true" && appRole == 'REFERRING_CLINICIAN' &&  refcaseAmounts?.INCOMPLETE > 0) {
            console.log("session running");
            setIncompleCaseAlert(true)
            sessionStorage.removeItem("shouldShowIncompleteCaseModal");
        }
    },[refcaseAmounts,appRole])


    useEffect(()=>{
        dispatch(bchDashboardCreators.setPathway(pathway))
        if(appRole == 'BCH_CLINICIAN' && speciality == "Plastic Surgery"){
            dispatch(bchDashboardCreators.requestBchDashboardInfo(48, "hour",pathway))
            dispatch(myReferralCreators.requestFetchReferrals(1, 'ALL',"ALL",'ALL',null, '','','DATE_TIME','DESC', (userDetails?.accountType == "REVIEWER" && (userDetails?.speciality == "Ophthalmology" || userDetails?.speciality == "Optometry")) ? 'ME' : 'ALL',pathway == 'ALL' ? null : pathway))
        }
    },[pathway])

    useEffect(() => {
        setClient(token);
        if(appRole == 'REFERRING_CLINICIAN' && selectedOrg){
            dispatch(bchDashboardCreators.requestRefDashboardInfo(selectedOrg))
            dispatch(bchDashboardCreators.requestChartData(periodType,selectedOrg))
        }
    },[selectedOrg])

    const orgOption = organisations && organisations.map((item)=>{
        return {label: item.name, value: item.name, orgID: item._id}
    })

    useEffect(()=>{
        if(selectedOrg == null && appRole == 'REFERRING_CLINICIAN'&& organisations.length > 1) return setmodal(true)
        if(organisations.length  == 1){
            dispatch(bchDashboardCreators.setUserOrganisation({orgID:organisations[0]._id}));
            dispatch(bchDashboardCreators.requestRefDashboardInfo(organisations[0]._id))
            dispatch(bchDashboardCreators.requestChartData(periodType,organisations[0]._id))
        }
    if(selectedOrg && appRole == 'REFERRING_CLINICIAN') getDashboardReferrals(selectedOrg,"ME");
    if(selectedOrg && appRole !== 'REFERRING_CLINICIAN') getDashboardReferrals(selectedOrg,"ALL");
    },[selectedOrg])

    // useEffect(()=>{
    //     if (speciality == "Plastic Surgery" && userDetails?.accountType == "REVIEWER"){
    //         setPathway("ALL")
    //         dispatch(bchDashboardCreators.requestDashboardReferrals(null,"ALL","ALL"))
    //     }
    // },[])



    //caseAmounts is used for reviewerpage
    //chartdata and refcaseamount is used for referralpage
    const chartData = chartsData;
    const refcaseAmount = refcaseAmounts && refcaseAmounts;
    //console.log("chartData",chartData);

    let tempObj = caseAmounts && caseAmounts.PATHWAYS_WISE;
    let pathWayFilteredData = [];
    let columnname = [];
    for (var key in tempObj) {
        var value = tempObj[key];
        pathWayFilteredData.push(value);
        columnname.push(key);
    }


    const reports = [
        { title: "Under review", iconClass: "bx bxs-inbox", description: caseAmounts && caseAmounts.UNDER_REVIEW ,status:"UNDER_REVIEW",decision:"ALL",duration:"ALL" },
        { title: "Query", iconClass: "bx bxs-chat", description:caseAmounts && caseAmounts.QUERIES ,status:"QUERIES",decision:"ALL",duration:"ALL" },

    ]

    // const refreport = [
    //     { title: "Under review", iconClass: "bx bxs-inbox", description:chartsData.UNDER_REVIEW ? chartsData.UNDER_REVIEW : 0,status:"UNDER_REVIEW",decision:"ALL",duration:"ALL" },
    //     { title: "Query", iconClass: "bx bxs-chat", description:chartsData.QUERIES ? chartsData.QUERIES : 0,status:"QUERIES",decision:"ALL",duration:"ALL" },
    //     { title: "Incomplete", iconClass: "bx bx-edit", description:chartsData.INCOMPLETE ? chartsData.INCOMPLETE : 0, status:"INCOMPLETE",decision:"ALL",duration:"ALL" }

    // ]

    const refreport = [
        { title: "Under review", iconClass: "bx bxs-inbox", description:referralCases?.caseAmounts?.underReview ? referralCases?.caseAmounts?.underReview : 0,status:"UNDER_REVIEW",decision:"ALL",duration:"ALL",cases:referralCases?.caseAmounts?.underReview || [] },
        { title: "Declined referrals", iconClass: "bx bxs-message-x", description:referralCases?.caseAmounts?.declinedReferrals ? referralCases?.caseAmounts?.declinedReferrals : 0,status:"DECLINED",decision:"ALL",duration:"ALL",cases:referralCases?.caseAmounts?.declinedReferrals || [] },
        { title: "Incomplete", iconClass: "bx bx-edit", description:referralCases?.caseAmounts?.incomplete ? referralCases?.caseAmounts?.incomplete : 0, status:"INCOMPLETE",decision:"ALL",duration:"ALL",cases:referralCases?.caseAmounts?.incomplete || [] },
        {
          title: "Response required",
          iconClass: "bx bxs-chat",
          description: referralCases?.caseAmounts?.responseRequired ? referralCases?.caseAmounts?.responseRequired : 0,
          status: "QUERIES",
          decision: "ALL",
          duration: "ALL",
          cases:referralCases?.caseAmounts?.QUERIES || []

      }
      ]


    //data for welcome component
    let data = {}
    if(appRole == 'REFERRING_CLINICIAN' ){
        data = {
            Referrals:refcaseAmount.ALL,
            Accepted:refcaseAmount.ACCEPTED,
        }
    }
    else{
        data = {
            Referrals:caseAmounts.ALL,
            Accepted:caseAmounts.ACCEPTED,
        }
    }

    const onChangeChartPeriod = (pType) => {
        setPeriodType(pType)
    }

    const previewStyle = {
        height: 240,
        width: 320,
    }

    // const Content = () =>{
    //     if(speciality == "Plastic Surgery" && userDetails?.accountType == "REVIEWER"){
    //         return (
    //             <div className="btn-group" onClick={(e)=>setPathway(e.target.htmlFor)} role="group" >
    //                 <input type="radio" className="btn-check" name="btnradio"  autoComplete="off"  checked={pathway == "ALL"} />
    //                 <label className="btn btn-outline-secondary" id="ALL" htmlFor="ALL">Trauma</label>
    //                 <input type="radio" className="btn-check" checked={pathway == "Extravasation"} name="btnradio" id="Extravasation" autoComplete="off" />
    //                 <label className="btn btn-outline-secondary" htmlFor="Extravasation">Extravasation</label>
    //             </div>
    //         )
    //     } else {
    //         return <></>
    //     }

    // }

    const Content = () => {

        const [subscriptionOptions, setSubscriptionOptions] = useState([]);

        const {subscriptions} = useSelector(
            (state) => ({
                subscriptions: state.CreateReferral.subscriptions,
            })
        );

        function handleSelectGroup(event) {
            console.log(event)
        }

        // useEffect(()=>{
        //     console.log(dispatch(createReferralCreators.getSubscriptions()))
        // },[])
        //
        // useEffect(()=>{
        //     if(subscriptions){
        //         let options = subscriptions;
        //         // options[0]["options"].push({label:"Rhematology",value:"Rhematology"});
        //         // console.log("options",options)
        //         setSubscriptionOptions(options);
        //     }
        // },[subscriptions])

        if (speciality == "Plastic Surgery" && userDetails?.accountType == "REVIEWER") {
            return (
                <div className="btn-group" onClick={(e) => {
                    setPathway(e.target.htmlFor)
                    dispatch(bchDashboardCreators.requestDashboardReferrals(null,"ALL",e.target.htmlFor))

                }} role="group">
                    <input type="radio" className="btn-check" name="btnradio" autoComplete="off"
                           checked={pathway == "ALL"}/>
                    <label className="btn btn-outline-secondary" id="ALL" htmlFor="ALL">Trauma</label>
                    <input type="radio" className="btn-check" checked={pathway == "Extravasation"} name="btnradio"
                           id="Extravasation" autoComplete="off"/>
                    <label className="btn btn-outline-secondary" htmlFor="Extravasation">Extravasation</label>
                </div>
            )
        }
         else if(userDetails?.accountType !== "REVIEWER") {
            return <>
               <div className="btn-group mt-2" onClick={(e) => {
                  setDashboard(e.target.htmlFor)

                  let assignedrole = e.target.htmlFor === "ME" ? "ME":"ALL"
                  getDashboardReferrals(selectedOrg,assignedrole);
                  }} role="group">
                    <input type="radio" className="btn-check" name="btnradio" autoComplete="off"
                           checked={dashboard == "ME"}/>
                    <label className={dashboard == "ME" ? "btn btn-primary" : "btn btn-secondary"} id="me"
                           htmlFor="ME">@Me</label>
                    <input type="radio" className="btn-check" checked={dashboard == "DEPARTMENT"} name="btnradio"
                           id="department" autoComplete="off"/>
                    <label className={dashboard == "DEPARTMENT" ? "btn btn-primary" : "btn btn-secondary"}
                           htmlFor="DEPARTMENT">Department</label>
                </div>

                {/* <div className="btn-group mx-3" onClick={(e) => setUserPref(e.target.htmlFor)} role="group">
                    <input type="radio" className="btn-check" name="btnradio" autoComplete="off"
                           checked={userpref == "REF"}/>
                    <label className={userpref == "REF" ? "btn btn-primary" : "btn btn-secondary"} id="ref"
                           htmlFor="REF">Ref</label>
                    <input type="radio" className="btn-check" checked={userpref == "REV"} name="btnradio"
                           id="rev" autoComplete="off"/>
                    <label className={userpref == "REV" ? "btn btn-primary" : "btn btn-secondary"}
                           htmlFor="REV">Rev</label>
                </div> */}
                {/* <div className="col-3">
                    <Select
                        onChange={handleSelectGroup}
                        options={subscriptionOptions}
                        className=""
                        placeholder="Select speciality"
                    />
                </div> */}
                {referral && (
                    <button className="btn btn-primary" style={{width:"max-content"}} onClick={() => {
                        history.push('/create-referral')
                    }}>
                        Create a referral
                    </button>
                )}

                 {referral && (
                    <button className="btn btn-primary" style={{width:"max-content"}} onClick={() => {
                        history.push('/ownership-requests')
                    }}>
                        Ownership Requests {<Badge color="danger">{refcaseAmounts.AWAITING_REASSIGNMENT}</Badge>}
                    </button>
                )}

            </>
        }
        else{
            return <></>
        }

    }


    const renderCaseTable = (data,tableName,icon)=>{
        console.log("data",data)


        const renderButton = (caseID,tableName,key)=>{
            const buttonid = "tooltip" + "-"+ tableName + "-" + key;

            if(tableName === "query"){
                return(<>
                        <button
                        id={buttonid}
                    onClick={()=>{
                      dispatch(
                        caseCreators.requestCaseDetails(
                          caseID
                        )
                        );
                        history.push({
                          pathname: '/referral-detail',
                          state: {
                            caseID:caseID,
                            query:"true"
                          }
                        })
                    }}
                    className="btn btn-primary btn-sm btn-rounded">
                    <i className={icon} />
                    </button>
                    <UncontrolledTooltip
                        target={buttonid}
                        // target={"priorityBadge" + row.caseID}
                        placement="top"
                    >
                    Respond
                    </UncontrolledTooltip>
                    </>

                )
            }
            else if(tableName === "underReview"){
                return(
                    <>
                    <button
                    id={buttonid}
                    className="btn btn-primary btn-sm btn-rounded"
                    onClick={()=>{
                      dispatch(
                        caseCreators.requestCaseDetails(
                          caseID
                        )
                        );
                        history.push({
                          pathname: '/referral-detail',
                          state: {
                            caseID:caseID,
                          }
                        })
                    }}
                    ><i className={icon} />
                    </button>
                    <UncontrolledTooltip
                    target={buttonid}
                    // target={"priorityBadge" + row.caseID}
                    placement="top"
                >
                View case details
                </UncontrolledTooltip>
                </>

                )
            }
            else if(tableName === "incomplete"){
                return(
                    <>
                    <button
                    id={buttonid}
                        onClick={()=>{
                            console.log("caseID",caseID)
                            dispatch(
                                createReferralCreators.resetState()
                            );
                          dispatch(
                            createReferralCreators.requestIncompleteCase(
                                caseID
                              )
                        );
                        history.push({
                            pathname: '/create-referral',
                        });
                        }}
                    className="btn btn-primary btn-sm btn-rounded">
                    <i className={icon} />

                    </button>
                    <UncontrolledTooltip
                    target={buttonid}
                    // target={"priorityBadge" + row.caseID}
                    placement="top"
                >
                Complete
                </UncontrolledTooltip>
                </>

                )
            }
            else if(tableName === "declinedReferrals"){
                return(
                    <>
                    <button
                    id={buttonid}
                        onClick={()=>{
                          dispatch(
                            createReferralCreators.requestIncompleteCase(
                                caseID
                            )
                        );
                        history.push({
                            pathname:  '/referral-detail',
                            state: {
                                caseID:caseID,
                              }
                        });
                        }}
                    className="btn btn-primary btn-sm btn-rounded">
                    <i className="mdi mdi-eye" />
                    </button>
                    <UncontrolledTooltip
                        target={buttonid}
                        // target={"priorityBadge" + row.caseID}
                        placement="top"
                    >
                    View case details
                    </UncontrolledTooltip>
                    </>

                )
            }
        }


        return(
            <>
            {
                data?.map((item,key)=>(
                    <tr key={key}>
                    <td align='left' style={{paddingLeft:"4px",paddingRight:"0px"}}>
                        <div
                            className='badge rounded-pill font-size-10' style={{backgroundColor:item?.triageID?.colorCode}}>{item?.triageID?.priority?.charAt(0)}</div>
                    </td>
                  <td>{moment.utc(item.creationDate).tz("Europe/London").format("DD/MM/YYYY")}</td>
                    <td className="text-wrap text-break" style={{minWidth:"75px"}} >{item?.firstName + " "+ item?.lastName}</td>
                    <td align='center'>
                    {renderButton(item.caseID,tableName,key)}
                    </td>
                    </tr>
                ))
            }
            </>
        )
    }


    return (
        <React.Fragment>

            <motion.div className="page-content" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
                <MetaTags>
                    <title>Dashboard | TriVice</title>
                </MetaTags>

                {reviewer &&
                <div onClick={()=>setRevmodal(true)}
                     style={{background:'#556EE6',transform: 'rotateZ(-90deg)',display:'inline-block',
                         position:'fixed',top:'50%',right:'-25px',zIndex:'100',padding:'5px',color:'white',
                         cursor:'pointer'}}>
                    <p style={{padding:'0',margin:'0',fontWeight:'20px'}}>Feedback</p>
                    {/*<span className="bx bx-like"/>*/}
                </div>
                }
                <Container fluid >
                    {/* Render Breadcrumb */}
                    <Breadcrumbs
                        title={props.t("Dashboard")}
                        breadcrumbItem={props.t("Home")}
                        content={<Content/>}
                    >
                    </Breadcrumbs>


          { referral &&
          <Row >
            <Col xl={3}>
            <Card style={{boxShadow:"0px 4px 4px rgb(36 25 25 / 25%)",minHeight:"700px"}} >
                <CardBody className="p-2">
                    <Card className="mini-stats-wid bg-primary mb-2" role="button" onClick={() => history.push({
                        pathname: '/my-referral',
                        state: {
                            status: refreport[3]['status'],
                            decision: refreport[3]['decision'],
                            duration: refreport[3]['duration'],
                            pathway: pathway,
                            dashboard:dashboard
                        }
                    })}>
                        <CardBody>
                            <Media>
                                <Media body>
                                    <p className="text-white fw-medium">
                                        {refreport[3]['title']}
                                    </p>
                                    <h4 className="mb-0 text-white">{refcaseAmounts?.QUERIES ? refcaseAmounts?.QUERIES : "0"}</h4>
                                </Media>
                                <div
                                    className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                  <span className="avatar-title rounded-circle bg-white text-primary">
                                    <i
                                        className={
                                            "bx " + refreport[3]['iconClass'] + " font-size-24"
                                        }
                                    ></i>
                                  </span>
                                </div>
                            </Media>
                        </CardBody>
                    </Card>
                    {referral && <Row style={{fontSize:""}} >
                        <Col xl={"12"}>
                            <div className="bg-white mb-2">
                                <div className='table-responsive table-wrapper'>
                                    <Table className='table mb-0' responsive >
                                        <thead className='table-primary'>
                                        <tr>
                                            <th></th>
                                            <th className="col-sm-4">Date</th>
                                            <th className="col-sm-4">Patient</th>
                                            <th className="col-sm-4">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {
                                            renderCaseTable(referralCases?.responseRequired,"query",refreport[3]["iconClass"])
                                            }
                    </tbody>
                    </Table>
                    </div>
                    </div>
                    </Col>
                </Row>
                }
            </CardBody>
                            </Card>
            </Col>
            {referral &&  <Col xl={3}>
            <Card style={{boxShadow:"0px 4px 4px rgb(36 25 25 / 25%)",minHeight:"700px"}}>
                                        <CardBody className="p-2">
                                            <Card className="mini-stats-wid bg-primary mb-2" role="button" onClick={() => history.push({
                                                pathname: '/my-referral',
                                                state: {
                                                    status: refreport[2]['status'],
                                                    decision: refreport[2]['decision'],
                                                    duration: refreport[2]['duration'],
                                                    pathway: pathway,
                                                    dashboard:dashboard

                                                }
                                            })}>
                                                <CardBody>
                                                    <Media>
                                                        <Media body>
                                                            <p className="fw-medium text-white">
                                                                {refreport[2]['title']}
                                                            </p>
                                                            <h4 className="mb-0 text-white">{refreport[2]['description']}</h4>
                                                        </Media>
                                                        <div
                                                            className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                                          <span className="avatar-title rounded-circle bg-white text-primary">
                                                            <i
                                                                className={
                                                                    "bx " + refreport[2]['iconClass'] + " font-size-24"
                                                                }
                                                            ></i>
                                                          </span>
                                                        </div>
                                                    </Media>
                                                </CardBody>
                                            </Card>
                                            {referral && <Row>
                                                <Col xl={"12"}>
                                                    <div className="bg-white mb-2">
                                                        <div className='table-responsive table-wrapper'>
                                                            <table className='table mb-0'>
                                                                <thead className='table-primary'>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>Date</th>
                                                                    <th>Patient</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {
                                                                        renderCaseTable(referralCases?.incomplete,"incomplete",refreport[2]["iconClass"])
                                                                    }

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            }
                                        </CardBody>
                                    </Card>
            </Col>}
            <Col xl={3}>
            <Card style={{boxShadow:"0px 4px 4px rgb(36 25 25 / 25%)",minHeight:"700px"}}>
                                        <CardBody className="p-2">
                                            <Card className="mini-stats-wid bg-primary mb-2" role="button" onClick={() => history.push({
                                                pathname: '/my-referral',
                                                state: {
                                                    status: refreport[1]['status'],
                                                    decision: refreport[1]['decision'],
                                                    duration: refreport[1]['duration'],
                                                    pathway: pathway,
                                                    dashboard:dashboard


                                                }
                                            })}>
                                                <CardBody>
                                                    <Media>
                                                        <Media body>
                                                            <p className="text-white fw-medium">
                                                                {refreport[1]['title']}
                                                            </p>
                                                            <h4 className="mb-0 text-white">{refreport[1]['description']}</h4>
                                                        </Media>
                                                        <div
                                                            className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-white text-primary">
                              <i
                                  className={
                                      "bx " + refreport[1]['iconClass'] + " font-size-24"
                                  }
                              ></i>
                            </span>
                                                        </div>
                                                    </Media>
                                                </CardBody>
                                            </Card>
                                            {referral && <Row>
                                                <Col xl={"12"}>
                                                    <div className="bg-white mb-2">
                                                        <div className='table-responsive table-wrapper'>
                                                            <table className='table mb-0'>
                                                                <thead className='table-primary'>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>Date</th>
                                                                    <th>Patient</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {
                                                                        renderCaseTable(referralCases?.declinedReferrals,"declinedReferrals",refreport[1]["iconClass"])
                                                                }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            }
                                        </CardBody>
                                    </Card>
            </Col>
            <Col xl={3}>
            <Card style={{boxShadow:"0px 4px 4px rgb(36 25 25 / 25%)",minHeight:"700px"}}>
                                        <CardBody className="p-2">
                                            <Card className="mini-stats-wid bg-primary mb-2" role="button" onClick={() => history.push({
                                                pathname: '/my-referral',
                                                state: {
                                                    status: refreport[0]['status'],
                                                    decision: refreport[0]['decision'],
                                                    duration: refreport[0]['duration'],
                                                    pathway: pathway,
                                                    dashboard:dashboard

                                                }
                                            })}>
                                                <CardBody>
                                                    <Media>
                                                        <Media body>
                                                            <p className="text-white fw-medium">
                                                                {refreport[0]['title']}
                                                            </p>
                                                            <h4 className="mb-0 text-white">{refreport[0]['description']}</h4>
                                                        </Media>
                                                        <div
                                                        className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                                        <span className="avatar-title rounded-circle bg-white text-primary">
                                                          <i
                                                              className={
                                                                  "bx " + refreport[0]['iconClass'] + " font-size-24"
                                                              }
                                                          ></i>
                                                        </span>
                                                        </div>
                                                    </Media>
                                                </CardBody>
                                            </Card>
                                            {referral && <Row>
                                                <Col xl={"12"}>
                                                    <div className="bg-white mb-2">
                                                        <div className='table-responsive table-wrapper'>
                                                            <table className='table mb-0'>
                                                                <thead className='table-primary'>
                                                                <tr>
                                                                <th></th>
                                                                    <th>Date</th>
                                                                    <th>Patient</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        renderCaseTable(referralCases?.underReview,"underReview",refreport[0]["iconClass"])
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            }
                                        </CardBody>
            </Card>
            </Col>
          </Row>}

                          {reviewer &&

                                    <Row>
                                    <Col xl="3">
                                    <ReferralsDataTable pathway={pathway} tablename="IMMEDIATE" title="Immediate referrals" icon="bx bxs-inbox" data={referralCases?.immediate || []} caseno={referralCases?.immediate?.length || 0} />
                                    </Col>
                                    <Col xl="3">
                                    <ReferralsDataTable pathway={pathway} tablename="Urgent" title="Urgent referrals" icon="bx bxs-inbox" data={referralCases?.urgent || []} caseno={referralCases?.urgent?.length || 0} />
                                    </Col>


                                    <Col xl="3">
                                    <ReferralsDataTable pathway={pathway} tablename="Routine" title="Routine Referrals" icon="bx bxs-inbox"data={referralCases?.routine || []}  caseno={referralCases?.routine?.length || 0}/>
                                    </Col>
                                    <Col xl="3">
                                    <ReferralsDataTable pathway={pathway} tablename="Queries" title="Response required" icon="bx bxs-message-rounded-error"data={referralCases?.responseRequired || []}  caseno={referralCases?.responseRequired?.length || 0}/>
                                    </Col>

                                    </Row>
                                    }

                         { reviewer && <Row>
                                <Col xl="6">
                                    <PathwaysPieChartBox caseAmounts={caseAmounts} />
                                </Col>
                                <Col xl="6">
                                    <ReviewerTypePieChartBox typewise = {caseAmounts && caseAmounts.TYPE_WISE}/>
                                </Col>
                            </Row>
                            }



                    <Row>
                        <Col xl="4">


                            {/* { reviewer && <WelcomeComp name={profilename} data ={data}  />} */}
                            { referral && <ReferralTypePieChartBox refcaseAmount={refcaseAmount} />}
                            {/* { reviewer && <PendingCasesBox caseAmount={caseAmounts} pathway={pathway} /> } */}
                        </Col>
                        <Col xl="8">


                            {/* {referral &&<Row> */}

                                {/* Reports Render */}
                                {/* {refreport.map((report, key) => (
                                    <Col md="4" key={"_col_" + key}>
                                        <Card className="mini-stats-wid" role="button" onClick={()=>history.push({
                                            pathname: '/my-referral',
                                            state:{
                                                status : report.status,
                                                decision:report.decision,
                                                duration:report.duration,
                                                pathway: pathway
                                            }
                                        })}>
                                            <CardBody>
                                                <Media>
                                                    <Media body>
                                                        <p className="text-muted fw-medium">
                                                            {report.title}
                                                        </p>
                                                        <h4 className="mb-0">{report.description}</h4>
                                                    </Media>
                                                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                  className={
                                      "bx " + report.iconClass + " font-size-24"
                                  }
                              ></i>
                            </span>
                                                    </div>
                                                </Media>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))} */}
                            {/* </Row>

                            } */}



                            { referral && <Card>
                                <CardBody>
                                    <div className="d-sm-flex flex-wrap">
                                        <h4 className="card-title mb-4">Referrals by {_.capitalize(periodType)}</h4>
                                        <div className="ms-auto">
                                            <ul className="nav nav-pills">
                                                <li className="nav-item">
                                                    <Link
                                                        to="#"
                                                        className={classNames(
                                                            { active: periodType === "WEEK" },
                                                            "nav-link"
                                                        )}
                                                        onClick={() => {
                                                            onChangeChartPeriod("WEEK");
                                                            dispatch(bchDashboardCreators.requestChartData("WEEK",selectedOrg));
                                                        }}
                                                        id="one_month"
                                                    >
                                                        Week
                                                    </Link>{" "}
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        to="#"
                                                        className={classNames(
                                                            { active: periodType === "MONTH" },
                                                            "nav-link"
                                                        )}
                                                        onClick={() => {
                                                            onChangeChartPeriod("MONTH");
                                                            dispatch(bchDashboardCreators.requestChartData("MONTH",selectedOrg))
                                                        }}
                                                        id="one_month"
                                                    >
                                                        Month
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        to="#"
                                                        className={classNames(
                                                            { active: periodType === "YEAR" },
                                                            "nav-link"
                                                        )}
                                                        onClick={() => {
                                                            onChangeChartPeriod("YEAR");
                                                            dispatch(bchDashboardCreators.requestChartData("YEAR",selectedOrg))
                                                        }}
                                                        id="one_month"
                                                    >
                                                        Year
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    {/* <div className="clearfix"></div> */}
                                    <StackedColumnChart periodData={chartData} />
                                </CardBody>
                            </Card>

                            }

                        </Col>
                    </Row>
                </Container>
            </motion.div>

            {/* subscribe ModalHeader */}

            {/*Modal for referrer org*/}
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
                    <Col >
                        <div>
                            {orgOption && orgOption.map((item,key)=>{
                                console.log("org option",item)
                                return(
                                    <div key={key+"radioORG"} className="mb-3 form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="orgOption"
                                            value={item.orgID}
                                            onClick={(e)=>setOrg(e.currentTarget.value)}
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
                            if (org != null){
                                dispatch(bchDashboardCreators.setUserOrganisation({orgID:org}));
                                setmodal(false);
                            }
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={basic}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> On-call Confirmation
                    </h5>
                    <button
                        type="button"
                        className="btn btn-danger btn-close"

                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body ">
                    <p>Are you the On Call Registrar for today?</p>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            setbasic(false);
                        }}
                    >
                        No
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            dispatch(bchDashboardCreators.updateOnCallRegistrar(token));
                            setbasic(false);

                        }}
                    >
                        Yes
                    </button>
                </div>
            </Modal>

                {/*when incomplete case is pending*/}
            <IncompleCaseModal modalopen={incompleCaseAlert} modalclose={setIncompleCaseAlert}/>
            <Revmodal open={revmodal} close={setRevmodal} qna={feedbackqna}/>
            <OrthopticsCheckModal isOpen={orthopticsModal} closeModal={()=>setOrthopticsModal(false)} token={token}/>



        </React.Fragment>
    )
}


Dashboard.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func
}

export default withTranslation()(Dashboard)



{/*
   content={appRole == "REFERRING_CLINICIAN" ?
            <Row style={{justifyContent: 'right'}}>
            <Col className="col-auto" style={{width: "30vw"}}>
            <Select
              value={org}
              onChange={(e)=>{setOrg(e); dispatch(bchDashboardCreators.setUserOrganisation(e))}}
              options={orgOption}
              className="select2"
              placeholder="Switch organisation"
              classNamePrefix="select2 select2-selection"
            />
            </Col>
            </Row>
          : <></>}


*/}


/*
{ reviewer && 
                            <Row>

                                {reports.map((report, key) => (
                                    <Col md="6" key={"_col_" + key}>
                                        <Card className="mini-stats-wid" role="button" onClick={()=>history.push({
                                            pathname: '/my-referral',
                                            state:{
                                                status : report.status,
                                                decision:report.decision,
                                                duration:report.duration,
                                                pathway: pathway
                                            }
                                        })}>
                                            <CardBody >
                                                <Media>
                                                    <Media body>
                                                        <p className="text-muted fw-medium">
                                                            {report.title}
                                                        </p>
                                                        <h4 className="mb-0">{report.description}</h4>
                                                    </Media>
                                                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                  className={
                                      "bx " + report.iconClass + " font-size-24"
                                  }
                              ></i>
                            </span>
                                                    </div>
                                                </Media>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            }


*/