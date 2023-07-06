import React,{useEffect,useState} from 'react'
import { useHistory } from 'react-router-dom';
import {
 Modal,
ModalHeader,
ModalBody,
ModalFooter,
} from "reactstrap"
import { useSelector,useDispatch } from 'react-redux';
import { appCreators } from 'store/app/appReducer';
import PropTypes from "prop-types"

const IncompleCaseModal=(props)=> {

    const dispatch = useDispatch()
    let history = useHistory();
/*    const {incompletProfile} = useSelector(state => ({
        incompletProfile:state.appReducer.incompletProfile,

  }))
*/
  return (
        <>
            <Modal
                isOpen={props.modalopen}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Incomplete Cases
                    </h5>
                </div>
                <div className="modal-body ">
                <p>Please ensure that you are submitting the referral by clicking the submit button at the end. Any unsubmitted referrals will not processed by the BWC specialists.</p>
                </div>
                <div className="modal-footer">
                <button
                        type="button"
                        className="btn btn-danger"
                        onClick={()=>{
                            props.modalclose(false)
                        }}
                >
                        Remind me later
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={()=>{
                            props.modalclose(false)
                            history.push({ 
                            pathname: '/my-referral',
                            state:{
                              status : "INCOMPLETE",
                              decision:"ALL",
                              duration:"ALL",
                            }
                           })}
                        }
                        >
                        View incomplete cases
                    </button>
                </div>
            </Modal>
        </>
    )
}

IncompleCaseModal.propTypes = {
    modalclose: PropTypes.any,
    modalopen: PropTypes.any,
  }
export default IncompleCaseModal;
