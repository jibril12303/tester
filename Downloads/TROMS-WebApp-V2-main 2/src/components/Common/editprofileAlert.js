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

const EditprofileAlert=()=> {

    const dispatch = useDispatch()
    let history = useHistory();
    const {incompletProfile} = useSelector(state => ({
        incompletProfile:state.appReducer.incompletProfile,

  }))

  return (
        <>
            <Modal
                isOpen={incompletProfile}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Incomplete Profile
                    </h5>
                </div>
                <div className="modal-body ">
                <p>Some mandatory information is missing from your profile. Please click below to update your profile. </p>
                </div>
                <div className="modal-footer">

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          dispatch(appCreators.setIncompleteProfileModalClose())
                          history.push({
                            pathname: '/profile',
                            state:{
                              activeTab : '2',
                            }
                          })
                        }}>
                        Update profile
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default EditprofileAlert
