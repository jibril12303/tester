import React, { useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback,
  Table,
} from "reactstrap"
import ReactQuill from "react-quill"
import useValidator from "hooks/useValidator"
import CreatableSelect from "react-select/creatable"
import { useDispatch, useSelector } from "react-redux"
import { emailTemplateCreators } from "store/email-templates/reducer"
import "./index.css"

function Preview() {
  const { emailPreviewData } = useSelector(state => ({
    emailPreviewData: state.EmailTemplateReducer.localEmailTemplateData,
  }))

  function createMarkup() {
    return {
      __html: emailPreviewData.emailBody
        ? emailPreviewData.emailBody
        : "First &middot; Second",
    }
  }

  return (
    <div>
      <CardTitle>Preview</CardTitle>
      <div className="mt-4">
        <Row>
          <Col sm={8}>
            <Card style={{ backgroundColor: "#d1d8e1" }}>
              <CardBody>
                <div
                  className="myClass"
                  dangerouslySetInnerHTML={createMarkup()}
                  style={{ marginBottom: "0px" }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Preview

{
  /* <Table className="table table-striped mb-0" responsive>
<thead>
  <tr>
    <th>Deatils</th>
    <th>Answer</th>
    <th>Edit</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td scope="row">Template Name</td>
    <td>{emailPreviewData.templateName}</td>
    <td>
      <i className="far fa-edit"></i>
    </td>
  </tr>
  <tr>
    <td scope="row">Template Description</td>
    <td>{emailPreviewData.templateDescription}</td>
    <td>
      <i className="far fa-edit"></i>
    </td>
  </tr>
  <tr>
    <td scope="row">To</td>
    <td>
      <div>
          {emailPreviewData.emailTo.map((item)=>(
              <div key={item.value}>{item.value}</div>
          ))}
      </div>
      </td>
    <td>
      <i className="far fa-edit"></i>
    </td>
  </tr>
  <tr>
    <td scope="row">CC</td>
    <td>
    <div>
          {Array.isArray(emailPreviewData?.emailCC) &&  emailPreviewData?.emailCC?.map((item)=>(
              <div key={item.value}>{item.value}</div>
          ))}
      </div>
    </td>
    <td>
      <i className="far fa-edit"></i>
    </td>
  </tr>
  <tr>
    <td scope="row">BCC</td>
    <td>
      <div>
          {Array.isArray(emailPreviewData?.emailBCC) && emailPreviewData?.emailBCC?.map((item)=>(
              <div key={item.value}>{item.value}</div>
          ))}
      </div>
      </td>
    <td>
      <i className="far fa-edit"></i>
    </td>
  </tr>
  <tr>
    <td scope="row">Subject</td>
    <td>{emailPreviewData.subject}</td>
    <td>
      <i className="far fa-edit"></i>
    </td>
  </tr>
  <tr>
    <td scope="row">Body</td>
    <td></td>
    <td>
      <i className="far fa-edit"></i>
    </td>
  </tr>
</tbody>
</Table> */
}
