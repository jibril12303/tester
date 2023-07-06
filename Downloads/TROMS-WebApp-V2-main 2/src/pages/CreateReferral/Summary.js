import React, { useState, useEffect } from 'react';
import PropTypes, { object } from 'prop-types';
import { CardTitle, Form, FormGroup, Label, Col, Card, Table,Modal } from 'reactstrap';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { createReferralCreators } from 'store/create-referral/reducer';
import ViewIcon from "assets/icon/viewIcon.svg"
import OffCanvasRheuScreens from "./OffCanvasRheuScreens";

import moment from 'moment'
import find from 'lodash/find';
const Summary = (props) => {
    if (props.disabled) return (<p>loading...</p>)
    const { questions, pathwayQuestions,selectedPathway} = useSelector((state) => ({
        questions: state.CreateReferral.questionAnswers,
        pathwayQuestions: state.CreateReferral.questions,
        selectedPathway: state.CreateReferral.selectedPathway
    }));
    const [showModal, setShowModal] = useState(false)
    const [vaModal, setVaModal] = useState(false)
    const [visualReport, setVisualReport] = useState({})
    const [exams, setExams] = useState([])
    const [showRheuScreen , setShowRheuScreen] = useState(false);
    const [offCanvasCustomActiveTab, setOffCanvasCustomActiveTab] = useState("1");
    const [activeTabRheuOffCanvas, setActiveTabRheuOffCanvas] = useState("1")
    const [selectedScreenQuestion, setSelectedScreenQuestion] = useState({});
    const dispatch = useDispatch()
    console.log(props);
    const findQuestionBasedOnId = (id) =>
    find(pathwayQuestions, (obj) => {
        return obj.id == id;
    });
    useEffect(()=>{
        // setShowModal(true)
        try{
            debugger;
            let question = findQuestionBasedOnId(questions[questions.length - 1].id) || findQuestionBasedOnId(questions[questions.length - 1].questionID)
            let euuid = question?.answers?.endpoint?.EUUID || question?.answers[questions[questions.length - 1].answer].endpoint.EUUID
            if(typeof euuid == "string")dispatch(createReferralCreators.setEuuid(euuid))
        } catch(e){}
        try {
        questions.map((item,index)=>{
            let quest = findQuestionBasedOnId(item.questionID)
            try {
                quest.answers?.leaflets.map((item,ind)=>{
                    dispatch(createReferralCreators.addLeaflet(item))
                })
            } catch (error) {
                
            }
            try {
                quest.answers[item.answer]?.leaflets.map((item,ind)=>{
                    dispatch(createReferralCreators.addLeaflet(item))
                })
            } catch (error) {
                
            }
        })
    }  catch (e){}
    },[])

    useEffect(() => {
        console.log("selectedScreenQuestion",selectedScreenQuestion);
    },[selectedScreenQuestion]);

    return (
        <div>
            <CardTitle>Pathway Summary</CardTitle>
            {/* <h4>Case Ref: {caseDetails.caseID} | {pathway}</h4>
            <h4>
                {patient.firstName} {patient.lastName} | {patient.NHSNumber} |{' '}
                {moment(patient.dateOfBirth).format('DD-MM-YYYY')} | {patient.gender.split(" ").map(w => w[0].toUpperCase() + w.substring(1)).join(" ")}
            </h4> */}
            <Table className="table table-striped mb-0" responsive>
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((item, index)=>{
                        let type;
                        let id;
                        let calculation  = item?.currentQuestion?.calculation;
                        try {
                            type = item.currentQuestion.answers.type.toLowerCase()
                            id = item.currentQuestion.id
                        } catch (error) {
                            type = item?.type?.toLowerCase()
                            id = item.questionID
                        }

                        if((type) == "visual") {
                            return(
                                <tr key={id}>
                                    <td scope="row">{item.question}</td>
                                    <td>{Object.values(item.answer).every(x => ((x.RE== "" || x.RE == false) && (x.LE == "" || x.LE == false))) ? "Not provided" :<i className='bx bx-window-open' onClick={()=>{
                                        setVisualReport(item.answer)
                                        console.log("VIUSAL",item.answer)
                                        setExams(Object.keys(item.answer))
                                        setVaModal(true)
                                        }}/>}</td>
                                    <td onClick={()=>{dispatch(createReferralCreators.setEditQuestionIndex(index)); dispatch(createReferralCreators.setTabIndex("4"))}}><i className="far fa-edit"></i></td>
                                </tr>
                            )
                        }
                        if((type) == "images"){
                            console.log("summ img",item.answer)
                            return(
                                <tr key={id}>
                                    <td scope="row">Uploaded images</td>
                                    <td>
                                        {item.answer?.images.map(f=>{
                                            return (<img
                                            key={f.name}
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                        />);
                                        })}
                                    </td>
                                    <td onClick={()=>{dispatch(createReferralCreators.setEditQuestionIndex(index)); dispatch(createReferralCreators.setTabIndex("4"))}}><i className="far fa-edit"></i></td>
                                </tr>
                            )
                        }
                        if(type == "opthoimages") {
                            return(
                                <>
                                <tr key={id}>
                                    <td scope="row">Uploaded images right eye</td>
                                    <td>
                                        {item.answer?.images?.rightEye.map(f=>{
                                            return (<img
                                            key={f.name}
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                        />);
                                        })}
                                    </td>
                                    <td onClick={()=>{dispatch(createReferralCreators.setEditQuestionIndex(index)); dispatch(createReferralCreators.setTabIndex("4"))}}><i className="far fa-edit"></i></td>
                                </tr>
                                <tr key={id} >
                                    <td scope="row">Uploaded images left eye</td>
                                    <td>
                                        {item.answer?.images?.leftEye.map(f=>{
                                            return (<img
                                            key={f.name}
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                        />);
                                        })}
                                    </td>
                                    <td onClick={()=>{dispatch(createReferralCreators.setEditQuestionIndex(index)); dispatch(createReferralCreators.setTabIndex("4"))}}><i className="far fa-edit"></i></td>
                                </tr>
                                </>
                            )
                        }
                        if((type)== "checkbox"){
                            if (Array.isArray(item.answer)){
                                return(
                                    <tr key={id}>
                                    <td scope="row">{item.question}</td>
                                    <td>{item?.answer?.map(i=>{
                                        if (i == item.answer[item.answer.length -1]) return `${i}`
                                        return `${i}, `
                                    })}</td>
                                    <td onClick={()=>{dispatch(createReferralCreators.setEditQuestionIndex(index)); dispatch(createReferralCreators.setTabIndex("4"))}}><i className="far fa-edit"></i></td>
                                </tr>
                                )
                            } else if(typeof item.answer == "string"){
                                return(
                                    <tr key={id}>
                                        <td scope="row">{item.question}</td>
                                        <td style={{wordWrap:'break-word'}}>{item.answer}</td>
                                        
                                    </tr>
                                )
                            }
                        }
                        if(type == "datetime" || type == "datetimecalc"){
                            return(
                                <tr key={id}>
                                    <td scope="row">{item.question}</td>
                                    <td style={{wordWrap:'break-word'}}>{moment(item.answer).format("DD/MM/YYYY LT")}</td>
                                    <td onClick={()=>{dispatch(createReferralCreators.setEditQuestionIndex(index)); dispatch(createReferralCreators.setTabIndex("4"))}}><i className="far fa-edit"></i></td>
                                </tr>
                            )
                        }
                        if((type == "rheutreat" || type == "rheuinves" || type == "rheuclini" || type == "rheuvital" || type == "rheuinves1" || type == "rheuinves2" || type == "rheuinves3" )){
                            return(
                                <tr key={id}>
                                <td scope="row">{item.question}</td>
                                <td>                                    
                                    <div 
                                    onClick={()=>{
                                        if(type=="rheuclini"){
                                            setOffCanvasCustomActiveTab("1")
                                        }
                                        else if(type=="rheuinves"){
                                            setOffCanvasCustomActiveTab("2")
                                        }
                                        else if(type=="rheuinves3"){
                                            setSelectedScreenQuestion(item)
                                            setOffCanvasCustomActiveTab("4")
                                        }
                                        else if(type=="rheuinves2"){
                                            setSelectedScreenQuestion(item)
                                            setOffCanvasCustomActiveTab("3")
                                        }
                                        else if(type=="rheutreat"){
                                            setOffCanvasCustomActiveTab("5")
                                        }
                                        else if(type=="rheuvital"){
                                            setOffCanvasCustomActiveTab("6")
                                        }
                                        setShowRheuScreen(true);
                                    }} 
                                    style={{display: "flex",cursor:'pointer', flexDirection:"row",alignItems:"center",gap:"5px"}} >
                                    <img src={ViewIcon} height="22px" width="22px"/> View</div>
                                </td>
                                <td onClick={()=>{dispatch(createReferralCreators.setEditQuestionIndex(index)); dispatch(createReferralCreators.setTabIndex("4"))}}><i className="far fa-edit"></i></td>
                            </tr>
                            )
                        }
                        return(
                            <tr key={id}>
                                <td scope="row">{item.question}</td>
                           <td>{item.answer}</td>
                                <td onClick={()=>{
                                    if(calculation !== true){
                                    dispatch(createReferralCreators.setEditQuestionIndex(index));
                                    dispatch(createReferralCreators.setTabIndex("4"))
                                }}}>
                                  {calculation === true ? " " :<i className="far fa-edit"></i> }</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Modal
            isOpen={showModal}
            scrollable={true}
            backdrop={'static'}
            centered={true}
            id="staticBackdrop"
        >
            <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                    <i className="fa fa-warning"></i> Warning
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => {setShowModal(false)}}
                    aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">{"Editing any of your responses may require further input of data."}</div>
            <div className="modal-footer">
            <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {setShowModal(false)}}
                >
                  Understood
                </button>
            </div>
        </Modal>
        <Modal
        isOpen={vaModal}
        scrollable={true}
        backdrop={'static'}
        centered={true}
        id="staticBackdrop"
        >
                        <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                    <i className="fa fa-warning"></i> Visual Acuity
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => {setVaModal(false)}}
                    aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
            <Table className="table table-striped mb-0" responsive>
                <thead>
                    <tr>
                        <th>Examination</th>
                        <th>Right Eye</th>
                        <th>Left Eye</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((item,index)=>{
                        console.log("siu",visualReport[item])
                        if(visualReport[item].RE == true || visualReport[item].RE == false || visualReport[item].LE == true || visualReport[item].LE == false){
                            let re = visualReport[item].RE ? "Yes" : "No"
                            let le = visualReport[item].LE ? "Yes" : "No"
                            return(
                                <tr key={index}>
                                    <td scope='row'>{visualReport[item]?.fieldName || item}</td>
                                    <td>{re}</td>
                                    <td>{le}</td>
                                </tr>
                            )
                        }
                        return(
                            <tr key={index}>
                                <td scope='row'>{visualReport[item].fieldName || item}</td>
                                <td>{visualReport[item].RE?.toString()}</td>
                                <td>{visualReport[item].LE?.toString()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            </div>
            <div className="modal-footer">
            <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {setVaModal(false)}}
                >
                  Understood
                </button>
            </div>
        </Modal>
        {
            selectedPathway?.flag?.includes('RQ3410') &&
            <OffCanvasRheuScreens
            showRheuScreen={showRheuScreen}
            toggleRheuScreen={()=>setShowRheuScreen(false)}
            offCanvasCustomActiveTab={offCanvasCustomActiveTab}
            setOffCanvasCustomActiveTab={setOffCanvasCustomActiveTab}
            summary={questions}
            selectedScreenQuestion={selectedScreenQuestion}
            setActiveTab={setActiveTabRheuOffCanvas}
        />
        }

        </div>
    );
};

Summary.propTypes = {
    questions: PropTypes.any,
    patient: PropTypes.any,
    disabled: PropTypes.any
};

export default Summary;
