import React from "react"

import { Row, Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"

import avatar1 from "../../assets/images/users/avatar-1.jpg"
import profileImg from "../../assets/images/profile-img.png"
//import profileLogo from "assets/images/profileLogo.png"
import profileLogo from "assets/images/profileLogonew.jpg"



const WelcomeComp = (profilename) => {
//console.log('lastName',profilename)
  const profname = profilename && profilename.name;
  const data = profilename && profilename.data;
  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-primary bg-soft">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary font-size-15">Welcome Back !</h5>
               {/* <p>TriVice Dashboard</p>*/}
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="4">
              <div className="avatar-md profile-user-wid mb-0">
                <img
                  src={profileLogo}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate " style={{marginLeft:'6px'}}>{profname.firstName}</h5>
              <h5 className="font-size-15 text-truncate " style={{marginLeft:'6px'}}>{profname.lastName}</h5>
              </Col>

            <Col sm="8">
              <div className="pt-4">
                <Row>
                  <Col xs="6">
                    <h5 className="font-size-15">{data.Referrals ? data.Referrals:0}</h5>
                    <p className="text-muted mb-0">Total Referrals</p>
                  </Col>
                  <Col xs="6">
                    <h5 className="font-size-15">{data.Accepted ? data.Accepted:0}</h5>
                    <p className="text-muted mb-0">Accepted Referrals</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}
export default WelcomeComp
