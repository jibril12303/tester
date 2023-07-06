import React, {useEffect, useState, useRef} from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import {withRouter, Link, useLocation} from "react-router-dom";
import {isEmpty} from "lodash";
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
    SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import moment from "moment";
import 'moment-timezone';
import {useHistory} from "react-router-dom";
import PageItem from 'react-bootstrap/PageItem';
import SweetAlert from "react-bootstrap-sweetalert"
//import Pagination from 'react-bootstrap/Pagination'
import ReactPaginate from 'react-paginate';
import "./datatables.scss"
import profileupdateValidator from "hooks/profileupdateValidator"
import {appCreators} from "store/app/appReducer"
import {bchDashboardTypes, bchDashboardCreators} from "store/dashboard/reducer"
import {motion, useMotionValue, useTransform} from "framer-motion"
import {emailTemplateCreators, emailTemplateTypes} from 'store/email-templates/reducer'
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Row,
    Badge,
    UncontrolledTooltip,
    Modal,
    ButtonDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem, FormGroup, Label, Input, FormFeedback, Form
} from "reactstrap";
import {AvForm, AvField} from "availity-reactstrap-validation";
import Select from "react-select";
import {setClient} from "utils/apiUtils"

//redux
import {useSelector, useDispatch} from "react-redux";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
    getOrders as onGetOrders,
    addNewOrder as onAddNewOrder,
    updateOrder as onUpdateOrder,
    deleteOrder as onDeleteOrder,
} from "store/actions";

import {myReferralCreators, myReferralTypes} from 'store/myReferrals/reducer'
import {createReferralCreators} from "store/create-referral/reducer";
import {caseCreators} from "store/caseDeatils/reducer"
import useValidator from "../../hooks/useValidator";

