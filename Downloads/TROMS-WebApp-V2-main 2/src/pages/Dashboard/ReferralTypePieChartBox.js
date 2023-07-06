import React from "react"

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import { Link } from "react-router-dom"

import ApexRadial from "./ApexRadial"
import ReferralTypePieChart from "./ReferralTypePieChart"

const ReferralTypePieChartBox = (refcaseAmount) => {
  return (
    <React.Fragment>
      {" "}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Referral Types</CardTitle>
          <Row>
            <Col sm="12">
              <div className="mt-4 mt-sm-0">
                <ReferralTypePieChart refcaseAmount={refcaseAmount.refcaseAmount}/>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default ReferralTypePieChartBox
