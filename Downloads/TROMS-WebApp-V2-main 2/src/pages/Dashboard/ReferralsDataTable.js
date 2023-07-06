import React,{ useEffect, useState} from 'react'
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardBody,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Media,
    Table,
    Label,
    UncontrolledTooltip
} from "reactstrap"
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types"
import moment from "moment";
import {caseCreators } from "store/caseDeatils/reducer"
import { useSelector, useDispatch } from "react-redux"
import Tooltip from "components/Tooltip"
import "./dashboard.scss"

const btndata = {
    IMMEDIATE:{
         name:"Review Immediate cases",
         value:"Emergency",
         status : 'UNDER_REVIEW',
         decision:'IMMEDIATE',
         duration:'ALL',
         color:"#F80E0E"
     },
     Urgent:{
         name:"Review Urgent cases",
         value:"Urgent",
         status :'UNDER_REVIEW' ,
         decision:'URGENT',
         duration:'ALL',
         color:"#FF9758"

     },
     Routine:{
         name:"Review Routine cases",
         value:"Routine",
         status :'REFERRED',
         decision:'ROUTINE',
         duration:'ALL',
         color:"#F5C665"
     },
     Queries:{
        title: "Response required",
        status: "QUERIES",
        decision: "ALL",
        duration: "ALL",
        
    }
    }
 


const ReferralsDataTable = ({icon,title,data,caseno,tablename,pathway}) => {

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);
    let history = useHistory();
    const dispatch = useDispatch();

    const casedata = [
        {
            date: "13/02/2022",
            patient: "Patient",
            priority: "I",
            color: ""
        },
        {
            date: "14/02/2022",
            patient: "Patient",
            priority: "I",
            color: ""
        },
        {
            date: "15/02/2022",
            patient: "Patient",
            priority: "I",
            color: ""
        }
    ]


    const renderCaseTable = (data,tableName)=>{
        console.log("data",data)

        const renderButton = (caseID,key,tableName)=>{
            const buttonid = "tooltip" + "-"+ tableName + "-" + key;
            if(tableName === "query"){
                return(<>
                    <Tooltip content="Respond" direction="top">
                    <button
                        id={`Tooltip-' + ${key}`}
                        onClick={()=>{
                      dispatch(
                        caseCreators.requestCaseDetails(
                          caseID
                        )
                        );
                        history.push({
                          pathname: '/referral-detail',
                          state: {
                            caseID:caseID,
                            query:"true"
                          }
                        })
                    }}
                    className="btn btn-primary btn-sm btn-rounded">
                        <i className={icon}/>
                        {/* Respond */}
                    </button>
                    </Tooltip>
                          {/* <Tooltip
                          placement={"top"}
                          isOpen={tooltipOpen}
                          target={`Tooltip-' + ${key}`}
                          toggle={toggle}
                        >
                          Tooltip Content!
                        </Tooltip> */}
                        </>
                
                )
            }
            else {
                return(<>
                    <button
                        id={buttonid}
                        className="btn btn-primary btn-sm btn-rounded"
                        onClick={()=>{
                            dispatch(
                                caseCreators.requestCaseDetails(
                                    caseID
                                    )
                            );
                            history.push({
                                pathname: '/referral-detail',
                                state: {
                                    caseID:caseID,
                            }
                            })
                    }}
                    >
                        <i className={icon}/>
                        {/* view */}
                    </button>
                    <UncontrolledTooltip
                        target={buttonid}
                        // target={"priorityBadge" + row.caseID}
                        placement="top"
                    >
                    View
                    </UncontrolledTooltip>
                        </>
                )
            }
            

        }
    
    
        return(
            <>
            {
                data?.map((item,key)=>(
                    <tr key={key}>
                    <td align='left' style={{paddingLeft:"4px",paddingRight:"0px"}}>
                        <div
                            className='badge rounded-pill font-size-10' style={{backgroundColor:item?.triageID?.colorCode}}>{item?.triageID?.priority?.charAt(0)}</div>
                    </td>
                  <td>{moment.utc(item.creationDate).tz("Europe/London").format("DD/MM/YYYY")}</td>
                    <td className="text-wrap text-break" style={{minWidth:"75px"}}>{item?.firstName + " "+ item?.lastName}</td>
                    <td align='center'> 
                    {renderButton(item.caseID,key,tableName)}
                    </td>
                    </tr>
                ))
            }
            </>
        )
    }


  return (
    <div>
        <Card style={{boxShadow:"0px 4px 4px rgb(36 25 25 / 25%)",minHeight:"250px"}}>
          <CardBody className="p-2">
              <Card className="mini-stats-wid bg-primary mb-2" role="button" 
              onClick={() => history.push({
                  pathname: '/my-referral',
                  state: {
                      status: btndata[tablename]['status'],
                      decision: btndata[tablename]['decision'],
                      duration: btndata[tablename]['duration'],
                      pathway: pathway
                  }
              })}
              >
                  <CardBody>
                      <Media>
                          <Media body>
                              <p className="text-white fw-medium">
                             {title}
                              </p>
                              <h4 className="mb-0 text-white">{caseno? caseno :0}</h4>
                          </Media>
                          <div
                              className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-white text-primary">
                              <i
                                  className={
                                      `bx ${icon} font-size-24`
                                  }
                              ></i>
                            </span>
                            </div>
                            </Media>
                    </CardBody>
                </Card>
                    <Row >
                        <Col xl={12}>
                            <div className="bg-white mb-2">
                                <div className='table-responsive table-wrapper' >
                                    <table className='table mb-0'>
                                        <thead className='table-primary'>
                                        <tr>
                                            <th></th>
                                            <th>Date</th>
                                            <th>Patient</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                     {
                                        renderCaseTable(data,tablename)
                                     }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    
                    </CardBody>
                </Card>
    </div>
  )
}

ReferralsDataTable.propTypes = {
    icon:PropTypes.any,
    title:PropTypes.string,
    data:PropTypes.any,
    caseno: PropTypes.any,
    tablename: PropTypes.string,
    pathway: PropTypes.string,
}

export default ReferralsDataTable