const EmailTemplate = props => {
    const [validator, showValidationMessage] = useValidator()
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    var appState = JSON.parse(localStorage.getItem('applicationState'));
    const appReducer = appState && appState.appReducer && appState.appReducer;
    const token = appReducer.token;
    const userDetails = appState && appState.appReducer && appState.appReducer.userDetails;
    const appRole = userDetails && userDetails.appRole;

    const [copyModel, setCopyModel] = useState(false);
    const [isDelete, setDeleteModel] = useState(false);
    const [dropButton, setDropButton] = useState('')

    const {emailList, totalPages, copyEmailData} = useSelector(state => ({
        emailList: state.EmailTemplateReducer.emailList.emails,
        totalPages: state.EmailTemplateReducer.emailList.totalPages,
        copyEmailData: state.EmailTemplateReducer.copyEmailData
    }))

    const [pagination, setPainationCount] = useState({
        current_page: '1',
        last_page: '',
        per_page: 10,
    })

    const [selectedTemplate, setSelectedTemplate] = useState({
        uuid: null,
        emailTo: [],
        emailCC: [],
        emailBCC: [],
        subject: null,
        emailBody: null,
        triggers: {},
        speciality: ""
    })

    var node = useRef();

    //references for the focus
    const templateNameRef = useRef(null)
    const templateDescriptionRef = useRef(null)

    const refreshPageWithCurrentData = () => {
        dispatch(emailTemplateCreators.requestFetchEmails(pagination.current_page, '10'));
    }

   useEffect(()=>{
        if (token.length == 48){
            setClient(token)
        }
   },[])

    useEffect(() => {
        refreshPageWithCurrentData()
    }, [copyEmailData]);

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

    const handleSubmit = () => {
        setError({
            ...error,
            templateName: !validator.fieldValid("templateName"),
            templateDescription: !validator.fieldValid("templateDescription"),
        })

        if (validator.allValid()) {
            dispatch(
                emailTemplateCreators.requestCopyEmail(
                    templateBasicInfo.templateName,
                    templateBasicInfo.templateDescription,
                    selectedTemplate.emailTo,
                    selectedTemplate.emailCC,
                    selectedTemplate.emailBCC,
                    selectedTemplate.subject,
                    selectedTemplate.emailBody,
                    selectedTemplate.triggers,
                    selectedTemplate.speciality,
                    history
                )
            )
            setTemplateBasicInfo({
                ...templateBasicInfo,
                templateName: null,
                templateDescription: null,
            })
            setCopyModel(false);
        } else {
            showValidationMessage(true);
        }
    }

    const submitButtonRef = useRef(null);

    const sortingHeaderStyle = {};

    let dataSource = generateTableData();

    function generateTableData() {

        let length = 0;
        if (emailList) {
            length = emailList.length;
        }

        var tableData = [];


        for (let index = 0; index < length; index++) {

            tableData.push({
                _id: emailList[index]._id,
                name: emailList[index].name,
                description: emailList[index].description,
                uID: emailList[index]._id.uID,
                htmlString: emailList[index].htmlString,
                subject: emailList[index].subject,
                enabled: emailList[index].enabled ? 'Active' : 'Inactive',
                date: moment(moment.now()).add('days', index).format('DD/MM/YYYY'),
                // createdBy: moment(emailList[index].createdBy).add('days', index).format('DD/MM/YYYY'),
                createdBy: emailList[index].createdBy.firstName + " " + emailList[index].createdBy.lastName,
            });
        }

        return tableData;
    }

    const dropDownFormatter = (cellContent, row, index, extraData) => {
        return (
            <ButtonDropdown
                isOpen={extraData === row._id}
                toggle={(e) => {
                    e.stopPropagation()
                    if (row._id == dropButton) {
                        setDropButton('')
                    } else {
                        setDropButton(row._id)
                    }
                }}
            >
                <DropdownToggle color="primary" className="btn-md btn-rounded"
                                caret>
                    Action{' '}{' '}
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu dropdown-menu-end">
                    <DropdownItem onClick={() => {
                        // alert('Edit')
                        let id = emailList[index].uID;
                        history.push(`/email-template/edit/${id}`)
                    }}>Edit</DropdownItem>
                    <DropdownItem onClick={() => {
                        setSelectedTemplate({
                            ...selectedTemplate,
                            emailTo: emailList[index]['recipients'].to,
                            emailCC: emailList[index]['recipients'].cc,
                            emailBCC: emailList[index]['recipients'].bcc,
                            subject: emailList[index].subject,
                            emailBody: emailList[index].htmlString,
                            triggers: emailList[index].triggers,
                            speciality: emailList[index].caseSpeciality,
                        })
                        setCopyModel(true)
                    }}>Copy</DropdownItem>
                    <DropdownItem onClick={() => {
                        setSelectedTemplate({
                            ...selectedTemplate,
                            uuid: emailList[index].uID
                        })
                        setDeleteModel(true);
                    }}>Delete</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        );

    }

    const Columns = [
        {
            dataField: "date",
            text: "Date created",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
            }
        },
        {
            dataField: "name",
            text: "Template name",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
            }
        },
        {
            dataField: "createdBy",
            text: "Created by",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
            }
        },
        {
            dataField: "enabled",
            text: "Status",
            sort: true,
            onSort: (field, order) => {
                console.log("order", order)
            }
        },
        {
            dataField: "view",
            isDummyField: true,
            text: "Action",
            formatter: dropDownFormatter,
            formatExtraData: dropButton
        }

    ];

    const defaultSorted = [
        {
            dataField: "dateTime",
            order: "desc",
        },
    ];

    const handlePageClick = (data) => {
        console.log("data", data);
        let selected = data && data.selected + 1;
        setPainationCount({...pagination, current_page: selected})
        dispatch(emailTemplateCreators.requestFetchEmails(selected, '10'));
    }
    return (
        <motion.div className="page-content" exit={{opacity: 0}} animate={{opacity: 1}} initial={{opacity: 0}}>

            <MetaTags>
                <title>Email template | TriVice</title>
            </MetaTags>
            <Container fluid>
                <Breadcrumbs title="Dashboard" breadcrumbItem="Email template"> </Breadcrumbs>
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>

                                <ToolkitProvider
                                    keyField="dateTime"
                                    data={dataSource}
                                    columns={Columns}

                                >
                                    {toolkitProps => (
                                        <React.Fragment>

                                            <Row className="mt-4">
                                                <Col xl="12">
                                                    <div className="table-responsive table-condensed">

                                                        <BootstrapTable
                                                            keyField="dateTime"
                                                            responsive
                                                            condensed
                                                            bordered={false}
                                                            striped={false}
                                                            defaultSorted={defaultSorted}
                                                            // rowEvents={tableRowEvents}
                                                            classes={
                                                                "table align-middle table-nowrap table-check "
                                                            }
                                                            headerWrapperClasses={"table-light"}

                                                            {...toolkitProps.baseProps}
                                                            ref={n => node = n}

                                                        />
                                                        <div style={{float: 'right'}}>
                                                            {/* <Pagination >{items}</Pagination> */}
                                                            <ReactPaginate
                                                                previousLabel={"previous"}
                                                                nextLabel={"next"}
                                                                breakLabel={"..."}
                                                                pageCount={totalPages && totalPages ? totalPages : 0}
                                                                marginPagesDisplayed={2}
                                                                pageRangeDisplayed={3}
                                                                forcePage={pagination.current_page - 1}
                                                                onPageChange={handlePageClick}
                                                                containerClassName={"pagination justify-content-center"}
                                                                pageClassName={"page-item"}
                                                                pageLinkClassName={"page-link"}
                                                                previousClassName={"page-item"}
                                                                previousLinkClassName={"page-link"}
                                                                nextClassName={"page-item"}
                                                                nextLinkClassName={"page-link"}
                                                                breakClassName={"page-item"}
                                                                breakLinkClassName={"page-link"}
                                                                activeClassName={"active"}
                                                            />
                                                        </div>
                                                    </div>


                                                </Col>
                                            </Row>

                                        </React.Fragment>
                                    )}
                                </ToolkitProvider>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    isOpen={copyModel}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i className="fa fa-warning"></i> Copy template
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setCopyModel(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <Form>
                            <Row>
                                <Col sm={12} md={12}>
                                    <FormGroup>
                                        <Label>Template Name<span className="text-danger"> *</span></Label>
                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1}} className="input-group">
                                                <Input
                                                    innerRef={templateNameRef}
                                                    type="text"
                                                    id="templateName"
                                                    name="templateName"
                                                    placeholder="Enter a template name"
                                                    className="form-control"
                                                    style={{height: "36px"}}
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
                                <Col sm={12} md={12}>
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
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                setCopyModel(false)
                            }}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleSubmit()
                            }
                        >
                            Ok
                        </button>
                    </div>
                </Modal>
                <Modal
                    isOpen={isDelete}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i className="fa fa-warning"></i> Alert
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                setDeleteModel(false)
                            }}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete.?
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                setDeleteModel(false)
                            }}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                dispatch(emailTemplateCreators.requestDeleteEmailTemplate(selectedTemplate.uuid, () => refreshPageWithCurrentData()));
                                setDeleteModel(false)
                            }}
                        >
                            Ok
                        </button>
                    </div>
                </Modal>
            </Container>
        </motion.div>
    );
};

EmailTemplate.propTypes = {};

export default EmailTemplate;