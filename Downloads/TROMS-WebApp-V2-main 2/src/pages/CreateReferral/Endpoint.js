import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    CardTitle,
    Form,
    FormGroup,
    Label,
    Row,
    Col,
    Card,
    Modal,
    Table,
    Input
} from 'reactstrap';
import Select from 'react-select';
import {useSelector, useDispatch} from 'react-redux';
import {createReferralCreators} from 'store/create-referral/reducer';
import uniqueId from 'lodash.uniqueid';
import {setClient} from 'utils/apiUtils';
import {useHistory} from 'react-router-dom';
import moment from 'moment';
import isHolidayFunction from '../../utils/isBankHolidayOrWeekend'
import dayjs from 'dayjs';

//toast
import {showToast} from 'utils/toastnotify'

const Endpoint = (props) => {
    if (props.disabled) return <p>loading...</p>;
    let clinicianLeaflets = [];
    const [answer, setAnswer] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [unavailableRegistrarModal, setunavailableRegistrarModal] = useState(false);
    const [noLeafletModal, setNoLeafletModal] = useState(false)
    const [sections, setSections] = useState([]);
    const [sectionNames, setSectionNames] = useState([]);
    const [apiOptions, setApiOptions] = useState()
    const [apiCalls, setApiCalls] = useState([])
    const [selectedLeaflets, setSelectedLeaflets] = useState([])
    const [clinicalLeaflets, setClinicalLeaflets] = useState([])
    const [incompleteCaseModal, setIncompleteCaseModal] = useState([])
    const [additionalnotes, setAdditionalNotes] = useState('')

    const {endpoint, userDetails, patient, caseDetails, parentDetail, actionContent, onCallNumber, token, leaflets, pathway, decision, speciality,chosenPathway} = useSelector(
        (state) => ({
            endpoint: state.CreateReferral.endpoint.result || state.CreateReferral.endpoint,
            speciality: state.CreateReferral.speciality,
            patient: state.CreateReferral.caseDetails.patient,
            caseDetails: state.CreateReferral.caseDetails,
            actionContent: state.CreateReferral.actionContent,
            onCallNumber: state.CreateReferral.onCallNumber,
            token: state.appReducer.token,
            leaflets: state.CreateReferral.leaflets,
            parentDetail: state.CreateReferral.caseDetails.patient.parent,
            pathway: state.CreateReferral.selectedPathway.name,
            decision: state.CreateReferral.decision,
            userDetails: state.appReducer.userDetails,
            chosenPathway: state.CreateReferral.selectedPathway,


        })
    );

    useEffect(() => {
        if (apiOptions?.lifeThreatening) {
            dispatch(createReferralCreators.setLifeThreatening(apiOptions?.lifeThreatening))
        }
    }, [apiOptions])

    const dispatch = useDispatch();
    const history = useHistory();

    const currentEmail = parentDetail?.emailAddress;
    console.log(props);
    console.log("ENDPOINT", endpoint)
    console.log("called")
    console.log("currentEmail", currentEmail)
    console.log(sections);
    console.log(sectionNames)
    console.log(answer);
    console.log(apiOptions)
    console.log(selectedLeaflets)
    console.log("speciality", speciality.label)
    console.log(sectionNames.filter((item) => item == 'Section2').length, 'accept param')
    props.setSectionNames(sectionNames);
    
    

    
    
    
    


    const setClinicanLeaflets = (val) => {
        console.log("val in setClinicanLeaflets", val)
        let value = val
        clinicianLeaflets = [...clinicianLeaflets, value];

    }
    console.log("clinicianLeaflets", clinicianLeaflets)

    function handleApiOptions(section) {
        let keys = Object.keys(
            section.apiOption
        );

        setApiOptions((prevState) => {
            let obj
            if ('callTimeline' in prevState && 'callTimeline' in section.apiOption) {
                //this checks the length of the timeline. So if a user changes their input the old apiOption will be removed and the new one added in
                // otherwise clicking all the different button can result in 50 length array when it only needs to be 3.
                if (prevState.callTimeline.length >= sections.length + 1) {
                    prevState.callTimeline.length = sections.length
                    let update = prevState.callTimeline
                    delete prevState.callTimeline
                    let timeline = section.apiOption.callTimeline.append
                    if (timeline != undefined) {
                        timeline.time = dayjs().format("DD/MM/YYYY HH:mm a")
                    }
                    update = [...update, timeline]
                    console.log(update)
                    section.apiOption.callTimeline = update

                } else {
                    let update = prevState.callTimeline
                    delete prevState.callTimeline
                    let timeline = section.apiOption.callTimeline.append
                    if (timeline != undefined) {
                        timeline.time = dayjs().format("DD/MM/YYYY HH:mm a")
                    }
                    update = [...update, timeline]
                    console.log(update)
                    section.apiOption.callTimeline = update
                }
            }
            keys.map((key) => {
                obj = {
                    ...prevState,
                    ...obj,
                    [key]: section.apiOption[key],
                };
            });
            return obj;
        });
    }


    function leafletsSelected() {
        let ret = true
        if (!('title' in endpoint)) {
            if ('showLeaflets' in endpoint['Section1']) {
                if (endpoint['Section1'].showLeaflets.includes('patient') && leaflets?.patientLeaflets?.length > 0 && selectedLeaflets.length == 0) {
                    ret = false
                }
            }

            let plexist = sections.map(i => 'showLeaflets' in i ? true : false); //plexist patient leaflet exist
            if (plexist.length > 0) {
                plexist.map((item, index) => {
                    console.log(`index: ${index}\ncontent: ${JSON.stringify(item)}`)
                    if (item == true) {
                        let section = sections[index]
                        if (section.showLeaflets.includes('patient') && selectedLeaflets.length == 0) {
                            ret = false
                        }
                    }
                })
            }
        } else {
            if ('showLeaflets' in endpoint?.body) {
                if (endpoint?.body.showLeaflets.includes('patient') && selectedLeaflets.length == 0) {
                    ret = false
                }
            }
            let plexist = sections.map(i => 'showLeaflets' in i ? true : false); //plexist patient leaflet exist
            if (plexist.length > 0) {
                plexist.map((item, index) => {
                    console.log(`index: ${index}\ncontent: ${JSON.stringify(item)}`)
                    if (item == true) {
                        let section = sections[index]
                        if (section.showLeaflets.includes('patient') && selectedLeaflets.length == 0) {
                            ret = false
                        }
                    }
                })
            }
        }

        return ret
    }

    useEffect(() => {
        setIncompleteCaseModal(true)
    }, [])

    console.log("selectedLeaflets", selectedLeaflets.length)
    console.log("clinicianLeaflets", clinicianLeaflets)

    useEffect(() => {
        let finalleaflet = null
        if (props.nextButtonClicked) {
            //this checks if the actions have been answered before allowing the user to cary on
            // but now we are using the textarea also
            // so we check if the sections are complete - or equal to textarea which comes at the very end.
            if (endpoint?.Section1?.action != undefined && ((sections[sections.length - 1]?.action != undefined && sections[sections.length - 1]?.action?.type != 'textarea') || sections[sections.length - 1] == undefined)) {
                showToast("Please answer the mandatory questions", 'error')
                return props.setEndpointSaveClose(false)
            }
            if (!leafletsSelected()) {
                if (currentEmail) {
                    setNoLeafletModal(true)
                }
                props.setEndpointSaveClose(false)
            } else {

                /*
                    SANJAY
                    if ophthal
                    finalleaflet = [...patientLeaflets,...clinicianLeaflets]
                    else {
                        finalleaflet = [...selectedLeaflets,...clinicianLeaflets]
                    }
                */
                setClient(token);

                // if (speciality.label == 'Ophthalmology') {
                //     finalleaflet = [...patientLeaflets, ...clinicianLeaflets]
                //
                // } else {
                //     finalleaflet = [...selectedLeaflets, ...clinicianLeaflets]
                // }
                finalleaflet = [...selectedLeaflets, ...clinicianLeaflets]
                //dispatch(createReferralCreators.sendLeaflets(caseDetails.caseID, finalleaflet));
                //history.push("/dashboard")
                if (!currentEmail && selectedLeaflets.length > 0) {
                    //props.setPrint(true)
                }
                // props.setModal(true)
                props.openPdfModal()
                props.setEndpointSaveClose(false)
            }
            let APIOptions = {...apiOptions}
            if ('apiOption' in endpoint.Section1) {
                let keys = Object.keys(endpoint.Section1.apiOption)
                let update = {}
                keys.forEach(item => {
                    update = {
                        ...update,
                        [item]: endpoint.Section1.apiOption[item]
                    }
                })
                setApiOptions({...apiOptions, update})
                APIOptions = {...APIOptions, update}
            }
            if (endpoint?.Section1?.content == '{advice}') {
                console.log("in endpoint['Section1'].content == '{advice}' " + "actionContent=", actionContent)
                dispatch(createReferralCreators.submitCaseAtEndpoint(caseDetails.caseID, APIOptions, endpoint?.Section1?.suggestedAction || endpoint?.suggestedAction, actionContent, finalleaflet));
            } else if ("title" in endpoint) {
                console.log("in title in endpoint " + "endpoint.body.advice=", endpoint.body.advice)
                dispatch(createReferralCreators.submitCaseAtEndpoint(caseDetails.caseID, APIOptions, endpoint?.Section1?.suggestedAction || endpoint?.suggestedAction, endpoint.body.advice, finalleaflet));
            } else if (endpoint.constructor === Object) {
                console.log("endpoint.constructor === Object " + "endpoint['Section1'].content=", endpoint['Section1'].content)
                dispatch(createReferralCreators.submitCaseAtEndpoint(caseDetails.caseID, APIOptions, endpoint?.Section1?.suggestedAction || endpoint?.suggestedAction, endpoint['Section1'].content, finalleaflet));
            } else {
                console.log("endpoint.body.advice", endpoint.body.advice)
                dispatch(createReferralCreators.submitCaseAtEndpoint(caseDetails.caseID, APIOptions, endpoint?.Section1?.suggestedAction || endpoint?.suggestedAction, endpoint.body.advice, finalleaflet));
            }
            if (!leafletsSelected() && !currentEmail && clinicianLeaflets?.length > 0) {
                //history.push("/dashboard")
                //props.setPrint(true)
                // props.setModal(true)
                props.openPdfModal()
                props.setEndpointSaveClose(false)
            }

        }
    }, [props])

    function renderMobileSwitchboard() {
        return (
            <div className="btn-group btn-group-example mb-3" role="group">
                <button
                    style={{paddingRight: '2vw'}}
                    type="button"
                    onClick={() =>
                        setShowModal({
                            message:
                                'Please make a note of the following contact number of on-call Registrar - ',
                            number: onCallNumber || '0121 333 9999',
                        })
                    }
                    className="btn btn-primary"
                >
                    {' '}
                    Direct Call
                </button>
                <button
                    type="button"
                    style={{paddingLeft: '2vw'}}
                    onClick={() =>
                        setShowModal({
                            message:
                                'Please make a note of the following contact number of switchboard. - ',
                            number: '0121 333 9999',
                        })
                    }
                    className="btn btn-danger"
                >
                    Switchboard{' '}
                </button>
            </div>
        );
    }

    function renderSwitchboard() {
        return (
            <button
                type="button"
                onClick={() =>
                    setShowModal({
                        message:
                            'Please make a note of the following contact number of switchboard. - ',
                        number: '0121 333 9999',
                    })
                }
                className="btn btn-danger w-xs mb-3"
            >
                {' '}Switchboard{' '}
            </button>
        );
    }


    let calculateTheBookingDate = () => {
        let now = moment()
        let currentHour = now.hour();
        let currentMinute = now.minute();
        if (currentHour >= 0 && currentHour <= 6) {
            if (currentHour === 6 && currentMinute > 0) {
                return [
                    now.add(1, 'days').format('DD MMMM YYYY'),
                    now.add(1, 'days').format('YYYY-MM-DD'),
                ];
            }
            return [now.format('DD MMMM YYYY'), now.format('YYYY-MM-DD')];
        }
        return [
            now.add(1, 'days').format('DD MMMM YYYY'),
            now.add(1, 'days').format('YYYY-MM-DD'),
        ];
    };

    if (endpoint.constructor === Object && endpoint != undefined) {
        //debugger
        return (
            <div>
                <CardTitle className={'float-start'}>Case Outcome</CardTitle>

                <div className="clearfix"></div>
                {/* <h4>Case Ref: {caseDetails.caseID} | {pathway}</h4> */}
                {/* <h4>
                {patient.firstName} {patient.lastName} | {patient.NHSNumber} |{' '}
                {moment(patient.dateOfBirth).format('DD-MM-YYYY')} | {patient.gender.split(" ").map(w => w[0].toUpperCase() + w.substring(1)).join(" ")}
            </h4> */}
                    {/*hide Priority when chosenPathway.name === "Extravasation" && decision === "LOCAL"*/}
                    { !(chosenPathway?.name === "Extravasation" && decision === "LOCAL") &&
                        <div className="mt-3 p-4 border">
                            <h5>Priority: <span style={{fontWeight: 'normal'}}>{decision}</span></h5>
                            {/* <h5>Suggested Action: <span style={{fontWeight: 'normal'}}>{endpoint?.Section1?.suggestedAction}</span></h5> */}
                        </div>
                    }

                <div className="mt-3 p-4 border">
                    <h4>{endpoint['Section1']?.title}</h4>
                    {endpoint['Section1']?.content == '{advice}' ? (
                        <p>{actionContent}</p>
                    ) : (
                        <div>{endpoint['Section1']?.content?.split('\n')?.map((i, ind) => {
                            //console.log("endpoint.constructor === Object",i)
                            return <p key={ind}>{i}</p>
                        })}</div>
                    )}
                    {endpoint['Section1'] && 'includeSwitchPhone' in endpoint['Section1'] &&
                    renderMobileSwitchboard()}
                    {endpoint['Section1'] && 'action' in endpoint['Section1'] && (
                        <h5>{endpoint['Section1']?.action?.question}<span className="text-danger">*</span></h5>
                    )}
                    {endpoint['Section1'] && 'action' in endpoint['Section1'] && (
                        <div
                            onChange={(e) => {
                                if (answer.includes(e.target.id)) {
                                    return;
                                }
                                if (
                                    'apiOption' in
                                    endpoint?.Section1?.action?.answers[e.target.value]
                                ) {
                                    let section = endpoint.Section1.action.answers[
                                        e.target.value
                                        ]
                                    let update = section.apiOption
                                    if ('callTimeline' in section.apiOption) {
                                        let timeline = section.apiOption.callTimeline.append
                                        if (timeline != undefined) {
                                            timeline.time = dayjs().format("DD/MM/YYYY HH:mm a")
                                        }
                                        update.callTimeline = [timeline]
                                    }

                                    setApiOptions(update);
                                }
                                setAnswer([e.target.id]);
                                setSections([
                                    endpoint[
                                        endpoint.Section1.action.answers[
                                            e.target.value
                                            ].section
                                        ],
                                ]);
                                setSectionNames([
                                    endpoint.Section1.action.answers[e.target.value]
                                        .section,
                                ]);
                            }}
                        >
                            {Object.keys(endpoint['Section1']?.action?.answers).map(
                                (item, index) => {
                                    return (
                                        <div
                                            className="mb-3 form-check"
                                            key={index}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="Section1"
                                                checked={console.log(this)}
                                                id={uniqueId()}
                                                value={item}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="exampleRadios2"
                                                id={item}
                                            >
                                                {item}
                                            </label>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>


                {endpoint['Section1'] && 'showLeaflets' in endpoint['Section1'] && endpoint.Section1.showLeaflets.includes('patient') && leaflets?.patientLeaflets != undefined && leaflets?.patientLeaflets?.length > 0 && (
                    <div className="mt-3 p-4 border">
                        <h4>Patient Leaflets</h4>
                        {leaflets?.patientLeaflets != undefined && leaflets?.patientLeaflets.map((item, index) => {

                            if (speciality.label == 'Ophthalmology') {

                                if (!selectedLeaflets.includes(item.id)) {
                                    setSelectedLeaflets([
                                        ...selectedLeaflets,
                                        item.id,
                                    ]);
                                }
                            }
                            return (
                                <div key={uniqueId()} className="mb-2">

                                    {speciality.label != 'Ophthalmology' ? (<>
                                        <input
                                            type="checkbox"
                                            className="form-check-input input-mini"
                                            name={item.id}
                                            checked={selectedLeaflets.includes(
                                                item.id
                                            )}
                                            //defaultChecked={false}
                                            onChange={(e) => {
                                                if (!currentEmail && e.target.checked) {
                                                    props.setPrint(true)
                                                    return;
                                                } else {

                                                    if (!selectedLeaflets.includes(item.id)) {
                                                        setSelectedLeaflets([
                                                            ...selectedLeaflets,
                                                            item.id,
                                                        ]);
                                                    } else {
                                                        setSelectedLeaflets((prevState) => {
                                                                console.log(prevState.filter((i) => i != item.id));
                                                                return prevState.filter((i) => i !== item.id);
                                                            }
                                                        );
                                                    }


                                                }
                                            }
                                            }
                                        />
                                    </>) : (<>
                                        <i style={{marginRight: '0.5vw'}} className="bx bx-book-open"></i>
                                    </>)}

                                    <a
                                        style={{marginLeft: "0.5vw"}}
                                        target="_blank"
                                        htmlFor={item.id}
                                        rel="noreferrer"
                                        href={item.s3Url}
                                    >
                                        {typeof item?.name == "undefined" ? item.Name : item.name}
                                    </a>

                                </div>
                            )
                        })}

                    </div>
                )}

                {endpoint['Section1'] && 'showLeaflets' in endpoint['Section1'] && endpoint.Section1.showLeaflets.includes('clinician') && leaflets?.clinicianLeaflets != undefined && leaflets?.clinicianLeaflets?.length > 0 && (
                    <div className="mt-3 p-4 border">
                        <h4>Clinician Leaflets</h4>
                        {leaflets?.clinicianLeaflets != undefined &&
                        leaflets?.clinicianLeaflets.map((item) => {
                            setClinicanLeaflets(item.id)

                            return (
                                <div key={item.id} className="mb-2">
                                    <i style={{marginRight: '0.5vw'}} className="bx bx-book-open"></i>
                                    <a
                                        target="_blank"
                                        htmlFor={item.id}
                                        rel="noreferrer"
                                        href={item?.s3Url}
                                    >
                                        {typeof item?.name == "undefined" ? item.Name : item.name}
                                    </a>

                                </div>
                            );
                        })}
                    </div>
                )}

                {sections != [] &&
                sections.map((item, index) => {
                    if ('action' in item) {
                        if ('type' in item.action && item.action.type == 'textarea') {
                            return (
                                <div
                                    className="mt-3 p-4 border"
                                    key={sectionNames[index]}
                                >
                                    <h4>{item.title}</h4>
                                    <div>{item.content.split('\n').map((i, ind) => {
                                        return <p key={ind}>{i}</p>
                                    })}</div>
                                    {'includeSwitchPhone' in item &&
                                    renderMobileSwitchboard()}
                                    {'includeSwitchboard' in item &&
                                    renderSwitchboard()}
                                    {/* map round answers and display the options. */}
                                    <h5>
                                        {item.action.question != 'undefined'
                                            ? <h5>{item.action.question}</h5>
                                            : ''}
                                    </h5>
                                    <div key={index} className="mt-3">
                                        <Input
                                            className='mb-3'
                                            type='textarea'
                                            onChange={(e) => {
                                                setApiOptions({
                                                    ...apiOptions,
                                                    [item.action.apiOption]: e.currentTarget.value
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div
                                className="mt-3 p-4 border"
                                key={sectionNames[index]}
                            >
                                <h4>{item.title}</h4>
                                <div>{item.content.split('\n').map((i, ind) => {
                                    return <p key={ind}>{i}</p>
                                })}</div>
                                {'includeSwitchPhone' in item &&
                                renderMobileSwitchboard()}
                                {'includeSwitchboard' in item &&
                                renderSwitchboard()}
                                {/* map round answers and display the options. */}
                                <h5>
                                    {item.action.question != 'undefined'
                                        ? <h5>{item.action.question}<span className="text-danger">*</span></h5>
                                        : ''}
                                </h5>
                                <div

                                >
                                    {Object.keys(item.action.answers).map(
                                        (it, ind) => {
                                            {
                                                console.log("asasas", it);
                                            }
                                            return (
                                                <div
                                                    className="mb-3 form-check"
                                                    key={ind}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name={
                                                            sectionNames[index]
                                                        }
                                                        id={uniqueId()}
                                                        value={it}
                                                        //checked={sectionNames.includes(item.action.answers[it].section)}
                                                        onClick={(e) => {
                                                            
                                                            debugger;
                                                            if (answer.includes(e.target.id)) {
                                                                return;
                                                            }
                                                            setAnswer([...answer, e.target.id]);
                                                            if (
                                                                'apiOption' in
                                                                item.action.answers[e.target.value]
                                                            ) {
                                                                let section = item.action.answers[e.target.value]
                                                                handleApiOptions(section)
                                                            }
                                                            let ret;
                                                            debugger;
                                                            Object.keys(item.action.answers).map((it, index) => {
                                                                if (sectionNames.includes(item.action.answers[it].section)) {
                                                                    let filteredArr = sections
                                                                    filteredArr.length = sections.indexOf(item) + 1
                                                                    setSections([
                                                                        ...filteredArr,
                                                                        endpoint[item.action.answers[e.target.value].section],
                                                                    ]);
                                                                    let filteredNames = sectionNames
                                                                    filteredNames.length = sectionNames.indexOf(item.action.answers[it].section) + 1
                                                                    setSectionNames([
                                                                        ...filteredNames,
                                                                        item.action.answers[e.target.value].section,
                                                                    ]);
                                                                    ret = true;
                                                                }
                                                            })
                                                            
                                                            if (!ret) {
                                                                setSections([
                                                                    ...sections,
                                                                    endpoint[
                                                                        item.action.answers[
                                                                            e.target.value
                                                                            ].section
                                                                        ],
                                                                ]);
                                                                setSectionNames([
                                                                    ...sectionNames,
                                                                    item.action.answers[
                                                                        e.target.value
                                                                        ].section,
                                                                ]);
                                                               
                                                            }



                                                            
                                                            if('alert' in item.action.answers[e.target.value]){
                                                                let message = item.action.answers[e.target.value].alert;
                                                                if(message.length) setunavailableRegistrarModal({
                                                                    message:message,
                                                                })
                                                            }
                                                           
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="exampleRadios2"
                                                        id={ind}
                                                    >
                                                        {it}
                                                    </label>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <>
                                <div key={index} className="mt-3 p-4 border">
                                    <h4>{item.title}</h4>
                                    <div>{item.content.split('\n').map((i, ind) => {
                                        return <p key={ind}>{i}</p>
                                    })}</div>
                                    {'includeSwitchPhone' in item &&
                                    renderMobileSwitchboard()}
                                </div>
                            </>
                        );
                    }
                })}
                {sections != [] &&
                sections.map((item, index) => {
                    if ('showLeaflets' in item) {
                        if (item.showLeaflets.includes('patient') && leaflets?.patientLeaflets != undefined && leaflets?.patientLeaflets?.length > 0) {
                            return (
                                <div className="mt-3 p-4 border">
                                    <h4>Patient Leaflets</h4>
                                    {leaflets?.patientLeaflets != undefined && leaflets?.patientLeaflets.map((item, index) => {
                                        return (
                                            <div key={uniqueId()}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name={item.id}
                                                    checked={selectedLeaflets.includes(
                                                        item.id
                                                    )}
                                                    //defaultChecked={false}
                                                    onChange={(e) => {
                                                        if (!currentEmail && e.target.checked) {
                                                            props.setPrint(true)
                                                            return;
                                                        } else {
                                                            if (e.target.checked) {
                                                                setSelectedLeaflets([
                                                                    ...selectedLeaflets,
                                                                    item.id,
                                                                ]);
                                                            } else {
                                                                setSelectedLeaflets(
                                                                    (prevState) => {
                                                                        console.log(
                                                                            prevState
                                                                        );
                                                                        return prevState.filter(
                                                                            (i) =>
                                                                                i !=
                                                                                item.id
                                                                        );
                                                                    }
                                                                );
                                                            }
                                                        }

                                                    }}
                                                />
                                                <a
                                                    style={{marginLeft: "0.5vw"}}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    href={item.s3Url}
                                                >
                                                    {typeof item?.name == "undefined" ? item.Name : item.name}
                                                </a>
                                            </div>
                                        )
                                    })}
                                </div>)
                        }
                    }
                })}
                {sections != [] &&
                sections.map((item, index) => {
                    if ('showLeaflets' in item) {
                        if (item.showLeaflets.includes('clinician') && leaflets?.clinicianLeaflets != undefined && leaflets?.clinicianLeaflets?.length > 0) {
                            return (
                                <div className="mt-3 p-4 border">
                                    <h4>Clinician Leaflets</h4>
                                    {leaflets?.clinicianLeaflets != undefined &&
                                    leaflets?.clinicianLeaflets.map((item) => {
                                        setClinicanLeaflets(item.id)
                                        return (
                                            <div key={item.id} className="mb-2">
                                                <i style={{marginRight: '0.5vw'}} className="bx bx-book-open"></i>
                                                <a
                                                    target="_blank"
                                                    htmlFor={item.id}
                                                    rel="noreferrer"
                                                    href={item.s3Url}
                                                >
                                                    {typeof item?.name == "undefined" ? item.Name : item.name}
                                                </a>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    }
                })}

                {/* {leaflets?.patientLeaflets?.length > 0 && (
                    <div className='mt-3 p-4 border'>
                        <h4>Patient Leaflets</h4>
                        {leaflets?.patientLeaflets?.map((item,index)=>{
                            return(
                                <div key={uniqueId()}>
                                <input 
                                    type="checkbox"
                                    className="form-check-input"
                                    name={item.id}
                                    checked={selectedLeaflets.includes(
                                        item.id
                                    )}
                                    //defaultChecked={false}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedLeaflets([
                                                ...selectedLeaflets,
                                                item.id,
                                            ]);
                                        } else {
                                            setSelectedLeaflets(
                                                (prevState) => {
                                                    console.log(
                                                        prevState
                                                    );
                                                    return prevState.filter(
                                                        (i) =>
                                                            i !=
                                                            item.id
                                                    );
                                                }
                                            );
                                        }
                                    }}
                                />
                                <a
                                style={{marginLeft: "0.5vw"}}
                                target="_blank"
                                rel="noreferrer"
                                href={item.s3Url}
                                >
                                {typeof item?.name == "undefined" ? item.Name : item.name}
                                </a>
                            </div>
                            )
                        })}
                    </div>
                )}

                {leaflets?.clinicianLeaflets?.length > 0 && (
                    <div className='mt-3 p-4 border'>
                        <h4>Clinician leaflets</h4>
                        {leaflets?.clinicianLeaflets?.map((item,index)=>{
                            return(
                                <div key={item.id} className="mb-2">
                                <i style={{marginRight: '0.5vw'}} className="bx bx-book-open"></i>
                                <a
                                target="_blank"
                                htmlFor={item.id}
                                rel="noreferrer"
                                href={item.s3Url}
                                >
                                {typeof item?.name == "undefined" ? item.Name : item.name}
                                </a>
                                    </div>
                            )
                        })}
                    </div>
                )}
     */}
                {/* <div className="p-4 border">
                    <h4>Patient Leaflets</h4>
                    {leaflets.patientLeaflets != undefined &&
                        leaflets.patientLeaflets.map((item) => {
                            return (
                                <p key={item.id}>
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href={item.s3Url}
                                    >
                                        {item.name}
                                    </a>
                                </p>
                            );
                        })}
                    <h4>Clinician Leaflets</h4>
                    {leaflets.clinicianLeaflets != undefined &&
                        leaflets.clinicianLeaflets.map((item) => {
                            return (
                                <p key={item.id}>
                                    <a href={item.s3Url}>{item.name}</a>
                                </p>
                            );
                        })}
                </div> */}
                <Modal
                    isOpen={showModal != false}
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
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {showModal.message + showModal.number ||
                        'Error getting mobile/switchboard: Please call 0121 333 9999'}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowModal(false)}
                        >
                            Ok
                        </button>
                    </div>
                </Modal>
                <Modal
                    isOpen={noLeafletModal}
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
                                setNoLeafletModal(false);
                            }}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div
                        className="modal-body">{"You haven't selcted any leaflets to send to the patient. Are you sure you want to continue?"}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                let APIOptions = null
                                if ('apiOption' in endpoint.Section1) {
                                    let keys = Object.keys(endpoint.Section1.apiOption)
                                    let update = {}
                                    keys.forEach(item => {
                                        update = {
                                            ...update,
                                            item
                                        }
                                    })
                                    setApiOptions({...apiOptions, update})
                                    APIOptions = {...apiOptions, update}
                                }
                                setClient(token);
                                dispatch(createReferralCreators.submitCaseAtEndpoint(caseDetails.caseID, APIOptions || apiOptions));
                                dispatch(createReferralCreators.resetState());
                                setNoLeafletModal(false)
                                // props.setModal(true)
                                props.openPdfModal()
                            }}
                        >
                            Skip & Continue
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setNoLeafletModal(false)
                            }}
                        >
                            Select Leaflet(s)
                        </button>
                    </div>
                </Modal>
                <Modal
                    isOpen={incompleteCaseModal}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h1 className="modal-title" id="staticBackdropLabel">
                            <i style={{color: 'red'}} className="fa fa-exclamation-triangle"></i> Important
                        </h1>
                    </div>
                    {/*<div className="modal-body">{"Please complete the case by clicking the submit/close button provided. Any incomplete cases will not be processed."}</div>*/}
                    <div className="modal-body font-size-20">{"You must click the submit/close button. Non submitted cases will not be processed."}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setIncompleteCaseModal(false)
                            }}
                        >
                            Understood
                        </button>
                    </div>
                </Modal>
                
                {/*registrar unavilable modal*/}
                <Modal
                    isOpen={unavailableRegistrarModal != false}
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
                            onClick={() => setunavailableRegistrarModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {unavailableRegistrarModal.message}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setunavailableRegistrarModal(false)}
                        >
                            Ok
                        </button>
                    </div>
                </Modal>



                Please click the submit/close button below to complete the data input.
            </div>
        );
    } else {
        return (
            <p>error</p>
        )
    }


};
Endpoint.propTypes = {
    questions: PropTypes.any,
    patient: PropTypes.any,
    disabled: PropTypes.any,
    nextButtonClicked: PropTypes.bool,
    setEndpointSaveClose: PropTypes.func,
    setModal: PropTypes.any,
    setPrint: PropTypes.any,
    openPdfModal: PropTypes.any,
    setSectionNames: PropTypes.func
};

export default Endpoint;
