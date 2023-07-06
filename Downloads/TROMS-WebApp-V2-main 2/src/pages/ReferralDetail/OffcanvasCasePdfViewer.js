import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal,    
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,} from 'reactstrap';
import {
    createReferralTypes,
    createReferralCreators,
} from 'store/create-referral/reducer';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import actions from 'redux-form/lib/actions';
import moment from "moment";
import 'moment-timezone';


const OffcanvasCasePdfViewer = ({showModal,modalClose,openFeedbackModal})=>{

    const dispatch = useDispatch();
    const history = useHistory();
    const url = null;

    const {casePdfData,caseDetails} = useSelector((state)=>({
        casePdfData:state.CreateReferral.CasePdfDetails,
        caseDetails: state.CreateReferral.caseDetails,
    }))

    useEffect(() => {
        if(showModal === false){
            // clear the casePdfData state in reducer when model closes
            dispatch(createReferralCreators.clearCasePDFDetails());
        }
    },[showModal])

    return(
        <Offcanvas
        isOpen={showModal}
        style={{width: '40vw'}}
        scrollable={false}
        backdrop={'static'}
        placement={'end'}
        direction={'end'}
        toggle={() => modalClose()}

    >
        <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
                <i className="fa fa-warning"></i> Case Details
            </h5>
        </div>
        <div className="modal-body" style={{padding:"0px"}}>
            {casePdfData?.CasePdfUrl == null ? "Loading..." : (
                <object
                data={casePdfData?.CasePdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
              >
        
                    <iframe
                    src={casePdfData?.CasePdfUrl}
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
                    modalClose();
                }}
            >
                Close
            </button>
        </div>
    </Offcanvas>
    )

}

OffcanvasCasePdfViewer.propTypes = {
    showModal : PropTypes.any,
    modalClose : PropTypes.any,
    openFeedbackModal: PropTypes.any,

};

export default OffcanvasCasePdfViewer;