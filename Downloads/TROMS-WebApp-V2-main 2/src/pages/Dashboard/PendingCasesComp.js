import React from "react"

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import { Link } from "react-router-dom"

import avatar1 from "../../assets/images/users/avatar-1.jpg"
import profileImg from "../../assets/images/profile-img.png"

const PendingCasesComp = () => {
  return (
    <React.Fragment>
      	<Card color="danger" className="text-white-50 ">
			<CardBody style={{margin:'0',padding:'0' }}>
				<CardTitle className="text-white pl-2 pr-2">
				<div><p style={{display:'inline'}}>Emergency cases</p><p style={{display:'inline'}}>7</p>
				<Link to="" className="btn btn-primary btn-sm float-end" >
                    	Review <i className="mdi mdi-arrow-right ms-1"></i>
                  	</Link>
				</div>
                  	
				</CardTitle>
			</CardBody>
		</Card>
		<Card color="warning" className="text-white-50">
			<CardBody style={{margin:'0',padding:'0' }} >
				<CardTitle className="text-white " style={{padding: '6px 5px'}}>
				<div><p style={{display:'inline'}}>Urgent cases</p><p style={{display:'inline'}}>7</p>
				<Link to="" className="btn btn-primary btn-sm float-end" >
				Review <i className="mdi mdi-arrow-right ms-1"></i>
                  	</Link>
				</div>
                  	
				</CardTitle>
			</CardBody>
		</Card>
		<Card color="warning" className="text-white-50">
			<CardBody style={{margin:'0',padding:'0' }}>
				<CardTitle className="text-white " style={{padding: '6px 5px'}}>
				<div><p style={{display:'inline'}}>Routine cases</p><p style={{display:'inline'}}>7</p>
				<Link to="" className="btn btn-primary btn-sm float-end" >
				Review <i className="mdi mdi-arrow-right ms-1"></i>
                  	</Link>
				</div>
                  	
				</CardTitle>
			</CardBody>
		</Card>
		<Card color="success" className="text-white-50">
			<CardBody style={{margin:'0',padding:'0' }}>
	
				<CardTitle className="text-white " style={{padding: '6px 5px'}}>
				<div><p style={{display:'inline'}}>Treat inhouse cases</p><p style={{display:'inline'}}>7</p>
				<Link to="" className="btn btn-primary btn-sm float-end" >
				Review <i className="mdi mdi-arrow-right ms-1"></i>
                  	</Link>
				</div>
                  	
				</CardTitle>
			</CardBody>
		</Card>
    </React.Fragment>
  )
}
export default PendingCasesComp
