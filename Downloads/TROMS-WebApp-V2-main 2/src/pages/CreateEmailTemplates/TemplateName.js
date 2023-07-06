import React, { useEffect, useState, useRef } from "react"
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
import { useDispatch } from "react-redux"
import {emailTemplateCreators} from "store/email-templates/reducer"

const TemplateName = ({ shouldSubmit,next,setTemplateBasicInfoSubmit,emailEditMode,singleEmailTemplate}) => {
  const [validator, showValidationMessage] = useValidator()
  const dispatch = useDispatch()

  //references for the focus
  const templateNameRef = useRef(null)
  const templateDescriptionRef = useRef(null)

  const [templateBasicInfo, setTemplateBasicInfo] = useState({
    templateName: "",
    templateDescription: "",
  })

  const [error, setError] = useState({
    templateName: false,
    templateDescription: false,
  })

  const handleValueChange = e => {
    setTemplateBasicInfo({
      ...templateBasicInfo,
      [e.target.name]: e.target.value,
    })
  }

  //submit current Info
  useEffect(() => {
    if (shouldSubmit) {
      console.log("check submit")
      setError({
        ...error,
        templateName: !validator.fieldValid("templateName"),
        templateDescription: !validator.fieldValid("templateDescription"),
      })

      if (validator.allValid()) {
        dispatch(emailTemplateCreators.saveEmailDataLocally(templateBasicInfo))
        console.log("no error")
        next();
      } else {
        showValidationMessage(true)
      }
      setTemplateBasicInfoSubmit(false)
    }
  }, [shouldSubmit])

  useEffect(() => {
    error?.templateName && templateNameRef.current.focus()
    error?.templateDescription && templateDescriptionRef.current.focus()
  }, [error])

  useEffect(() => {
    console.log("templateBasicInfo", templateBasicInfo)
  }, [templateBasicInfo])

  useEffect(() =>{
    if(emailEditMode == "edit" && singleEmailTemplate.length > 0){
      let data = singleEmailTemplate[0];
      setTemplateBasicInfo({
        templateName: data.name,
        templateDescription: data.description,
      })
    }
  },[emailEditMode,singleEmailTemplate])

  return (
    <div>
      <CardTitle>Email template</CardTitle>
      <p className="card-title-desc">
        Enter a meaningfull name of the email template.
      </p>
      <div className="p-4 border">
        <Form>
          <Row>
            <Col sm={12} md={10}>
              <FormGroup>
                <Label>Template Name<span className="text-danger"> *</span></Label>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }} className="input-group">
                    <Input
                      innerRef={templateNameRef}
                      type="text"
                      id="templateName"
                      name="templateName"
                      placeholder="Enter a template name"
                      className="form-control"
                      style={{ height: "36px" }}
                      value={templateBasicInfo.templateName}
                      onChange={handleValueChange}
                      invalid={error.templateName}
                    />
                    <FormFeedback>
                      {validator.message(
                        "templateName",
                        templateBasicInfo.templateName,
                        "required"
                      )}
                    </FormFeedback>
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={10}>
              <FormGroup>
                <Label>Template Description<span className="text-danger"> *</span></Label>
                <Input
                  innerRef={templateDescriptionRef}
                  type="textarea"
                  id="templateDescription"
                  name="templateDescription"
                  placeholder="Enter a template Description"
                  className="form-control"
                  value={templateBasicInfo.templateDescription}
                  onChange={handleValueChange}
                  invalid={error.templateDescription}
                />
                <FormFeedback>
                  {validator.message(
                    "templateDescription",
                    templateBasicInfo.templateDescription,
                    "required"
                  )}
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

TemplateName.propTypes = {
  shouldSubmit: PropTypes.bool,
  next: PropTypes.func,
  setTemplateBasicInfoSubmit: PropTypes.func,
  emailEditMode: PropTypes.any,
  singleEmailTemplate: PropTypes.any
}

export default TemplateName
