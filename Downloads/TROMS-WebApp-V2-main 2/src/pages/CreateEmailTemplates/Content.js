import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { emailTemplateCreators } from "store/email-templates/reducer"
import PropTypes from "prop-types"
import {
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback,
} from "reactstrap"
import useValidator from "hooks/useValidator"
import Select from "react-select"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"


const defaultEmailBody = {
  body: `<p>Hello abcd {{CAPRI_REVIEWER_NAME}},</p><p><br></p><p>You have a new eye case from {{TRUST_NAME}}, Please click the link below to review the case.</p><p>{{LINK}}</p><p><br></p><p>Regards,</p><p>Capri Admin</p>`,
}

function Content({ shouldSubmit, next, setSubmitfalse,emailEditMode,singleEmailTemplate }) {
  const [validator, showValidationMessage] = useValidator()
  const dispatch = useDispatch()

  const [contentInfo, setContentInfo] = useState({
    subject: "",
    emailBody: "",
  })

  const handleValueChange = e => {
    setContentInfo({
      ...contentInfo,
      [e.target.name]: e.target.value,
    })
  }

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: ["small", false, "large", "huge"] }, { color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
          { align: [] },
        ],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    clipboard: { matchVisual: false },
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "size",
    "color",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
  ]

  const [error, setError] = useState({
    subject: false,
  })

  const [emailbody, setEmailBody] = useState(defaultEmailBody.body)
  useEffect(() => {
    const obj = {
      body: emailbody,
    }
    console.log("emailbody", emailbody)
  }, [emailbody])

  useEffect(() => {
    if (shouldSubmit) {
      setError({
        ...error,
        subject: !validator.fieldValid("subject"),
      })
      if (validator.allValid()) {
        dispatch(
          emailTemplateCreators.saveEmailDataLocally({
            subject: contentInfo.subject,
            emailBody: emailbody,
          })
        )
        console.log("no error")
        next()
      } else {
        showValidationMessage(true)
      }
      setSubmitfalse()
    }
  }, [shouldSubmit])

    useEffect(() =>{
    if(emailEditMode == "edit" && singleEmailTemplate.length > 0){
      let data = singleEmailTemplate[0];
      const {subject,htmlString} = data;
      setContentInfo({
        subject:subject
      })
      setEmailBody(htmlString);
    }
  },[emailEditMode,singleEmailTemplate])

  return (
    <div>
      <CardTitle>Content</CardTitle>
      <div className="card-title-desc">{`Enter the subject and notification body content including {{variable}} to populate them dynamically.`}</div>
      <div className="border p-4">
        <Form>
          <Row>
            <Col sm={12} md={10}>
              <FormGroup>
                <Label>
                  Subject<span className="text-danger"> *</span>
                </Label>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }} className="input-group">
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Enter subject"
                      className="form-control"
                      style={{ height: "36px" }}
                      value={contentInfo.subject}
                      onChange={handleValueChange}
                      invalid={error.subject}
                    />
                    <FormFeedback>
                      {validator.message(
                        "subject",
                        contentInfo.subject,
                        "required"
                      )}
                    </FormFeedback>
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Row>
          <Row>
            <Col sm={12} md={10} >
              <Label>Available fields <span className="text-danger">*</span></Label>
              <div
                className="button-items"
                style={{ gap: "5px", color: "#495057" }}
              >
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{referrer.firstName}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{referrer.lastName}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{myCase.caseID}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{myCase.pathwayOutcome}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{myCase.pathway}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{patient.firstName}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{patient.lastName}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{user.firstName}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{user.lastName}}`}</div>
                <div
                  className="badge font-size-13  border-0"
                  style={{ color: "#495057" }}
                >{`{{user.speciality}}`}</div>
              </div>
            </Col>
          </Row>
          <div className="mt-4" style={{ height: "270px" }}>
            <Label>Body</Label>
            <ReactQuill
              theme="snow"
              value={emailbody}
              onChange={setEmailBody}
              style={{ height: "200px" }}
              modules={modules}
              formats={formats}
            />
          </div>
        </Row>
      </div>
    </div>
  )
}

Content.propTypes = {
  shouldSubmit: PropTypes.bool,
  next: PropTypes.func,
  setSubmitfalse: PropTypes.func,
  emailEditMode: PropTypes.any,
  singleEmailTemplate: PropTypes.any

}

export default Content





