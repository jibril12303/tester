import PropTypes from 'prop-types';
import {Modal} from 'reactstrap'
import React, {useEffect, useState, useRef} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { appCreators } from 'store/app/appReducer';
import { bchDashboardCreators, bchDashboardTypes } from 'store/dashboard/reducer';
import { mainReducerCreators,mainReducerTypes } from "store/reducers";
import {publicRoutes} from '../../routes/index'

const TimeoutModal = (props) =>{
    const dispatch = useDispatch();
    const location = useLocation();
    console.log(location.pathname)
    const { expiryDate, loading } = useSelector(
        (state) => ({
          expiryDate: new Date (state.appReducer?.tokenExpiryDate),
          loading: state.Dashboard.extendingToken
        })
        );
        const [modal, setmodal] = useState(false)
        let timeouts = [];
        useEffect(()=>{
          //  debugger;
            if (loading) return;
            //if non public route then show the expiry module
            if (publicRoutes.find(item => item.path == location.pathname) == undefined){
            // if (location.pathname != '/login' && location.pathname != '/register' && location.pathname != '/reset-password' && location.pathname != '/register-email' && location.pathname != '/register-password' && location.pathname != '/termsconditions' && location.pathname != '/update-profile' && location.pathname != '/forgot-password' && location.pathname != '/logout' && location.pathname != '/setup2fa'){
                if (expiryDate.getTime() < new Date().getTime()){
                    return;
                }
                let timer = setTimeout(() => {
                    setmodal(true)
                },(expiryDate.getTime() - 1000 *60) - new Date().getTime());
                return () => clearTimeout(timer)
            }
        },[expiryDate, loading])
    return(
        <Modal
        isOpen={modal}
        scrollable={true}
        backdrop={'static'}
        centered={true}
        id="staticBackdrop"
    >
        <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
                <i className="fa fa-warning"></i> Alert
            </h5>
            <div hidden>
            {timeouts.push(setTimeout(() => {
                if(modal){
                    debugger;
                    dispatch(mainReducerCreators.userLogout())
                }
            }, (expiryDate.getTime()) - new Date().getTime()))
            }
            </div>
            <button
                type="button"
                className="btn-close"
                onClick={() => {
                    dispatch(bchDashboardCreators.extendToken());
                    for (var i=0; i<timeouts.length; i++) {
                        clearTimeout(timeouts[i]);
                    }
                    setmodal(false);
                }
                }
                aria-label="Close"
            ></button>
        </div>
        <div className="modal-body">{"Your session is close to expiring"}</div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-danger"
                onClick={() => {dispatch(mainReducerCreators.userLogout());setmodal(false)}}
            >
                Logout
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                    dispatch(bchDashboardCreators.extendToken());
                    for (var i=0; i<timeouts.length; i++) {
                        clearTimeout(timeouts[i]);
                    }
                    setmodal(false);
                }
                }
            >
                Stay here
            </button>
        </div>
    </Modal>
    )


};

TimeoutModal.propTypes = {
    show: PropTypes.bool
};

export default TimeoutModal