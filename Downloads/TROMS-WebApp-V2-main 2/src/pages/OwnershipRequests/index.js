import React, { useEffect, useState, useRef } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { withRouter, Link, useLocation } from "react-router-dom";
import { isEmpty } from "lodash";
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
    SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import moment from "moment";
import 'moment-timezone';
import { useHistory } from "react-router-dom";
import PageItem from 'react-bootstrap/PageItem';
import SweetAlert from "react-bootstrap-sweetalert"
//import Pagination from 'react-bootstrap/Pagination'
import ReactPaginate from 'react-paginate';
import "./datatables.scss"
import profileupdateValidator from "hooks/profileupdateValidator"
import { appCreators } from "store/app/appReducer"
import { bchDashboardTypes, bchDashboardCreators } from "store/dashboard/reducer"
import { motion, useMotionValue, useTransform } from "framer-motion"
import OffcanvasCasePdfViewer from "../ReferralDetail/OffcanvasCasePdfViewer";


import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Row,
    Badge,
    UncontrolledTooltip,
    Modal,
    ButtonDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem, Input, ModalHeader
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import { setClient } from "utils/apiUtils"

//redux
import { useSelector, useDispatch } from "react-redux";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
    getOrders as onGetOrders,
    addNewOrder as onAddNewOrder,
    updateOrder as onUpdateOrder,
    deleteOrder as onDeleteOrder,
} from "store/actions";

import { myReferralCreators, myReferralTypes } from 'store/myReferrals/reducer'
import { createReferralCreators } from "store/create-referral/reducer";
import { caseCreators } from "store/caseDeatils/reducer"
import checkPermission from "functions/checkPermission";

