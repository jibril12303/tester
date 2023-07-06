import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Modal, Form, FormGroup, Label, Col, Input, Row, FormFeedback, UncontrolledTooltip, Tooltip } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux"
import { createReferralTypes, createReferralCreators } from "store/create-referral/reducer";
import usePatientValidator from 'hooks/patientValidator';
import Scanner from "components/Barcodescanner/Scanner"
import { capitalize } from 'lodash';
import { showToast } from 'utils/toastnotify';
import dayjs from 'dayjs';

const PatientDetails = (props) => {
    console.log(props)
    //references for the focus
    const nhsNumberRef = useRef(null)
    const hospitalNumberRef = useRef(null)
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const dobRef = useRef(null)
    const genderRef = useRef(null)
    const parentFNameRef = useRef(null)
    const parentLNameRef = useRef(null)
    const parentMobileRef = useRef(null)
    const parentEmailRef = useRef(null)
    const postcodeRef = useRef(null)
    const GPNameRef = useRef(null)
    const GPAddressRef = useRef(null)
    const GPPhoneNumberRef = useRef(null)
    const GPEmailAddressRef = useRef(null)
    const patientAddressRef = useRef(null)

    const [, forceUpdate] = useState()
    const [validator, showValidationMessage] = usePatientValidator()
    const [height, setHeight] = useState();
    const [ttopleft, setttopleft] = useState(false);
    const [ttopright, setttopright] = useState(false);
    const [basic, setBasic] = useState(false)
    const [qrvalue, setQrValue] = useState('')
    const [nonNHS, setNonNHS] = useState(false)
    const [showAdult, setShowAdult] = useState(true)

    const [PatientForm, setPatientForm] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        nhsNumber: '',
        hospitalNumber: '',
        dateOfBirth: '',
        parentFirstName: '',
        parentLastName: '',
        parentPhoneNumber: '',
        parentEmailAddress: '',
        postCode: '',
        patientAddress: '',
        GPName: '',
        GPAddress: '',
        GPPhoneNumber: '',
        GPEmailAddress: ''

    })

    const [error, setError] = useState({
        nhsNumber: false,
        hospitalNumber: false,
        firstName: false,
        lastName: false,
        gender: false,
        dateOfBirth: false,
        parentFirstName: false,
        parentLastName: false,
        parentPhoneNumber: false,
        parentEmailAddress: false,
        postCode: false,
        GPName: false,
        GPAddress: false,
        GPPhoneNumber: false,
        GPEmailAddress: false,
        patientAddress: false
    })


    const dispatch = useDispatch()

    

    


    const { speciality, orgID, patientData, loadingPatient, user } = useSelector(state => ({
        speciality: state.CreateReferral.speciality,
        orgID: state.Dashboard.orgID,
        patientData: state.CreateReferral.patientData,
        loadingPatient: state.CreateReferral.loadingPatient,
        user: state.appReducer.userDetails
    }))

    const adultCheck = (val) => {
        let dob = new Date(val)
        let today = new Date()
        let age = today.getFullYear() - dob.getFullYear()
        let month = today.getMonth() - dob.getMonth()
        if (month < 0 || month === 0 && (today.getDate() < dob.getDate())) age--;
        console.log(age, user.speciality, user.organisation[0].name)
        if (user?.speciality == ("Ophthalmology" || "Optometry") && user.organisation[0].name == "SANDWELL AND WEST BIRMINGHAM HOSPITALS NHS TRUST" && age > 16) {
            setShowAdult(false)

        }
        else { setShowAdult(true) }
        console.log(showAdult,'showadult')
    }





    useEffect(() => {
        console.log("SHOULD SUBMIT", props.shouldSubmit)
        if (props.shouldSubmit == true) {

            setError({
                ...error,
                nhsNumber: !validator.fieldValid('nhsNumber'),
                hospitalNumber: !validator.fieldValid('hospitalNumber'),
                firstName: !validator.fieldValid('firstName'),
                lastName: !validator.fieldValid('lastName'),
                gender: !validator.fieldValid('gender'),
                dateOfBirth: !validator.fieldValid('dateOfBirth'),
                parentFirstName: !validator.fieldValid('parentFirstName'),
                parentLastName: !validator.fieldValid('parentLastName'),
                parentPhoneNumber: !validator.fieldValid('parentPhoneNumber'),
                parentEmailAddress: !validator.fieldValid('parentEmailAddress'),
                GPAddress: !validator.fieldValid('GPAddress'),
                GPPhoneNumber: !validator.fieldValid('GPPhoneNumber'),
                GPName: !validator.fieldValid('GPName'),
                GPEmailAddress: !validator.fieldValid('GPEmailAddress'),
                patientAddress: !validator.fieldValid('patientAddress'),
                postCode: !validator.fieldValid('postCode')

            })
            if (validator.allValid()) {
                setValue('force');
                let patientInfo = {
                    firstName: _.capitalize(PatientForm.firstName),
                    lastName: _.capitalize(PatientForm.lastName),
                    gender: PatientForm.gender,
                    nhsNumber: PatientForm.nhsNumber,
                    dateOfBirth: PatientForm.dateOfBirth,
                    hospitalNumber: PatientForm.hospitalNumber,
                    postCode: PatientForm.postCode,
                    GPName: PatientForm.GPName,
                    GPAddress: PatientForm.GPAddress,
                    GPPhoneNumber: PatientForm.GPPhoneNumber,
                    GPEmailAddress: PatientForm.GPEmailAddress,
                    patientAddress: PatientForm.patientAddress,
                    GPmcode: patientData?.GPid
                }
                let parentInfo = {
                    parentFirstName: _.capitalize(PatientForm.parentFirstName),
                    parentLastName: _.capitalize(PatientForm.parentLastName),
                    parentPhoneNumber: PatientForm.parentPhoneNumber,
                    parentEmailAddress: PatientForm.parentEmailAddress
                }
                dispatch(createReferralCreators.createCase(speciality, patientInfo, parentInfo, orgID, null, null, null, patientData.GPid, PatientForm.GPName, null, PatientForm.GPEmailAddress))
                props.onSubmit(patientInfo, parentInfo)
            } else {
                showValidationMessage(true)
                forceUpdate(1)
            }
        }
        props.setPatientDetailsSubmit(false)
    }, [props.shouldSubmit])
    
    useEffect(() => {
        //if error is true show the focus on the field. It goes in ascending order to show the highest component first
       if (showAdult){ error?.parentEmailAddress && parentEmailRef.current.focus()
        error?.parentPhoneNumber && parentMobileRef.current.focus();
        error?.parentLastName && parentLNameRef.current.focus();
        error?.parentFirstName && parentFNameRef.current.focus();}

        error?.gender && genderRef.current.focus();
        error?.dateOfBirth && dobRef.current.focus();
        error?.lastName && lastNameRef.current.focus();
        error?.firstName && firstNameRef.current.focus();
        error?.hospitalNumber && hospitalNumberRef.current.focus();
        error?.nhsNumber && nhsNumberRef.current.focus();
        error?.postCode && postcodeRef.current.focus();
        error?.GPName && GPNameRef.current.focus();
        error?.GPAddress && GPAddressRef.current.focus();
        error?.GPEmailAddress && GPEmailAddressRef.current.focus();
        error?.GPPhoneNumber && GPPhoneNumberRef.current.focus();
        error?.patientAddress && patientAddressRef.current.focus()
    }, [error])

    const setValue = (e) => {
        validator.hideMessages();
        adultCheck(PatientForm.dateOfBirth);
        if (e != 'force'){
        if (e.currentTarget != null) {
            setPatientForm({ ...PatientForm, [e.currentTarget.name]: e.currentTarget.value, postCode: (document.getElementById('postCode')).value, patientAddress: (document.getElementById('patientAddress')).value })
        } else {
            setPatientForm({ ...PatientForm, [e.target.name]: e.target.value,  postCode: (document.getElementById('postCode')).value, patientAddress: (document.getElementById('patientAddress')).value  })
        }}
        else {
            setPatientForm({ ...PatientForm, postCode: (document.getElementById('postCode')).value, patientAddress: (document.getElementById('patientAddress')).value  })
        }

    }

    const onDetected = data => {
        setQrValue(data)
        console.log(data)
        if (data) {
            setBasic(false)
        }
    }

    useEffect(() => {
        let form = {
            firstName: capitalize(patientData?.firstName) || '',
            lastName: capitalize(patientData?.lastName) || '',
            gender: capitalize(patientData?.gender) || '',
            dateOfBirth: patientData?.dateOfBirth || '',
            nhsNumber: patientData?.NHSNumber || PatientForm.nhsNumber,
            postCode: patientData?.postCode || PatientForm.postCode,
            patientAddress: patientData?.postCode ? patientData?.patientAddress || '' : '',
            GPAddress: patientData?.GPAddress || '',
            GPName: patientData?.GPName || '',
            GPPhoneNumber: patientData?.GPPhoneNumber || '',
            GPEmailAddress: patientData?.GPEmailAddress || '',

        }
        setPatientForm({ ...PatientForm, ...form })
    }, [patientData])
    console.log(PatientForm, 'pfchangs')
    
    useEffect(()=> {

        adultCheck(PatientForm.dateOfBirth)

    },[PatientForm])
    console.log(showAdult)

    useEffect(() => {

        addressNow.load();

    },{}

    )

    {addressNow.listen("load",
    function(control) {
        control.listen("populate",
            function(address) {
                let addAddress = {postCode: address?.PostalCode, patientAddress: (address?.Line1 + ', ' + address?.City + ', ' + address?.Province) }
                document.getElementById('postCode').value = address?.PostalCode;
                var reform = (address?.Label).replaceAll(('\n'+address?.PostalCode), '')
                var reformed = reform.replaceAll('\n', ', ');
                document.getElementById('patientAddress').value = reformed;
            });
    });}

    



    return (<>

        <form>
            <div>
                <CardTitle className="h4">Patient information{qrvalue}</CardTitle>
                <p className="card-title-desc">
                    Please tell us about the patient you wish to refer (
                    <a
                        rel="noreferrer"
                        target="_blank"
                        href="https://bwc.nhs.uk/privacy-policy"
                    >
                        Read our privacy policy
                    </a>
                    )
                </p>
                <div className="p-4 border">
                    <Form>
                        <Row>
                            <Col lg="6">
                                <FormGroup className="mb-0">
                                    <Label htmlFor="nhsNumber">
                                        NHS Number <span className="text-danger">*</span> <a
                                            rel="noreferrer"
                                            target="_blank"
                                            href="https://www.nhs.uk/find-nhs-number/what-is-your-name"
                                        >
                                            {"(Find patient's NHS number)"}
                                        </a>
                                    </Label>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ flex: 1 }} className='input-group'>
                                            <Input
                                                disabled={nonNHS}
                                                innerRef={nhsNumberRef}
                                                type="number"
                                                className="form-control"
                                                style={{ height: '36px' }}
                                                id="nhsNumber"
                                                name="nhsNumber"
                                                placeholder="Scan or search NHS number"
                                                onChange={(e) => {
                                                    if (e.target.value.length < 11) setValue(e)
                                                }}
                                                value={PatientForm.nhsNumber}
                                                invalid={error.nhsNumber}
                                            />
                                            <div className="input-group-append">

                                                <span className="input-group-text" id="basic-addon2"
                                                    style={{ background: 'white', height: "36px", borderLeft: '0px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>
                                                    <Tooltip
                                                        placement="top"
                                                        isOpen={ttopleft}
                                                        target="TooltipTop"
                                                        toggle={() => {
                                                            setttopleft(!ttopleft);
                                                        }}
                                                    >
                                                        Scan barcode
                                                    </Tooltip>
                                                    <i className="bx bx-barcode" id="TooltipTop"
                                                        style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => setBasic(true)}>
                                                    </i>


                                                </span>
                                            </div>

                                            <FormFeedback>{validator.message('nhsNumber', PatientForm.nhsNumber, nonNHS ? '' : 'required|nhsNumber')}</FormFeedback>
                                        </div>
                                        <UncontrolledTooltip target='searchpatient' >
                                            {"Search either using NHS number or patient's name and date of birth."}
                                        </UncontrolledTooltip>
                                        <span id='searchpatient' className='bg bg-primary' style={{
                                            height: '36px', marginLeft: '10px',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '0.25rem'
                                        }}
                                        >
                                            {loadingPatient ? (
                                                <i className="bx bx-loader bx-spin " style={{ color: 'white', fontSize: '20px', padding: "10px", cursor: 'pointer' }} />
                                            ) : (
                                                <i className='bx bx-search-alt-2' onClick={() => {
                                                    if (PatientForm?.nhsNumber.length == 10) {
                                                        dispatch(createReferralCreators.requestPatientData(PatientForm?.nhsNumber))
                                                    } else if (PatientForm.lastName && PatientForm.firstName && PatientForm.dateOfBirth) {
                                                        dispatch(
                                                            createReferralCreators.searchPatientData({
                                                                family: PatientForm.lastName,
                                                                given: PatientForm.firstName,
                                                                birthdate: dayjs(PatientForm.dateOfBirth)
                                                                    .add(4, "hour")
                                                                    .format("YYYY-MM-DD"),
                                                            })
                                                        )
                                                    } else {
                                                        showToast('Please enter a valid NHS Number', 'info');
                                                    }

                                                }}
                                                    style={{ color: 'white', fontSize: '20px', padding: "10px", cursor: 'pointer' }} />
                                            )}
                                        </span>

                                    </div>
                                </FormGroup>
                                <div className="form-check mt-0">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={nonNHS}
                                        onClick={(e) => { setNonNHS(!nonNHS); setPatientForm({ ...PatientForm, nhsNumber: '' }) }}
                                        id="defaultCheck1"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="defaultCheck1"
                                    >
                                        {"NHS Number not available"}
                                    </label>
                                </div>
                            </Col>

                            <Col lg="6">
                                <FormGroup className="mb-0">
                                    <Label htmlFor="hospitalNumber">
                                        {`Birmingham Women's & Children's Hospital Number (If known) `}
                                    </Label>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ flex: 1 }} className='input-group'>
                                            <Input
                                                innerRef={hospitalNumberRef}
                                                type="text"
                                                className="form-control"
                                                style={{ height: '36px' }}
                                                id="hospitalNumber"
                                                name="hospitalNumber"
                                                placeholder="Scan or search hospital number"
                                                onChange={(e) => {
                                                    if (e.target.value.length < 9) setValue(e)
                                                }}
                                                value={PatientForm.hospitalNumber}
                                                invalid={error.hospitalNumber}
                                            />
                                            {/* <div className="input-group-append">
                                                <span className="input-group-text" id="basic-addon2" 
                                                style={{background:'white',height:"36px",borderLeft:'0px',borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}>
                                                    <i className="bx bx-barcode" id="Barcodetooltip"
                                                    style={{fontSize:'20px',cursor:'pointer'}}>
                                                    </i>
            
                                                <Tooltip
                                                    placement="top"
                                                    isOpen={ttopright}
                                                    target="Barcodetooltip"
                                                    toggle={() => {
                                                        setttopright(!ttopright);
                                                    }}
                                                    >
                                                    Scan barcode
                                                    </Tooltip>
                                                            </span>
                                            </div> */}

                                            <FormFeedback>{validator.message('hospitalNumber', PatientForm.hospitalNumber, 'hospitalNumber')}</FormFeedback>
                                        </div>
                                        {/* 
                                    <span className='bg bg-primary' style={{height:'36px',marginLeft:'10px',
                                        display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'0.25rem'}}
                                    >
                                    <i className='bx bx-search-alt-2' style={{color:'white',fontSize:'20px',padding:"10px",cursor:'pointer'}}/>
                                    </span> */}

                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="6">
                                <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="firstName">
                                        First Name<span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        innerRef={firstNameRef}
                                        type="text"
                                        className="form-control"
                                        style={{ textTransform: PatientForm.firstName.length == 0 ? '' : 'capitalize' }}
                                        id="firstName"
                                        name="firstName"
                                        maxlength="35"
                                        placeholder="Enter patient's first name"
                                        onChange={setValue}
                                        value={PatientForm.firstName}
                                        invalid={error.firstName}
                                    />
                                    <FormFeedback>{validator.message('firstName', PatientForm.firstName, 'required|name')}</FormFeedback>

                                </FormGroup>
                            </Col>
                            <Col lg="6">
                                <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="lastName">
                                        Last Name<span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        innerRef={lastNameRef}
                                        type="text"
                                        className="form-control"
                                        style={{ textTransform: PatientForm.lastName.length == 0 ? '' : 'capitalize' }}
                                        id="lastName"
                                        name="lastName"
                                        maxlength="35"
                                        placeholder="Enter patient's last name"
                                        onChange={setValue}
                                        value={PatientForm.lastName}
                                        invalid={error.lastName}
                                    />
                                    <FormFeedback>{validator.message('lastName', PatientForm.lastName, 'required|name')}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg="6">
                                <FormGroup className=" mt-4 mb-0">
                                    <Label htmlFor="dateOfBirth">
                                        Date of Birth<span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        innerRef={dobRef}
                                        type="date"
                                        className="form-control"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        placeholder="DD/MM/YYYY"
                                        onChange={(setValue)}
                                        invalid={error.dateOfBirth}
                                        value={PatientForm.dateOfBirth}
                                    />
                                   {(user?.speciality == ("Ophthalmology" || "Optometry") && user.organisation[0].name == "SANDWELL AND WEST BIRMINGHAM HOSPITALS NHS TRUST" )  ?  (<FormFeedback>{validator.message('dateOfBirth', PatientForm.dateOfBirth, 'required|dateOfBirthFuture')}</FormFeedback>) : (<FormFeedback>{validator.message('dateOfBirth', PatientForm.dateOfBirth, 'required|dateOfBirth18|dateOfBirthFuture')}</FormFeedback>) }
                                </FormGroup>
                            </Col>
                            <Col lg="6">
                                <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="gender">Gender<span className="text-danger">*</span></Label>
                                    <Input innerRef={genderRef} className="form-select form-control" type="select" name="gender" id="gender" onChange={setValue} value={PatientForm.gender} invalid={error.gender}>
                                        <option>Select...</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Not known</option>
                                        <option>Not specified</option>
                                    </Input>
                                    <FormFeedback>{validator.message('gender', PatientForm.gender, 'required|gender')}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <br></br>

                        <Row>
                            <Col lg="6">
                                <FormGroup className="mb-0">
                                    <Label htmlFor="postCode">
                                        Postcode <span className="text-danger">*</span>
                                    </Label>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ flex: 1 }} className='input-group'>
                                            <Input

                                                innerRef={postcodeRef}
                                                type="text"
                                                className="form-control"
                                                style={{ height: '36px' }}
                                                id="postCode"
                                                name="postCode"
                                                placeholder="Search Postcode"
                                                onInput={(e) => {
                                                    setValue(e)
                                                }}
                                                value={PatientForm.postCode}
                                                invalid={error.postCode}
                                            />
                                            

                                            <FormFeedback>{validator.message('postCode', PatientForm.postCode, 'required')}</FormFeedback>
                                        </div>
                                        {/* <UncontrolledTooltip target='postcodeTooltip' >
                                        {'Search for an address'}
                                    </UncontrolledTooltip>
                                    <span id='postcodeTooltip' className='bg bg-primary' style={{height:'36px',marginLeft:'10px',
                                        display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'0.25rem'}}
                                    >
                                    {loadingPatient ? (
                                        <i className="bx bx-loader bx-spin " style={{color:'white',fontSize:'20px',padding:"10px",cursor:'pointer'}} />
                                    ) : (
                                        <i className='bx bx-search-alt-2' onClick={()=>{
                                           
                                        null
                                        
                                        } }
                                        style={{color:'white',fontSize:'20px',padding:"10px",cursor:'pointer'}}/>
                                    )}
                                    </span>  */}

                                    </div>
                                </FormGroup>

                            </Col>
                            <Col lg="6">
                                <FormGroup className="mb-0">
                                    <Label htmlFor="patientAddress">
                                        Address<span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        innerRef={patientAddressRef}
                                        type="text"
                                        className="form-control"
                                        id="patientAddress"
                                        name="patientAddress"
                                        maxlength="35"
                                        style={{ textTransform: PatientForm.patientAddress.length == 0 ? '' : 'capitalize' }}
                                        placeholder="Enter the patient's address"
                                        onChange={setValue}
                                        value={PatientForm.patientAddress}
                                        invalid={error.patientAddress}
                                    />
                                    <FormFeedback>{validator.message('patientAddress', PatientForm.patientAddress, 'required')}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

            { (showAdult) && (<>
            <h5 className="mt-5 mb-3 font-size-15">Parent/Carer Information</h5>
            <p className="card-title-desc">
                Please tell us about the parent/carer of the child so that we
                can contact them (
                <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://bwc.nhs.uk/privacy-policy"
                >
                    Read our privacy policy
                </a>
                )
            </p>
            <div className="p-4 border">
                <Form>
                    <Row>
                        <Col lg="6">
                            <FormGroup className="mb-0">
                                <Label htmlFor="parentFirstName">
                                    First Name<span className="text-danger">*</span>
                                </Label>
                                <Input
                                    innerRef={parentFNameRef}
                                    type="text"
                                    className="form-control"
                                    id="parentFirstName"
                                    name="parentFirstName"
                                    maxlength="35"
                                    style={{ textTransform: PatientForm.parentFirstName.length == 0 ? '' : 'capitalize' }}
                                    placeholder="Enter parent's first name"
                                    onChange={setValue}
                                    invalid={error.parentFirstName}
                                    value={PatientForm.parentFirstName}
                                />
                                <FormFeedback>{validator.message('parentFirstName', PatientForm.parentFirstName, 'required|name')}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col lg="6">
                            <FormGroup className="mb-0">
                                <Label htmlFor="parentLastName">
                                    Last Name<span className="text-danger">*</span>
                                </Label>
                                <Input
                                    innerRef={parentLNameRef}
                                    type="text"
                                    className="form-control"
                                    id="parentLastName"
                                    name="parentLastName"
                                    maxlength="35"
                                    style={{ textTransform: PatientForm.parentLastName.length == 0 ? '' : 'capitalize' }}
                                    placeholder="Enter parent's last name"
                                    onChange={setValue}
                                    value={PatientForm.parentLastName}
                                    invalid={error.parentLastName}
                                />
                                <FormFeedback>{validator.message('parentLastName', PatientForm.parentLastName, 'required|name')}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <FormGroup className="mt-4 mb-0">
                                <Label htmlFor="parentPhoneNumber">
                                    Contact Number<span className="text-danger">*</span>
                                </Label>
                                <Input
                                    innerRef={parentMobileRef}
                                    type="text"
                                    className="form-control"
                                    id="parentPhoneNumber"
                                    name="parentPhoneNumber"
                                    placeholder="Enter parent's contact number"
                                    onChange={(e) => {
                                        if (!/^\d*$/.test(e.target.value)) return;
                                        if (e.target.value.length < 12) setValue(e)
                                    }}
                                    invalid={error.parentPhoneNumber}
                                    value={PatientForm.parentPhoneNumber}
                                />
                                <FormFeedback>{validator.message('parentPhoneNumber', PatientForm.parentPhoneNumber, 'required|phoneNumber')}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col lg="6">
                            <FormGroup className=" mt-4 mb-0">
                                <Label htmlFor="parentEmailAddress">Email</Label>
                                <Input
                                    innerRef={parentEmailRef}
                                    type="text"
                                    className="form-control"
                                    id="parentEmailAddress"
                                    name="parentEmailAddress"
                                    placeholder="Enter a valid email address"
                                    onChange={setValue}
                                    value={PatientForm.parentEmailAddress}
                                    invalid={error.parentEmailAddress}
                                />
                                <FormFeedback>{validator.message('parentEmailAddress', PatientForm.parentEmailAddress, 'email')}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </div></> )}
            
            <h5 className="mt-5 mb-3 font-size-15">GP Information</h5>
            <p className="card-title-desc">
                Please tell us about the GP information of the child (
                <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://bwc.nhs.uk/privacy-policy"
                >
                    Read our privacy policy
                </a>
                )
            </p>
            <div className="p-4 border">
                <Form>
                    <Row>
                        <Col lg="6">
                            <FormGroup className="mb-0">
                                <Label htmlFor="GPName">
                                    GP Name <span className="text-danger">*</span>
                                </Label>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ flex: 1 }} className='input-group'>
                                        <Input
                                            innerRef={GPNameRef}
                                            type="text"
                                            className="form-control"
                                            style={{ textTransform: PatientForm.GPName.length == 0 ? '' : 'capitalize' }}
                                            id="GPName"
                                            name="GPName"
                                            placeholder="Enter GP name"
                                            onChange={setValue}
                                            value={PatientForm.GPName}
                                            invalid={error.GPName}
                                        />
                                        <div className="input-group-append">


                                        </div>

                                        <FormFeedback>{validator.message('GPName', PatientForm.GPName, 'required')}</FormFeedback>
                                    </div>
                                    {/* <UncontrolledTooltip target='gpsearch' >
                                        {"Search for a GP"}
                                    </UncontrolledTooltip>
                                    <span id='gpsearch' className='bg bg-primary' style={{height:'36px',marginLeft:'10px',
                                        display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'0.25rem'}}
                                    >
                                    {loadingPatient ? (
                                        <i className="bx bx-loader bx-spin " style={{color:'white',fontSize:'20px',padding:"10px",cursor:'pointer'}} />
                                    ) : (
                                        <i className='bx bx-search-alt-2' onClick={()=>{
                                            if(PatientForm?.nhsNumber.length == 10){
                                                dispatch(createReferralCreators.requestPatientData(PatientForm?.nhsNumber))
                                            } else if(PatientForm.lastName && PatientForm.firstName && PatientForm.dateOfBirth) {
                                                dispatch(
                                                  createReferralCreators.searchPatientData({
                                                    family: PatientForm.lastName,
                                                    given: PatientForm.firstName,
                                                    birthdate: dayjs(PatientForm.dateOfBirth)
                                                      .add(4, "hour")
                                                      .format("YYYY-MM-DD"),
                                                  })
                                                )
                                            } else {
                                                showToast('Please enter a valid NHS Number','info');
                                            }
                                            
                                        } }
                                        style={{color:'white',fontSize:'20px',padding:"10px",cursor:'pointer'}}/>
                                    )}
                                    </span>  */}

                                </div>
                            </FormGroup>

                        </Col>
                        <Col lg="6">
                            <FormGroup className="mb-0">
                                <Label htmlFor="GPAddress">
                                    Practice Address<span className="text-danger">*</span>
                                </Label>
                                <Input
                                    innerRef={GPAddressRef}
                                    type="text"
                                    className="form-control"
                                    id="GPAddress"
                                    name="GPAddress"
                                    style={{ textTransform: PatientForm.GPAddress.length == 0 ? '' : 'capitalize' }}
                                    placeholder="Enter the practice's address"
                                    onChange={setValue}
                                    value={PatientForm.GPAddress}
                                    invalid={error.GPAddress}
                                />
                                <FormFeedback>{validator.message('GPAddress', PatientForm.GPAddress, 'required')}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <FormGroup className="mt-4 mb-0">
                                <Label htmlFor="GPPhoneNumber">
                                    Phone<span className="text-danger">*</span>
                                </Label>
                                <Input
                                    innerRef={GPPhoneNumberRef}
                                    type="number"
                                    className="form-control"
                                    id="GPPhoneNumber"
                                    name="GPPhoneNumber"
                                    placeholder="Enter GP Contact number"
                                    onChange={(e) => {
                                        if (!/^\d*$/.test(e.target.value)) return;
                                        if (e.target.value.length < 12) setValue(e)
                                    }}
                                    invalid={error.GPPhoneNumber}
                                    value={PatientForm.GPPhoneNumber}
                                />
                                <FormFeedback>{validator.message('GPPhoneNumber', PatientForm.GPPhoneNumber, 'required|phoneNumber')}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col lg="6">
                            <FormGroup className=" mt-4 mb-0">
                                <Label htmlFor="GPEmailAddress">Email</Label>
                                <Input
                                    innerRef={GPEmailAddressRef}
                                    type="text"
                                    className="form-control"
                                    id="GPEmailAddress"
                                    name="GPEmailAddress"
                                    placeholder="Enter a valid email address"
                                    onChange={setValue}
                                    value={PatientForm.GPEmailAddress}
                                    invalid={error.GPEmailAddress}
                                />
                                <FormFeedback>{validator.message('GPEmailAddress', PatientForm.GPEmailAddress, 'email')}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </div>
        </form>
        <Modal
            isOpen={basic}
            scrollable={true}
            backdrop={'static'}
            centered={true}
            id="staticBackdrop"
            style={{ Width: '500px', width: '100%', overflow: 'none' }}
        >
            <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                    <i className="fa fa-warning"></i> Scanner
                </h5>
                <button
                    type="button"
                    className="btn btn-danger btn-close"

                    aria-label="Close"
                ></button>
            </div>
            <div className="modal-body " style={{ overflow: 'hidden', margin: '0px', padding: '0px' }}>
                <div style={{ height: '500px', width: '500px', marginTop: '20px', marginBottom: 'auto' }}><Scanner onDetected={onDetected} /></div>

            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                        setBasic(false);
                    }}
                >
                    Close
                </button>

            </div>
        </Modal>

    </>
    );
};

PatientDetails.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    shouldSubmit: PropTypes.any.isRequired,
    setPatientDetailsSubmit: PropTypes.func
    // options: PropTypes.array.isRequired,
    // value: PropTypes.any.isRequired,
};

export default PatientDetails;
