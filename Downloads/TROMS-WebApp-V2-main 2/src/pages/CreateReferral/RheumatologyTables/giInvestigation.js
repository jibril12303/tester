import React, { useEffect, useState } from "react"
import {
  Table,
  Input,
  Label,
  Form,
  FormGroup,
  Row,
  Col,
  Button,
} from "reactstrap"
import "./styles.css"
import PropTypes from "prop-types"
import { showToast } from "utils/toastnotify"
// import FileUploadIcon from "assets/icon/fileUploadIcon.svg";
import { ReactComponent as FileUploadIcon } from "assets/icon/fileUploadIcon.svg"
import { v4 as uuid } from "uuid"

const GiInvestigation = ({
  currentQuestion,
  fields,
  nextButtonCalled,
  onClick,
  featureValues,
  setGiInvestigateFeatureValues,
  question,
}) => {
  const [selectedFiles, setSelectedFiles] = useState()
  let inputNodes = new Map()

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  //handles store image in fields
  const handleChange = (e, objName) => {
    debugger
    console.log("f", e.target.files)
    if (e.target.files.length > 0) {
      let files = Object.keys(e.target.files).map(index => {
        console.log("file", [e.target.files[0]])
        let indexedFile = e.target.files[index]
        Object.assign(indexedFile, {
          preview: indexedFile.preview
            ? indexedFile.preview
            : URL.createObjectURL(indexedFile),
          formattedSize: formatBytes(indexedFile.size),
        })
        return { file: indexedFile, id: uuid() }
      })
      setGiInvestigateFeatureValues({
        ...featureValues,
        [objName]: {
          ...featureValues[objName],
          file: featureValues[objName]["file"]?.length > 0 ? [...featureValues[objName]["file"], ...files] : [...files],
        },
      })
    }
    e.value = null
  }

  const handleDeleteImageOfField = (objName, imgId) => {
    const files = featureValues[objName]?.file?.map(item => item)
    let index = files.findIndex(item => item.id == imgId)
    if (index != -1) {
      files.splice(index, 1)
    }
    setGiInvestigateFeatureValues({
      ...featureValues,
      [objName]: { ...featureValues[objName], file: files ?? [] },
    })
  }

  const makeFieldValueObj = fields => {
    const obj = {}

    fields?.content?.map((item, index) => {
      let objName = item?.investigation?.objName
      let fieldName = item?.investigation?.value

      obj[objName] = {
        type: item?.presentation?.type,
        fieldName: fieldName,
      }
      let answers = item?.presentation?.answers
      if (answers?.includes("images")) {
        obj[objName].file = []
      }
      if (answers?.includes("Positive")) {
        obj[objName].present = null
      }
      if (answers?.includes("textarea")) {
        obj[objName].Description = ""
      }

      // if(item?.presentation?.type == "radio"){
      //     obj[item?.investigation?.objName] = {

      //         present:null,
      //         file:[],
      //         Description:""
      //     }
      // }
      // else if(item?.presentation?.type == "textarea"){
      //     obj[item?.investigation?.objName] = {
      //         type:item?.presentation?.type,
      //         value:""
      //     }
      // }
    })
    setGiInvestigateFeatureValues(obj)
    console.log("value obj=>", obj)
  }

  const handleValueChange = (value, label, key) => {
    console.log("checked", value, "label")
    console.log("featureValues[label]?.present", featureValues[label]?.present)
    if (
      key == "present" &&
      value == "negative" &&
      featureValues[label]?.hasOwnProperty("file")
    ) {
      // adding enable/disable image and text area based on present value
      setGiInvestigateFeatureValues({
        ...featureValues,
        [label]: {
          ...featureValues[label],
          present: "negative",
          Description: "",
          file: [],
        },
      })
    } else {
      setGiInvestigateFeatureValues({
        ...featureValues,
        [label]: { ...featureValues[label], [key]: value },
      })
    }
  }

  useEffect(() => {
    console.log("featureValues=>", featureValues)
  }, [featureValues])

  //this stops the crashing from happening
  useEffect(()=>{
    if(fields && featureValues == undefined){
      if(featureValues == undefined){
          makeFieldValueObj(fields)
      }else if(Object.keys(featureValues).length ==0  ){
              makeFieldValueObj(fields);
      }
    }
  },[fields, featureValues])


  useEffect(() => {
    if (fields) {
      if (Object.keys(featureValues).length == 0) {
        makeFieldValueObj(fields)
      }
    }
  }, [fields])

  // handle the next button press and validations
  useEffect(() => {
    if (
      currentQuestion?.answers?.type?.toLowerCase() == "rheuinves3" &&
      nextButtonCalled
    ) {
      const validateInvestigation = () => {
        let error = false
        let featureValueKeys = Object.keys(featureValues)
        for (let i = 0; i < featureValueKeys.length; i++) {
          let objName = featureValueKeys[i]
          if (featureValues[objName]?.type == "radio") {
            if (featureValues[objName]?.present == null) {
              error = true
              break
            } else if (featureValues[objName].hasOwnProperty("file")) {
              // alert("desc & file check");

              if (
                featureValues[objName]?.present == "positive" &&
                featureValues[objName]?.file?.length <= 0 &&
                featureValues[objName]?.Description < 2
              ) {
                // alert("desc & file");
                handleFocusonField(objName)
                error = true
                break
              }
            } else if (!featureValues[objName].hasOwnProperty("file")) {
              if (
                featureValues[objName]?.present == "positive" &&
                featureValues[objName]?.Description < 2
              ) {
                handleFocusonField(objName)
                error = true
                break
              }
            } else if (
              featureValues[objName]?.present == "positive" &&
              featureValues[objName]?.Description < 2
            ) {
              handleFocusonField(objName)
              error = true
              break
            }

            //validation remains for Stool Culture, Virology Samples everything ese is done
          }
          if (featureValues[objName]?.type == "textarea") {
            if (
              featureValues[objName]?.Description?.length <= 1 &&
              featureValues[objName]?.file?.length <= 0
            ) {
              console.log("error")
              error = true
              handleFocusonField(objName)
              break
            }
          }
        }
        return error
      }
      let onClickData = {answer: featureValues}
      if(currentQuestion.answers?.next){
        onClickData['next'] = currentQuestion.answers.next;
      }
      if(currentQuestion.answers?.endpoint){
        onClickData['endpoint'] = currentQuestion.answers.endpoint;
      }
      if (question?.answers?.screenValidation === true) {
        const validateinv = validateInvestigation()
        if (validateinv) {
          showToast("All mandatory fields must be filled to proceed", "error")
        } else {
          onClick(onClickData)
        }
      } else if (question?.answers?.screenValidation === false) {
        //store answer and go next
        onClick(onClickData)
      }
    }
  }, [nextButtonCalled])

  const handleFocusonField = i => {
    const node = inputNodes.get(i)
    console.log("node", node)
    node.classList.add("errorBorder")
    node.focus()
    //     node.focus();
    setTimeout(() => {
      node.classList.remove("errorBorder")
    }, 4000)
  }

  const renderTextAreaAndImage = (row, label, index, fieldDisabled) => {
    return (
      <>
        <Row>
          <Col
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {featureValues[label]?.hasOwnProperty("Description") &&
              !(label == "oabi" || label == "abul") && (
                <Input
                  type="text"
                  style={{ minWidth: "192.94px" }}
                  placeholder={row?.investigation?.placeholder}
                  value={featureValues[label]?.Description}
                  onChange={e =>
                    handleValueChange(e.target.value, label, "Description")
                  }
                  innerRef={c => inputNodes.set(label, c)}
                />
              )}
            {featureValues[label]?.hasOwnProperty("Description") &&
              (label == "oabi" || label == "abul") && (
                <Input
                  type="text"
                  style={{ minWidth: "192.94px" }}
                  placeholder={row?.investigation?.placeholder}
                  value={featureValues[label]?.Description}
                  onChange={e =>
                    handleValueChange(e.target.value, label, "Description")
                  }
                  innerRef={c => inputNodes.set(label, c)}
                  disabled={
                    featureValues[label]?.present == "positive" ? false : true
                  }
                />
              )}
            {featureValues[label]?.hasOwnProperty("file") && (
              <>
                {featureValues[label]?.hasOwnProperty("present") ? (
                  <>
                    <input
                      type="file"
                      id={`actual-btn-${index}`}
                      multiple
                      hidden
                      onChange={e => {
                        if (!fieldDisabled) {
                          handleChange(e, label)
                        }
                      }}
                      value={[]}
                      accept="image/*"
                    />
                    <Label
                      className="btn img-button"
                      for={`actual-btn-${index}`}
                      color="#ced4da"
                      outline
                      style={{
                        background:
                          fieldDisabled === true ? "#EFF2F7" : "#556EE6",
                        border: "1px solid #ced4da",
                        margin: "0px",
                      }}
                    >
                      <FileUploadIcon
                        fill={fieldDisabled === true ? "#ced4da" : "white"}
                      />
                    </Label>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      id={`actual-btn-${index}`}
                      multiple
                      hidden
                      onChange={e => {
                        handleChange(e, label)
                      }}
                      value={[]}
                      accept="image/*"
                    />
                    <Label
                      className="btn img-button"
                      for={`actual-btn-${index}`}
                      color="#ced4da"
                      outline
                      style={{
                        background: "#556EE6",
                        border: "1px solid #ced4da",
                        margin: "0px",
                      }}
                    >
                      <FileUploadIcon fill={"white"} />
                    </Label>
                  </>
                )}
              </>
            )}
          </Col>
        </Row>
        {featureValues[label]?.file?.length > 0 &&
          featureValues[label]?.file.map((item, key) => {
            return (
              <Row key={key}>
                <Col>
                  <div
                    className="border mt-1"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* <div className="image-name-div text-bold ">
                      {item?.file?.name}
                    </div> */}
                    <div className="image-name-div text-bold" style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"5px"}}>
                      <div>
                        <img
                          src={item?.file?.preview}
                          style={{ height: "63px", width: "90px" }}
                        />
                      </div>
                      <div className="text-center">{item?.file?.name}</div>
                    </div>
                    <div
                      className="DelteIcondDiv"
                      onClick={() => handleDeleteImageOfField(label, item?.id)}
                    >
                      <i
                        className="bx bxs-trash text-danger"
                        style={{ fontSize: "16px" }}
                      ></i>
                    </div>
                  </div>
                </Col>
              </Row>
            )
          })}
      </>
    )
  }

  const renderPresentation = (row, type, index) => {
    let label = row?.investigation?.objName

    let fieldDisabled =
      featureValues[label] && featureValues[label].present == "positive" ? false : true

    return (
      <>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/*radio*/}
          {featureValues[label]?.hasOwnProperty("present") && (
            <Col className="col-sm-4  ">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Form>
                  <Row
                    style={{
                      minWidth: "130px",
                      maxWidth: "170px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Col
                      onClick={e =>
                        handleValueChange("positive", label, "present")
                      }
                    >
                      <div style={{ cursor: "pointer", width: "max-content" }}>
                        <Input
                          type="radio"
                          checked={featureValues[label]?.present == "positive"}
                        />{" "}
                        <label style={{ margin: "0px" }}>
                          {row?.investigation?.objName == "viroSample" ||
                          row?.investigation?.objName == "stoolC"
                            ? "+ve"
                            : "Yes"}
                        </label>
                      </div>
                    </Col>
                    <Col style={{ padding: "initial" }}>
                      <div
                        onClick={e =>
                          handleValueChange("negative", label, "present")
                        }
                        style={{ cursor: "pointer", width: "max-content" }}
                      >
                        <Input
                          type="radio"
                          checked={featureValues[label]?.present == "negative"}
                        />{" "}
                        <label style={{ margin: "0px" }}>
                          {row?.investigation?.objName == "viroSample" ||
                          row?.investigation?.objName == "stoolC"
                            ? "-ve"
                            : "No"}
                        </label>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          )}
          {/*image upload && text area */}
          <Col
            className={
              featureValues[label]?.hasOwnProperty("present")
                ? "col-sm-8"
                : "col-sm-12"
            }
          >
            {renderTextAreaAndImage(row, label, index, fieldDisabled)}
          </Col>
        </Row>
      </>
    )
    if (type == "textarea") {
      return (
        <Row>
          {/*radio*/}
          <Col>
            <Input
              type="text"
              value={featureValues[label]?.value}
              onChange={e => handleValueChange(e.target.value, label, "value")}
              innerRef={c => inputNodes.set(label, c)}
              placeholder={row?.investigation?.placeholder}
            />
          </Col>
          {/*image upload && text area */}
        </Row>
      )
    }
  }

  return (
    <>
      <div className="mb-3 h4 card-title">
        {question &&
          question?.question?.split("\n").map((it, ind) => {
            return (
              <div className="mb-1" key={ind}>
                {it}
              </div>
            )
          })}
      </div>
      <div className="border p-2 investigation-table ">
        <Table className="border table table-striped mb-0">
          <thead>
            <tr>
              <th className="col-sm-4 border">
                Investigation
                {question?.answers?.screenValidation === true && (
                  <span className="text-danger">*</span>
                )}
              </th>
              <th className="col-sm-8 border ">
                Presentation
                {question?.answers?.screenValidation === true && (
                  <span className="text-danger">*</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {featureValues != undefined && fields?.content?.map((item, index) => {
              console.log('itemSIU',featureValues[item?.investigation?.objName])
              return (
                <tr key={index} style={{ verticalAlign: "middle" }}>
                  <td>{item?.investigation?.value}</td>
                  <td>
                    {renderPresentation(item, item?.presentation?.type, index)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <Row>
          <Col></Col>
        </Row>
      </div>
    </>
  )
}

GiInvestigation.propTypes = {
  fields: PropTypes.any,
  nextButtonCalled: PropTypes.any,
  onClick: PropTypes.any,
  featureValues: PropTypes.any,
  setGiInvestigateFeatureValues: PropTypes.any,
  question: PropTypes.any,
  currentQuestion: PropTypes.any,
}

export default GiInvestigation
