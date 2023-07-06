import React from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Row, Col, BreadcrumbItem } from "reactstrap"

const Breadcrumb = props => {
  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between" >
          <div className="d-sm-flex align-items-center" style={{gap:"25px"}}>
            <h4 className="mb-0 font-size-18">{props.breadcrumbItem}</h4>
            {props.content}
          </div>
          <div
          style={{display:"inline-flex"
          // width:(props.breadcrumbItem == 'Home' || props.breadcrumbItem == 'My Referral')?'80%':''
          }}>
          {props.children}
          </div>
          <div className="page-title-right">
            <ol className="breadcrumb m-0" style={{width:"max-content"}}>
              <BreadcrumbItem>
                <Link to="#">{props.title}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                <Link to="#">{props.breadcrumbItem}</Link>
              </BreadcrumbItem>
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.any,
  children: PropTypes.any
}

export default Breadcrumb