const EcommerceOrders = props => {

    const dispatch = useDispatch();
    let history = useHistory();
    const location = useLocation();
    const caseval = location && location.state;


    var appState = JSON.parse(localStorage.getItem('applicationState'));
    const appReducer = appState && appState.appReducer && appState.appReducer;
    const token = appReducer.token;
    const userDetails = appState && appState.appReducer && appState.appReducer.userDetails;
    const appRole = userDetails && userDetails.appRole;



    const [modal, setModal] = useState(false);
    const [orgmod, setorgmod] = useState(false)
    const [modal1, setModal1] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [pageno, setPage] = useState(1);
    const [org, setOrg] = useState(null)

    //form param default value states

    const [statusP, setStatusP] = useState('REASSIGNED');
    const [decisionP, setDecisionP] = useState('ALL');
    const [durationP, setDurationP] = useState('ALL');
    const [assingedP, setAssignedP] = useState('ME')
    const [timeP, setTime] = useState('');
    const [resetbtn, setResetbtn] = useState(false)
    const [searchval, setSearchval] = useState('');
    const [statusval, setStatusval] = useState('')
    const [decisonval, setDecisionval] = useState('');
    const [durationval, setDurationval] = useState('');
    const [assignedval, setAssignedval] = useState("ME")  //// ME or ALL
    const [owner, setOwnerVal] = useState(userDetails?.accountType == "")  //// ME or ALL
    const [basic, setbasic] = useState(false) // for on call popup visibility
    const [orthoptic, setOrthoptic] = useState(false)
    const [orderType, setOrderType] = useState('DESC');
    const [orderColumn, setOrderColumn] = useState('DATE_TIME');
    const [dropButton, setDropButton] = useState('')
    const [reassignModal, setReassignModal] = useState({})
    const [clinician, setClinician] = useState()
    const [resonforchange, setResonForChange] = useState('')
    const [selectedCaseID, setSelectedCaseID] = useState("");
    const [showCancelCaseAlert, setShowCancelCaseAlert] = useState(false)
    const [showChangeOwnerAlert, setChangeOwnerAlert] = useState(false)
    const [modalvisiblePDF, setModalVisiblePDF] = useState(false);
    const [acceptanceModal, setAcceptanceModal] = useState(false);
    const [showYes, setShowYes] = useState(false);
    const [showNo, setShowNo] = useState(false);


    let setSearchvalue = (e) => setSearchval(e.target.value)
    let setDecisionValue = (e) => setDecisionval(e.target.value)
    let setDurationValue = (e) => setDurationval(e.target.value)
    let setAssignedValue = (e) => setAssignedval(e.target.value)
    let setOwnerValue = (e) => {
        if (e.target.value == userDetails?._id) {
            setAssignedval('ME');
        } else {
            setAssignedval('ALL');
        }
        setOwnerVal(e.target.value)
    }

    const SETTIME = (value) => {
        setTime(value)
    }


    const { referrals, organisations, selectedOrg, clinicians, AssignedFinished, globalPathway, currentUser, caseDetails, caseLoading } = useSelector(state => ({
        referrals: state.MyReferralsContainerReducer.referrals,
        organisations: state.appReducer.userDetails.organisation,
        selectedOrg: state.Dashboard.orgID,
        clinicians: state.MyReferralsContainerReducer.clincians,
        AssignedFinished: state.MyReferralsContainerReducer.reassignLoad,
        globalPathway: state.Dashboard.pathway,
        currentUser: state.appReducer.userDetails,
        caseDetails: state.caseDetails.caseDetails.case,
        caseLoading: state.caseDetails.loading

    }))

    const [pathway, setPathway] = useState(typeof globalPathway != 'undefined' ? globalPathway : 'ALL')
    const orgOption = organisations && organisations.map((item) => {
        return { label: item.name, value: item.name, orgID: item._id }
    })

    const [pagination, setPainationCount] = useState({
        current_page: '1',
        last_page: '',
        per_page: 10,
    })

    const submitButtonRef = useRef(null);

    const refreshDataOnDelete = () => {
        submitButtonRef.current.click()
    }

    const isStaffMember = checkPermission('staff-member')

    useEffect(() => {
        dispatch(appCreators.updateBacktrack('ownership-requests'))
        debugger;
        if (selectedOrg == null && appRole == 'REFERRING_CLINICIAN' && organisations.length > 1) return setorgmod(true)
        if (organisations.length == 1 && appRole == "REFERRING_CLINICIAN") {
            dispatch(bchDashboardCreators.setUserOrganisation({ orgID: organisations[0]._id }));
            dispatch(bchDashboardCreators.requestRefDashboardInfo(organisations[0]._id))
            //dispatch(bchDashboardCreators.requestChartData(periodType,organisations[0]._id))
        }
    }, [selectedOrg])

    useEffect(() => {
        debugger;
        dispatch(bchDashboardCreators.setPathway(pathway))
        dispatch(bchDashboardCreators.requestBchDashboardInfo(48, "hour", pathway))
        if (userDetails?.speciality == "Plastic Surgery" && userDetails?.accountType == "REVIEWER") {
            dispatch(myReferralCreators.requestFetchReferrals(1, statusP, decisionP, durationP, timeP, searchval, null, null, null, assignedval, owner, pathway == 'ALL' ? null : pathway, currentUser._id))
            console.log("pathway")
            setPainationCount({
                ...pagination,
                current_page: '1'
            })
        }
    }, [pathway])

    // useEffect(() => {


    // dispatch(myReferralCreators.requestFetchReferrals(1, values.Status, values.decision, values.duration, time, values.search, selectedOrg,"","",))
    // },[])

    // useEffect(() => {
    //     debugger;
    //     try {
    //         if ('pathway' in location.state) {
    //             debugger;
    //             setPathway(location.state.pathway)
    //         }
    //         if ('dashboard' in location.state) {
    //             console.log("location.state",location.state)
    //             let value = location.state.dashboard === "DEPARTMENT" ? "ALL":location.state.dashboard
    //             setAssignedval(location.state.dashboard === "DEPARTMENT" ? "ALL":location.state.dashboard)
    //             dispatch(myReferralCreators.requestFetchReferrals(1, statusP, decisionP, durationP, timeP, searchval, null, null,null,value))
    //             console.log("location.state")
    //         }
    //     } catch (error) {

    //     }

    // }, [location.state])

    //when reassign finished we want to refetch cases to update stale data
    useEffect(() => {
        debugger
        if (AssignedFinished == null) return;
        if (typeof AssignedFinished == "boolean" && AssignedFinished === false) {
            appRole == 'BCH_CLINICIAN' ?
                dispatch(myReferralCreators.requestFetchReferrals(1, statusP, decisionP, durationP, timeP, searchval, null, null, null, assignedval, owner, pathway == 'ALL' ? null : pathway))
                : dispatch(myReferralCreators.requestFetchReferrals(1, statusP, decisionP, durationP, timeP, searchval, selectedOrg, null, null, "ME", owner))
            console.log("AssignedFinished")

        }
    }, [AssignedFinished])

    useEffect(() => {
        debugger;
        setClient(token)
        try {
            sessionStorage.removeItem("shouldShowIncompleteCaseModal");
        } catch (error) {

        }
        dispatch(myReferralCreators.requestClinicianList())
        if (userDetails?.accountType == "REVIEWER" && (userDetails?.speciality == "Ophthalmology" || userDetails?.speciality == "Optometry" || userDetails?.speciality == "Orthoptics")) setAssignedP('ME')
        if (selectedOrg == null && appRole == 'REFERRING_CLINICIAN' && organisations.length > 1) return setorgmod(true)
        if (organisations.length == 1 && appRole == "REFERRING_CLINICIAN") {
            dispatch(bchDashboardCreators.setUserOrganisation({ orgID: organisations[0]._id }));
            dispatch(bchDashboardCreators.requestRefDashboardInfo(organisations[0]._id))
            //dispatch(bchDashboardCreators.requestChartData(periodType,organisations[0]._id))
        }
        if (sessionStorage.getItem("shouldShowOnCallRegistrarModal") === "true" && appRole == 'BCH_CLINICIAN' && userDetails?.speciality == "Plastic Surgery") {
            console.log("session running");
            setbasic(true)
        }
        if (sessionStorage.getItem("shouldShowOnCallRegistrarModal") === "true" && userDetails?.accountType == 'REVIEWER' && userDetails?.speciality == "Orthoptics") {
            setOrthoptic(true)
        }

        sessionStorage.removeItem("shouldShowOnCallRegistrarModal");
    }, [])

    const cases = referrals && referrals.cases;
    console.log("cases", cases)

    // const toggleModal = () => {
    //   setModal1(!modal1)
    // }
    const toggleViewModal = () => setModal1(!modal1);

    const status = [
        {
            title: "All",
            value: "ALL",
        },
        {
            title: "Accepted",
            value: "ACCEPTED",
        },
        {
            title: "Under Review",
            value: "UNDER_REVIEW",
        },
        {
            title: "Guidance issued",
            value: "GUIDANCE_ISSUED"
        },
        {
            title: "Redirected",
            value: "REDIRECTED"
        },
        {
            title: "Incomplete",
            value: "INCOMPLETE",
        },
        {
            title: "Queries",
            value: "QUERIES",
        },
        {
            title: "Cancelled",
            value: "CANCELLED"
        },
        {
            title: "Declined",
            value: "DECLINED"
        },
        {
            title: "Reassigned",
            value: "REASSIGNED"
        }
    ]

    if (appRole == "BCH_CLINICIAN") {
        status.splice(5, 1)
    }
    const decision = [
        {
            title: "All",
            value: "ALL",
        },
        {
            title: "Immediate",
            value: "IMMEDIATE",
        },
        {
            title: "Urgent",
            value: "URGENT",
        },
        {
            title: 'Routine',
            value: 'ROUTINE'
        },
        {
            title: "Treated Locally",
            value: "TREAT_LOCALLY",
        },
        {
            title: "Unknown",
            value: "UNKNOWN"
        },


    ];
    const duration = [
        {
            title: "All",
            value: "ALL",
        },
        {
            title: "Today",
            value: "TODAY",
        },
        {
            title: "Last 48 Hours",
            value: 48,
        },
        {
            title: "Last 7 days",
            value: 7,
        },
        {
            title: "Last 1 month",
            value: 28,
        },
    ];
    const assigned = [
        {
            title: "Me",
            value: "ME"
        },
        {
            title: 'All',
            value: 'ALL'
        },
        {
            title: 'Orthoptics',
            value: 'ORTHOPTICS'
        }
    ]
    const sortingHeaderStyle = {};


    //setDataSource(generateTableData(cases));
    let dataSource = generateTableData(cases)

    function generateTableData(cases) {
        let length = 0;
        if (cases) {
            length = cases.length;
        }

        var returnedValue = [];
        for (let index = 0; index < length; index++) {
            try {
                // console.log("index: " + index);
                // console.log(
                // 	"cases[index].suggestedAction: " + cases[index].suggestedAction
                // );

                let category = cases[index].triage ? cases[index].triage.priority : '';


                let diseaseText = "";
                if (cases[index].transmittableDisease) {
                    diseaseText = "Yes";
                } else {
                    diseaseText = "No";
                }

                let covidResult = "";
                switch (cases[index].covid19) {
                    case "0":
                        covidResult = "Covid-19 infection not suspected";
                        break;
                    case "1":
                        covidResult = "Covid-19 test result available";
                        break;
                    case "2":
                        covidResult = "Sample sent, awaiting result";
                        break;
                    case "3":
                        covidResult = "Sample not sent";
                        break;
                    case "4":
                        covidResult = "Patient has Covid-19 symptoms";
                        break;
                    default:
                        break;
                }
                var patientName = "";
                // console.log(cases[index]);
                if (cases[index].patient == undefined) {
                    patientName = cases[index].firstName + " " + cases[index].lastName;
                } else {
                    patientName =
                        cases[index].patient.firstName + " " + cases[index].patient.lastName;
                }

                returnedValue.push(userDetails?.accountType == "REFERRING" ? {
                    caseID: cases[index].caseID,
                    patientName: patientName,
                    category: category,
                    pathway: cases[index].pathway ? cases[index].pathway : '',
                    dateTime: cases[index].creationDate,
                    owner: cases[index].assignedReferrer.firstName + " " + cases[index].assignedReferrer.lastName,
                    transmittableDisease: diseaseText,
                    status: cases[index].status,
                    action: "View",
                    categoryColor: cases[index].triage ? cases[index].triage.colorCode : 'grey',
                    assignedRev: cases[index]?.assignedReviewer,
                    assignedName: typeof cases[index]?.assignedReviewer != "undefined" ? cases[index]?.assignedReviewer.firstName + " " + cases[index]?.assignedReviewer.lastName : '',
                    editedByUser: cases[index]?.editedByUser ? cases[index]?.editedByUser : "",
                    lastEdited: cases[index]?.lastEdited

                } : {
                    caseID: cases[index].caseID,
                    patientName: patientName,
                    category: category,
                    pathway: cases[index].pathway ? cases[index].pathway : '',
                    dateTime: cases[index].creationDate,
                    transmittableDisease: diseaseText,
                    status: cases[index].status,
                    action: "View",
                    categoryColor: cases[index].triage ? cases[index].triage.colorCode : 'grey',
                    assignedRev: cases[index]?.assignedReviewer,
                    assignedName: typeof cases[index]?.assignedReviewer != "undefined" ? cases[index]?.assignedReviewer.firstName + " " + cases[index]?.assignedReviewer.lastName : '',
                    editedByUser: cases[index]?.editedByUser ? cases[index]?.editedByUser : "",
                    lastEdited: cases[index]?.lastEdited

                });
            } catch (error) {
                console.log("T  IS AN ERROR", error);
            }
        }

        console.log("")
        return returnedValue;
    }

    const Content = () => {
        if (userDetails?.speciality == "Plastic Surgery" && userDetails?.accountType == "REVIEWER") { //hidden for now
            return (
                <div className="btn-group" onClick={(e) => setPathway(e.target.htmlFor)} role="group">
                    <input type="radio" className="btn-check" name="btnradio" autoComplete="off"
                        checked={pathway == "ALL"} />
                    <label className="btn btn-outline-secondary" id="ALL" htmlFor="ALL">Trauma</label>
                    <input type="radio" className="btn-check" checked={pathway == "Extravasation"} name="btnradio"
                        id="Extravasation" autoComplete="off" />
                    <label className="btn btn-outline-secondary" htmlFor="Extravasation">Extravasation</label>
                </div>
            )
        }
        else if (userDetails?.accountType === "REFERRING") {
            return <>
                <div className="btn-group align-items-center" onClick={(e) => {
                    setAssignedval(e.target.htmlFor);
                    var owner_const = e.target.htmlFor == 'ME' ? userDetails?._id : '';
                    setOwnerVal(owner_const);
                    dispatch(myReferralCreators.requestFetchReferrals(1, statusP, decisionP, durationP, timeP, searchval, null, null, null, e.target.htmlFor, owner_const, pathway == 'ALL' ? null : pathway))
                }} role="group">
                    {/* <input type="radio" className="btn-check" name="btnradio" autoComplete="off"
                           checked={assignedval === "ME"}/>
                    <label className={assignedval === "ME" ? "btn btn-primary" : "btn btn-secondary"} id="me"
                           htmlFor="ME">@Me</label>
                    <input type="radio" className="btn-check" checked={assignedval == "ALL"} name="btnradio"
                           id="department" autoComplete="off"/>
                    <label className={assignedval === "ALL" ? "btn btn-primary" : "btn btn-secondary"}
                           htmlFor="ALL">Department</label> */}
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
                {/*<div className="col-3">*/}
                {/*    {referral && (*/}
                {/*        <button className="btn btn-primary" style={{width:"max-content"}} onClick={() => {*/}
                {/*            history.push('/create-referral')*/}
                {/*        }}>*/}
                {/*            Create a referral*/}
                {/*        </button>*/}
                {/*    )}*/}
                {/*</div>*/}
            </>
        }
        // else if(userDetails?.accountType == "REFERRING"){
        //     return (
        //         <div className="btn-group"
        //              onClick={(e) => {
        //                  setAssignedval(e.target.htmlFor)
        //                  let selectedTable = e.target.htmlFor;
        //                  dispatch(myReferralCreators.requestFetchReferrals(1, statusP, decisionP, durationP, timeP, searchval, null,null,null,selectedTable))
        //                  setPainationCount({
        //                      ...pagination,
        //                      current_page: '1'
        //                  })
        //              }}
        //              role="group">
        //             <input type="radio" className="btn-check" name="btnradio" autoComplete="off"
        //                    checked={assignedval == "ME"}
        //             />
        //             <label
        //                 className={assignedval == "ME" ? "btn btn-primary" : "btn btn-secondary"}
        //                 id="ME" htmlFor="ME">Me</label>
        //             <input type="radio" className="btn-check"
        //                    checked={assignedval == "ALL"}
        //                    name="btnradio"
        //                    id="Extravasation" autoComplete="off"/>
        //             <label
        //                 className={assignedval == "ALL" ? "btn btn-primary" : "btn btn-secondary"}
        //                 htmlFor="ALL">Department</label>
        //         </div>
        //     )
        // }
        else {
            return <></>
        }


    }

    function setDropDownButton(caseid) {
        if (caseid == dropButton) {
            setDropButton('')
        } else {
            setDropButton(caseid)
        }
        setOrderList(orderList)
    }


    const datalength = referrals && referrals.totalDocs;


    const setStates = (decision, duration, assigned) => {
        setDecisionP(decision)
        setDurationP(duration)
        setAssignedP("ME")
    }

    // console.log("datalength",dataSource.length)
    // console.log("dataSource",dataSource)

    //redirected values from dashboard

    let statusR = location && location.state && location.state.status;
    let decisionR = location && location.state && location.state.decision;
    let durationR = location && location.state && location.state.duration;


    const dropDownFormatter = (cellContent, row, index, extraData) => {

        console.log(`BIGONE
  cellContent: ${cellContent}
  row: ${row}
  index: ${index}
  extraData: ${extraData}
  `)
        if (userDetails?.accountType == 'REVIEWER' && row.status != "Incomplete" && (userDetails?.speciality == "Ophthalmology" || userDetails?.speciality == "Optometry" || userDetails?.speciality == "Orthoptics")) {
            return (
                <ButtonDropdown
                    isOpen={extraData == row.caseID}
                    toggle={(e) => {
                        e.stopPropagation()
                        if (row.caseID == dropButton) {
                            setDropButton('')
                        } else {
                            setDropButton(row.caseID)
                        }
                    }}
                >
                    <DropdownToggle color="primary" className="btn-md btn-rounded"
                        caret>
                        Action{' '}{' '}
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu dropdown-menu-end">
                        <DropdownItem
                            onClick={() => {
                                dispatch(
                                    caseCreators.requestCaseDetails(
                                        row.caseID
                                    )
                                );
                                history.push({
                                    pathname: '/referral-detail',
                                    state: {
                                        caseID: row.caseID,
                                        status: statusP,
                                        decision: decisionP,
                                        duration: durationP,
                                        search: searchval,
                                        page: pagination.current_page,
                                        ordertype: orderType,
                                        ordercolumn: orderColumn,
                                        assignedval: assignedval
                                    },
                                });
                            }}
                        >View Details
                        </DropdownItem>
                        <DropdownItem onClick={() => {
                            // dispatch(createReferralCreators.requestCasePDF(row.caseID, 'false', '', ''));
                            dispatch(createReferralCreators.requestCasePDFDetails(row.caseID))
                            setModalVisiblePDF(true);
                        }}>Download</DropdownItem>
                        <DropdownItem id="assignTo" disabled={isStaffMember} onClick={() => {
                            setReassignModal({ caseID: row.caseID, assignedRev: row.assignedRev })
                        }}>Assign to</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
            )
        } else {
            return (
                <>{row.status === 'Incomplete' && userDetails?.accountType == 'REFERRING' ? (
                    <>
                        {/* <Button
                type="button"
                color="primary"
                className="btn-sm btn-rounded"
                //onClick={toggleViewModal}
                // onClick={()=>console.log(row.caseID)}
                onClick={(e) => {
                  e.stopPropagation()
                  try {
                    if (
                        row.status == 'Incomplete' &&
                        userDetails?.accountType == 'REFERRING'
                    ) {
                      dispatch(
                          createReferralCreators.resetState()
                      );
                      dispatch(
                          createReferralCreators.requestIncompleteCase(
                              row.caseID
                          )
                      );
                      history.push({
                        pathname: '/create-referral',
                      });
                    } else {
                      dispatch(
                          caseCreators.requestCaseDetails(
                              row.caseID
                          )
                      );
                      history.push({
                        pathname: '/referral-detail',
                        state: {
                          caseID: row.caseID,
                          status: statusP,
                          decision: decisionP,
                          duration: durationP,
                          search: searchval,
                          page: pagination.current_page,
                          ordertype: orderType,
                          ordercolumn: orderColumn,
                        },
                      });
                    }
                  } catch (error) {}
                }}
            >
              Update Case
            </Button> */}
                        <ButtonDropdown
                            isOpen={extraData == row.caseID}
                            toggle={(e) => {
                                e.stopPropagation()
                                if (row.caseID == dropButton) {
                                    setDropButton('')
                                } else {
                                    setDropButton(row.caseID)
                                }
                            }}
                        >
                            <DropdownToggle color="primary" className="btn-md btn-rounded"
                                caret>
                                Action{' '}{' '}
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu dropdown-menu-end">
                                <DropdownItem
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        try {
                                            if (
                                                row.status == 'Incomplete' &&
                                                userDetails?.accountType == 'REFERRING'
                                            ) {
                                                dispatch(
                                                    createReferralCreators.resetState()
                                                );
                                                dispatch(
                                                    createReferralCreators.requestIncompleteCase(
                                                        row.caseID
                                                    )
                                                );
                                                history.push({
                                                    pathname: '/create-referral',
                                                });
                                            } else {
                                                dispatch(
                                                    caseCreators.requestCaseDetails(
                                                        row.caseID
                                                    )
                                                );
                                                history.push({
                                                    pathname: '/referral-detail',
                                                    state: {
                                                        caseID: row.caseID,
                                                        status: statusP,
                                                        decision: decisionP,
                                                        duration: durationP,
                                                        search: searchval,
                                                        page: pagination.current_page,
                                                        ordertype: orderType,
                                                        ordercolumn: orderColumn,
                                                    },
                                                });
                                            }
                                        } catch (error) {
                                        }
                                    }}
                                >Update
                                </DropdownItem>
                                <DropdownItem

                                    onClick={() => {
                                        setSelectedCaseID(row.caseID);
                                        setShowCancelCaseAlert(true)
                                        // dispatch(
                                        //   createReferralCreators.requestCaseCancel(
                                        //       row.caseID
                                        //   ))
                                    }}

                                >Cancel referral</DropdownItem>
                                {/* <DropdownItem
                  onClick={() => {
                      dispatch(
                          caseCreators.requestCaseDetails(
                              row.caseID
                          )
                      );
                      // history.push({
                      //     pathname: '/referral-detail',
                      //     state: {
                      //         caseID: row.caseID,
                      //         status: statusP,
                      //         decision: decisionP,
                      //         duration: durationP,
                      //         search: searchval,
                      //         page: pagination.current_page,
                      //         ordertype: orderType,
                      //         ordercolumn: orderColumn,
                      //     },
                      // });
                  }}
              >View Details
              </DropdownItem> */}


                            </DropdownMenu>
                        </ButtonDropdown>
                    </>


                ) : (

                    row.status === 'Cancelled' ? (
                        //     <ButtonDropdown
                        //     isOpen={extraData == row.caseID}
                        //     toggle={(e) => {
                        //       e.stopPropagation()
                        //       if(row.caseID == dropButton){
                        //         setDropButton('')
                        //       }else{
                        //         setDropButton(row.caseID)
                        //       }
                        //     }}
                        // >
                        //   <DropdownToggle color="primary" className="btn-md btn-rounded"
                        //                   caret >
                        //     Action{' '}{' '}
                        //   </DropdownToggle>
                        //   <DropdownMenu className="dropdown-menu dropdown-menu-end">
                        //     <DropdownItem
                        //     >

                        //     { moment.utc(row.lastEdited).tz("Europe/London").format("DD-MM-YYYY")}
                        //     </DropdownItem>


                        //   </DropdownMenu>
                        // </ButtonDropdown>
                        <>
                            <div style={{ maxWidth: "118px", whiteSpace: "initial" }}
                            >Referral cancelled by {row?.editedByUser?.firstName} {row?.editedByUser?.lastName} on{" "}
                                {moment.utc(row.lastEdited).tz("Europe/London").format("DD-MM-YYYY  H:mm:s")} Hrs</div>
                        </>


                    ) : (
                        <ButtonDropdown
                            isOpen={extraData == row.caseID}
                            toggle={(e) => {
                                e.stopPropagation()
                                if (row.caseID == dropButton) {
                                    setDropButton('')
                                } else {
                                    setDropButton(row.caseID)
                                }
                            }}
                        >
                            <DropdownToggle color="primary" className="btn-md btn-rounded"
                                caret>
                                Action{' '}{' '}

                            </DropdownToggle>

                            <DropdownMenu className="dropdown-menu dropdown-menu-end">
                                <DropdownItem
                                    onClick={() => {
                                        dispatch(
                                            caseCreators.requestCaseDetails(
                                                row.caseID
                                            )
                                        );
                                        history.push({
                                            pathname: '/referral-detail',
                                            state: {
                                                caseID: row.caseID,
                                                status: statusP,
                                                decision: decisionP,
                                                duration: durationP,
                                                search: searchval,
                                                page: pagination.current_page,
                                                ordertype: orderType,
                                                ordercolumn: orderColumn,
                                                assignedval: assignedval,
                                            },
                                        });
                                    }}
                                >View Details
                                </DropdownItem>

                                {
                                    userDetails?.accountType == "REFERRING" ? (
                                        <DropdownItem onClick={() => {
                                            dispatch(
                                                caseCreators.requestCaseDetails(
                                                    row.caseID
                                                )
                                            )


                                            setAcceptanceModal(true)


                                            // setReassignModal({caseID: row.caseID, assignedRev: row.assignedRev})
                                        }}>Review Ownership</DropdownItem>
                                    ) : null
                                }

                            </DropdownMenu>
                        </ButtonDropdown>
                    )


                )}

                </>
            )
        }

    }

    //console.log("statusP="+statusP+"decisionP="+decisionP+"durationP"+durationP);
    const Columns = [
        {
            dataField: "caseID",
            text: "Case ID",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
                if (order == "asc") {

                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'CASE_ID', 'ASC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'CASE_ID', 'ASC', null, owner))
                    setOrderColumn('CASE_ID')
                    setOrderType('ASC')
                    setPainationCount({ ...pagination, current_page: 1 })

                } else if (order == "desc") {
                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'CASE_ID', 'DESC', null, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'CASE_ID', 'DESC', null, owner))
                    setOrderColumn('CASE_ID')
                    setOrderType('DESC')
                    setPainationCount({ ...pagination, current_page: 1 })
                }
            }

        },

        {
            dataField: "patientName",
            text: "Patient Name",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
                if (order == "asc") {

                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'PATIENT_NAME', 'ASC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'PATIENT_NAME', 'ASC', null, owner))
                    setOrderColumn('PATIENT_NAME')
                    setOrderType('ASC')
                    setPainationCount({ ...pagination, current_page: 1 })

                } else if (order == "desc") {
                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'PATIENT_NAME', 'DESC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'PATIENT_NAME', 'DESC', null, owner))
                    setOrderColumn('PATIENT_NAME')
                    setOrderType('DESC')
                    setPainationCount({ ...pagination, current_page: 1 })

                }
            }

        },
        {
            dataField: "category",
            text: "Priority",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
                if (order == "asc") {

                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'PRIORITY', 'ASC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'PRIORITY', 'ASC', null, owner))
                    setOrderColumn('PRIORITY')
                    setOrderType('ASC')
                    setPainationCount({ ...pagination, current_page: 1 })
                } else if (order == "desc") {
                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'PRIORITY', 'DESC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'PRIORITY', 'DESC', null, owner))
                    setOrderColumn('PRIORITY')
                    setOrderType('DESC')
                    setPainationCount({ ...pagination, current_page: 1 })
                }
            },
            // eslint-disable-next-line react/display-name
            formatter: (cellContent, row) => (
                <>

                    {row.status != "Incomplete" && row.category ?
                        <>
                            <span
                                className={"font-size-12 badge rounded-pill"}
                                style={{ background: row.categoryColor }}
                                pill
                                id={"priorityBadge" + row.caseID}
                            >
                                <div style={{ color: 'white', fontSize: '20' }}>{row.category}</div>
                            </span>
                            <UncontrolledTooltip
                                target={"priorityBadge" + row.caseID}
                                placement="top"
                                hidden={row.category != "Unknown" && !(row.category == "Routine" && userDetails?.speciality == "Plastic Surgery")}
                            >
                                Case referred to other speciality.
                            </UncontrolledTooltip>
                        </> : <></>}


                </>
            )
        },
        {
            dataField: "pathway",
            text: "Pathway",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
                if (order == "asc") {

                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'PATHWAY', 'ASC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'PATHWAY', 'ASC', null, owner))
                    setOrderColumn('PATHWAY')
                    setOrderType('ASC')
                    setPainationCount({ ...pagination, current_page: 1 })
                } else if (order == "desc") {
                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'PATHWAY', 'DESC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'PATHWAY', 'DESC', null, owner))
                    setOrderColumn('PATHWAY')
                    setOrderType('DESC')
                    setPainationCount({ ...pagination, current_page: 1 })
                }
            }
        },
        {
            dataField: "dateTime",
            isDummyField: true,
            text: "Date/Time",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
                if (order == "asc") {
                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'DATE_TIME', 'ASC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'DATE_TIME', 'ASC', null, owner))
                    setOrderColumn('DATE_TIME')
                    setOrderType('ASC')
                    setPainationCount({ ...pagination, current_page: 1 })
                } else if (order == "desc") {
                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'DATE_TIME', 'DESC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'DATE_TIME', 'DESC', null, owner))
                    setOrderColumn('DATE_TIME')
                    setOrderType('DESC')
                    setPainationCount({ ...pagination, current_page: 1 })
                }
            },

            // eslint-disable-next-line react/display-name
            formatter: (cellContent, row) => (
                <>
                    {moment.utc(row.dateTime).tz("Europe/London").format("DD-MM-YYYY H:mm:s")} Hrs

                </>
            )

        },
        userDetails?.accountType == "REFERRING" && (userDetails?.speciality == "Plastic Surgery" || userDetails?.speciality == "Accident & Emergency") ? {
            dataField: "owner",
            text: "Owner",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
                if (order == "asc") {

                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'DATE_TIME', 'ASC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'DATE_TIME', 'ASC', null, owner))
                    setOrderColumn('OWNER')
                    setOrderType('ASC')
                    setPainationCount({ ...pagination, current_page: 1 })
                } else if (order == "desc") {
                    appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, '', 'DATE_TIME', 'DESC', assignedval, owner, pathway == 'ALL' ? null : pathway))
                        : dispatch(myReferralCreators.requestFetchReferrals(1, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, searchval && searchval, selectedOrg, 'DATE_TIME', 'DESC', null, owner))
                    setOrderColumn('OWNER')
                    setOrderType('DESC')
                    setPainationCount({ ...pagination, current_page: 1 })
                }
            },
        } : (''),
        {
            dataField: "status",
            text: "Status",
            sort: true,
        },
        {
            dataField: "assignedName",
            text: "Assigned to",
            hidden: !(userDetails?.accountType == 'REVIEWER' && (userDetails?.speciality == "Ophthalmology" || userDetails?.speciality == "Optometry" || userDetails?.speciality == "Orthoptics"))
        },
        {
            dataField: "view",
            isDummyField: true,
            text: "Action",
            //eslint-disable-next-line react/display-name
            formatter: dropDownFormatter,
            formatExtraData: dropButton
        },
    ];


    const profileupdatevalidator = profileupdateValidator()

    useEffect(() => {
        debugger;
        setClient(token);
        appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals
            (pagination.current_page, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, '', '', orderColumn, orderType, (userDetails?.accountType == "REVIEWER" && (userDetails?.speciality == "Ophthalmology" || userDetails?.speciality == "Optometry" || userDetails?.speciality == "Orthoptics")) ? 'ME' : 'ALL', owner, pathway == 'ALL' ? null : pathway))
            : dispatch(myReferralCreators.requestFetchReferrals(pagination.current_page, statusP ? statusP : 'ALL', decisionP ? decisionP : "ALL", durationP ? durationP : 'ALL', null, '', selectedOrg, orderColumn, orderType, assignedval, owner))


        if (userDetails?.consultantCode == null || userDetails?.firstName == null || userDetails?.lastName == null
            || userDetails?.email == null || userDetails?.phoneNumber == null || userDetails?.grade == null
            || userDetails?.speciality == null || userDetails?.speciality == false || userDetails?.organisation?.length == 0) {
            dispatch(appCreators.setIncompleteProfileModalOpen())
        }

    }, []);

    useEffect(() => {
        debugger;

        let page = null;
        let orderTyp = null;
        let orderCol = null;
        if (location.state && resetbtn == false) {
            //setStates(statusR,decisionR,durationR);
            console.log("location.state table", location.state)
            setStatusP(location && location.state && location.state.status)
            setDecisionP(location && location.state && location.state.decision)
            setDurationP(location && location.state && location.state.duration)
            setOrderColumn(location && location.state && location.state.ordercolumn)
            setOrderType(location && location.state && location.state.ordertype)
            orderTyp = location && location.state && location.state.ordertype
            orderCol = location && location.state && location.state.ordercolumn
            location && location.state && location.state.search && setSearchval(location.state.search)
            page = location && location.state && location.state.page;
            setPainationCount({ ...pagination, current_page: page ? page : 1 })

            if ('pathway' in location.state) {
                debugger;
                setPathway(location.state.pathway)
            }
            let value = "ALL"
            if ('dashboard' in location.state) {
                console.log("location.state", location.state)
                value = location.state.dashboard === "DEPARTMENT" ? "ALL" : location.state.dashboard
                setAssignedval(location.state.dashboard === "DEPARTMENT" ? "ALL" : location.state.dashboard)
                dispatch(myReferralCreators.requestFetchReferrals(1, statusP, decisionP, durationP, timeP, searchval, null, null, null, value))
                console.log("location.state")
            }

            const DirectedFrom = location && location.state && location.state.DirectedFrom;
            let assignedvalue = location && location.state && location.state.assignedval;
            debugger;
            if (assignedvalue && DirectedFrom == "referralDetail") {
                value = assignedvalue;
            }


            appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(page ? page : pagination.current_page, location && location.state && location.state.status, location && location.state && location.state.decision
                , location && location.state && location.state.duration, '', location && location.state && location.state.search, '', orderCol, orderTyp, userDetails?.accountType == "REVIEWER" && (userDetails?.speciality == "Ophthalmology" || userDetails?.speciality == "Optometry" || userDetails?.speciality == "Orthoptics") ? 'ME' : 'ALL', pathway == 'ALL' ? null : pathway))
                : dispatch(myReferralCreators.requestFetchReferrals(page ? page : pagination.current_page, location && location.state && location.state.status, location && location.state && location.state.decision
                    , location && location.state && location.state.duration, '', location && location.state && location.state.search, "", orderCol, orderTyp, value))
        }

    }, [location.state]);
    const toggle = () => {
        setModal(!modal);
    };

    const toLowerCase1 = str => {
        return str.toLowerCase();
    };

    const handleOrderClick = arg => {
        const order = arg;

        setOrderList({
            id: order.id,
            orderId: order.orderId,
            billingName: order.billingName,
            orderdate: order.orderdate,
            total: order.total,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            badgeclass: order.badgeclass,
        });

        setIsEdit(true);

        toggle();
    };

    var node = useRef();

    const selectRow = {
        mode: 'checkbox'
    }


    const handleValidOrderSubmit = (e, values) => {
        if (isEdit) {
            const updateOrder = {
                id: orderList.id,
                orderId: values.orderId,
                billingName: values.billingName,
                orderdate: values.orderdate,
                total: values.total,
                paymentStatus: values.paymentStatus,
                paymentMethod: values.paymentMethod,
                badgeclass: values.badgeclass,
            };

            // update order

        } else {
            const newOrder = {
                id: Math.floor(Math.random() * (30 - 20)) + 20,
                orderId: values["orderId"],
                billingName: values["billingName"],
                orderdate: values["orderdate"],
                total: values["total"],
                paymentStatus: values["paymentStatus"],
                paymentMethod: values["paymentMethod"],
                badgeclass: values["badgeclass"],
            };
            // save new order
            dispatch(onAddNewOrder(newOrder));
        }
        toggle();
    };

    const handleOrderClicks = () => {
        setOrderList("");
        setIsEdit(false);
        toggle();
    };

    const handleValidDate = date => {
        const date1 = moment(new Date(date)).format("DD MMM Y");
        return date1;
    };

    const defaultSorted = [
        {
            dataField: "dateTime",
            order: "desc",
        },
    ];


    const handlePageClick = (data) => {
        console.log("data", data);
        let selected = data && data.selected + 1;
        setPainationCount({ ...pagination, current_page: selected })
        console.log(pagination.current_page)

        console.log(assignedval, 'buttercup')
        appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(selected, statusP, decisionP, durationP, timeP, searchval, null, orderColumn, orderType, assignedval, owner, pathway == 'ALL' ? null : pathway))
            : dispatch(myReferralCreators.requestFetchReferrals(selected, statusP, decisionP, durationP, timeP, '', "", orderColumn, orderType, assignedval, owner))
    }

    const handleValidSubmit = (event, values) => {
        console.log("formvalue", values);
        let time = '';
        if (values.duration == "ALL") {
            time = 'null';

            SETTIME('');
        } else if (values.duration == "48") {
            time = 'hour';

            SETTIME('hour');
        } else if (values.duration == "7") {
            time = 'day';
            SETTIME('day');
        } else if (values.duration == "28") {
            time = 'day';
            SETTIME('day');
        }
        setActive(1)
        setStates(values.Status, values.decision, values.duration, values.assigned)
        setPainationCount({ ...pagination, current_page: 1 })
        appRole == 'BCH_CLINICIAN' ?
            dispatch(myReferralCreators.requestFetchReferrals(1, "REASSIGNED", values.decision, values.duration, time, values.search, null, null, null, values.assigned, owner, pathway == 'ALL' ? null : pathway))
            : dispatch(myReferralCreators.requestFetchReferrals(1, "REASSIGNED", values.decision, values.duration, time, values.search, "", "", "", assignedval, owner))
    }

    const [active, setActive] = useState(1)

    let items = [];
    {/*
for (let number = 1; number <= referrals.totalPages; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active} onClick={()=>{setActive(number);
      dispatch(myReferralCreators.requestFetchReferrals(number,statusP,decisionP,durationP,timeP, '')) }}>
      {number}
    </Pagination.Item>,
  );
}
*/
    }


    const tableRowEvents = {
        onClick: (e, row, rowIndex) => {
            try {

                if (row.status != 'Cancelled') {
                    if (row.status == "Incomplete" && appRole == "REFERRING_CLINICIAN") {
                        dispatch(createReferralCreators.resetState())
                        dispatch(createReferralCreators.requestIncompleteCase(row.caseID))
                        history.push({
                            pathname: '/create-referral'
                        })
                    } else {
                        dispatch(caseCreators.requestCaseDetails(row.caseID))
                        history.push({
                            pathname: '/referral-detail',
                            state: {
                                caseID: row.caseID,
                                status: statusP,
                                decision: decisionP,
                                duration: durationP,
                                search: searchval,
                                page: pagination.current_page,
                                ordertype: orderType,
                                ordercolumn: orderColumn,
                                assignedval: assignedval,
                                owner: owner,
                            }
                        })
                    }
                }
            } catch (error) {

            }
            console.log(`clicked on row with index: ${rowIndex} ${JSON.stringify(row)}
                        \n\ne: ${e}
            `);
        },
    }

    const onUnitChange = (e) => {
        console.log(e.target.value)
        setStatusval(e.target.value)

        // setDecisionP(e.target.value)
        //setStates(e.target.value)
    }

    const x = useMotionValue(0)
    const input = [-200, 0, 200]
    const output = [0, 1, 0]
    const opacity = useTransform(x, input, output)


    return (
        <motion.div className="page-content" exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>



            <MetaTags>
                <title>{userDetails?.accountType === "REFERRING" ? "Ownership Requests" : "My Referral"} | TriVice</title>
            </MetaTags>
            <Container fluid>
                <Breadcrumbs title="Dashboard" breadcrumbItem={userDetails?.accountType === "REFERRING" ? "Ownership Requests" : "My Referral"} content={<Content />}> </Breadcrumbs>
                <Row>
                    <Col xs="12">

                        <Card>
                            <CardBody>
                                <AvForm className="row gy-2 gx-3 align-items-center"
                                    onValidSubmit={(e, v) => {
                                        handleValidSubmit(e, v)
                                    }}
                                >
                                    <div className="col-sm-auto">
                                        <AvField
                                            name="search"
                                            label="Search"
                                            className="form-control"
                                            placeholder="NHS num/patient name"
                                            type="text"
                                            value={searchval}
                                            onChange={setSearchvalue}


                                        />
                                    </div>

                                    {/* <div className="col-sm-auto">
                                        <AvField
                                            name="Status"
                                            label="Status"
                                            className="form-control"
                                            type="select"
                                            htmlFor="autoSizingSelect"
                                            onChange={onUnitChange}

                                            value={resetbtn == true ? statusP : statusR ? statusR : statusP}

                                        >

                                            {
                                                status && status.map((item, key) => {
                                                    return (
                                                        <option key={key}
                                                                value={item && item.value}>{item && item.title}</option>
                                                    )
                                                })
                                            }
                                        </AvField>
                                    </div> */}
                                    <div className="col-sm-auto">
                                        <AvField
                                            name="decision"
                                            label="Priority"
                                            className="form-control"
                                            type="select"
                                            htmlFor="autoSizingSelect"
                                            value={resetbtn == true ? decisionP : decisionR ? decisionR : decisionP}
                                            onChange={setDecisionValue}

                                        >

                                            {
                                                decision && decision.map((item, key) => {
                                                    return (
                                                        <option key={key}
                                                            value={item && item.value}>{item && item.title}</option>
                                                    )
                                                })
                                            }
                                        </AvField>
                                    </div>
                                    <div className="col-sm-auto">
                                        <AvField
                                            name="duration"
                                            label="Duration"
                                            className="form-control"
                                            type="select"
                                            htmlFor="autoSizingSelect"
                                            value={resetbtn == true ? durationP : durationR ? durationR : durationP}
                                            onChange={setDurationValue}
                                        >

                                            {
                                                duration && duration.map((item, key) => {
                                                    return (
                                                        <option key={key}
                                                            value={item && item.value}>{item && item.title}</option>
                                                    )
                                                })
                                            }
                                        </AvField>
                                    </div>
                                    {userDetails?.accountType == 'REVIEWER' && (userDetails?.speciality == "Ophthalmology" || userDetails?.speciality == "Optometry" || userDetails?.speciality == "Orthoptics") && (
                                        <div className="col-sm-auto">
                                            <AvField
                                                name="assigned"
                                                label="Assigned to"
                                                className="form-control"
                                                type="select"
                                                htmlFor="autoSizingSelect"
                                                value={assingedP}
                                                onChange={setAssignedValue}
                                            >
                                                {
                                                    assigned && assigned.map((item, key) => {
                                                        return (
                                                            <option key={key}
                                                                value={item && item.value}>{item && item.title}</option>
                                                        )
                                                    })
                                                }
                                            </AvField>
                                        </div>
                                    )}
                                    {/* {userDetails?.accountType == 'REFERRING' && (userDetails?.speciality == "Plastic Surgery" || userDetails?.speciality == "Accident & Emergency")  ? (
                                        <div className="col-sm-auto">
                                            <AvField
                                                name="owner"
                                                label="Owner"
                                                className="form-control"
                                                type="select"
                                                htmlFor="autoSizingSelect"
                                                value={owner}
                                                onChange={(e) =>setOwnerValue(e)}
                                            >
                                                <option  value="">All</option>
                                                {
                                                    clinicians && clinicians.sort((a,b) =>   a.label > b.label ? 1 : -1).map((item, key) => {

                                                        return (
                                                            <option key={key} value={item && item.value}>{item.label}</option>
                                                        )
                                                    })
                                                }
                                            </AvField>
                                        </div>
                                    ):null} */}


                                    <div className="col-sm-auto h-300" style={{ height: '65px' }}>
                                        <button style={{ marginTop: '20px' }}
                                            className="btn btn-primary w-md "
                                            type="submit"
                                            ref={submitButtonRef}
                                        >
                                            Search
                                        </button>
                                    </div>

                                    <div className="col-sm-auto h-300" style={{ height: '65px' }}>
                                        <button style={{ marginTop: '20px' }} onClick={() => {
                                            setSearchval('')
                                            setStates('ALL', 'ALL', 'ALL', 'ALL');
                                            setResetbtn(true)
                                            setOrderColumn('')
                                            setOrderType('')
                                            setPainationCount({ ...pagination, current_page: 1 })
                                            setOrderType('DESC')
                                            setOrderColumn('DATE_TIME')
                                            setAssignedval(userDetails?.accountType == "REVIEWER" ? "ALL" : "ME")
                                            console.log("in setstate")
                                            appRole == 'BCH_CLINICIAN' ? dispatch(myReferralCreators.requestFetchReferrals(1, 'REASSIGNED', "ALL", 'ALL', null, '', '', 'DATE_TIME', 'DESC', 'ME', owner, pathway == 'ALL' ? null : pathway))
                                                : dispatch(myReferralCreators.requestFetchReferrals(1, "REASSIGNED", "ALL", 'ALL', null, '', "", 'DATE_TIME', 'DESC', 'ME', owner))
                                        }}
                                            className="btn btn-primary w-md "
                                            type="reset"

                                        >
                                            Reset
                                        </button>
                                    </div>

                                </AvForm>

                                <ToolkitProvider
                                    keyField="dateTime"
                                    data={dataSource}
                                    columns={Columns}

                                >
                                    {toolkitProps => (
                                        <React.Fragment>

                                            <Row className="mt-4">
                                                <Col xl="12">
                                                    <div className="table-responsive table-condensed">

                                                        <BootstrapTable
                                                            keyField="dateTime"
                                                            responsive
                                                            condensed
                                                            bordered={false}
                                                            striped={false}
                                                            defaultSorted={defaultSorted}
                                                            rowEvents={tableRowEvents}
                                                            classes={
                                                                "table align-middle table-nowrap table-check "
                                                            }
                                                            headerWrapperClasses={"table-light"}

                                                            {...toolkitProps.baseProps}
                                                            ref={n => node = n}

                                                        />
                                                        <div style={{ float: 'right' }}>
                                                            {/* <Pagination >{items}</Pagination> */}
                                                            <ReactPaginate
                                                                previousLabel={"previous"}
                                                                nextLabel={"next"}
                                                                breakLabel={"..."}
                                                                pageCount={referrals && referrals.totalPages ? referrals.totalPages : 0}
                                                                marginPagesDisplayed={2}
                                                                pageRangeDisplayed={3}
                                                                forcePage={pagination.current_page - 1}
                                                                onPageChange={handlePageClick}
                                                                containerClassName={"pagination justify-content-center"}
                                                                pageClassName={"page-item"}
                                                                pageLinkClassName={"page-link"}
                                                                previousClassName={"page-item"}
                                                                previousLinkClassName={"page-link"}
                                                                nextClassName={"page-item"}
                                                                nextLinkClassName={"page-link"}
                                                                breakClassName={"page-item"}
                                                                breakLinkClassName={"page-link"}
                                                                activeClassName={"active"}
                                                            />
                                                        </div>
                                                    </div>


                                                </Col>
                                            </Row>

                                        </React.Fragment>
                                    )}
                                </ToolkitProvider>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    isOpen={orgmod}
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
                                    dispatch(bchDashboardCreators.setUserOrganisation({ orgID: org }));
                                    setorgmod(false);
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
                <Modal
                    isOpen={orthoptic}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i className="fa fa-warning"></i> Orthoptics
                        </h5>
                        <button
                            type="button"
                            className="btn btn-danger btn-close"

                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body ">
                        <p>Are you the On Call Orthoptist for today?</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                setOrthoptic(false);
                            }}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                dispatch(bchDashboardCreators.updateOnCallRegistrar(token));
                                setOrthoptic(false);
                            }}
                        >
                            Yes
                        </button>
                    </div>
                </Modal>
                <Modal
                    isOpen={JSON.stringify(reassignModal) != '{}'}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i className="fa fa-warning"></i> {userDetails?.accountType == "REFERRING" ? "Change Owner" : "Assign to"}
                        </h5>
                        <button
                            type="button"
                            className="btn btn-danger btn-close"
                            onClick={() => setReassignModal({})}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body" style={{ overflow: 'hidden' }}>
                        {userDetails?.accountType == "REFERRING" ? <>
                            <Col>
                                <div className="mb-3">
                                    <label><span style={{ fontWeight: 'bold' }}>Organisation:</span> {organisations.length == 1 ? organisations[0]['name'] : ''}</label><br />
                                    <label><span style={{ fontWeight: 'bold' }}>Department:</span> {currentUser.speciality}</label>
                                </div>
                            </Col>
                        </> : ''}
                        <Col>
                            <div className="mb-3">
                                <Select
                                    value={clinician}
                                    onChange={(e) => {
                                        setClinician(e)
                                    }}
                                    options={clinicians.sort((a, b) => a.label > b.label ? 1 : -1)}
                                    className="select2"
                                    placeholder={userDetails?.accountType == "REFERRING" ? "Change Owner" : "Assign to"}
                                    classNamePrefix="select2 select2-selection"
                                    maxMenuHeight='15vh'
                                />
                            </div>
                        </Col>
                        <Col>
                            <div className="mb-3">
                                <lable><span style={{ fontWeight: 'bold' }}>Reasons/comments for change:</span><span style={{ color: 'red' }}>*</span></lable>
                                <Input
                                    type="textarea"
                                    id="templateDescription"
                                    name="templateDescription"
                                    placeholder="Enter a reasons/comments for change"
                                    className="form-control"
                                    value={resonforchange}
                                    rows="10"
                                    onChange={(e) => {
                                        setResonForChange(e.target.value)
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="confirm-checkbox"
                                />
                                <label>

                                    &nbsp; I have discussed transfer of ownership with the new owner. <span style={{ color: 'red' }}>*</span>
                                </label>
                            </div>




                            {/*<Input type="textarea" id="templateDescription" name="templateDescription" cols="5" placeholder="Enter a comment" className="form-control"  />*/}

                        </Col>
                        <div style={{ marginBottom: '2vh' }}></div>
                        {reassignModal.assignedRev != undefined && (
                            <p>Assigned
                                Clinician: {reassignModal.assignedRev.firstName} {reassignModal.assignedRev.lastName}</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={clinician == null || resonforchange == ''}
                            onClick={(e) => {
                                setChangeOwnerAlert(true);
                            }}
                        >
                            {userDetails?.accountType == "REFERRING" ? "Save" : "Assign to"}
                        </button>
                    </div>
                </Modal>
                {/* { showCancelCaseAlert &&  <SweetAlert
              warning
              showCancel
              // confirmBtnText="Yes, delete it!"
              // confirmBtnBsStyle="danger"

              customIcon={
                <i className="mdi mdi-alert-outline me-2"/>
            }
              title=""
              customButtons={
                <React.Fragment>
                  <div style={{display:"flex",gap:"5px"}} >
                  <button
                  type="button"
                  className="btn btn-primary"
                  onClick={()=>setShowCancelCaseAlert(false)}>No</button>
                  <button
                  type="button"
                  className="btn btn-danger"
                  onClick={()=>{
                    dispatch(
                      createReferralCreators.requestCaseCancel(
                        selectedCaseID,()=>refreshDataOnDelete()
                      ))
                    setShowCancelCaseAlert(false)
                }}>Yes</button>
                </div>
                </React.Fragment>
              }
              onCancel={()=>setShowCancelCaseAlert(false)}
              focusCancelBtn
            >

            </SweetAlert>} */}

                <Modal
                    isOpen={showCancelCaseAlert}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i style={{ color: 'red' }} className="fa fa-exclamation-triangle"></i> Important
                        </h5>
                    </div>
                    <div
                        className="modal-body">
                        {`Please note once referral has been cancelled then it cannot be re-opened. Do you wish to cancel the referral ?`}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setShowCancelCaseAlert(false)
                            }}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                dispatch(
                                    createReferralCreators.requestCaseCancel(
                                        selectedCaseID, () => refreshDataOnDelete(), currentUser._id
                                    ))
                                setShowCancelCaseAlert(false)
                            }}
                        >
                            Yes
                        </button>
                    </div>
                </Modal>
                <Modal
                    isOpen={showChangeOwnerAlert}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i style={{ color: 'red' }} className="fa fa-exclamation-triangle"></i> Important
                        </h5>
                    </div>
                    <div
                        className="modal-body">
                        {`Do you want to change the referral owner ?`}
                        <br></br>
                        <br></br>
                        <p><span style={{ fontWeight: 'bold' }}>Note:</span> The transfer of ownership will occur only after the new owner has accepted it. Untill then, you will remain the current owner by default. </p>

                    </div>


                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setChangeOwnerAlert(false)
                            }}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                setReassignModal({});
                                //reassignModal is set to the caseid
                                dispatch(myReferralCreators.reassignCase(reassignModal.caseID, clinician, resonforchange))
                                setClinician();
                                setResonForChange('');
                                setChangeOwnerAlert(false)
                            }}
                        >
                            Yes
                        </button>

                    </div>

                </Modal>

                <Modal
                    isOpen={showCancelCaseAlert}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i style={{ color: 'red' }} className="fa fa-exclamation-triangle"></i> Important
                        </h5>
                    </div>
                    <div
                        className="modal-body">
                        {`Please note once referral has been cancelled then it cannot be re-opened. Do you wish to cancel the referral ?`}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setShowCancelCaseAlert(false)
                            }}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                dispatch(
                                    createReferralCreators.requestCaseCancel(
                                        selectedCaseID, () => refreshDataOnDelete(), currentUser._id
                                    ))
                                setShowCancelCaseAlert(false)
                            }}
                        >
                            Yes
                        </button>
                    </div>
                </Modal>

                <Modal
                    isOpen={acceptanceModal}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}

                    id="staticBackdrop">




                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            Change Owner
                        </h5>
                    </div>
                    <div className="modal-body">


                        {'This case has been assigned to you.'}
                        <br></br>
                        <br></br>

                        {'Current Owner: '} <b>{caseDetails?.assignedReferrer?.firstName} {' '} {caseDetails?.assignedReferrer?.lastName} </b>

                        <br></br>
                        <br></br>
                        {"Reason for Change: "} <b> {caseDetails?.ownerChangedAdditionalComment} </b>

                        <br></br>
                        <br></br>

                        {"Do you accept this case ownership?"}

                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                dispatch(myReferralCreators.acceptNewOwner(false, caseDetails.caseID))
                                setAcceptanceModal(false),
                                    refreshDataOnDelete(),
                                    setShowNo(true)

                            }}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                dispatch(myReferralCreators.acceptNewOwner(true, caseDetails.caseID))
                                setAcceptanceModal(false),
                                    refreshDataOnDelete()
                                setShowYes(true)
                            }}
                        >
                            Yes
                        </button>
                    </div>





                </Modal>

                <Modal isOpen={showYes}
                    scrollable={true}
                    backdrop={'static'}eferral
                    centered={true}>

                    <div className='modal-header'></div>

                    <div className='modal-body'>
                        This case is now assigned to you. </div>

                    <div className='modal-footer'>
                        <Button color="primary" onClick={() => setShowYes(false)}>Ok</Button>
                    </div>
                </Modal>
                <Modal isOpen={showNo} onHide={() => setShowNo(false)}

                    scrollable={true}
                    backdrop={'static'}
                    centered={true}>
                    <div className='modal-header'></div>

                    <div className='modal-body'>
                        The case assignment is unchanged </div>

                    <div className='modal-footer'>
                        <Button color="primary" onClick={() => setShowNo(false)}>Ok</Button>
                    </div></Modal>

                <OffcanvasCasePdfViewer showModal={modalvisiblePDF} modalClose={() => setModalVisiblePDF(false)} />
            </Container>
        </motion.div>
    );
};

EcommerceOrders.propTypes = {
    orders: PropTypes.array,
    onGetOrders: PropTypes.func,
    onAddNewOrder: PropTypes.func,
    onDeleteOrder: PropTypes.func,
    onUpdateOrder: PropTypes.func,
};

export default withRouter(EcommerceOrders);