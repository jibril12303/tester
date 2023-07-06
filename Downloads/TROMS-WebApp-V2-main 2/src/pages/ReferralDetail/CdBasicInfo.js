import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import 'moment-timezone';
import {
Dropdown,
DropdownItem,
DropdownMenu,
DropdownToggle,
Row,
Col,
Modal
} from "reactstrap";
import Select from 'react-select'
import { useSelector, useDispatch } from "react-redux"
import caseDetails, {caseTypes,caseCreators } from "store/caseDeatils/reducer"


const CdBasicInfo = (props) =>{
  const dispatch = useDispatch()
  const [dropdown, setDropdown] = useState(false)
  const [modal, setModal] = useState(false)
  const [clinician, setClinician] = useState()
  let Case = props.Case;
  let caseID = Case && Case.caseID;
  let NHSNumber = Case && Case.NHSNumber;
  let hospitalNumber = Case && Case.hospitalNumber;
  const {clincians} =useSelector( state=>({
    clincians: state.caseDetails.clincians

  }))
    
        return(
            <div className="mt-4 mt-xl-3 text-white">
              <Row>
                <Col sm="9">
                <h5 className="text-white" >Case No: {caseID ? caseID : "Not available"} | NHS No: {NHSNumber ? NHSNumber : "Not available"} | Hospital No: {hospitalNumber ? hospitalNumber : "Not available"}</h5>
                </Col>
                <Col sm="3" >
                {false && Case && Case?.nonNHSPatient === true && (
                  <div style={{position:'relative',marginLeft:'auto', marginRight:'0'}}>
                    <span
                        className={"font-size-12 badge rounded-pill"}
                        style={{background:'#F80E0E'}}
                        pill
                        >
                        <div style={{color:'white',fontSize:'24'}}>
                            {" Non NHS Patient "}
                        </div>
                        </span>
                </div>
                )}
                </Col>
              </Row>

                        
                          <h4 className="mt-3 mb-0 text-white">{Case && Case.lastName}, {Case && Case.firstName} | { moment.utc(Case &&Case.dateOfBirth).tz("Europe/London").format("DD-MM-YYYY")} | {Case?.gender?.split(" ").map(w => w[0].toUpperCase() + w.substring(1)).join(" ")} | {moment().diff(moment(Case?.dateOfBirth), 'years', false)}y {moment().diff(moment(Case?.dateOfBirth), 'months', false) % 12 }m</h4>

                         
                        <p className="mb-3">
                          {moment.utc(Case && Case.creationDate).tz("Europe/London").format("DD-MM-YYYY")} | {moment.utc(Case && Case.creationDate).tz("Europe/London").format("H:mm")} Hrs | {Case && Case.pathway}
                      </p>

             
{/* 
                          <div className="product-color">
                            <h4 className="mt-0 mb-0">Case Details</h4>
                            <p className="text-muted mb-4">
                            Click to expand and view case details
                          </p>
                          </div> */}
       <Modal
                isOpen={modal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Reassign
                    </h5>
                    <button
                        type="button"
                        className="btn btn-danger btn-close"
                        onClick={()=>setModal(false)}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body" style={{overflow:'hidden'}}>
                <Col >
                  <Select
                      value={clinician}
                      onChange={(e)=>{setClinician(e)}}
                      options={clincians}
                      className="select2"
                      placeholder="Select assignee"
                      classNamePrefix="select2 select2-selection"
                      maxMenuHeight='15vh'
                  />
                  </Col>
                  <div style={{marginBottom:'15vh'}}></div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          setModal(false);
                          dispatch(caseCreators.reassignCase(caseID, clinician))
                        }}
                    >
                        Reassign
                    </button>
                </div>
            </Modal>
                        </div>
        )
}

CdBasicInfo.propTypes = {
    Case: PropTypes.any,
    appRole: PropTypes.string
  }

export default CdBasicInfo;