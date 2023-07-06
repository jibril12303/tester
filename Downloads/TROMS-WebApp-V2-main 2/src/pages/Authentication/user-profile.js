import React, {Component, useEffect, useState} from "react"
import MetaTags from 'react-meta-tags';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Media,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Form,
    Input,
    Modal,
    FormFeedback,
    Button
} from "reactstrap"
import classnames from "classnames"
import {motion} from "framer-motion"
import profileImg from "assets/images/profileLogonew.jpg"
import _ from "lodash";
import profileupdateValidator from "hooks/profileupdateValidator"
import {appCreators} from "store/app/appReducer"

import {withRouter, Link, useLocation} from "react-router-dom";
//redux
import {useSelector, useDispatch} from "react-redux"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//Import validator
import useValidator from 'hooks/useValidator.js'

//Import Load button
import Loadbtn from "components/Common/Loadbtn"
import Multiselect from 'multiselect-react-dropdown';
import {useHistory} from "react-router-dom";
import Changepassword from "./ChangePassword";

import {registerTypes, registerCreators} from 'store/auth/register/reducer';
import { myReferralCreators } from "store/myReferrals/reducer";
import { createReferralCreators } from "store/create-referral/reducer";
import {bchDashboardCreators} from "store/dashboard/reducer"
import EnableMFA from "./EnableMFA";
import Select from "react-select";
import useCheckFeatures from "utils/useCheckFeature.js";

