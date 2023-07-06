import React from "react"

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import { Link } from "react-router-dom"

import ApexRadial from "./ApexRadial"
import ReviewerTypePieChart from "./ReviewerTypePieChart"

const ReviewerTypePieChartBox = (typewise) => {
  return (
    <React.Fragment>
      {" "}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Referral Types</CardTitle>
          <Row>
            <Col sm="12">
              <div className="mt-4 mt-sm-0">
                <ReviewerTypePieChart typewise={typewise.typewise} />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default ReviewerTypePieChartBox
