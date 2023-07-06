import React, { useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
  Collapse,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Media,
  CardText,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap"
import classnames from "classnames"
import _ from "lodash"
import { height } from "@mui/system"
import styled from "styled-components"
import {
  renderClinicalField,
  renderInvestigateField,
  renderInvestigateField2,
  renderGiInvestigateField,
  renderTreatMentField,
  renderVitalsField,
} from "utils/rheuFunctions"

const OffCanvasRheuScreens = ({
  showRheuScreen,
  toggleRheuScreen,
  summary,
  offCanvasCustomActiveTab,
  setOffCanvasCustomActiveTab,
  setActiveTab,
}) => {
  const [TreatmentScreenData, setTreatmentScreenData] = useState([])

  const { reauScreens } = useSelector(state => ({
    reauScreens: state.CreateReferral.reauScreens,
  }))

  //   const [customActiveTab, setcustomActiveTab] = useState("1")
  const toggleCustom = tab => {
    if (offCanvasCustomActiveTab !== tab) {
      setOffCanvasCustomActiveTab(tab)
    }
  }

  const showImageTab = () => {
    toggleRheuScreen(false)
    setActiveTab("7")
  }

  const filterCaseDetailToScreen = (screen, data) => {
    let result = {}
    if (data != null) {
      if (data?.length > 0) {
        result = _.findLast(data, function (obj) {
          if (screen.includes(obj.type)) {
            return true
          } else if (obj?.currentQuestion?.CID) {
            let CID = obj.currentQuestion.CID
            if (screen.includes(CID)) {
              return true
            }
          }
        })
      }
    }
    return result
  }
  // const getscreen

  useEffect(() => {
    if (reauScreens && summary) {
      let data = []
      // screen data from summary
      const rheuTreat = filterCaseDetailToScreen(
        ["rheuTreat", "CLINTREAT"],
        summary
      )
      // screen fields and unit from screen API
      let rheuTreatFromScreenApi

      const findUnitFromScreenApi = (fieldName, screenData) => {
        let unit = ""
        let OriginalfieldName = ""
        if (screenData) {
          let fieldObj = screenData?.content?.find(
            i => i.name.objName == fieldName
          )
          if (Object.keys(fieldObj).length > 0) {
            unit = fieldObj?.name?.unit
            OriginalfieldName = fieldObj?.name?.value
          }
        }
        return { unit, OriginalfieldName }
      }
      if (rheuTreat != null && rheuTreat !== undefined) {
        if (
          typeof rheuTreat == "object" &&
          Object.keys(rheuTreat).length > 0 &&
          reauScreens
        ) {
          rheuTreatFromScreenApi = reauScreens?.find(
            item => item.screenType == "rheuTreat"
          )

          data = Object.keys(rheuTreat.answer).map(fieldName => {
            let fields = rheuTreat.answer
            const { unit, OriginalfieldName } = findUnitFromScreenApi(
              fieldName,
              rheuTreatFromScreenApi
            )
            return {
              ...fields[fieldName],
              objName: fieldName,
              fieldName: OriginalfieldName,
              unit: unit,
            }
          })
        }
      }
      console.log("FinalTreatData", data)
      console.log("rheuTreat", rheuTreat)
      console.log("rheuTreatFromScreenApi", rheuTreatFromScreenApi)
      setTreatmentScreenData(data)
    }
  }, [reauScreens, summary])

  const renderClinicalScreen = data => {
    return (
      <Table className="table table-striped mb-0" responsive>
        <thead>
          <tr>
            <th>Clinical Features</th>
            <th>Present</th>
            <th>Date Onset</th>
            <th>Date Resolved</th>
          </tr>
        </thead>
        <tbody>
          {typeof data == "object" &&
            Object.keys(data).length > 0 &&
            Object.keys(data?.answer)?.map((item, key) => {
              let dateOnset = data.answer[item]?.dateOnset
              let dateResolved = data.answer[item]?.dateResolved
              let fieldName = data.answer[item]?.fieldName
              return (
                <tr key={key}>
                  <td style={{ textTransform: "capitalize" }}>{fieldName}</td>
                  <td>{data.answer[item]?.present}</td>
                  <td>{dateOnset?.length <= 0 ? "-" : dateOnset}</td>
                  <td>{dateResolved?.length <= 0 ? "-" : dateResolved}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    )
  }

  const renderInvestigateScreen = data => {
    return (
      <Table className="table table-striped mb-0" responsive>
        <thead>
          <tr>
            <th>Investigation</th>
            <th>Presentation</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {typeof data == "object" &&
            Object.keys(data).length > 0 &&
            Object.keys(data?.answer)?.map((item, key) => {
              const renderDescription = () => {
                if (
                  data.answer[item] &&
                  data.answer[item].hasOwnProperty("Description")
                ) {
                  if (data?.answer[item]["Description"].length <= 0) {
                    return "Not required"
                  } else return data.answer[item]["Description"]
                }
                return "Not Applicable"
              }

              const renderPresentation = () => {
                if (data?.answer[item]?.value?.length > 0) {
                  let presentation = data?.answer[item]?.value
                  if (
                    data?.answer[item]?.type != "radio" &&
                    data?.answer[item]?.unit != undefined
                  ) {
                    presentation += ` ${data?.answer[item]?.unit}`
                  }
                  return _.capitalize(presentation)
                }
                return "-"
              }
              let fieldName = data.answer[item]?.fieldName

              return (
                <tr key={key}>
                  <td style={{ textTransform: "capitalize" }}>{fieldName}</td>
                  <td>{renderPresentation()}</td>
                  <td>{renderDescription()}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    )
  }

  const renderInvestigate2Screen = data => {
    return (
      <Table className="table table-striped mb-0" responsive>
        <thead>
          <tr>
            <th>Investigation</th>
            <th>Presentation</th>
            {/*<th>Description</th>*/}
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {typeof data == "object" &&
            Object.keys(data).length > 0 &&
            Object.keys(data?.answer)?.map((item, key) => {
              const renderDescription = () => {
                if (
                  data.answer[item] &&
                  data.answer[item].hasOwnProperty("Description")
                ) {
                  if (data?.answer[item]["Description"].length <= 0) {
                    return "Not required"
                  } else return data.answer[item]["Description"]
                }
                return "Not Applicable"
              }
              const renderPresentation = () => {
                if (data?.answer[item]?.value?.length > 0) {
                  let presentation = data?.answer[item]?.value
                  if (
                    data?.answer[item]?.type != "radio" &&
                    data?.answer[item]?.unit != undefined
                  ) {
                    presentation += ` ${data?.answer[item]?.unit}`
                  }
                  return _.capitalize(presentation)
                }
                return "-"
              }
              let fieldName = data.answer[item]?.fieldName

              return (
                <tr key={key}>
                  <td style={{ textTransform: "capitalize" }}>{fieldName}</td>
                  <td>{renderPresentation()}</td>
                  {/*<td>{renderDescription()}</td>*/}
                  <td>
                    {data?.answer[item].hasOwnProperty("file") ? (
                      <>
                        <button
                          className={
                            data?.answer[item].file != 0
                              ? "btn-sm btn btn-primary  position-relative"
                              : "btn-sm btn btn-danger  position-relative"
                          }
                          onClick={()=>alert('This is the button')}>


                          <span className="font-size-10 position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                            {data?.answer[item].file?.length}
                          </span>{" "}
                          {data?.answer[item].file != 0
                            ? "View image"
                            : "No images"}


                        </button>
                      </>
                    ) : (
                      "Not Applicable"
                    )}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    )
  }
  const renderInvestigate3Screen = data => {
    return (
      <Table className="table table-striped mb-0" responsive>
        <thead>
          <tr>
            <th>Investigation</th>
            <th>Present</th>
            <th>Description</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {typeof data == "object" &&
            Object.keys(data).length > 0 &&
            Object.keys(data?.answer)?.map((item, key) => {
              const renderDescription = data => {
                if (data) {
                  if (data?.type == "textarea") {
                    if (data?.value?.length <= 0) {
                      return "-"
                    } else return data?.value
                  } else if (data.hasOwnProperty("Description")) {
                    if (data?.Description?.length <= 0) {
                      return "-"
                    } else {
                      return data.Description
                    }
                  }
                  return "Not Applicable"
                }
              }

              let fieldName = data.answer[item]?.fieldName
              return (
                <tr key={key}>
                  <td style={{ textTransform: "capitalize" }}>{fieldName}</td>
                  <td>
                    {data?.answer[item]?.type !== "radio"
                      ? "Not Applicable"
                      : data?.answer[item]?.present?.length > 0
                      ? _.capitalize(data?.answer[item]?.present)
                      : "-"}
                  </td>
                  <td>{renderDescription(data.answer[item])}</td>
                  <td>
                    {data?.answer[item].hasOwnProperty("file") ? (
                      <>
                        <button
                          className={
                            data?.answer[item].file != 0
                              ? "btn-sm btn btn-primary  position-relative"
                              : "btn-sm btn btn-danger  position-relative"
                          }
                          onClick={() => alert('GI button test')}
                        >
                          <span className="font-size-10 position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                            {data?.answer[item].file?.length}
                          </span>{" "}
                          {data?.answer[item].file != 0
                            ? "View image"
                            : "No images"}
                        </button>
                      </>
                    ) : (
                      "Not Applicable"
                    )}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    )
  }

  const renderTreatmentScreen = data => {
    return (
      <Table className="table table-striped mb-0" responsive>
        <thead>
          <tr>
            <th>Treatment</th>
            <th>Applicable</th>
            <th>Date of first dose</th>
            <th>Drug</th>
            <th>Dose</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((item, key) => {
              let fieldName = item?.fieldName
              let applicable = item?.present
              let doseDate
              let drug
              let dose
              let unit = item?.unit
              if ("fields" in item) {
                doseDate = item?.fields.map(field => field.doseDate)
                drug = item?.fields.map(field => field.drug)
                dose = item?.fields.map(field => field.dose)
              } else {
                doseDate = item?.doseDate
                drug = item?.drug
                dose = item?.dose
              }

              if ("fields" in item) {
                return (
                  <tr key={key}>
                    <td style={{ textTransform: "capitalize" }}>{fieldName}</td>
                    <td>{_.capitalize(applicable)}</td>
                    <td>
                      {doseDate?.length <= 0 ? (
                        "-"
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "9px",
                          }}
                        >
                          {doseDate.map((doseDate, key) => (
                            <div key={key}>
                              {doseDate?.length > 0 ? doseDate : "-"}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      {drug?.length <= 0 ? (
                        "-"
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "9px",
                          }}
                        >
                          {drug.map((drug, key) => (
                            <div key={key}>{drug?.length > 0 ? drug : "-"}</div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      {dose?.length <= 0 ? (
                        "-"
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "9px",
                          }}
                        >
                          {dose.map((dose, key) => (
                            <div key={key}>
                              {dose}
                              {unit && ` ${unit}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={key}>
                  <td style={{ textTransform: "capitalize" }}>{fieldName}</td>
                  <td>{_.capitalize(applicable)}</td>
                  <td>{doseDate?.length <= 0 ? "-" : doseDate}</td>
                  <td>{drug?.length <= 0 ? "-" : drug}</td>
                  {/* <td><div>{dose?.length <= 0 ? "-" : dose}{unit && dose?.length <= 0 && ` ${unit}`}</div></td> */}
                  <td>
                    <div>
                      {dose?.length <= 0 ? "-" : dose}
                      {unit && ` ${unit}`}
                    </div>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    )
  }
  const renderPatientVitalScreen = data => {
    const vitalScreen = renderVitalsField(reauScreens)
    //adding units to the values
    const renderValue = (fieldValue, fieldName) => {
      if (fieldValue.length > 0) {
        let value = fieldValue
        const objfromVitalScreen = _.find(vitalScreen?.content, function (i) {
          if (i.name == fieldName) return true
        })
        if (objfromVitalScreen) {
          value += ` ${objfromVitalScreen?.unit}`
        }
        return value
      }
      return "-"
    }

    return (
      <Table className="table table-striped mb-0" responsive>
        <thead>
          <tr>
            <th>Investigation</th>
            <th>Presentation</th>
          </tr>
        </thead>
        <tbody>
          {typeof data == "object" &&
            Object.keys(data).length > 0 &&
            Object.keys(data?.answer)?.map((item, key) => {
              let fieldName = item
              let fieldValue = data.answer[item]

              return (
                <tr key={key}>
                  <td>{fieldName}</td>
                  <td>{renderValue(fieldValue, fieldName)}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    )
  }
  return (
    <Offcanvas
      scrollable={false}
      style={{ width: "40vw" }}
      placement={"end"}
      direction={"end"}
      isOpen={showRheuScreen}
      toggle={() => toggleRheuScreen()}
    >
      <OffcanvasHeader
        toggle={() => {
          toggleRheuScreen(false)
        }}
      >
        VIEW DETAILS
      </OffcanvasHeader>
      <OffcanvasBody>
        <Nav tabs className="nav-tabs-custom nav-justified">
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({
                active: offCanvasCustomActiveTab === "1",
              })}
              onClick={() => {
                toggleCustom("1")
              }}
            >
              <span className="d-block d-sm-none">
                <i className="fas fa-home"></i>
              </span>
              <span className="d-none d-sm-block">Clinical Features</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({
                active: offCanvasCustomActiveTab === "2",
              })}
              onClick={() => {
                toggleCustom("2")
              }}
            >
              <span className="d-block d-sm-none">
                <i className="far fa-user"></i>
              </span>
              <span className="d-none d-sm-block">1st Investigation</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({
                active: offCanvasCustomActiveTab === "3",
              })}
              onClick={() => {
                toggleCustom("3")
              }}
            >
              <span className="d-block d-sm-none">
                <i className="far fa-envelope"></i>
              </span>
              <span className="d-none d-sm-block">2nd Investigation</span>
   
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({
                active: offCanvasCustomActiveTab === "4",
              })}
              onClick={() => {
                toggleCustom("4")
              }}
            >
              <span className="d-block d-sm-none">
                <i className="far fa-envelope"></i>
              </span>
              <span className="d-none d-sm-block">GI Investigation</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({
                active: offCanvasCustomActiveTab === "5",
              })}
              onClick={() => {
                toggleCustom("5")
              }}
            >
              <span className="d-block d-sm-none">
                <i className="far fa-envelope"></i>
              </span>
              <span className="d-none d-sm-block">Treatments</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({
                active: offCanvasCustomActiveTab === "6",
              })}
              onClick={() => {
                toggleCustom("6")
              }}
            >
              <span className="d-block d-sm-none">
                <i className="far fa-envelope"></i>
              </span>
              <span className="d-none d-sm-block">Patient Vitals</span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent
          activeTab={offCanvasCustomActiveTab}
          className="p-3 text-muted"
        >
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                {summary &&
                  renderClinicalScreen(
                    filterCaseDetailToScreen(["rheuClini", "CLINFEAT"], summary)
                  )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                {renderInvestigateScreen(
                  filterCaseDetailToScreen(["rheuInves", "CLININVES"], summary)
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
              {/* <div>
                <div className="d-flex p-0 gap-2 mb-2">
                    <Button className="btn btn-rounded">
                        2nd Investigation (1)
                    </Button>
                    <Button color="primary" className="btn btn-rounded" >
                        2nd Investigation (2)
                    </Button>
                    <Button className="btn btn-rounded">
                        2nd Investigation (3)
                    </Button>
                </div>
              </div> */}
                {renderInvestigate2Screen(
                  filterCaseDetailToScreen(
                    ["rheuInves2", "CLININVES2"],
                    summary
                  )
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                {renderInvestigate3Screen(
                  filterCaseDetailToScreen(
                    ["rheuInves3", "CLININVES3"],
                    summary
                  )
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="5">
            <Row>
              <Col sm="12">
                {renderTreatmentScreen(TreatmentScreenData || [])}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="6">
            <Row>
              <Col sm="12">
                {renderPatientVitalScreen(
                  filterCaseDetailToScreen(["rheuVital", "VITALSIG"], summary)
                )}
              </Col>
            </Row>
          </TabPane>

          {/* <TabPane tabId="4">
                <Row>
                    <Col sm="12">
                    {renderTreatmentScreen(filterCaseDetailToScreen("rheuTreat",summary))}

                    </Col>
                </Row>
                </TabPane> */}
        </TabContent>
      </OffcanvasBody>
    </Offcanvas>
  )
}

OffCanvasRheuScreens.propTypes = {
  showRheuScreen: PropTypes.any,
  toggleRheuScreen: PropTypes.any,
  summary: PropTypes.any,
  offCanvasCustomActiveTab: PropTypes.any,
  setOffCanvasCustomActiveTab: PropTypes.any,
  setActiveTab: PropTypes.any,
}

export default OffCanvasRheuScreens
