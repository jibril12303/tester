import React from "react"

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import { Link,useHistory } from "react-router-dom"

import ApexRadial from "./ApexRadial"
import PendingCasesComp from "./PendingCasesComp"
import PropTypes from 'prop-types'

const PendingCasesBox = ({caseAmount, pathway}) => {

	let history =useHistory();
//	console.log(" in pending box",caseAmount.caseAmount)

	const values = caseAmount;
	const Emergency = values && values.UNDER_REVIEW_ACTION && values.UNDER_REVIEW_ACTION.Emergency;
	const LocallyTreated = values && values.UNDER_REVIEW_ACTION && values.UNDER_REVIEW_ACTION.LocallyTreated;
	const Routine = values && values.UNDER_REVIEW_ACTION && values.UNDER_REVIEW_ACTION.Routine;
	const Urgent = values && values.UNDER_REVIEW_ACTION && values.UNDER_REVIEW_ACTION.Urgent;

const btndata = [
	   {
			name:"Review Immediate cases",
			value:Emergency,
			status : 'UNDER_REVIEW',
			decision:'IMMEDIATE',
			duration:'ALL',
			color:"#F80E0E"
		},
		{
			name:"Review Urgent cases",
			value:Urgent,
			status :'UNDER_REVIEW' ,
            decision:'URGENT',
            duration:'ALL',
			color:"#FF9758"

		},
		{
			name:"Review Routine cases",
			value:Routine,
			status :'REFERRED',
            decision:'ROUTINE',
            duration:'ALL',
			color:"#F5C665"
		},
		{
			name:"Review Treat inhouse cases",
			value:LocallyTreated,
			status : 'ALL',
			decision:'TREAT_LOCALLY',
			duration:'ALL',
			color:"#58BC89"
		}
	]

  return (
    <React.Fragment>
      {" "}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">View and action pending cases</CardTitle>
          <Row>
            <Col sm="12">
				
			{btndata.map((item, key) => (
                  <div className="d-flex " style={{padding: '6px 0px',height:"56px"}} key={key} >
				  <button  type="button" className="btn btn-primary position-relative w-100 " style={{border:'3px solid #E5E5E5',background:item.color,borderRadius:'7px'}}
				  onClick={()=>history.push({ 
					pathname: '/my-referral',
					state:{
					  status :item.status,
					  decision:item.decision,
					  duration:item.duration,
					  pathway: pathway
					}
				   })}>
					<div style={{padding:'0',float:'left'}}>{item.name}</div> <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{background:'#556EE6'}}>{item.value} <span className="visually-hidden">unread messages</span></span>
				  </button>
				  </div>
                ))}
			
              
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

PendingCasesBox.propTypes ={
	caseAmount: PropTypes.any,
	pathway: PropTypes.any
}

export default PendingCasesBox