const Faqs = () => {

    let history = useHistory();
    const [, forceUpdate] = useState()
    const dispatch = useDispatch()
    const location = useLocation()

    const [validator, showValidationMessage] = useValidator()
    let selectedval = [];
    const [selecteditem, setSelected] = useState(selectedval);
    const [showModal, setShowModal] = useState(false)
    const [selectedflag, setselectedflag] = useState(false)
    const [payload, setPayload] = useState({})
    const [onCallEdit,setOnCallEdit] = useState(false);
    const [clinician, setClinician] = useState()

    let specialityId = null;
    let selectedItemarr = [...selecteditem];

    let selectedorganisation = [];

    const [activeTab, setActiveTab] = useState('1')

    const {token, userDetails, orgval, configdata, selectedorgval,onCallNumber,clinicians,currentOnCall,onCallStatus} = useSelector(state => ({
        userDetails: state.appReducer.userDetails,
        configdata: state.Dashboard.configData,
        selectedorgval: state.appReducer.userDetails.organisation,
        orgval: state.Account.orgval,
        token: state.appReducer.token,
        onCallNumber: state.CreateReferral.onCallNumber,
        clinicians: state.MyReferralsContainerReducer.clincians,
        currentOnCall:state.CreateReferral.currentOnCall,
        onCallStatus: state.Dashboard.onCallStatus
    }))

    console.log("userDetails  specialiyt=", userDetails.speciality)

    const [updateForm, setupdateForm] = useState({
        firstname: userDetails.firstName,
        lastname: userDetails.lastName,
        phoneno: userDetails.phoneNumber,
        grade: userDetails.grade,
        speciality: userDetails.speciality,
        departmets: userDetails.departmets,
        organisation: selectedorganisation,
        gmcno: userDetails?.consultantCode,

    })

    const [checkFeature] = useCheckFeatures();

    const AccounType = userDetails?.accountType == "REFERRING" ? "Referrer" : userDetails?.accountType;
    let selectorganisation = selectedorgval && selectedorgval;
    let OrgNames = [];


    selectorganisation && selectorganisation.map((item) => {
        var index = selectedval.indexOf(item);
        console.log("index", index)
        if (index == -1) {
            selectedval.push(item._id)
        }
        OrgNames.push(item.name)
        selectedorganisation.push({name: item.name, id: item._id})
    })


    let specialities = configdata && configdata.specialities;

    let sortspecialities = specialities && specialities.sort(function (a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });


    let gradeselect = configdata && configdata.grades;
    console.log("gradeselect", configdata)
    let sortgrades = gradeselect && gradeselect.sort();

    let Orgoptions = [];

    orgval && orgval.map((item, index) => {
        Orgoptions.push({name: item.name, id: item._id})
    })

    const toggleOnCallEdit = ()=> setOnCallEdit(!onCallEdit);

    const updateOnCall = ()=>{
        if(clinician){
            const {value:id} = clinician;
           console.log("clinician",clinician);
           dispatch(bchDashboardCreators.requestUpdateOnCallRegistrarWithId(id,userDetails))
        }
    }


    //value of the my organization multiselect

    const onSelect = (selectedList, selectedItem) => {
        //  console.log("selectedItem",selectedItem)
        setupdateForm({...updateForm, organisation: selectedItem.id})
        selectedItemarr.push(selectedItem.id)
        setSelected(selectedItemarr)
        console.log("selecteditem", selectedItemarr);
    }

    const onRemove = (selectedList, removedItem) => {
        var index = selectedItemarr.indexOf(removedItem.id);
        selectedItemarr.splice(index, 1)
        setupdateForm({...updateForm, organisation: selectedItemarr})
        setSelected(selectedItemarr)
        console.log("selecteditem", selectedItemarr);
    }

    const onrefOrgSearch = (val) => {
        console.log("search val", val)
        console.log("search vallength=", val.length)
        if (val.length > 1) {
            dispatch(registerCreators.requestGetOrg(val))
        }
    }

    const specialityset = (val) => {
        console.log("val running")
        specialityId = val

        console.log("val", val)
    }


    let index = specialities && specialities.findIndex(
        (rank, index) => rank.name === updateForm.speciality
    );

    specialityset(specialities[index]?._id)


    const setValue = (e) => {

        setupdateForm({...updateForm, [e.currentTarget.name]: e.currentTarget.value})

    }

    const [error, setError] = useState({
        firstname: false,
        lastname: false,
        phoneno: false,
        email: false,
        grade: false,
        consultantcode: false,
        gmcno: false,

    })


    // Set Login Form Field Error State
    const onSubmit = (e) => {
        e.preventDefault();

        // Set Login Form Field Error State
        setError({
            ...error,
            firstname: !validator.fieldValid('first name'),
            lastname: !validator.fieldValid('last name'),
            phoneno: !validator.fieldValid('phone number'),
            hospital: !validator.fieldValid('hospital'),
            grade: !validator.fieldValid('grade'),
            organisation: !validator.fieldValid('organisation'),
            gmcno: !validator.fieldValid('registration number'),

        })


        if (validator.allValid()) {


            const PayLoad = {
                firstName: _.capitalize(updateForm.firstname),
                lastName: _.capitalize(updateForm.lastname),
                phoneNumber: updateForm.phoneno,
                grade: updateForm.grade,
                organisation: selectedItemarr,
                speciality: updateForm.speciality,
                specialityID: specialityId,
                consultantCode: updateForm.gmcno,
            }
            console.log("payload", PayLoad)
            setPayload(PayLoad)
            setShowModal(true)

        } else {
            showValidationMessage(true)
            forceUpdate(1)
        }
        console.log(updateForm);


    }


    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab)
        }
    }


    const renderOnCallRegistrar =()=>{
        const firstName = currentOnCall?.onCallDoctor?.firstName;
        const lastName = currentOnCall?.onCallDoctor?.lastName;
        const label = userDetails?.speciality == 'Orthoptics' ? 'On-Duty Orthoptist' : userDetails?.speciality == 'Plastic Surgery'? 'On-Call Registrar' : "";
        return(
            <>
            <dt className="col-sm-3">{label}</dt>
            <dd className="col-sm-9">
                {
                    !onCallEdit ? 
                    (
                    <div className="d-flex align-items-center">
                        <>
                        {firstName ?? ""} {lastName ?? ""} <i className="fa fa-edit mx-2" style={{cursor:"pointer"}} onClick={()=>toggleOnCallEdit()} />
                        </>
                    </div>
                    ) :
                    (
                    <>
                    <div style={{maxWidth:"250px"}}>
                        <Select
                            value={clinician}
                            onChange={(e) => {
                                setClinician(e)
                            }}
                            options={clinicians}
                            className="select2"
                            placeholder="Select On-Call Registrar"
                            classNamePrefix="select2 select2-selection"
                            maxMenuHeight='15vh'
                                />
                            <div className="mt-2 text-end" >
                                <button className="btn btn-secondary" onClick={()=>toggleOnCallEdit()}>Cancel</button>
                                <button className="btn btn-primary ms-2" onClick={()=>updateOnCall()}>Save</button>
                            </div>
                    </div>

                    </>
                    )
                }
                
            </dd>
            </>
        )
    }

    let OrgDemo = ['a', 'b']

    useEffect(() => {
        if (location?.state?.activeTab != null) {
            setActiveTab(location?.state?.activeTab)
        }
    }, [location.state])

    useEffect(()=>{
        if(onCallStatus == "Registrar updated"){
            setOnCallEdit(false)
        }
    },[onCallStatus])

    useEffect(()=>{
        debugger;
        //fetch on call registrar
        console.log("userDetails",userDetails)
        if(checkFeature("onCallRegistrar")){
            // console.log("checkFeature hook")
            const speciality = userDetails.speciality == "Orthoptics" ? "Orthoptics" : "";
            dispatch(myReferralCreators.requestClinicianList('1'))
            dispatch(createReferralCreators.requestOnCallRegistrarDetails(speciality))
        }
    },[])

    return (
        <React.Fragment>
            <motion.div className="page-content" exit={{opacity: 0}} animate={{opacity: 1}} initial={{opacity: 0}}>
                <MetaTags>
                    <title>Profile | TriVice - Triage, Referral & Advice</title>
                </MetaTags>
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Dashboard" breadcrumbItem="Profile"/>

                    <div className="checkout-tabs">
                        <Row>
                            <Col lg="2">
                                <Nav className="flex-column" pills>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTab === "1",
                                            })}
                                            onClick={() => {
                                                toggleTab("1")
                                            }}
                                        >
                                            <i className="bx bx-user d-block check-nav-icon mt-4 mb-2"/>
                                            <p className="font-weight-bold mb-4">
                                                My Profile
                                            </p>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTab === "2",
                                            })}
                                            onClick={() => {
                                                toggleTab("2")
                                            }}
                                        >
                                            <i className="bx bx-edit d-block check-nav-icon mt-4 mb-2"/>
                                            <p className="font-weight-bold mb-4">Update Profile</p>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTab === "3",
                                            })}
                                            onClick={() => {
                                                toggleTab("3")
                                            }}
                                        >
                                            <i className="bx bx-lock-open d-block check-nav-icon mt-4 mb-2"/>
                                            <p className="font-weight-bold mb-4">Change Password</p>

                                        </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            hidden={userDetails?.TwoFAEnabled == true}
                                            className={classnames({
                                                active: activeTab === "4",
                                            })}
                                            onClick={() => {
                                                toggleTab("4")
                                            }}
                                        >
                                            <i className="bx bx-lock-open d-block check-nav-icon mt-4 mb-2"/>
                                            <p className="font-weight-bold mb-4">Enable 2FA</p>

                                        </NavLink>
                                    </NavItem>

                                </Nav>
                            </Col>
                            <Col lg="10">
                                <Card>
                                    <CardBody>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId="1">
                                                <CardTitle className="mb-3 h4">
                                                    User Profile
                                                </CardTitle>

                                                <Media>

                                                    <div className="ms-3">
                                                        <img
                                                            src={profileImg}
                                                            alt=""
                                                            className="avatar-md rounded-circle img-thumbnail"
                                                        />
                                                    </div>
                                                    <Media body className="align-self-center">
                                                        <div className="text-muted ms-4 mt-0">
                                                            <h4>{userDetails && userDetails.firstName} {userDetails && userDetails.lastName}</h4>
                                                        </div>

                                                    </Media>

                                                </Media>
                                                <Media>

                                                    <Media body className="align-self-center">
                                                        <div className="ms-4 mt-4">
                                                            <dl className="row mb-0">

                                                                <dt className="col-sm-3">Email</dt>
                                                                <dd className="col-sm-9">
                                                                    {userDetails && userDetails.email ? userDetails.email : "Not Available"}</dd>

                                                                <dt className="col-sm-3">Phone Number</dt>
                                                                <dd className="col-sm-9">{userDetails && userDetails.phoneNumber ? userDetails.phoneNumber : "Not Available"}</dd>

                                                                <dt className="col-sm-3">Account Type</dt>
                                                                <dd className="col-sm-9">{AccounType ? AccounType : "Not Available"}</dd>

                                                                <dt className="col-sm-3">Organisation</dt>
                                                                <dd className="col-sm-9">{OrgNames.map((item, key) => {

                                                                    return (<div key={key}>
                                                                        <span>{item}{key == OrgNames.length - 1 ? "" : ","}</span>

                                                                    </div>)
                                                                })}</dd>

                                                                <dt className="col-sm-3">Grade</dt>
                                                                <dd className="col-sm-9">{userDetails && userDetails.grade ? userDetails.grade : "Not Available"}</dd>


                                                                <dt className="col-sm-3">Department</dt>
                                                                <dd className="col-sm-9">{userDetails && userDetails.speciality ? userDetails.speciality : "Not Available"}</dd>


                                                                <dt className="col-sm-3">GMC/NMC/GOC No</dt>
                                                                <dd className="col-sm-9">{userDetails && userDetails.consultantCode ? userDetails.consultantCode : "Not Available"}</dd>

                                                                {checkFeature("onCallRegistrar") && renderOnCallRegistrar()}
                                                            </dl>

                                                        </div>
                                                    </Media>
                                                </Media>


                                            </TabPane>
                                            <TabPane tabId="2">
                                                <Modal
                                                    isOpen={showModal}
                                                    scrollable={true}
                                                    backdrop={'static'}
                                                    centered={true}
                                                    id="staticBackdrop"

                                                >
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">
                                                            <i className="fa fa-warning"></i> Confirmation
                                                        </h5>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-close"
                                                            onClick={() => {
                                                                setShowModal(false);

                                                            }}
                                                            aria-label="Close"
                                                        ></button>
                                                    </div>
                                                    <div className="modal-body ">
                                                        Are you sure you want to update your profile? After saving
                                                        changes, you will need to login again.
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => {
                                                                setShowModal(false);
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={() => {
                                                                dispatch(registerCreators.requestUpdateProfile(payload, token, history))
                                                                setShowModal(false);

                                                            }}
                                                        >
                                                            Ok
                                                        </button>
                                                    </div>
                                                </Modal>

                                                <CardTitle>Edit Profile</CardTitle>
                                                <div className="mt-4">
                                                    <Form onSubmit={onSubmit}>
                                                        <div className="mt-3 d-grid">
                                                            <Row>
                                                                <Col xl={6}>
                                                                    <div className="mb-3">
                                                                        <label>First name <span
                                                                            className="text-danger">*</span></label>
                                                                        <Input
                                                                            type="text"
                                                                            name="firstname"
                                                                            style={{textTransform: 'capitalize'}}
                                                                            className="form-control"
                                                                            placeholder=" Enter first name"
                                                                            value={updateForm.firstname}
                                                                            onChange={setValue}
                                                                            maxlength="35"
                                                                            invalid={error.firstname}

                                                                        />
                                                                        <FormFeedback>{validator.message('first name', updateForm.firstname, 'required|alpha_space')}</FormFeedback>
                                                                    </div>
                                                                </Col>
                                                                <Col xl={6}>
                                                                    <div className="mb-3">
                                                                        <label>Last name <span
                                                                            className="text-danger">*</span></label>
                                                                        <Input
                                                                            type="text"
                                                                            name="lastname"
                                                                            style={{textTransform: 'capitalize'}}
                                                                            className="form-control"
                                                                            placeholder="Enter last name"
                                                                            value={updateForm.lastname}
                                                                            onChange={setValue}
                                                                            invalid={error.lastname}
                                                                            maxlength="35"

                                                                        />
                                                                        <FormFeedback>{validator.message('last name', updateForm.lastname, 'required|alpha')}</FormFeedback>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xl={6}>
                                                                    <div className="mb-3">
                                                                        <label>Phone number <span
                                                                            className="text-danger">*</span></label>
                                                                        <Input
                                                                            type="text"
                                                                            name="phoneno"
                                                                            className="form-control"
                                                                            placeholder="Enter phone number"
                                                                            value={updateForm.phoneno}
                                                                            onChange={setValue}
                                                                            invalid={error.phoneno}
                                                                            maxlength="11"

                                                                        />
                                                                        <FormFeedback>{validator.message('phone number', updateForm.phoneno, 'required|phone|min:11|max:11')}</FormFeedback>
                                                                    </div>

                                                                </Col>
                                                                <Col xl={6}>
                                                                    <div className="mb-3">
                                                                        <label>Grade <span
                                                                            className="text-danger">*</span></label>
                                                                        <select

                                                                            name="grade"
                                                                            className="form-select custom-select"
                                                                            value={updateForm.grade}
                                                                            onChange={setValue}
                                                                            invalid={error.grade}

                                                                        >
                                                                            <option value='' selected
                                                                                    disabled>Select...
                                                                            </option>
                                                                            {
                                                                                sortgrades && sortgrades.map((item, key) => {
                                                                                    return (<option key={key}
                                                                                                    value={item}>{item}</option>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </select>
                                                                        <span style={{
                                                                            fontSize: '80%',
                                                                            color: '#f46a6a',
                                                                        }}>{validator.message('grade', updateForm.grade, 'required')}</span>


                                                                    </div>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                                <Col xl={12}>
                                                                    <div className="mb-3">

                                                                        <div style={{
                                                                            width: 'inherit',
                                                                            overflow: 'none'
                                                                        }}>
                                                                            <label>My Organisation<span
                                                                                className="text-danger">*</span></label>
                                                                            <Multiselect
                                                                                options={Orgoptions}
                                                                                onSelect={onSelect}
                                                                                onRemove={onRemove}
                                                                                selectedValues={selectedorganisation}
                                                                                displayValue="name"
                                                                                placeholder="Type to search"
                                                                                selectionLimit={1}
                                                                                onSearch={onrefOrgSearch}
                                                                                singleSelect={false}
                                                                                keepSearchTerm={false}
                                                                            />
                                                                        </div>

                                                                        <span style={{
                                                                            fontSize: '80%',
                                                                            color: '#f46a6a',
                                                                        }}>{validator.message('organisation', updateForm.organisation, 'required')}</span>


                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xl={6}>
                                                                    <div className="mb-3">
                                                                        <label>Department <span
                                                                            className="text-danger">*</span></label>
                                                                        <select
                                                                            type="select"
                                                                            name="speciality"
                                                                            className="form-select custom-select"
                                                                            value={updateForm.speciality}
                                                                            onChange={setValue}
                                                                            invalid={error.speciality}

                                                                        >
                                                                            <option value='' selected
                                                                                    disabled>Select...
                                                                            </option>
                                                                            {
                                                                                sortspecialities && sortspecialities.map((item, key) => {
                                                                                    return (<option key={key}
                                                                                                    value={item.name}>{item.name}</option>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </select>
                                                                        <span style={{
                                                                            fontSize: '80%',
                                                                            color: '#f46a6a',
                                                                        }}>{validator.message('speciality', updateForm.speciality, 'required')}</span>

                                                                    </div>
                                                                </Col>
                                                                <Col xl={6}>
                                                                    <div className="mb-3">
                                                                        <label>GMC/NMC/GOC No <span
                                                                            className="text-danger">*</span></label>
                                                                        <Input
                                                                            type="text"
                                                                            name="gmcno"
                                                                            className="form-control"
                                                                            placeholder="Enter GMC/NMC/GOC number"
                                                                            value={updateForm.gmcno}
                                                                            onChange={setValue}
                                                                            invalid={error.gmcno}
                                                                            maxlength="10"

                                                                        />
                                                                        <FormFeedback>{validator.message('registration number', updateForm.gmcno, 'required|alpha_num|min:7|max:10')}</FormFeedback>
                                                                    </div>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                                <Col>
                                                                    <Loadbtn btnname={'Submit'} btnloadname={'Submit'}
                                                                             loading={false}/>
                                                                </Col>
                                                            </Row>

                                                        </div>
                                                    </Form>

                                                </div>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <CardTitle>Change Password</CardTitle>

                                                <div className="mt-4">
                                                    <Changepassword/>
                                                </div>
                                            </TabPane>
                                            {userDetails?.TwoFAEnabled != true && (
                                                <TabPane tabId="4">
                                                    <CardTitle>Enable 2FA</CardTitle>

                                                    <div className="mt-4">
                                                        <EnableMFA/>
                                                    </div>
                                                </TabPane>
                                            )}

                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </motion.div>
        </React.Fragment>
    )

}

export default Faqs
