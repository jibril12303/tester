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
import CreatableSelect from "react-select/creatable"
import { useDispatch } from "react-redux"
import { emailTemplateCreators } from "store/email-templates/reducer"
import Select from "react-select"
import {showToast} from 'utils/toastnotify'


const emailLists = [
  { label: "Parent's email", value: "{{myCase.parent.emailAddress}}" },
  { label: "Referrer's email", value: "{{referrer.emailAddress}}" },
  { label: "Case created by email", value: "{{myCase.createdBy.email}}"},
  { label: "User's email", value: "{{user.email}}" },
  { label: "PLASTIC_EMAIL", value: "{{environment.PLASTIC_EMAIL}}" },
  { label: "TRAUMA_EMAIL", value: "{{environment.TRAUMA.EMAIL}}" },
  { label: "THEATRE_EMAIL", value: "{{environment.THEATRE_EMAIL}}" },
  { label: "REFEREE_EMAIL", value: "{{environment.REFEREE_EMAIL}}" },
  { label: "OPHTH_EMAIL", value: "{{environment.OPHTH_EMAIL}}" },
  { label: "PARENT_EMAIL", value: "{{environment.PARENT_EMAIL}}" },
  { label: "NIGHT_EMAIL", value: "{{environment.NIGHT_EMAIL}}" },
  { label: "LOKESH_EMAIL", value: "{{environment.LOKESH_EMAIL}}" },
  { label: "ADMIN_EMAIL", value: "{{environment.ADMIN_EMAIL}}" },
  { label: "APPROVER_EMAIL", value: "{{environment.APPROVER_EMAIL}}" },
  { label: "BED_EMAIL", value: "{{environment.BED_EMAIL}}" },
  { label: "WARD_EMAIL", value: "{{environment.WARD_EMAIL}}" },
  { label: "PICU_EMAIL", value: "{{environment.PICU_EMAIL}}" },
  { label: "BOOKING_EMAIL", value: "{{environment.BOOKING_EMAIL}}" },
  { label: "OREFEREE_EMAIL", value: "{{environment.OREFEREE_EMAIL}}" },
  { label: "BMEC_EMAIL", value: "{{environment.BMEC_EMAIL}}" },
  { label: "LUKE_EMAIL", value: "{{environment.LUKE_EMAIL}}" },
  { label: "BOOKING_TWO", value: "{{environment.BOOKING_TWO}}" },
  { label: "PHARMACY_EMAIL", value: "{{environment.PHARMACY_EMAIL}}" },
  { label: "APPROVER_EMAIL", value: "{{environment.APPROVER_EMAIL}}" },
]

