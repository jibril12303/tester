import React from 'react'
import PropTypes from 'prop-types';
import {
  CardTitle,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Input,
  Modal,
  Card,
  FormFeedback,
  UncontrolledTooltip,
  Button,
  Table
} from 'reactstrap';


const DynamicAlertModal = ({showModal,onClose,ReauNextId,onClickNext,onClick}) => {
  return (
      <>
          <Modal
                isOpen={showModal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i style={{color:'red'}} className="fa fa-exclamation-triangle"></i> Alert!
                    </h5>
                </div>
                <div className="modal-body" style={{whiteSpace:"pre-line"}} >
                    {ReauNextId?.action}
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>{
                          onClose();
                          if(ReauNextId.hasOwnProperty("EUUID") || ReauNextId.hasOwnProperty("priority")){
                            onClick({answer:ReauNextId?.answer,endpoint:ReauNextId})
                            dispatch(
                                createReferralCreators.setDecisionAndQuestionAnswers(
                                    ReauNextId,
                                    submittedAnswers
                                )
                            );
                            dispatch(createReferralCreators.setTabIndex('5'));
                          }
                          else{
                            onClick({answer:ReauNextId?.answer,next:ReauNextId?.next})
                          }
                        }} 
                    >
                        Understood
                    </button>
                </div>
            </Modal>
      </>
  )
}

DynamicAlertModal.propTypes = {
  showModal: PropTypes.any,
  onClose: PropTypes.any,
  ReauNextId: PropTypes.any,
  onClickNext: PropTypes.any,
  onClick: PropTypes.any,
};

export default DynamicAlertModal;