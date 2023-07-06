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
import ReactQuill from "react-quill"
import useValidator from "hooks/useValidator"
import CreatableSelect from "react-select/creatable"
import { useDispatch } from "react-redux"
import { emailTemplateCreators } from "store/email-templates/reducer"

const defaultEmailBody = {
    header:`<p>Hello {{CAPRI_REVIEWER_NAME}}</p>`,
    body: `<p>Hello {{CAPRI_REVIEWER_NAME}},</p><p><br></p><p>You have a new eye case from {{TRUST_NAME}}, Please click the link below to review the case.</p><p>{{LINK}}</p><p><br></p><p>Regards,</p><p>Capri Admin</p>`,
    footer:`<p>Regards,</p><p>Capri Admin</p>`
    // table:`<table><thead><tr><td>   <tr/><thead/></table`
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

function HeaderNFooter() {

  const [emailHeader, setEmailHeader] = useState(defaultEmailBody.header)
  const [emailFooter,setEmailFooter] = useState(defaultEmailBody.footer)

  useEffect(()=>{
    console.log("emailHeader",emailHeader)
  },[emailHeader])

  useEffect(()=>{
    console.log("emailFooter",emailFooter)
},[emailFooter])

  return (
    <div>
      <CardTitle>Header & Footer</CardTitle>
      <div className="card-title-desc">
        Setup the Header and Footer you want to use in template
      </div>
 
      <div className="border p-4">
        <Row style={{height:"470px"}} >
            <Col sm={8}>
                <Label>Header</Label>
                <ReactQuill
              theme="snow"
              value={emailHeader}
              onChange={setEmailHeader}
              style={{ height: "150px" }}
              modules={modules}
              formats={formats}
            />
            </Col>
            <Col sm={8} className="mt-4">
            <Label>Footer</Label>
            <ReactQuill
              theme="snow"
              value={emailFooter}
              onChange={setEmailFooter}
              style={{ height: "150px" }}
              modules={modules}
              formats={formats}
            />
            </Col>
        </Row>
      </div>
    </div>
  )
}

export default HeaderNFooter
