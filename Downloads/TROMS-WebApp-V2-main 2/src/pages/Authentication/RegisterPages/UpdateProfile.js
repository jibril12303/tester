import React, {useEffect, useState} from "react"
import {Row, Col, CardBody, Card, Alert, Container, CardTitle, Form, Input, Modal, FormFeedback} from "reactstrap"
import Trivicelogo from '../Trivicelogo.png'
import Multiselect from 'multiselect-react-dropdown';
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch
} from 'react-router-dom';
import {useParams, useRouteMatch, Redirect, useLocation} from "react-router-dom";
import {registerTypes, registerCreators} from 'store/auth/register/reducer';
import useValidator from 'hooks/useValidator.js'
import AuthHeader from "pages/Authentication/AuthComponent/Header"
import AuthFooter from "pages/Authentication/AuthComponent/Footer"
import _ from "lodash";


//redux
import {useSelector, useDispatch} from "react-redux"
import {useHistory} from "react-router-dom";

// import images
import profileImg from "assets/images/profile-img.png"
import logoImg from "assets/images/logo.svg"
import Loadbtn from "components/Common/Loadbtn"


// availity-reactstrap-validation
import {AvForm, AvField} from "availity-reactstrap-validation"

const Updateprofile = () => {
    let history = useHistory();
    const [, forceUpdate] = useState()
    const dispatch = useDispatch()


    const {user, registrationError, isLoading, email, role, configdata, userDetails, subscriptionData, orgval} = useSelector(state => ({
        user: state.Account.user,
        registrationError: state.Account.registrationError,
        isLoading: state.Account.isLoading,
        email: state.Account.email,
        role: state.Account.role,
        configdata: state.Account.configdata,
        userDetails: state.appReducer.userDetails,
        subscriptionData: state.Account.subscriptionData,
        orgval: state.Account.orgval

    }))

    const loading = isLoading ? isLoading : null;


    let sendemail = email;
    let dataconfig = configdata && configdata.hospitals;
    let specialityselect = configdata && configdata.specialities;
    let gradeselect = configdata && configdata.grades;
    let sortgrades = gradeselect.sort();
    let hospitals = dataconfig ? Object.keys(dataconfig) : dataconfig;
    let termsconditions = configdata && configdata.termsAndConditions;
    let appRole = userDetails && userDetails.appRole;
    let specialities = configdata && configdata.specialities;


    let sortspecialities = specialities.sort(function (a, b) {
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
    let organisations = configdata && configdata.organisations;
    // console.log("hospitals",hospitals);
    // console.log("role",role);


//  console.log("specialityselect",specialityselect);


    const [validator, showValidationMessage] = useValidator()

    const [referral, setReferral] = useState(false)
    const [reviewer, setReviewer] = useState(false)
    const [specialityId, setSpecialityId] = useState('')


    const specialityset = (val) => {
        console.log("val running")
        setSpecialityId(val)

        console.log("val", val)
    }

    const [updateForm, setupdateForm] = useState({
        firstname: '',
        lastname: '',
        phoneno: '',
        department: '',
        refOrganisation: "",
        revOrganisation: "",
        grade: "",
        consultantcode: '',
        specialities: '',

    })


    const setValue = (e) => {

        setupdateForm({...updateForm, [e.currentTarget.name]: e.currentTarget.value})
        if (e.currentTarget.name === "department") {
            let index = specialities.findIndex(
                (rank, index) => rank.name === e.currentTarget.value
            );
            const specialityID = specialities[index]._id
            specialityset(specialityID)
            console.log("specialityID", specialityID)
        }

    }

    const [error, setError] = useState({
        firstname: false,
        lastname: false,
        phoneno: false,
        department: false,
        organisation: false,
        grade: false,
        consultantcode: false,
        refOrganisation: false,
        revOrganisation: false,

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
            department: !validator.fieldValid('department'),
            grade: !validator.fieldValid('grade'),
            consultantcode: !validator.fieldValid('registration number'),

        })

        if (validator.allValid()) {

            let payload = {}

            payload = {
                firstName: _.capitalize(updateForm.firstname),
                lastName: _.capitalize(updateForm.lastname),
                phoneNumber: updateForm.phoneno,
                speciality: updateForm.department,
                grade: updateForm.grade,
                consultantCode: updateForm.consultantcode,
                organisation: selectedItemarr,
                specialityID: specialityId,
                policyAccepted: true,
            }


            dispatch(registerCreators.requestForm(payload, user.token, history))
        } else {
            showValidationMessage(true)
            forceUpdate(1)
        }
        console.log(updateForm);


    }

    const [selecteditem, setSelected] = useState([]);

    const Orgoptions = [];

    orgval && orgval.map((item, index) => {
        Orgoptions.push({name: item.name, id: item._id})
    })


//console.log("org",org)
//console.log(speciality)
//console.log("arrval",arrval.organisation.name)
//console.log(arr1)
//speciality && speciality.map(item=>specialityOption.push({sID:item._id,gID:orgid ,name:item.name,id:org}))
//console.log(specialityOption)


    let selectedItemarr = [...selecteditem]; //value of the my organization multiselect

    const onSelect = (selectedList, selectedItem) => {
        //  console.log("selectedItem",selectedItem)
        setupdateForm({...updateForm, refOrganisation: selectedItem.id})
        selectedItemarr.push(selectedItem.id)
        setSelected(selectedItemarr)
        console.log("selecteditem", selectedItemarr);
    }

    const onRemove = (selectedList, removedItem) => {
        var index = selectedItemarr.indexOf(removedItem.id);
        selectedItemarr.splice(index, 1)
        setupdateForm({...updateForm, refOrganisation: selectedItemarr})
        setSelected(selectedItemarr)
        console.log("selecteditem", selectedItemarr);
    }


    const onspecialitySelect = (selectedList, selectedItem) => {

        //  console.log("selectedItem",selectedItem)
        let index = refSpecialities.findIndex(
            (rank, index) => rank.organisationID === selectedItem.gID
        );
//    console.log("index",index)
        if (index !== -1) {
            // console.log("run")
            refSpecialities[index].specialities = [...refSpecialities[index].specialities, selectedItem.sID]
        }
        if (index == -1) {
            //console.log("push")
            refSpecialities.push({organisationID: selectedItem.gID, specialities: [selectedItem.sID]})
        }
        // console.log("refSpecialities",refSpecialities)
    }


    const onspecialityRemove = (selectedList, removedItem) => {
        //console.log("removedItem",removedItem)

        let rmvindex = refSpecialities.findIndex(
            (rank, index) => rank.organisationID === removedItem.gID
        );

        let lengthspeciality = refSpecialities[rmvindex].specialities.length
        //console.log("lengthspeciality",lengthspeciality)
        // console.log("rmvindex",rmvindex)

        if (rmvindex !== -1 && lengthspeciality == 2) {
            //    console.log("removerun")
            refSpecialities[rmvindex].specialities.splice(removedItem, 1)
            //  console.log("refSpecialities",refSpecialities)
        }


        if (rmvindex !== -1 && lengthspeciality != 2) {
            let index = refSpecialities.findIndex(
                (rank, index) => rank.organisationID === removedItem.gID && rank.specialities === removedItem.sID
            );
            refSpecialities.splice(index, 1);
            // console.log("refSpecialities",refSpecialities)
        }
    }


    // console.log("refSpecialities",refSpecialities)

    const onrefOrgSearch = (val) => {
        console.log("search val", val)
        console.log("search vallength=", val.length)
        if (val.length > 1) {
            dispatch(registerCreators.requestGetOrg(val))
        }

    }


    useEffect(() => {

        if (appRole == 'BCH_CLINICIAN') {
            setReviewer(true)
        } else if (appRole == 'REFERRING_CLINICIAN') {
            setReferral(true)

        }

    }, [])


    return (
        <div className="auth-full-page-content p-md-5 p-4" style={{overflow: scroll}}>
            <div className="w-100">
                <div className="d-flex flex-column h-100">
                    <AuthHeader/>

                    <div className="m-0">
                        <div>
                            <h5 className="text-primary">Update Profile</h5>
                            <p className="text-muted ">

                            </p>
                        </div>

                        <div className="mt-4">
                            <Form onSubmit={onSubmit}>
                                <div className="mt-3 d-grid">
                                    <Row>
                                        <Col xl={6}>
                                            <div className="mb-3">
                                                <label>First name <span className="text-danger">*</span></label>
                                                <Input
                                                    type="text"
                                                    name="firstname"
                                                    style={{textTransform: 'capitalize'}}
                                                    maxlength="35"
                                                    className="form-control"
                                                    placeholder=" Enter first name"
                                                    value={updateForm.firstname}
                                                    onChange={setValue}
                                                    invalid={error.firstname}

                                                />
                                                <FormFeedback>{validator.message('first name', updateForm.firstname, 'required|alpha')}</FormFeedback>
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <div className="mb-3">
                                                <label>Last name <span className="text-danger">*</span></label>
                                                <Input
                                                    type="text"
                                                    name="lastname"
                                                    style={{textTransform: 'capitalize'}}
                                                    maxlength="35"
                                                    className="form-control"
                                                    placeholder="Enter last name"
                                                    value={updateForm.lastname}
                                                    onChange={setValue}
                                                    invalid={error.lastname}

                                                />
                                                <FormFeedback>{validator.message('last name', updateForm.lastname, 'required|alpha')}</FormFeedback>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl={6}>
                                            <div className="mb-3">
                                                <label>Phone number <span className="text-danger">*</span></label>
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
                                                <label>Department <span className="text-danger">*</span></label>
                                                <select
                                                    type="select"
                                                    name="department"
                                                    className="form-select custom-select"
                                                    value={updateForm.department}
                                                    onChange={setValue}
                                                    invalid={error.department}

                                                >
                                                    <option value='' selected disabled>Select...</option>
                                                    {
                                                        sortspecialities && sortspecialities.map((item, key) => {
                                                            return (
                                                                <option key={key} value={item.name}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <span style={{
                                                    fontSize: '80%',
                                                    color: '#f46a6a',
                                                }}>{validator.message('department', updateForm.department, 'required')}</span>

                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl={12}>
                                            <div className="mb-3">

                                                <div style={{width: 'inherit', overflow: 'none'}}>
                                                    <label>My Organisation<span className="text-danger">*</span></label>
                                                    <Multiselect
                                                        options={Orgoptions}
                                                        onSelect={onSelect}
                                                        onRemove={onRemove}
                                                        displayValue="name"
                                                        placeholder="Type to search"
                                                        onSearch={onrefOrgSearch}
                                                        singleSelect={false}
                                                        selectionLimit={1}
                                                        keepSearchTerm={false}
                                                    />
                                                </div>

                                                <span style={{
                                                    fontSize: '80%',
                                                    color: '#f46a6a',
                                                }}>{validator.message('organisation', updateForm.refOrganisation, 'required')}</span>


                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl={6}>
                                            <div className="mb-3">
                                                <label>Grade <span className="text-danger">*</span></label>
                                                <select

                                                    name="grade"
                                                    className="form-select custom-select"
                                                    value={updateForm.grade}
                                                    onChange={setValue}
                                                    invalid={error.grade}

                                                >
                                                    <option value='' selected disabled>Select...</option>
                                                    {
                                                        sortgrades && sortgrades.map((item, key) => {
                                                            return (<option key={key} value={item}>{item}</option>
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
                                        <Col xl={6}>
                                            <div className="mb-3">
                                                <label>GMC/NMC/GOC number <span className="text-danger">*</span></label>
                                                <Input

                                                    name="consultantcode"
                                                    className="form-control"
                                                    placeholder="Enter GMC/NMC/GOC number"
                                                    value={updateForm.consultantcode}
                                                    onChange={setValue}
                                                    invalid={error.consultantcode}
                                                    maxlength="10"
                                                />
                                                <FormFeedback>{validator.message("registration number", updateForm.consultantcode, 'required|alpha_num|min:7|max:10')}</FormFeedback>

                                            </div>
                                        </Col>
                                    </Row>


                                    <Loadbtn btnname={'Submit'} btnloadname={'Submit'}
                                             loading={loading}/>

                                </div>
                            </Form>

                        </div>
                    </div>
                    <AuthFooter/>
                </div>
            </div>

        </div>
    )

}
export default Updateprofile;