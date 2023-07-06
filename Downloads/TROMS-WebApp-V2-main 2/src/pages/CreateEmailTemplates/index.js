import React, {useEffect, useState} from "react"
import {useParams, useLocation, useHistory} from "react-router-dom"
import {motion} from "framer-motion"
import MetaTags from "react-meta-tags"
import {
    Container,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Card,
    CardBody,
    Button
} from "reactstrap"
import classnames from "classnames"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//Import nav components
import TemplateName from "./TemplateName"
import Addresses from "./Addresses"
import Content from "./Content"
import Condition from "./Condition"
import HeaderNFooter from "./HeaderNFooter"
import Preview from "./Preview"
import PropTypes from "prop-types"
import {useSelector, useDispatch} from "react-redux"
import {emailTemplateCreators} from "store/email-templates/reducer"
import {setClient} from "utils/apiUtils"

function CreateEmailTemplates() {
    const location = useLocation()
    const dispatch = useDispatch()
    const urlsplit = location.pathname.split("/")
    const endpoint = urlsplit[2]
    let {templateId} = useParams();
    console.log("endpoint", endpoint)

    const history = useHistory();

    const [tabIndex, setTabIndex] = useState("1")
    const [TemplateBasicInfoSubmit, setTemplateBasicInfoSubmit] = useState(false)
    const [AddressSubmit, setAddressSubmit] = useState(false)
    const [ContentSubmit, setContentSubmit] = useState(false)
    const [ConditionsSubmit, setConditionsSubmit] = useState(false)
    const [emailEditMode, setemailEditMode] = useState("create"); // create || edit

    const {emailPreviewData, token, userSpeciality, singleEmailTemplate, emailTemplateLoading} = useSelector(state => ({
        emailPreviewData: state.EmailTemplateReducer.localEmailTemplateData,
        token: state.appReducer.token,
        userSpeciality: state.appReducer.userDetails.speciality,
        singleEmailTemplate: state.EmailTemplateReducer?.singleEmailTemplate,
        emailTemplateLoading: state.EmailTemplateReducer.requestTemplateLoading
    }))

    const handleNext = () => {
        switch (tabIndex) {
            case "1":
                setTemplateBasicInfoSubmit(true)
                break
            case "2":
                setAddressSubmit(true)
                break
            case "3":
                setContentSubmit(true)
                // setTabIndex("4")
                break
            case "4":
                setConditionsSubmit(true)
                // setTabIndex("5")
                break
            case "5":
                setTabIndex("6")
                break
        }
    }

    const handleSubmit = () => {
        //submit the template here
        console.log("userSpeciality", userSpeciality)
        dispatch(
            emailTemplateCreators.requestAddEmail(
                emailPreviewData.templateName,
                emailPreviewData.templateDescription,
                emailPreviewData.emailTo,
                emailPreviewData.emailCC,
                emailPreviewData.emailBCC,
                emailPreviewData.subject,
                emailPreviewData.emailBody,
                emailPreviewData.triggers,
                userSpeciality,
                emailPreviewData.api,
                emailPreviewData.caseSpeciality,
            )
        )
    }

    const updateEmailTemplate = (templateId) => {
        dispatch(emailTemplateCreators.requestUpdateEmailTemplate(
            templateId,
            emailPreviewData.templateName,
            emailPreviewData.templateDescription,
            emailPreviewData.emailTo,
            emailPreviewData.emailCC,
            emailPreviewData.emailBCC,
            emailPreviewData.subject,
            emailPreviewData.emailBody,
            emailPreviewData.triggers,
            userSpeciality,
            history,
            emailPreviewData.api,
            emailPreviewData.caseSpeciality,
        ));
    }

    const handleBackButton = () => {
        if (tabIndex !== "1") {
            setTabIndex(`${tabIndex - 1}`)
        }
    }

    useEffect(() => {
        setClient(token)
        dispatch(emailTemplateCreators.requestEmailTriggers())
        console.log("endpoint in useEffect and template id", endpoint, templateId)

        if (endpoint == "edit" && templateId) {
            setemailEditMode("edit");
            dispatch(emailTemplateCreators.requestSingleEmailTemplate(templateId))
        }

        return () => {dispatch(emailTemplateCreators.requestClearLocalStateData())}
    }, [])

    return (
        <React.Fragment>
            <motion.div
                exit={{opacity: 0}}
                animate={{opacity: 1}}
                initial={{opacity: 0}}
            >
                <div className="page-content">
                    <MetaTags>
                        <title>
                            Create Email Templates | TriVice - Triage, Referral & Advice
                        </title>
                    </MetaTags>
                    <Container fluid>
                        {/*render breadscrum*/}
                        <Breadcrumbs
                            title="Home"
                            breadcrumbItem={`${endpoint} EMAIL TEMPLATE`}
                        />
                        <div className="checkout-tabs">
                            <Row>
                                {/*left tabs*/}
                                <Col lg="2" sm="3">
                                    <Nav className="flex-column" pills>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({active: tabIndex === "1"})}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className={
                                                            tabIndex === "1"
                                                                ? "bg-white text-primary badge rounded-pill font-size-13"
                                                                : "bg-primary badge rounded-pill font-size-13"
                                                        }
                                                    >
                                                        1
                                                    </div>
                                                    <p className="mt-3 mx-1">Template name</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({active: tabIndex === "2"})}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className={
                                                            tabIndex === "2"
                                                                ? "bg-white text-primary badge rounded-pill font-size-13"
                                                                : "bg-primary badge rounded-pill font-size-13"
                                                        }
                                                    >
                                                        2
                                                    </div>
                                                    <p className="mt-3 mx-1">Addresses</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>{" "}
                                        <NavItem>
                                            <NavLink
                                                className={classnames({active: tabIndex === "3"})}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className={
                                                            tabIndex === "3"
                                                                ? "bg-white text-primary badge rounded-pill font-size-13"
                                                                : "bg-primary badge rounded-pill font-size-13"
                                                        }
                                                    >
                                                        3
                                                    </div>
                                                    <p className="mt-3 mx-1">Content</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>{" "}
                                        <NavItem>
                                            <NavLink
                                                className={classnames({active: tabIndex === "4"})}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className={
                                                            tabIndex === "4"
                                                                ? "bg-white text-primary badge rounded-pill font-size-13"
                                                                : "bg-primary badge rounded-pill font-size-13"
                                                        }
                                                    >
                                                        4
                                                    </div>
                                                    <p className="mt-3 mx-1">Condition</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>{" "}
                                        <NavItem>
                                            <NavLink
                                                className={classnames({active: tabIndex === "5"})}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className={
                                                            tabIndex === "5"
                                                                ? "bg-white text-primary badge rounded-pill font-size-13"
                                                                : "bg-primary badge rounded-pill font-size-13"
                                                        }
                                                    >
                                                        5
                                                    </div>
                                                    <p className="mt-3 mx-1">Header & footer</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>{" "}
                                        <NavItem>
                                            <NavLink
                                                className={classnames({active: tabIndex === "6"})}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className={
                                                            tabIndex === "6"
                                                                ? "bg-white text-primary badge rounded-pill font-size-13"
                                                                : "bg-primary badge rounded-pill font-size-13"
                                                        }
                                                    >
                                                        6
                                                    </div>
                                                    <p className="mt-3 mx-1">Preview</p>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                                {/*right side tab contents*/}
                                {emailTemplateLoading ? (
                                    <Col lg="10" sm="9">
                                        <Card>Loading...</Card>
                                    </Col>
                                ) : (
                                    <Col lg="10" sm="9">
                                    <Card>
                                        <CardBody>
                                            <TabContent activeTab={tabIndex}>
                                                <TabPane tabId="1">
                                                    <TemplateName
                                                        shouldSubmit={TemplateBasicInfoSubmit}
                                                        next={() => setTabIndex("2")}
                                                        setTemplateBasicInfoSubmit={
                                                            setTemplateBasicInfoSubmit
                                                        }
                                                        emailEditMode={emailEditMode}
                                                        singleEmailTemplate={singleEmailTemplate}
                                                    />
                                                </TabPane>
                                                <TabPane tabId="2">
                                                    <Addresses
                                                        shouldSubmit={AddressSubmit}
                                                        next={() => setTabIndex("3")}
                                                        setSubmitfalse={() => setAddressSubmit(false)}
                                                        emailEditMode={emailEditMode}
                                                        singleEmailTemplate={singleEmailTemplate}
                                                    />
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    <Content
                                                        shouldSubmit={ContentSubmit}
                                                        next={() => setTabIndex("4")}
                                                        setSubmitfalse={() => setContentSubmit(false)}
                                                        emailEditMode={emailEditMode}
                                                        singleEmailTemplate={singleEmailTemplate}
                                                    />
                                                </TabPane>
                                                <TabPane tabId="4">
                                                    <Condition
                                                        shouldSubmit={ConditionsSubmit}
                                                        next={() => setTabIndex("5")}
                                                        setSubmitfalse={() => setConditionsSubmit(false)}
                                                        emailEditMode={emailEditMode}
                                                        singleEmailTemplate={singleEmailTemplate}
                                                    />
                                                </TabPane>
                                                <TabPane tabId="5">
                                                    <HeaderNFooter/>
                                                </TabPane>
                                                <TabPane tabId="6">
                                                    <Preview/>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                    <Row className="mt-4">
                                        <Col sm={6}>
                                            <p
                                                className="btn text-muted d-sm-inline-block btn-link"
                                                onClick={handleBackButton}
                                            >
                                                {tabIndex !== "1" && (
                                                    <p>
                                                        <i className="mdi mdi-arrow-left me-1"/>
                                                        Back{" "}
                                                    </p>
                                                )}
                                            </p>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="text-end">
                                                {tabIndex !== "6" && (
                                                    <Button color="success" onClick={() => handleNext()}>
                                                        Next
                                                    </Button>
                                                )}
                                                {tabIndex == "6" && (
                                                    <Button
                                                        color="success"
                                                        onClick={() => {
                                                            if (emailEditMode == "create") {
                                                                handleSubmit()
                                                            } else if (emailEditMode == "edit") {
                                                                if (templateId) updateEmailTemplate(templateId)
                                                            }
                                                        }}
                                                    >
                                                        Submit
                                                    </Button>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col> 
                                )}
                            </Row>

                            {/*button area*/}
                        </div>
                    </Container>
                </div>
            </motion.div>
        </React.Fragment>
    )
}

export default CreateEmailTemplates
