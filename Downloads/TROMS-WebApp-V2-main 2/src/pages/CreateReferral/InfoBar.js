import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import 'moment-timezone';
import {
Badge, Row, Col
} from "reactstrap";
import classnames from "classnames";
import { isEmpty, map } from "lodash";
import { useParams, useRouteMatch, Redirect, useLocation } from "react-router-dom";

const InfoBar = (props) =>{
  let Case = props.Case;
  let caseID = Case && Case.caseID;
  let NHSNumber = Case && Case.patient.NHSNumber;
  let hospitalNumber = Case && Case.patient && Case.patient.hospitalNumber;
  let colour = undefined
switch (props.priority) {
    case 'IMMEDIATE':
      colour = '#F80E0E'
      break;
    case 'URGENT':
      colour = '#FF9758'
      break;
    case 'ROUTINE':
      colour = '#F5C665'
      break;
    case 'LOCAL':
      colour = '#58BC89'
  break;
    default:
      colour = undefined
      break;
  }

    
        return(
            <div className="mt-4 mt-xl-3 text-white">
              <Row>
                <Col sm="9">
                <h5 className="text-white" >Case No: {caseID ? caseID : "Not available"} | NHS No: {NHSNumber ? NHSNumber : "Not available"} | Hospital No: {hospitalNumber ? hospitalNumber : "Not available"} {/*props.priority != undefined*/false &&(
                <Badge pill style={{backgroundColor:colour}}>{" "}</Badge>
              )} </h5> 
                </Col>
                <Col sm="3">
                {false && Case && Case.patient &&  Case.patient?.nonNHSPatient === true && (
                  <div style={{position:'relative',marginLeft:'auto', marginRight:'0'}}>
                    <span
                        className={"font-size-12 badge rounded-pill"}
                        style={{background:'#F80E0E'}}
                        pill
                        >
                        <div style={{color:'white',fontSize:'24'}}>
                            {"Non NHS Patient"}
                        </div>
                        </span>
                </div>
                )}
                </Col>
              </Row>
              
                        
                          <h4 className="mt-3 mb-0 text-white">{Case && Case.patient && Case.patient.lastName}, {Case && Case.patient && Case.patient.firstName} | { moment.utc(Case && Case.patient && Case.patient.dateOfBirth).tz("Europe/London").format("DD-MM-YYYY")} | {Case?.patient?.gender ? Case?.patient?.gender?.split(" ")?.map(w => w[0].toUpperCase() + w.substring(1)).join(" ") : "Not Known"} | {moment().diff(moment(Case?.patient?.dateOfBirth), 'years', false)}y {moment().diff(moment(Case?.patient?.dateOfBirth), 'months', false) % 12 }m</h4>

                         
                        {/* <p className="mb-3">
                          {moment.utc(Case && Case.creationDate).tz("Europe/London").format("DD-MM-YYYY")} | {moment.utc(Case && Case.creationDate).tz("Europe/London").format("H:mm")} Hrs
                      </p> */}

             
{/* 
                          <div className="product-color">
                            <h4 className="mt-0 mb-0">Case Details</h4>
                            <p className="text-muted mb-4">
                            Click to expand and view case details
                          </p>
                          </div> */}
                        </div>
        )
}

InfoBar.propTypes = {
    Case: PropTypes.any,
    priority: PropTypes.any
  }

export default InfoBar;