import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal} from 'reactstrap';
import {
    createReferralTypes,
    createReferralCreators,
} from 'store/create-referral/reducer';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import actions from 'redux-form/lib/actions';
import moment from "moment";
import 'moment-timezone';


const DynamicActionModal = ({showModal,setShowModal,setURL,action,url,tempEndpoint,questionAnswers,setEndpoint,caseDetails,pathwayName,selectedSpeciality,actionAnswer})=>{

    const dispatch = useDispatch();
    const history = useHistory();

    

    const renderAction = (action)=>{

        if(actionAnswer?.textReplacement === true){
            let actiontext = action;
            let bday =  moment.utc(caseDetails && caseDetails.patient && caseDetails.patient.dateOfBirth).tz("Europe/London").format("DD-MM-YYYY")
            actiontext = actiontext.replace('(CASEID)',caseDetails?.caseID);
            actiontext = actiontext.replace('(CASEID)',caseDetails?.caseID);
            actiontext = actiontext.replace('(NHSNUMBER)',caseDetails?.patient?.NHSNumber);
            actiontext = actiontext.replace('(FNAME)',caseDetails?.patient?.firstName);
            actiontext = actiontext.replace('(LNAME)',caseDetails?.patient?.lastName);
            actiontext = actiontext.replace('(BDAY)',bday);

            return (
                <>
                {actiontext?.split('\n').map((i, ind) => {
                    return <p key={ind}>{i}</p>;
                })}
                </> 
            )
        }
        return(<>
            {action?.split('\n').map((i, ind) => {
                return <p key={ind}>{i}</p>;
            })}
            </>
        )
    }

    return(
        <Modal
        isOpen={showModal}
        scrollable={true}
        backdrop={'static'}
        centered={true}
        id="staticBackdrop"
    >
        <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
                <i className="fa fa-warning"></i> Advice
            </h5>
            {
                actionAnswer?.textReplacement === true
            }
            {
                (!actionAnswer?.saveAndExit && questionAnswers[questionAnswers.length -1]?.currentQuestion?.CID === undefined) &&
            <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
            ></button>
            }
        </div>
        <div className="modal-body">
           {renderAction(action)}
            {url != null && (
                <object
                data={url}
                type="application/pdf"
                width="500"
                height="678"
              >
        
                <iframe
                  src={url}
                  width="500"
                  height="678"
                >
                <p>This browser does not support PDF!</p>
                </iframe>
              </object>
            )}
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                    if(tempEndpoint && action){
                        dispatch(
                            createReferralCreators.setDecisionAndQuestionAnswers(
                                tempEndpoint,
                                questionAnswers
                            )
                        );
                        dispatch(createReferralCreators.setTabIndex('5'));
                        setEndpoint()
                    }
                    if(action?.includes("complete the case on TriVice later.")){
                        //save and exit
                        dispatch(createReferralCreators.saveMidResponse(caseDetails.caseID, questionAnswers, pathwayName, selectedSpeciality))
                        history.push('/dashboard')
                        setShowModal(false);
                    }

                    setShowModal(false);
                    setURL(null)
                }}

            >
                Understood
            </button>
        </div>
    </Modal>
    )

}

DynamicActionModal.propTypes = {
    showModal : PropTypes.any,
    setShowModal : PropTypes.any,
    setURL : PropTypes.any,
    action : PropTypes.any,
    url : PropTypes.any,
    tempEndpoint : PropTypes.any,
    questionAnswers : PropTypes.any,
    setEndpoint : PropTypes.any,
    caseDetails : PropTypes.any,
    pathwayName : PropTypes.any,
    selectedSpeciality: PropTypes.any,
    actionAnswer: PropTypes.any,
};

export default DynamicActionModal;