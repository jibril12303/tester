import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import { CardTitle, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {Button, Input, Modal, ModalFooter, ModalBody, ModalHeader, Form, FormGroup, Label, Col} from 'reactstrap';
import { toggleButtonGroupClasses } from '@mui/material';
import { bchDashboardCreators } from 'store/dashboard/reducer';
import { caseCreators } from "store/caseDeatils/reducer"




const Referrer = React.memo(props => {

    const dispatch = useDispatch();

    const {caseAudits,messages,caseDetail} =useSelector( state=>({
        caseDetail: state.caseDetails.caseDetails,
        messages: state.caseDetails.messages,
        caseAudits: state.caseDetails.caseDetails.caseAudits,
      }))

      let sortedEvents = []

      const [events , setEvents] = useState([]);
      const [actionModal, setActionModal] = useState(false);

      const [action,setAction] =useState('');
      const [comments, setComments] =useState('');

      const [currentAudit, setCurrentAudit] = useState("");
      const[update,setUpdate] = useState('');



    useEffect(() => {
        
    const allEvents = [...(caseAudits ? caseAudits : ['nodata']), ...(props.Messages?.messages ? props.Messages.messages : ['nodata']), ...(props.Case?.assignmentHistory[0] ? props.Case?.assignmentHistory[0] : ['nodata'])]

    sortedEvents = allEvents.sort(
        (a, b) => (moment(a.sentAt ? a.sentAt : a.creationDate ? a.creationDate : a.time ? a.time.$d : 0).isBefore(b.sentAt ? b.sentAt : b.creationDate ? b.creationDate : b.time ? b.time.$d : 0)) ? 1 : (moment(b.sentAt ? b.sentAt : b.creationDate ? b.creationDate : b.time ? b.time.$d : 0).isBefore(a.sentAt ? a.sentAt : a.creationDate ? a.creationDate : a.time ? a.time.$d : 0)) ? -1 : 0);

    setEvents(sortedEvents)
    console.log('mikey', sortedEvents )},[caseAudits,messages,caseDetail.assignmentHistory])  
    

    const TimelineItem = ({ type, receiver, id, icon, time, toggle, metadata, errorArea, audit }) => {

        const [toggleThisElement, setToggleThisElement] = useState(false);
        return (
            <li className='event-list'>


                <div className="event-timeline-dot">
                    <i
                        className={'bx bx-right-arrow-circle bx-fade-right'}
                    />
                </div>
                <div className="media">
                    <div className="me-3">
                        <i style={icon == "bx bx-error h2" ? { color: "red" } : icon == "bx bx-check-circle h2" ? { color: "green" } : {}}
                            className={
                                icon ? icon : "bx bx-file h2 text-secondary"
                            }
                        />
                    </div>
                    <div className="media-body">

                        <span className={"text-muted"}>{moment.utc(time).tz("Europe/London").format("lll")}</span> {errorArea}
                        <h5 style={(icon == "bx bx-error h2" && audit.actioned != true) ? { color: "red" } : {}}> {type} {receiver ? receiver : null}   {metadata && <i
                            className={toggleThisElement ? "bx bx-caret-up h5" : "bx bx-caret-down h5"}
                            onClick={() => setToggleThisElement((prev) => !prev)}
                        >
                        </i>} </h5>
                        {toggleThisElement && <div className="h-info">{<p className="text-muted">
                            {metadata}
                        </p>}
                        </div>}


                    </div>
                </div>

            </li>
        );
    };

    TimelineItem.propTypes = {
        type: PropTypes.string,
        id: PropTypes.number,
        receiver: PropTypes.string,
        icon: PropTypes.string,
        time: PropTypes.number,
        toggle: PropTypes.bool,
        metadata: PropTypes.node,
        errorArea: PropTypes.node,
        audit: PropTypes.object
    }

    function checkPending(item) {
        let isPending = false
        item?.changes?.map((change) =>
            (change.hasOwnProperty('pending') ? isPending = change?.pending?.to : isPending = isPending))
        if (isPending == '') {
            isPending = false
        }

        return isPending

    }

    function titleMake(audit) {

        if (audit.hasOwnProperty('email')) {
            let status = audit.notifStatus.charAt(0).toUpperCase() + audit.notifStatus.slice(1);
            if (status == 'Success') {
                status = 'dispatched successfully'
            }



            return (' Email notification ' + (status) + ': ' + emailMake(audit.email[0]?.templateName) + (((audit?.email[1]?.to != undefined) && (audit?.email[1].to != '')) ? (' - ' + (audit?.email[1]?.to)) : '') + (((audit?.email[1]?.notes?.eReason != undefined) && (audit?.email[1].notes?.eReason != '')) ? (' - Reason:  ' + (audit?.email[1]?.notes?.eReason)) : ''))
        }

        if (audit.apiCall == '/api/cases/create') {
            return (('Case created'))
        }
        if (audit.apiCall == "/api/cases/consent") {
            return ('Case updated')
        }
        // if (audit.apiCall == "/api/referrals/create" && audit.email) {

        //     return ('Email notification sent: ' + (emailMake(audit.email[0]?.templateName)) + (audit?.email[1]?.to != undefined ? ( ' - ' + (audit?.email[1]?.to)) : ''))
        // }

        if (audit.hasOwnProperty('changes')) {
            if (audit.apiCall == "/api/cases/endpointPDF") {
                return ('PDF Generated')
            }
            if (audit.apiCall == '/api/cases/submit') {
                return ('Case submitted')
            }
            if (audit.apiCall == '/api/referrals/create') {
                return ('Case updated')

            }
            if (audit.apiCall == '/api/cases/rubberStamp') {
                return ('Case updated')
            }


            else {
                return ('Case updated')
            }
        }
        if (audit.hasOwnProperty('push')) {
            if (audit?.push[0]?.title) {
                return (audit?.push[0]?.title)
            }
            if (audit.push.type == 'twilio') {
                let status = audit.notifStatus //.charAt(0).toUpperCase() + audit.notifStatus.slice(1);
                if (status == 'success') {
                    status = 'dispatched successfully'
                }
                return ('SMS message' + ' ' + (status))
            }
            if (audit.apiCall == "/api/cases/reassign") {
                return ('New ownership request')
            }
            if (audit.apiCall == "/api/referrals/create") {
                return ('New ownership request')
            }
        }

        else {
            return (audit.apiCall)
        }
    }

    function emailMake(email) {
        switch (email) {
            case 'caseSubmissionAcknowledgedRef.js':
                return ('Case submission acknowledgement email to referring clinician')
            case 'caseSubmissionBMEC.js':
                return ('Case submission email to BMEC')
            case "patientRedirected.js":
                return ('Email to referring clinician about patient redirection to BMEC')
            case "caseAcceptanceNotifCarer.js":
                return ('Case acceptance email to parents/ carer')
            case "appointmentBooking.js":
                return ('Appointment email to booking team')
            case "caseAcceptanceNotification.js":
                return ('Case acceptance email to referring clinician')
            case "caseSubmissionCarerBMEC.js":
                return ('Case submission email to parents/ carer about BMEC redirection')
            case "caseSubmissionNotifCarer.js":
            case "caseSubmissionCarer.js":
                return ('Case submission email to parents/ carer')
            case "caseSubmissionAcknowledgedYellow.js":
            case "caseSubmission.js":
            case "caseSubmissionNotificationOpth.js":
                return ('Case review request email to BWC clinicians')
            case "declineNotifactionCarer.js":
                return ('Case update email to parents/ carer')
            case "bookingRejection.js":
                return ('Case details email to booking team')
            case "declineNotifaction.js":
                return ('Case decline email to referring clinician')
            case "caseSubmissionGP.js":
                return ('Case submission notification to GP')
            case "patientRedirectedO2OOH.js":
            case "patientRedirectedOOH.js":
                return ('Patient redirected to BMEC')
            default:
                let newEmail1 = email?.replace(/([A-Z])/g, ' $1').replace('.js', '').replace('B M E C', 'BMEC').replace('Ref', 'Referrer').replace('Notif ', 'Notification ').trim()
                let newEmail = newEmail1?.charAt(0).toUpperCase() + newEmail1?.slice(1);
                return (newEmail)

        }
    }

    function renderType(item) {
        if (item.hasOwnProperty('apiCall')) {
            return (titleMake(item))
        }
        if (item.hasOwnProperty('sentBy')) {
            return ('Query message sent by ')
        }
        if (item.hasOwnProperty('to')) {
            return ('Ownership transfer: ')
        }
        else {
            return ('Unknown Action')
        }

    }

    function renderReciever(item) {
        if (item.hasOwnProperty('sentBy')) {
            return (item.sentBy.firstName) + ' ' + (item.sentBy.lastName)
        }
        if (item.hasOwnProperty('to') && item.hasOwnProperty('from')) {
            let prevOwner = item?.from?.firstName + ' ' + item?.from?.lastName
            let newOwner = item?.to?.firstName + ' ' + item?.to?.lastName

            return (prevOwner + ' changed owner to ' + newOwner)

        }
        if (item.hasOwnProperty('changes')) {
            if (item.apiCall == "/api/cases/rubberStamp") {
                let status = ''
                item.changes.map((change) =>
                    (change.hasOwnProperty('status') ? status = change.status.to : status = status))

                if (status == 'Guidance issued') {
                    status = 'Declined - Guidance Issued'
                }
                return (' by ' + item?.whoCalled?.firstName + ' ' + item?.whoCalled?.lastName + ' - ' + status)
            }
            if (item.apiCall == "/api/referrals/create") {
                let status = ''
                item?.changes?.map((change) =>
                    (change.hasOwnProperty('status') ? status = change.status.to : status = status))

                if (status != '') {
                    return (' by ' + item?.whoCalled?.firstName + ' ' + item?.whoCalled?.lastName + ' - ' + status)
                }
            }
            else {
                return (' by ' + item?.whoCalled?.firstName + ' ' + item?.whoCalled?.lastName)
            }
        }

    }

    function renderMetaData(item) {
        if (item.hasOwnProperty('content')) {

            if (item.content.includes('amazonaws.com')) {
                return (<div> Message content: image</div>)
            }
            else { return (<div>Message content:  {item.content}</div>) }



        }
        if (item.apiCall == '/api/cases/create') {
            return (<div>
                Name: {props.Case?.createdBy?.firstName + " " + props.Case?.createdBy?.lastName}
                <br />
                Phone: {props.Case?.createdBy?.phoneNumber ? props.Case?.createdBy?.phoneNumber : "Not Available"}
                <br />
                Email: {props.Case?.createdBy?.email ? props.Case?.createdBy?.email : "Not Available"}
            </div>
            )
        }

        if (item.apiCall == "/api/cases/rubberStamp" && item.changes) {
            let status = ''
            item?.changes?.map((change) =>
                (change.hasOwnProperty('status') ? status = change.status.to : status = status))

            if (status == 'Accepted') {
                return (<div>
                    Name: {props.Case?.acceptedBy?.firstName + " " + props.Case?.acceptedBy?.lastName}
                    <br />
                    Phone: {props.Case?.acceptedBy?.phoneNumber ? props.Case?.acceptedBy?.phoneNumber : "Not Available"}
                    <br />
                    Email: {props.Case?.acceptedBy?.email ? props.Case?.acceptedBy?.email : "Not Available"}
                </div>)
            }
        }
        if (item.hasOwnProperty('email')) {
            if (item?.email[1]?.html != undefined) {

                let frag = item?.email[1]?.html.replace('\n', '').replace("Dark blue banner, with a slanted section consisting of red, orange and green (in that order), on the far right there is a company logo", '')

                return (<>
                    {(item?.actioned == true) && (
                    <div >
                        
                        <p><b>Action Taken:</b> <br/> {item?.actionTaken}</p>
                        <br />
                        <p><b>Comments: </b> <br/> {item.actionComments}</p>
                        <br/>
                        <b><hr></hr></b>
                    </div>
                    )}

                <div dangerouslySetInnerHTML={{ __html: frag }}>
                </div></>)
            }
        }
        if (item.hasOwnProperty('push')) {
            if (item?.push?.body != undefined) {
                let sms = item?.push?.body.replace('\n', '<br/>').replaceAll('.', '. <br/>')
                return (<>
                 {(item?.actioned == true) && (
                    <div >
                        
                        <p><b>Action Taken:</b> <br/> {item?.actionTaken}</p>
                        <br />
                        <p><b>Comments: </b> <br/> {item.actionComments}</p>
                        <br/>
                        <b><hr></hr></b>
                    </div>
                    )}
                    <div>To : {item.push.to} <br /><div dangerouslySetInnerHTML={{ __html: sms }}></div></div></>)
            }
        }
        if (item.apiCall == '/api/cases/submit' || "/api/cases/rubberStamp") {
            return (<div>
                Name: {item?.whoCalled?.firstName + " " + item?.whoCalled?.lastName}
                <br />
                Phone: {item?.whoCalled?.phoneNumber ? item?.whoCalled?.phoneNumber : "Not Available"}
                <br />
                Email: {item?.whoCalled?.email ? item?.whoCalled?.email : "Not Available"}
            </div>)
        }



        else {
            return (null)
        }
    }

    function renderIcon(item) {
        if (item.hasOwnProperty('notifStatus')) {
            if (item.notifStatus == 'success') {
                return ('bx bx-check-circle h2')
            }
            if (item.notifStatus == 'failure') {
                return ('bx bx-error h2')
            }
            else {
                return (null)
            }
        }
        else { return (null) }
    }

    function renderTime(item){
        let time = item.creationDate ? item.creationDate : item.sentAt ? item.sentAt : item.time.$d ? item.time.$d : null
        return (time)
    }

    function renderError(item){
        if (item.hasOwnProperty('notifStatus')) {
            if (item.notifStatus == 'failure') {
               
                if(item?.actioned == true){
                return (<><Button size='sm' color='success' onClick={()=>(null)}>Actioned</Button></>)}
                else{
                    return (<><Button size='sm' color='primary' onClick={()=>(setActionModal(true),setCurrentAudit(item._id))}>Mark as actioned {update}</Button></>)}
            }
            else {
                return (null)
            }
        }
        else { return (null) }
    }

    function renderEvents(events, caseAudits){
        let timelineEvents = events?.map((item, ind) => (
            <>
                <div key={ind}>
                    {(item != 'nodata')
                        && (item?.apiCall != '/api/cases/consent')
                        && (item?.push?.title != "A new case is available for review")
                        && (<TimelineItem type={renderType(item)} time={renderTime(item)} receiver={renderReciever(item)} metadata={renderMetaData(item)} icon={renderIcon(item)} errorArea={renderError(item)} audit= {item}/>)}
                </div>
                {(item?.apiCall == '/api/cases/submit' && checkPending(item)) && (<div><TimelineItem type={'PDF Generated'} time={renderTime(item)} receiver={null} metadata={null} icon={null} /> </div>)}

            </>
        ))
        return(timelineEvents)
    }

    return (
        <div>
            <CardTitle>Case History Details</CardTitle>
            <ul className="verti-timeline list-unstyled">

                {renderEvents(events)} 


            </ul>

            <Modal
            isOpen={actionModal}
            scrollable={true}
            backdrop={'static'}
            centered={true}
            id="staticBackdrop"
            >
                <ModalHeader>Remedial Action</ModalHeader>
                <ModalBody>
                    <Form>

                    <FormGroup row>
                        <Label for="exampleSelect">Action Taken<span style={{color:"red"}}>*</span></Label>
                        
                        <Input type="select" name="select" id="exampleSelect" onChange={(e)=>(setAction(e.target.value))}  >
                            <option></option>
                            <option>Notification Resent</option>
                            <option>Recipient Contacted</option>
                            <option>Other</option>
                        </Input>
                        
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleText" >Comments<span style={{color:"red"}}>*</span></Label>
                        
                        <Input type="textarea" name="text" id="exampleText"  onChange={(e)=>(setComments(e.target.value))} />
                        
                    </FormGroup>
                    
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Col >
                    <Button onClick={()=>(setActionModal(false))} >Cancel</Button>
                    </Col>
                    <Col md={8} >
                    </Col>
                    <Col >
                    <Button color='success' disabled={comments=='' || action ==''} onClick={()=>(setActionModal(false), dispatch(bchDashboardCreators.updateAudit(currentAudit, true, action, comments)),
     setComments(''),setAction(''),  dispatch(caseCreators.requestCaseDetails(caseDetail?.case?.caseID)),dispatch(bchDashboardCreators.getAuditFails()),dispatch(bchDashboardCreators.countAuditFails()))}>Save</Button>
                    </Col>
                </ModalFooter>
            </Modal>
        </div>


    );
});

Referrer.displayName = 'Referrer'

Referrer.propTypes = {
    Case: PropTypes.object.isRequired,
    referringOrg: PropTypes.string.isRequired,
    userDetails: PropTypes.object.isRequired,
    Messages: PropTypes.object,
    caseAudits: PropTypes.array,
    loading: PropTypes.bool
}

export default Referrer;
