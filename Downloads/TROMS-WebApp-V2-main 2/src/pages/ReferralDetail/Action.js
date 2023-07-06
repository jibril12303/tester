import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Col,
    Input,
    FormFeedback,
    Badge
} from 'reactstrap'
import {useSelector, useDispatch} from 'react-redux';
import {caseTypes, caseCreators} from "store/caseDeatils/reducer"
import {useHistory} from "react-router-dom";
import {showToast} from 'utils/toastnotify';
import RubberStamp from './RubberStamp';
import Timeline from './Timeline';
import Accordians from "./Accordians";
import checkPermission from 'functions/checkPermission';

const Action = (props) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [showRubberStamp, setShowRubberStamp] = useState(false)
    const [btnSelected, setBtnSelected] = useState(null)
    const [showSuggestedActionDescription, setSuggestedActionDescription] = useState(false)
    var appState = JSON.parse(localStorage.getItem('applicationState'));
    const userDetails = appState && appState.appReducer && appState.appReducer.userDetails;
    const [form, setForm] = useState({
        priority: "",
        notes: "",
        internalNotes: "",
        consultantName: ""
    })
    const [error, setError] = useState({
        priority: false,
        notes: false,
        internalNotes: false,
        consultantName: false
    })

    const nonStaffUser = !(checkPermission('staff-admin') || checkPermission('staff-member'))

    function Capitalized(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    }

    const checkFields = () => {
        //debugger
        //consultant name
        setError({
            consultantName: form.consultantName == "" || !/\S/.test(form.consultantName),
            notes: form.notes == "" || !/\S/.test(form.notes),
            internalNotes: form.internalNotes == "" || !/\S/.test(form.internalNotes),
            priority: form.priority == "" || form.priority == "Select..."
        })
        //return invalid
        if (form.consultantName == "" || !/\S/.test(form.consultantName) || form.notes == "" || !/\S/.test(form.notes) || form.internalNotes == "" || !/\S/.test(form.internalNotes) || (form.priority == "" && btnSelected == "No") || (form.priority == "Select..." && btnSelected == "No")) return false

    }
    const onSubmit = () => {
        //   console.log("in submit fucntion",JSON.stringify(values));
        if (checkFields() == false) return;
        const payload = {
            caseID: props.Case.caseID,
            consultantName: form.consultantName,
            internalNotes: form.internalNotes,
            notes: form.notes,
            agreeSuggestedAction: true,
            referralAccepted: true,
            lastEdited: props.Case?.lastEdited,

        }
        dispatch(caseCreators.updateCaseDetails(payload, history))
        //  showToast('You can fill out the rubber stamp','info')
        //  props.setShowRS(true)


    }
    const onNosubmit = () => {
        if (checkFields() == false) return;
        const payload = {
            caseID: props.Case.caseID,
            consultantName: form.consultantName,
            internalNotes: form.internalNotes,
            suggestedAction: form.notes,
            agreeSuggestedAction: false,
            referralAccepted: true,
            lastEdited: props.Case?.lastEdited,
            pathwayOutcome: form.priority,


        }
        dispatch(caseCreators.updateCaseDetails(payload, history))
    }
    if (props.Case?.referralAccepted === true || props.appRole === "REFERRING_CLINICIAN") {
        if (props.Case?.specialitySelected == undefined) {
            return (
                <div>
                    Loading...
                </div>
            )
        }
        if (props.Case?.specialitySelected != "Ophthalmology") {

            return (
                <>
                    {(props.Case?.agreeSuggestedAction == false) && (
                        <div className='p-4 border mb-3'>
                            <h4>Updated priority and action</h4>
                            <div>
                                <strong>Priority: </strong>
                                <span
                                    className={"font-size-12 badge rounded-pill"}
                                    style={{background: props.Case?.triageID?.colorCode}}
                                    pill
                                >
                        <div style={{color: 'white', fontSize: '20'}}>
                            {props.Case?.triageID?.priority}
                        </div>
                        </span>
                            </div>
                            <br/>
                            {
                                props.Case?.suggestedAction?.split("\n").length >0 &&
                                <>
                            <strong style={{textDecoration: 'underline'}}>Recommended
                                action: </strong>{props.Case?.suggestedAction?.split("\n").map((item, index) => {
                            return (
                                <div key={index}>
                                    <p>{item}</p>
                                </div>
                            )
                        })}
                                </>
                            }
                            <br/>
                            {(props.appRole == "BCH_CLINICIAN" && props.Case?.rubberStamp != undefined )&& (
                                <RubberStamp Case={props.Case}/>
                            )}
                        </div>
                    )}
                    <div className='p-4 border mb-3' style={props.Case?.agreeSuggestedAction == false ? {
                        backgroundColor: 'white',
                        zIndex: 20,
                        height: '100%',
                        width: '100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        top: '0px',
                        left: '0px',
                        opacity: 0.5,
                        MozOpacity: 0.5
                    } : {}}>
                        <h4>Suggested priority and action for referrer</h4>
                        <div className='mb-2'>
                            <strong>Priority: </strong>
                            <span
                                className={"font-size-12 badge rounded-pill"}
                                style={{background: props.Case?.originalTriageID.colorCode}}
                                pill
                            >
                            
                        <div style={{color: 'white', fontSize: '20'}}>
                            {props.Case?.originalTriageID?.priority}
                        </div>
                        </span>
                        </div>
                        <div className='mb-2'>
                            <strong>Original suggested action: </strong> {props.Case?.originalSuggestedAction ? props.Case?.originalSuggestedAction : "Not Available"}
                        </div>
                        {props.Case?.lifeThreatening != undefined && props.Case?.specialitySelected == "Plastic Surgery" && ['Soft tissue injury including hand & arm', 'Hand and wrist fracture'].includes(props.Case?.pathway) && (
                            <div>
                                <div className='mb-2'>
                                    <strong>Limb or life
                                        Threatening:</strong> {props.Case?.lifeThreatening != undefined ? (props.Case?.lifeThreatening ? "Yes" : "No") : "Not Available"}
                                </div>
                            </div>
                        )}
                        <div className="mt-3">
                            <div className="accordion" id="accordion">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button fw-medium collapsed" type="button"
                                                onClick={() => {
                                                    setSuggestedActionDescription(showSuggestedActionDescription ? false : true);
                                                }}
                                                style={{cursor: 'pointer', paddingLeft: '0',background:'#EFF1FC'}}>
                                            <strong>&nbsp;&nbsp;{showSuggestedActionDescription ? (
                                                <i className="mdi mdi-minus fa-1x"></i>) : (
                                                <i className="mdi mdi-plus fa-1x"></i>)}&nbsp;&nbsp;Instructions for
                                                referring
                                                clinician (Click to expand or collapse)</strong>
                                        </button>
                                    </h2>
                                    <div
                                        className={showSuggestedActionDescription ? "accordion-collapse collapse show" : "accordion-collapse collapse"}>
                                        <div className="accordion-body">
                                            <div className="text-muted">
                                                {props.Case?.originalSuggestedActionDescription?.split("\n").map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <p>{item}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {props?.Case != undefined && 'callTimeline' in props.Case && props.Case?.callTimeline?.length > 0 && (
                            <Timeline timeline={props.Case.callTimeline}/>
                        )}
                        {props?.Case != undefined && 'endpointNotes' in props.Case && props.Case?.endpointNotes?.length > 0 && (
                            <div>
                                <strong>Additional notes from referrer:</strong>
                                <br/>
                                {props.Case.endpointNotes.split('\n').map((item, key) => {
                                    return <p key={key}>{item}</p>
                                })}
                            </div>
                        )}
                    </div>
                    {(props.Case?.agreeSuggestedAction == true && props.Case?.rubberStamp != undefined) && (
                        <RubberStamp Case={props.Case}/>
                    )}
                    {(props.appRole == "BCH_CLINICIAN" && userDetails?.accountType == "REFERRING" && props.Case?.internalNotes != undefined) && (
                        <div className='p-4 border mb-3'>
                            <h4>Internal notes / Agreed actions (not visible to referrer)</h4>
                            <div className="mt-3">
                                {props.Case?.internalNotes.split("\n").map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <p>{item}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    {/*    {(userDetails?.accountType == "REFERRING" && props.Case?.notes != undefined && props.Case?.status?.toLowerCase() == "accepted") && (*/}
                    {/*    <div className='p-4 border mb-3'>*/}
                    {/*    <h4>{props.appRole == "BCH_CLINICIAN" ? "Notes to the referrer" : "Notes from the reviewer"}</h4>*/}
                    {/*    <div className="mt-3">*/}
                    {/*        {props.Case?.notes?.split("\n").map((item,index)=>{*/}
                    {/*            return(*/}
                    {/*                <div key={index}>*/}
                    {/*                    <p>{item}</p>*/}
                    {/*                </div>*/}
                    {/*            )*/}
                    {/*        })}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*    )}*/}
                    {props.Case?.consultantName && (
                        <div className='p-4 border mb-3'>
                            <h4 className='mb-1'>Other details</h4>
                            {/*Consultant name: {props.Case.consultantName ? props.Case.consultantName : "Not Available" }*/}
                            <div>
                                Case triaged
                                by: {`${props.Case?.acceptedBy?.firstName} ${props.Case?.acceptedBy?.lastName}`}
                            </div>
                            {typeof props.Case?.onCallDoctor != 'undefined' && (
                                <div>
                                    On call
                                    Registrar: {`${props.Case?.onCallDoctor?.firstName} ${props.Case?.onCallDoctor?.lastName}`}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )
        } else if (props.Case?.specialitySelected == "Ophthalmology") {
            return (
                <>
                    {props.appRole == "REFERRING_CLINICIAN" && props?.Case.rubberStamp != undefined && 'Reason to decline' in props.Case?.rubberStamp && props.snippet?.data && (
                        <div className='p-4 border mb-3'>
                            <h4>Reviewer response</h4>
                            {props.Case?.rubberStamp["Reason to decline"]["Rejection reason"] && (
                                <div>
                                    Reason to
                                    decline: {props.Case?.rubberStamp["Reason to decline"]["Rejection reason"]}
                                </div>
                            )}

                            <br/>
                            <div>
                                {props.snippet.data?.split('\n').map((i, ind) => {
                                    return <p key={ind}>{i}</p>
                                })}
                            </div>

                        </div>
                    )}
                    <div className='p-4 border mb-3' style={props.Case?.agreeSuggestedAction == false ? {
                        backgroundColor: 'white',
                        zIndex: 20,
                        height: '100%',
                        width: '100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        top: '0px',
                        left: '0px',
                        opacity: 0.5,
                        MozOpacity: 0.5
                    } : {}}>
                        <h4>Suggested priority and action for referrer</h4>
                        <div className='mb-2'>
                            <strong>Priority: </strong>
                            <span
                                className={"font-size-12 badge rounded-pill"}
                                style={{background: props.Case?.originalTriageID.colorCode}}
                                pill
                            >
                        <div style={{color: 'white', fontSize: '20'}}>
                            {props.Case?.originalTriageID?.priority}
                        </div>
                        </span>
                        </div>
                        <div className='mb-2'>
                            <strong>Original suggested action: </strong> {props.Case?.originalSuggestedAction ? props.Case?.originalSuggestedAction : "Not Available"}
                        </div>
                        <div className="mt-3">
                            <div className="accordion" id="accordion">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button fw-medium collapsed" type="button"
                                                onClick={() => {
                                                    setSuggestedActionDescription(showSuggestedActionDescription ? false : true);
                                                }}
                                                style={{cursor: 'pointer', paddingLeft: '0',background:'#EFF1FC'}}>
                                            <strong>&nbsp;&nbsp;{showSuggestedActionDescription ? (
                                                <i className="mdi mdi-minus fa-1x"></i>) : (
                                                <i className="mdi mdi-plus fa-1x"></i>)}&nbsp;&nbsp;Instructions for
                                                referring
                                                clinician (Click to expand or collapse)</strong>
                                        </button>
                                    </h2>
                                    <div
                                        className={showSuggestedActionDescription ? "accordion-collapse collapse show" : "accordion-collapse collapse"}>
                                        <div className="accordion-body">
                                            <div className="text-muted">
                                                {props.Case?.originalSuggestedActionDescription.split("\n").map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <p>{item}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {props.Case?.referralAccepted && (
                        <div className='p-4 border mb-3'>
                            Referral triaged
                            by: {typeof props.Case?.acceptedBy == "undefined" ? "Unknown" : `${props.Case?.acceptedBy.firstName} ${props?.Case?.acceptedBy.lastName}`}
                            <br/>
                            Referral status: {props.Case?.status ? props.Case.status : 'Unknown'}
                        </div>
                    )}
                    {props.appRole == "BCH_CLINICIAN" && (
                        <RubberStamp Case={props.Case}/>
                    )}
                </>
            )
        }

    } else if (props.appRole == "BCH_CLINICIAN") {
        return (
            <>
                <div className='p-4 border mb-3'>
                    <h4>{"Suggested priority and action for referrer"}</h4>
                    <div>
                        <strong>Priority: </strong>
                        <span
                            className={"font-size-12 badge rounded-pill"}
                            style={{background: props.Case?.originalTriageID.colorCode}}
                            pill
                        >
                        <div style={{color: 'white', fontSize: '20'}}>
                            {props.Case?.originalTriageID?.priority}
                        </div></span>
                        
                        
                    </div>
                   
                    <br/>
                    {props?.Case && props?.Case.originalSuggestedAction && (
                        <div>
                            <strong>Suggested
                                action:</strong> {props.Case?.originalSuggestedAction ? props.Case?.originalSuggestedAction : "Not Available"}
                        </div>
                    )}
                    <br/>
                    {/* Extravsation call timeline from the endpoint file */}
                    {props.Case?.lifeThreatening != undefined && props.Case?.specialitySelected == "Plastic Surgery" && ['Soft tissue injury including hand & arm', 'Hand and wrist fracture'].includes(props.Case?.pathway) && (
                        <div>
                            <div className='mb-2'>
                                <strong>Limb or life
                                    Threatening:</strong> {props.Case?.lifeThreatening != undefined ? (props.Case?.lifeThreatening ? "Yes" : "No") : "Not Available"}
                            </div>
                        </div>
                    )}
                    <div className="mt-3">
                        <div className="accordion" id="accordion">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button fw-medium collapsed" type="button"
                                            onClick={() => {
                                                setSuggestedActionDescription(showSuggestedActionDescription ? false : true);
                                            }}
                                            style={{cursor: 'pointer', paddingLeft: '0',background:'#EFF1FC'}}>
                                        <strong>&nbsp;&nbsp;{showSuggestedActionDescription ? (
                                            <i className="mdi mdi-minus fa-1x"></i>) : (
                                            <i className="mdi mdi-plus fa-1x"></i>)}&nbsp;&nbsp;Instructions for
                                            referring
                                            clinician (Click to expand or collapse)</strong>
                                    </button>
                                </h2>
                                <div
                                    className={showSuggestedActionDescription ? "accordion-collapse collapse show" : "accordion-collapse collapse"}>
                                    <div className="accordion-body">
                                        <div className="text-muted">
                                        
                                            {props.Case?.originalSuggestedActionDescription ? props.Case?.originalSuggestedActionDescription.split("\n").map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <p>{item}</p>
                                                    </div>
                                                )
                                            }) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {props.Case?.originalTriageID?.code == "LOCAL" && props.Case?.specialitySelected == "Plastic Surgery" && (
                        <>
                        <br></br>
                        <div>
                        <RubberStamp Case={props}/>
                        <br></br>
                        </div>
                        <div>
                        </div>
                        </>
                        )}

                        
                    </div>


                    <div className="mt-3">
                        {props?.Case != undefined && 'callTimeline' in props.Case && props.Case?.callTimeline?.length > 0 && (
                            <Timeline timeline={props.Case.callTimeline}/>
                        )}
                    </div>
                    <div className="mt-3">
                        {props?.Case != undefined && 'endpointNotes' in props.Case && props.Case?.endpointNotes?.length > 0 && (
                            <div>
                                <strong>Additional notes from referrer:</strong>
                                <br/>
                                {props.Case.endpointNotes.split('\n').map((item, key) => {
                                    return <p key={key}>{item}</p>
                                })}
                            </div>
                        )}
                    </div>
                </div>
                {/* UNKNOWN cases do not require rubber stamp as they are not triaged within trivice system */}
                {props?.Case?.triageID?.code != "UNKNOWN" && nonStaffUser && (
                    <RubberStamp Case={props.Case}/>
                )}
                

            </>
        )
    } else {
        return (
            <div>
                You have an invalid app role
            </div>
        )
    }
};

Action.propTypes = {
    Case: PropTypes.object.isRequired,
    appRole: PropTypes.string.isRequired,
    Dropitems: PropTypes.array,
    setShowRS: PropTypes.func,
    snippet: PropTypes.any
}

export default Action;