const Addresses = ({ shouldSubmit, next, setSubmitfalse,emailEditMode,singleEmailTemplate}) => {
  const dispatch = useDispatch()

  const createOption = label => ({
    label,
    value: label,
  })

  const components = {
    DropdownIndicator: null,
  }

  //references for the focus
  // const emailToRef = useRef(null)
  const emailCCRef = useRef(null)
  const emailBCCRef = useRef(null)

  const [validator, showValidationMessage] = useValidator()

  const [emailSelect, setEmailSelect] = useState({
    inputValue: "",
    value: [],
  })


  const [templateAddressInfo, setTemplateAddressInfo] = useState({
    emailTo: [],
    emailCC: [],
    emailBCC: [],
  })

  const [error, setError] = useState({
    emailTo: false,
  })

  const handleTOChange = (selectedOption) =>{
    setTemplateAddressInfo({...templateAddressInfo,emailTo:selectedOption})
  }
  const handleCCChange = (selectedOption) =>{
    setTemplateAddressInfo({...templateAddressInfo,emailCC:selectedOption})
  }
  const handleBCCChange = (selectedOption) =>{
    setTemplateAddressInfo({...templateAddressInfo,emailBCC:selectedOption})
  }

  const handleCreate = (value, key) =>{
    debugger;
    let emailTest =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
    if(emailTest){
      setTemplateAddressInfo({...templateAddressInfo,[key]:[...templateAddressInfo[key],createOption(value)]})
    } else {
      showToast('Must enter a valid email','error')
    }
  }

  const handleValueChange = e => {
    setTemplateAddressInfo({
      ...templateAddressInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleChange = (value, actionMeta) => {
    console.group("Value Changed")
    console.log(value)
    console.log(`action: ${actionMeta.action}`)
    console.groupEnd()
    setEmailSelect({
      ...emailSelect,
      value: value,
    })
  }

  const handleInputChange = inputValue => {
    setEmailSelect({
      ...emailSelect,
      inputValue: inputValue,
    })
  }

  const handleKeyDown = event => {
    // const { inputValue, value } = this.state;
    if (!emailSelect?.inputValue) return
    switch (event.key) {
      case "Enter":
      case "Tab":
        console.group("Value Added")
        // console.log(value);
        console.groupEnd()
        if (
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
            emailSelect?.inputValue
          )
        ) {
          setError({
            ...error,
            emailTo: false,
          })
          setEmailSelect({
            inputValue: "",
            value: [
              ...emailSelect?.value,
              createOption(emailSelect?.inputValue),
            ],
          })
          event.preventDefault()
        }
    }
  }

  const findAddressInfoData =(data)=>{
    debugger;

    let Arr = [];

    data.map((value)=>{
      emailLists.map((listItem)=>{
        if(listItem.value === value){
          Arr.push({...listItem})
        }
      })
      if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)){
        Arr.push({value: value, label: value})
      }
    })


    return Arr;

  }


  useEffect(() => {
    console.log("emailSelect", emailSelect)
  }, [emailSelect])

  //submit current Info
  useEffect(() => {
    if (shouldSubmit) {
      console.log("check submit")
      setError({
        ...error,
        emailTo: !validator.fieldValid("emailTo"),
      })

      if (templateAddressInfo.emailTo.length >0) {
        console.log("no error")
        const payload = {
          emailTo: templateAddressInfo.emailTo,
          emailCC: templateAddressInfo.emailCC,
          emailBCC: templateAddressInfo.emailBCC,
        }
        dispatch(emailTemplateCreators.saveEmailDataLocally(payload))
        next()
      } else {
        showToast("Please select mandatory fields","error")
      }
      setSubmitfalse()
    }
  }, [shouldSubmit])

  useEffect(() =>{
    if(emailEditMode == "edit" && singleEmailTemplate.length > 0){
      let data = singleEmailTemplate[0];
      let emailTo = findAddressInfoData(data.recipients.to);
      let emailCC = findAddressInfoData(data.recipients.cc);
      let emailBCC = findAddressInfoData(data.recipients.bcc);


      setTemplateAddressInfo({emailTo:emailTo, emailBCC: emailBCC, emailCC: emailCC})
      
      // setTemplateBasicInfo({
      //   templateName: data.name,
      //   templateDescription: data.description,
      // })
    }
  },[emailEditMode,singleEmailTemplate])

  useEffect(() => {
    console.log("templateAddressInfo", templateAddressInfo)
  }, [templateAddressInfo])

  // useEffect(() => {
  //   console.log("shouldSubmit", shouldSubmit)
  // }, [shouldSubmit])

  return (
    <div>
      <CardTitle>Addresses</CardTitle>
      <div className="card-title-desc">{`Enter the address who you would like to notify. You can use {{parent_email}}, referrer_email, reviewer email.`}</div>
      <div className="border p-4">
        <Form>
          <Row>
            <Col sm={12} md={10}>
              <FormGroup>
                <Label>
                  To<span className="text-danger"> *</span>
                </Label>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {/* <CreatableSelect
                    ref={emailToRef}
                    components={components}
                    inputValue={emailSelect.inputValue}
                    isClearable
                    isMulti
                    menuIsOpen={false}
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type email and press enter..."
                    value={emailSelect.value}
                    invalid={error.emailTo}
                    style={{ width: "100%" }}
                  />
                  {error.emailTo && (
                    <div
                      className="mx-1"
                      style={{ fontSize: "80%", color: "#f46a6a" }}
                    >
                      email To field is required
                    </div>
                  )}
                  <FormFeedback>
                    {validator.message(
                      "emailto",
                      emailSelect.value,
                      "required"
                    )}
                  </FormFeedback> */}
                  <div style={{ width: "inherit" }}>
                    <CreatableSelect
                      options={emailLists}
                      isMulti
                      placeholder="Select a field"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      style={{ width: "inherit" }}
                      value={templateAddressInfo.emailTo}
                      onChange={handleTOChange}
                      onCreateOption={(val)=>handleCreate(val,'emailTo')}
                      formatCreateLabel={(val)=>`Add ${val}`}
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div className="input-group">
                    {/* <Input
                      innerRef={emailToRef}
                      type="text"
                      id="emailTo"
                      name="emailTo"
                      placeholder="Send email To"
                      // className="form-control"
                      style={{ height: "36px" }}
                      value={templateAddressInfo.emailTo}
                      onChange={handleValueChange}
                      invalid={error.emailTo}
                    /> */}

                    {/* <FormFeedback>
                      {validator.message(
                        "emailto",
                        templateAddressInfo.emailTo,
                        "required"
                      )}
                    </FormFeedback> */}
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={10}>
              <FormGroup>
                <Label>CC</Label>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }} className="input-group">
                    {/* <Input
                      innerRef={emailCCRef}
                      type="text"
                      id="emailCC"
                      name="emailCC"
                      placeholder="Enter CC"
                      className="form-control"
                      style={{ height: "36px" }}
                      value={templateAddressInfo.emailCC}
                      onChange={handleValueChange}
                      invalid={error.emailCC}
                    /> */}
                    <div style={{ width: "inherit" }}>
                      <CreatableSelect
                        options={emailLists}
                        isMulti
                        placeholder="Select a field"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={templateAddressInfo.emailCC}
                        style={{ width: "inherit" }}
                        onChange={handleCCChange}
                        onCreateOption={(val)=>handleCreate(val,'emailCC')}
                        formatCreateLabel={(val)=>`Add ${val}`}
                      />
                    </div>
                    {/* <FormFeedback>
                      {validator.message(
                        "emailcc",
                        templateAddressInfo.emailCC,
                        "required"
                      )}
                    </FormFeedback> */}
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={10}>
              <FormGroup>
                <Label>BCC</Label>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }} className="input-group">
                    {/* <Input
                      innerRef={emailBCCRef}
                      type="text"
                      id="emailBCC"
                      name="emailBCC"
                      placeholder="Enter BCC"
                      className="form-control"
                      style={{ height: "36px" }}
                      value={templateAddressInfo.emailBCC}
                      onChange={handleValueChange}
                      invalid={error.emailBCC}
                    /> */}
                    <div style={{ width: "inherit" }}>
                      <CreatableSelect
                        options={emailLists}
                        isMulti
                        placeholder="Select a field"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        style={{ width: "inherit" }}
                        value={templateAddressInfo.emailBCC}
                        onChange={handleBCCChange}
                        onCreateOption={(val)=>handleCreate(val,'emailBCC')}
                        formatCreateLabel={(val)=>`Add ${val}`}
                      />
                    </div>
                    {/* <FormFeedback>
                      {validator.message(
                        "emailbcc",
                        templateAddressInfo.emailBCC,
                        "required"
                      )}
                    </FormFeedback> */}
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

Addresses.propTypes = {
  shouldSubmit: PropTypes.bool,
  next: PropTypes.func,
  setSubmitfalse: PropTypes.func,
  emailEditMode: PropTypes.any,
  singleEmailTemplate: PropTypes.any


}

export default Addresses
