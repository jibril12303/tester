import React from "react"

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import { Link } from "react-router-dom"

import ApexRadial from "./ApexRadial"
import PathwaysPieChart from "./PathwaysPieChart"

const PathwaysPieChartBox = (caseAmounts) => {
   return (
    <React.Fragment>
      {" "}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Pathways</CardTitle>
          <Row>
            <Col sm="12">
              <div className="mt-4 mt-sm-0">
                <PathwaysPieChart caseAmounts = {caseAmounts} />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default PathwaysPieChartBox
