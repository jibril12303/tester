import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    CardTitle,
    Form,
    FormGroup,
    Label,
    Row,
    Col,
    Input,
    Modal,
    Card,
    FormFeedback,
    UncontrolledTooltip,
    Button,
    Table
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import Select from 'react-select';
import Creatable from 'react-select/creatable'
import {
    createReferralTypes,
    createReferralCreators,
} from 'store/create-referral/reducer';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import find from 'lodash/find';
import { visualAcuity } from './VisualAcuityChildValues';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { showToast } from 'utils/toastnotify';
import OpthoImageUpload from './OpthoImgUpload';
import moment from 'moment'
import { useHistory } from "react-router-dom";
import ClinicalFeature from "./RheumatologyTables/clinicalFeature";
import TreatmentToDate from "./RheumatologyTables/treatmentToDate";
import InvestigationToDate from "./RheumatologyTables/investigationToDate"
import InvestigationToDate2 from "./RheumatologyTables/investigationToDate2"
import GiInvestigation from "./RheumatologyTables/giInvestigation"
import RenderReauScreens from './RheumatologyTables/renderScreens';
import DynamicAlertModal from "components/CreateReferral/Modal/DynamicAlertModal"
import VitalScreen from "./vitalScreen";

import DocumentUpload from './DocumentUpload';
import DynamicActionModal from "./Modals/DynamicActionModal";
import { renderClinicalField, renderInvestigateField, renderInvestigateField2, renderGiInvestigateField, renderTreatMentField, renderVitalsField }
    from "utils/rheuFunctions";

const Response = React.forwardRef((props, ref) => {
    if (props.disabled) return <p>loading</p>;
    let nextButtonCalled = props.nextButtonCalled;
    const history = useHistory()
    const {
        caseDetails,
        questions,
        loading,
        questionIndex,
        endpoint,
        submittedAnswers,
        selectedSpeciality,
        dateOfBirth,
        drugList,
        incompleteCase,
        questionID,
        pathwayName,
        lastResponse,
        userSpeciality,
        ReauNextId,
        loadingCalcQuestion,
        downloadRheuImages,
        questionAnswersCopy,
        rheuScreenPrefillStatus,
        localHospital
    } = useSelector((state) => ({
        caseDetails: state.CreateReferral.caseDetails,
        questions: state.CreateReferral?.questions,
        loading: state.CreateReferral?.loading,
        loadingCalcQuestion: state.CreateReferral?.loadingCalcQuestion,
        questionIndex: state.CreateReferral?.questionIndex,
        endpoint: state.CreateReferral?.endpoint,
        submittedAnswers: state.CreateReferral?.questionAnswers,
        selectedSpeciality: state.CreateReferral?.speciality?.value,
        dateOfBirth: state.CreateReferral?.caseDetails?.patient?.dateOfBirth,
        drugList: state.CreateReferral?.drugList,
        incompleteCase: state.CreateReferral.incompleteCase,
        questionID: state.CreateReferral?.questionID,
        pathwayName: state.CreateReferral?.selectedPathway.name,
        lastResponse: state.CreateReferral?.lastResponse,
        userSpeciality: state.appReducer?.userDetails?.speciality,
        ReauNextId: state.CreateReferral?.ReauNextId,
        downloadRheuImages: state.CreateReferral?.downloadRheuImages,
        questionAnswersCopy: state.CreateReferral?.questionAnswersCopy,
        rheuScreenPrefillStatus: state.CreateReferral?.rheuScreenPrefillStatus,
        localHospital: state.CreateReferral?.localHospital
    }));

    const { reauScreensIndex, reauScreens } = useSelector((state) => ({
        reauScreensIndex: state.CreateReferral.reauScreensIndex,
        reauScreens: state.CreateReferral.reauScreens
    }))
    console.log('selectedSpeciality', selectedSpeciality);

    function onDrop(acceptedFiles) {
        console.log('acceptedFiles', acceptedFiles);
        handleAcceptedFiles(acceptedFiles);
    }
    const [consents, setConsents] = useState([
        {
            consent: 'Assessment, treatment and referral',
            isOptional: false,
            checked: false,
        },
        {
            consent: 'Medical teaching and research',
            isOptional: true,
            checked: false,
        },
        // {
        //     consent: 'Research & development and medical publication',
        //     isOptional: true,
        //     checked: false,
        // },
    ]);

    const [noConsent, setNoConsent] = useState(false)


    const renderClinicalField = (field) => {
        const data = field.find((item => item.screenType == "rheuClini"))
        return data;
    }
    const renderInvestigateField = (field) => {
        const data = field.find((item => item.screenType == "rheuInves"))
        return data;
    }

    const renderInvestigateField2 = (field) => {
        const data = field.find((item => item.screenType == "rheuInves2"))
        return data;
    }

    const renderGiInvestigateField = (field) => {
        const data = field.find((item => item.screenType == "rheuInves3"))
        return data;
    }

    const renderTreatMentField = (field) => {
        const data = field.find((item => item.screenType == "rheuTreat"))
        return data;
    }
    const renderVitalsField = (field) => {
        const data = field.find((item => item.screenType == "rheuVital"))
        return data;
    }

    const onConsentChange = (e, item, index) => {
        const newConsent = [...consents];
        newConsent[index].checked = !newConsent[index].checked;
        setConsents(newConsent);
    };

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png, video/mp4',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showDelete, setDelete] = useState(false);
    const [showDynamicAlert, setShowDynamicAlert] = useState(false);
    const [showNoImgModal, setNoImgModal] = useState(false);
    const [imageDelete, setImageDelete] = useState(null);
    const [questionAnswers, setQuestionAnswers] = useState(
        submittedAnswers || []
    );
    const [hideCurrentQuestion, setHideCurrentQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState();
    const [textInput, setTextInput] = useState('');
    const [textLength, setTextLength] = useState(textInput?.length || 0);
    const [checkBox, setCheckBox] = useState([]);
    const [noneOfTheAbove, setNoneOfTheAbove] = useState();
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState();
    const [tempEndpoint, setEndpoint] = useState();
    const [url, setURL] = useState(null);
    const [actionAnswer, setActionAnswer] = useState({});
    const [visualAC, setVisualAC] = useState({
        cycloplegicRefrection: {
            fieldName: 'Cycloplegic refraction',
            RE: '',
            LE: ''
        },
        glassesIssued: {
            fieldName: 'Glasses issued',
            RE: '',
            LE: ''
        },
        sph: {
            fieldName: 'Sphere (Dioptres)',
            RE: "",
            LE: ""
        },
        cyl: {
            fieldName: 'Cylinder (Dioptres)',
            RE: "",
            LE: ""
        },
        axis: {
            fieldName: 'Axis (Degrees)',
            RE: "",
            LE: ""
        },
        prism: {
            fieldName: 'Prism (PD)',
            RE: "",
            LE: ""
        },
        unaidedVision: {
            fieldName: "Unaided vision",
            RE: "",
            LE: ""
        },
        aidedVision: {
            fieldName: "Aided vision",
            RE: "",
            LE: ""
        },
        ishiharaScore: {
            fieldName: "Ishihara score",
            RE: "",
            LE: ""
        },
        add: {
            fieldName: "Add (Dioptres)",
            RE: "",
            LE: ""
        }
    });
    const [datetime, setDatetime] = useState(null);
    const [dateError, setDateError] = useState(null);
    const [drug, setDrug] = useState(null);
    const [dropdown, setDropdown] = useState(null);
    const [drugModal, setDrugModal] = useState(false)
    const [vaModal, setVaModal] = useState();
    const [esrModal, setEsrModal] = useState();
    const [saveModal, setSaveModal] = useState();
    const [clinicalFeatureValues, setClinicalFeatureValues] = useState({});
    const [treatmentFeatureValues, setTreatmentFeatureValues] = useState({});
    const [investigateFeatureValues, setInvestigateFeatureValues] = useState({});
    const [secondInvestigateFeatureValues, setSecondInvestigateFeatureValues] = useState({});
    const [giInvestigateFeatureValues, setGiInvestigateFeatureValues] = useState({});
    const [vitalFieldValues, setVitalFieldValues] = useState({
        "Blood pressure": "",
        "Respiration rate": "",
        "Heart rate": "",
        "Body temparature": ""
    });

    useEffect(() => {
        console.log('clinicalFeatureValues', clinicalFeatureValues)
    }, [clinicalFeatureValues])
    console.log(props);
    const dispatch = useDispatch();
    //setVisualAC();
    console.log(selectedFiles, 'selectedFiles');
    const setValue = (e, key) => {
        // validator.hideMessages();
        if (e.currentTarget != null) {
            setVisualAC({
                ...visualAC,
                [key]: {
                    ...visualAC[key],
                    [e.currentTarget.name]: e.currentTarget.value,
                },
            });
        } else {
            setVisualAC({
                ...visualAC,
                [key]: {
                    ...visualAC[key],
                    [e.target.name]: e.target.value,
                },
            });
        }
        console.log('VISUAL AC:', visualAC);
    };
    const findQuestionBasedOnId = (id) =>
        find(questions, (obj) => {
            return obj.id == id;
        });
    const onCheckBox = (e, item, index) => {

        let newCheckbox = [...checkBox];
        if (newCheckbox.includes(e.target.value)) {
            newCheckbox = newCheckbox.filter((item) => item != e.target.value);
        } else {
            newCheckbox = [...checkBox, e.target.value];
        }
        if (newCheckbox.includes('None of above')) {
            newCheckbox = ['None of above']
        }
        setCheckBox(newCheckbox);


        console.log('lily', newCheckbox)

    };
    console.log(questionIndex);
    useEffect(() => {
        // debugger
        if (props.save) {
            if (currentQuestion.answers.type != "opthoimages" && currentQuestion.answers.type != "documents") setSaveModal(true)
        }
    }, [props.save])
    useEffect(() => {
        if (loading == false && questionIndex == null && questionID == null) {
            setQuestionAnswers([]);
            setCurrentQuestion(findQuestionBasedOnId('0'));
        }
        if (questionID != undefined) setCurrentQuestion(findQuestionBasedOnId(questionID))
        dispatch(createReferralCreators.setQuestionID(null))
    }, [loading]);
    useEffect(() => {
        // debugger;
        if (questionIndex == null && questionID == null) {
            try {
                if (questions[0].question === "Select your role") {
                    if (userSpeciality == "Ophthalmology" || userSpeciality == "Optometry") {
                        setCurrentQuestion(findQuestionBasedOnId(questions[0].answers['Optometrist'].next))
                        return;
                    } else {
                        setCurrentQuestion(findQuestionBasedOnId(questions[0].answers['GP'].next))
                        return;
                    }
                } else {
                    setCurrentQuestion(findQuestionBasedOnId('0'));
                    return
                }
            } catch (error) {
                setCurrentQuestion(findQuestionBasedOnId('0'));
                return
            }
            setCurrentQuestion(findQuestionBasedOnId('0'));
            return
        }

    }, [questions]);
    useEffect(() => {

        console.log("currentQuestion useEffect", currentQuestion)
        try {
            if ('action' in currentQuestion) {
                setAction(currentQuestion.action);
                if ('url' in currentQuestion) {
                    setURL(currentQuestion.url)
                }
                return setShowModal(true);
            }
        } catch (error) { }
        try {
            if ('action' in currentQuestion.answers) {
                setAction(currentQuestion.answers.action)
                dispatch(createReferralCreators.setAction(currentQuestion.answers.action));
                if ('url' in currentQuestion) {
                    setURL(currentQuestion.url)
                }
                return setShowModal(true)
            }
        } catch (error) { }
        try {
            if ('givenAnswer' in currentQuestion && currentQuestion?.givenAnswer != undefined) {
                if (currentQuestion.answers.type == "visual") {
                    return setVisualAC(currentQuestion.givenAnswer)
                }
                if (currentQuestion.answers.type == "images") {
                    setSelectedFiles(currentQuestion.givenAnswer.images)
                    //handleAcceptedFiles(currentQuestion.givenAnswer.images, true)
                    return;
                }
                if (currentQuestion.answers.type === "textinput" || currentQuestion.answers.type === "textarea") {
                    setTextInput(currentQuestion.givenAnswer);
                    setTextLength(currentQuestion.givenAnswer.length);
                    return;
                }
            }
        }
        catch (err) { }
        try {
            if ('givenAnswer' in lastResponse) {
                if (lastResponse.type == "visual") {
                    return setVisualAC(lastResponse.givenAnswer)
                }
                if (lastResponse.type == "images") {
                    //setSelectedFiles()
                    handleAcceptedFiles(lastResponse.givenAnswer.images, true)
                    return;
                }
            }
        }
        catch (err) { }

        // for rheu screen values retain 
        debugger;

        const findQuestionFromSummaryCopy = (id) => {
            console.log(questionAnswersCopy)
            find(questionAnswersCopy, (obj) => {
                return obj?.questionID == id || obj?.currentQuestion?.id == id;
            });
        }
        const currentQuestionFromSummaryCopy = findQuestionFromSummaryCopy(currentQuestion?.id)
        console.log("currentQuestionFromSummaryCopy", currentQuestionFromSummaryCopy, currentQuestion?.id, questionAnswersCopy)
        debugger;
        const answerCopy = currentQuestionFromSummaryCopy?.answer ?? lastResponse?.answer
        const CIDType = currentQuestion?.CID ?? lastResponse?.currentQuestion?.CID;

        if (rheuScreenPrefillStatus[CIDType] == false && questionAnswersCopy.length > 0) {
            if (currentQuestionFromSummaryCopy?.answer && currentQuestion?.CID) {
                prefillQuestionAnswers(currentQuestionFromSummaryCopy.answerCopy, currentQuestion.CID)
            } else if (lastResponse?.answer && lastResponse?.currentQuestion?.CID) {
                prefillQuestionAnswers(lastResponse.answer, lastResponse.currentQuestion.CID)
            }
        }
        if (currentQuestion?.calculation === true || currentQuestion?.answers?.calculation === true) {
            dispatch(createReferralCreators.requestReauNextId(pathwayName, caseDetails?.caseID, currentQuestion?.id, submittedAnswers));
        }



    }, [currentQuestion]);
    useEffect(() => {
        console.log(nextButtonCalled);
        console.log(textInput);
        //console.log(questions[questionIndex]);
        // debugger;

        if (nextButtonCalled) {
            if (["opthoimages", "documents", "rheuInves", "rheuInves2", "rheuInves3", "rheuClini"].includes(currentQuestion.answers.type)) {
                return nextButtonCalled = false
            }
            try {
                let reg = currentQuestion.answers.regex;
                reg = reg.slice(1, -1);
                console.log(reg);
                let re = new RegExp(reg).test(textInput);
                console.log(re);
                if (!currentQuestion.answers.isOptional) {
                    if (textInput === null || textInput.match(/^ *$/) != null) {
                        showToast(
                            'Please fill in the mandatory field(s)',
                            'error'
                        );
                        return (nextButtonCalled = false);
                    } else if (!re) {
                        // showToast('Please correctly fill out the field(s)', 'error')
                        return (nextButtonCalled = false);
                    }
                } else {
                    if (textInput.match(/^ *$/) == null) {
                        if (!re) {
                            // showToast('Please fill in the mandatory field(s)', 'error')
                            return (nextButtonCalled = false);
                        }
                    }
                }
                if (
                    currentQuestion?.answers?.type.toLowerCase() ==
                    'textarea' &&
                    textLength > 512
                ) {
                    return (nextButtonCalled = false);
                }
            } catch (e) { }
            if (
                currentQuestion?.answers?.type.toLowerCase() == 'drugdropdown'
            ) {
                if (drug == null) {
                    return;
                } else {
                    if (drug?.__isNew__) {
                        dispatch(createReferralCreators.sendUnknownDrugEmail(drug.value))
                    }
                    onClick({
                        answer: drug.value,
                        next:
                            currentQuestion.answers.next[drug.ragStatus] ||
                            currentQuestion.answers.next.default,
                    });
                    // onClick({
                    //     answer:drugName.ragStatus,
                    //     next: currentQuestion.answers[drugName.ragStatus].next
                    // })
                }
            }
            // if (currentQuestion?.answers?.type.toLowerCase() == '') {

            // }
            if (currentQuestion?.answers?.type.toLowerCase() == 'dropdown') {
                if (dropdown == null) {
                    return;
                } else {
                    onClick({
                        answer: dropdown.value,
                        next: currentQuestion.answers[dropdown.value].next,
                    });
                    setDropdown(null);
                }
            }
            if (currentQuestion?.answers?.type.toLowerCase() == 'datetimecalc') {
                if (datetime == null) {
                    showToast('You must enter a valid date and time', 'error');
                    setDateError('Please fill out a valid date');
                    return (nextButtonCalled = false);
                }
                let date = new Date(datetime);
                if (date instanceof Date && !isNaN(date.valueOf())) {
                    if (date < new Date(dateOfBirth)) {
                        setDateError(
                            'The date entererd must not be before the patient was born'
                        );
                        return (nextButtonCalled = false);
                    }
                    if (date < new Date()) {
                        if (currentQuestion?.answers?.endpoint != undefined) {
                            onClick({
                                answer: date,
                                endpoint: currentQuestion.answers.endpoint,
                            });
                            setDatetime(null);
                            return (nextButtonCalled = false);
                        } else {
                            onClick({
                                answer: date,
                                next: currentQuestion.answers.next[moment().diff(moment(date), 'hours') < 24 ? "<24" : ">24"],
                            });
                            setDatetime(null);
                            return (nextButtonCalled = false);
                        }
                    } else {
                        setDateError(
                            'The date entererd must not be in the future'
                        );
                        return (nextButtonCalled = false);
                    }
                } else {
                    showToast('You must enter a valid date and time', 'error');
                    setDateError('Please fill out a valid date');
                    return (nextButtonCalled = false);
                }
            }
            if (currentQuestion?.answers?.type.toLowerCase() == 'datetime') {
                if (datetime == null) {
                    showToast('You must enter a valid date and time', 'error');
                    setDateError('Please fill out a valid date');
                    return (nextButtonCalled = false);
                }
                let date = new Date(datetime);
                if (date instanceof Date && !isNaN(date.valueOf())) {
                    if (date < new Date(dateOfBirth)) {
                        setDateError(
                            'The date entererd must not be before the patient was born'
                        );
                        return (nextButtonCalled = false);
                    }
                    if (date < new Date()) {
                        if (currentQuestion?.answers?.endpoint != undefined) {
                            onClick({
                                answer: date,
                                endpoint: currentQuestion.answers.endpoint,
                            });
                            setDatetime(null);
                            return (nextButtonCalled = false);
                        } else {
                            onClick({
                                answer: date,
                                next: currentQuestion.answers.next,
                            });
                            setDatetime(null);
                            return (nextButtonCalled = false);
                        }
                    } else {
                        setDateError(
                            'The date entererd must not be in the future'
                        );
                        return (nextButtonCalled = false);
                    }
                } else {
                    showToast('You must enter a valid date and time', 'error');
                    setDateError('Please fill out a valid date');
                    return (nextButtonCalled = false);
                }
            }
            if (currentQuestion.answers.type.toLowerCase() == 'images') {
                if (!noConsent && !consents[0].checked) {
                    showToast(
                        'You must selected the mandatory fields before continuing',
                        'error'
                    );
                    return;
                }
                if (selectedFiles.length == 0 && !noConsent) {
                    return setNoImgModal(true);
                }
                if (currentQuestion?.answers?.endpoint != undefined) {
                    onClick({
                        answer: { consents: consents, images: selectedFiles },
                        endpoint: currentQuestion.answers.endpoint,
                    });
                    return (nextButtonCalled = false);
                } else {
                    onClick({
                        answer: { consents: consents, images: selectedFiles },
                        next: currentQuestion.answers.next,
                    });
                    return (nextButtonCalled = false);
                }
            }
            if (currentQuestion.answers.type.toLowerCase() == 'radio')
                return (nextButtonCalled = false);
            if (currentQuestion.answers.endpoint != undefined) {
                onClick({
                    answer: textInput,
                    endpoint: currentQuestion.answers.endpoint,
                });
                props.onSubmit();
            } else if (currentQuestion.answers.type.toLowerCase() == 'visual') {
                if (Object.values(visualAC).every(x => ((x.RE == "" || x.RE == false) && (x.LE == "" || x.LE == false)))) {
                    setVaModal(true)
                    return (nextButtonCalled = false);
                }
                onClick({
                    answer: visualAC,
                    next: currentQuestion.answers.next,
                });
            } else if (
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
            ) {
                if (!currentQuestion.answers?.isOptional && checkBox.length < 1) {
                    showToast('Please select at least one option.', 'error')
                } else {
                    onClick({
                        answer: checkBox,
                        next: currentQuestion.answers.next,
                    });
                }

                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
                currentQuestion.answers.type.toLowerCase() == 'checkbox'
            }
            // else if(currentQuestion?.answers?.type?.toLowerCase() == 'rheuclini'){
            //     //first table to render

            //     const validateClinicalFields = ()=>{

            //         let error = false;

            //         Object.keys(clinicalFeatureValues).map((objName)=>{

            //             if(clinicalFeatureValues[objName].present === "null"){
            //                 error = true;
            //             }
            //             else if(clinicalFeatureValues[objName].present == "yes"){
            //                 if(clinicalFeatureValues[objName].dateOnset.length <=0){
            //                     error = true;
            //                 }
            //             }
            //         })
            //         return error;
            //         }
            //     const validateClinic = validateClinicalFields();
            //         if(validateClinic){
            //             showToast("Please select all the fields",'error');
            //         }else{
            //             onClick({
            //                 answer: clinicalFeatureValues,
            //                 endpoint: currentQuestion.answers.endpoint,
            //             });
            //         }
            // }
            // else if(currentQuestion.answers.type.toLowerCase() == 'rheuvital'){
            //     const validateVitalFields = ()=>{
            //         let error = false;
            //         Object.keys(vitalFieldValues).map((objName)=>{
            //             if(vitalFieldValues[objName].length<=0){
            //                 error = true;
            //             }
            //         })
            //         return error;
            //         }
            //     const validateVitals = validateVitalFields();
            //     if(validateVitals){
            //         showToast("Please fill all fields Values",'error');
            //     }else{
            //         onClick({
            //             answer: vitalFieldValues,
            //             endpoint: currentQuestion.answers.endpoint,
            //         });
            //     }
            // }
            else {
                if (
                    (!/\S/.test(textInput) || textInput == '') &&
                    !currentQuestion.answers.isOptional
                )
                    return (nextButtonCalled = false);
                if (
                    (!/\S/.test(textInput) || textInput == '') &&
                    typeof currentQuestion.answers?.isOptional == 'undefined'
                )
                    return (nextButtonCalled = false);
                onClick({
                    answer: textInput,
                    next: currentQuestion.answers.next,
                });
            }
            setTextInput('');
            setTextLength(0);
            nextButtonCalled = false;
        }
    }, [nextButtonCalled]);

    useEffect(() => {
        console.log('postCodey')
        if (currentQuestion?.answers?.type == 'postCodeFinder') {
            dispatch(createReferralCreators.findLocalHospital(pathwayName, caseDetails?.caseID, currentQuestion?.id, submittedAnswers))

        }





    }, [currentQuestion]);





    console.log('CURRENT QUESTION:', currentQuestion);
    //onClick handles the nextButton being clicked and the current question being hanlded and next question/or endpoint being shown.
    const onClick = ({ event, answer, next, endpoint }) => {
        console.log(next);
        console.log(endpoint);
        console.log(answer);
        let submittedAnswer;
        let nextQuestionIndex;
        let action;
        let leaflets;
        if (typeof answer == 'undefined') {
            submittedAnswer = event?.target?.value;
        } else {
            submittedAnswer = answer;
        }
        console.log(currentQuestion);

        try {
            action =
                currentQuestion['answers'][submittedAnswer || answer]['action'];
        } catch (error) { }
        try {
            currentQuestion.answers[submittedAnswer].leaflets.map((item, ind) => {
                dispatch(createReferralCreators.addLeaflet(item))
            })
            //dispatch(createReferralCreators.addLeaflet(leaflets))
        } catch (e) { }
        try {
            currentQuestion.answers.leaflets.map((item, index) => {
                dispatch(createReferralCreators.addLeaflet(item))
            })
        } catch (e) { }
        try {
            currentQuestion.answers[submittedAnswer].leaflets.map((item, index) => {
                dispatch(createReferralCreators.addLeaflet(item))
            })
        } catch (e) { }
        if (typeof endpoint == 'undefined') {
            try {
                endpoint =
                    currentQuestion['answers'][submittedAnswer || answer][
                    'endpoint'
                    ];
            } catch (error) { }
            try {
                endpoint = currentQuestion.answers.endpoint
            } catch (e) { }
            try {
                endpoint = currentQuestion.answers[submittedAnswer || answer].endpoint
            } catch (e) { }

            if (typeof next != 'undefined') {
                nextQuestionIndex = next;
            } else {
                try {
                    nextQuestionIndex = currentQuestion.answers.next;
                    if (nextQuestionIndex == undefined) {
                        nextQuestionIndex =
                            currentQuestion['answers'][
                            submittedAnswer || answer
                            ]['next'];
                        console.log(nextQuestionIndex);
                    }
                } catch (error) {
                    console.warn(error);
                }
            }
        }



        let newQuestionAnswers = [];
        // hides the question from summary if hideFromSummary flag is true
        debugger;
        if (currentQuestion?.hideFromSummary != true) {
            newQuestionAnswers = [
                ...questionAnswers,
                {
                    question: currentQuestion.question,
                    answer,
                    currentQuestion,
                },
            ];
            setQuestionAnswers(newQuestionAnswers);
        }


        if (action && endpoint) {
            dispatch(createReferralCreators.setAction(action));
            if (currentQuestion['answers'][submittedAnswer || answer]) setActionAnswer(currentQuestion['answers'][submittedAnswer || answer])
            setAction(action);
            if ('url' in currentQuestion) {
                setURL(currentQuestion.url)
            }
            // setHideCurrentQuestion(true);
            setEndpoint(endpoint)
            setShowModal(true);
            return;
        }

        if (action && !endpoint) {
            dispatch(createReferralCreators.setAction(action));
            if (currentQuestion['answers'][submittedAnswer || answer]) setActionAnswer(currentQuestion['answers'][submittedAnswer || answer])
            setAction(action);
            if ('url' in currentQuestion) {
                setURL(currentQuestion.url)
            }
            setShowModal(true);
        }
        if (endpoint && !action) {
            dispatch(
                createReferralCreators.setDecisionAndQuestionAnswers(
                    endpoint,
                    currentQuestion?.hideFromSummary != true ? newQuestionAnswers : questionAnswers
                )
            );
            dispatch(createReferralCreators.setTabIndex('5'));
            return console.log('endpoint=', endpoint);
        }
        console.log("newQuestionAnswers", newQuestionAnswers);
        console.log("current que in onClick method", currentQuestion)
        // if(currentQuestion?.calculation === true){
        //     //logic for calling calc API and bring back the next question id
        //     console.log("calcAPI");// console.log(questions.pathway, findQuestionBasedOnId(next), next)
        //     dispatch(createReferralCreators.setQuestionAnswers(newQuestionAnswers));
        //     dispatch(createReferralCreators.requestReauNextId(pathwayName,caseDetails?.caseID,currentQuestion?.id,newQuestionAnswers));
        // }


        // if(nextQuestion?.calculation === true){
        //     dispatch(createReferralCreators.setQuestionAnswers(newQuestionAnswers));
        //     dispatch(createReferralCreators.requestReauNextId(pathwayName,caseDetails?.caseID,nextQuestion?.id,newQuestionAnswers));
        // }else{
        //     console.log('nnext qu', nextQuestionIndex);
        setCurrentQuestion(findQuestionBasedOnId(nextQuestionIndex));
        // debugger;
        if (currentQuestion?.hideFromSummary != true) dispatch(createReferralCreators.setQuestionAnswers(newQuestionAnswers));
        // }        
        console.log('QUESTION ANSWERS:', questionAnswers);
    };


    const onClickScreen = () => {

        let nextQuestionIndex;
        try {
            nextQuestionIndex = currentQuestion.answers.next;

            nextQuestionIndex =
                currentQuestion['answers']['next'];
            console.log(nextQuestionIndex);

        } catch (error) {
            console.warn(error);
        }

        setCurrentQuestion(findQuestionBasedOnId(nextQuestionIndex));
    }
    const onClickNext = ({ answer, next, endpoint }) => {
        let submittedAnswer;
        let nextQuestionIndex;
        let action;

        const currentQue = findQuestionBasedOnId(currentQuestion['answers']['next']);

        submittedAnswer = answer;
        try {
            action =
                currentQuestion['answers'][submittedAnswer || answer]['action'];
        } catch (error) { }
        if (typeof next != 'undefined') {
            nextQuestionIndex = next;
        } else {
            try {
                nextQuestionIndex = currentQuestion.answers.next;
                if (nextQuestionIndex == undefined) {
                    nextQuestionIndex =
                        currentQuestion['answers'][
                        submittedAnswer || answer
                        ]['next'];
                    console.log(nextQuestionIndex);
                }
            } catch (error) {
                console.warn(error);
            }
        }

        if (typeof endpoint == 'undefined') {
            try {
                endpoint =
                    currentQue['answers'][submittedAnswer || answer][
                    'endpoint'
                    ];
            } catch (error) { }
            try {
                endpoint = currentQue.answers.endpoint
            } catch (e) { }
            try {
                endpoint = currentQue.answers[submittedAnswer || answer].endpoint
            } catch (e) { }

            if (typeof next != 'undefined') {
                nextQuestionIndex = next;
            } else {
                try {
                    nextQuestionIndex = currentQuestion.answers.next;
                    if (nextQuestionIndex == undefined) {
                        nextQuestionIndex =
                            currentQuestion['answers'][
                            submittedAnswer || answer
                            ]['next'];
                        console.log(nextQuestionIndex);
                    }
                } catch (error) {
                    console.warn(error);
                }
            }
        }

        const nextQuestion = findQuestionBasedOnId(nextQuestionIndex);
        const newQuestionAnswers = [
            ...questionAnswers,
            {
                question: currentQue.question,
                answer,
                currentQuestion: currentQue,
            },
        ];

        setQuestionAnswers(newQuestionAnswers);
        if (action) {
            //make state for flags for that action            
            dispatch(createReferralCreators.setAction(action));
            setAction(action);
            if ('url' in nextQuestion) {
                setURL(nextQuestion.url)
            }
            setShowModal(true);
        }
        if (endpoint) {
            dispatch(
                createReferralCreators.setDecisionAndQuestionAnswers(
                    endpoint,
                    newQuestionAnswers
                )
            );
            dispatch(createReferralCreators.setTabIndex('5'));
            return console.log('endpoint=', endpoint);
        }
        dispatch(createReferralCreators.setQuestionAnswers(newQuestionAnswers));
        setCurrentQuestion(findQuestionBasedOnId(nextQuestionIndex));

    }

    const handleAcceptedFiles = (files, clearOld = false) => {
        console.log('files', files);
        files.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
                mimeType: file.type
            })
        );
        if (clearOld) {
            setSelectedFiles([...files]);
        } else {
            setSelectedFiles([...selectedFiles, ...files]);
        }
    };
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };


    const findBackwardCalcQuestions = (question) => {
        let count = 0;
        for (let i = question.length - 1; i >= 0; i--) {
            if (question[i]?.currentQuestion?.calculation === true) {
                count++;
            }
            else {
                break;
            }
        }
        return count;
    }

    const prefillQuestionAnswers = (givenAnswer, QuestionCIDType) => {
        switch (QuestionCIDType) {
            case 'CLINTREAT':
            case 'rheuTreat':
                setTreatmentFeatureValues(givenAnswer);
                dispatch(createReferralCreators.updateRheuScreenPrefillStatus({ 'CLINTREAT': true }))
                break;
            case 'CLININVES':
            case 'rheuInves':
                setInvestigateFeatureValues(givenAnswer);
                dispatch(createReferralCreators.updateRheuScreenPrefillStatus({ 'CLININVES': true }))
                break;
            case 'CLININVES2':
            case 'rheuInves2':
                // prefill the data when this question loads and adds images into the fields 
                // if(Object.keys(downloadRheuImages).length > 0 && Object.keys(downloadRheuImages).includes('rheuInves2')){
                //     const {rheuInves2:imageFields} = downloadRheuImages;
                //     Object.keys(imageFields).forEach((fieldName)=>{
                //         const currentFieldImages = imageFields[fieldName]
                //         if('images' in givenAnswer[fieldName]){
                //             givenAnswer[fieldName]['file'] = currentFieldImages
                //             delete givenAnswer[fieldName]['images'];
                //         }
                //     })
                //     dispatch(createReferralCreators.successPrefillRheu2Images())
                // }
                dispatch(createReferralCreators.successPrefillRheu2Images())
                setSecondInvestigateFeatureValues(givenAnswer);
                dispatch(createReferralCreators.updateRheuScreenPrefillStatus({ 'CLININVES2': true }))


                break;
            case 'CLININVES3':
            case 'rheuInves3':
                // prefill the data when this question loads and adds images into the fields 
                // if(Object.keys(downloadRheuImages).length > 0 && Object.keys(downloadRheuImages).includes('rheuInves3')){
                //     const {rheuInves3:imageFields} = downloadRheuImages;
                //     Object.keys(imageFields).forEach((fieldName)=>{
                //         const currentFieldImages = imageFields[fieldName]
                //         if('images' in givenAnswer[fieldName]){
                //             givenAnswer[fieldName]['file'] = currentFieldImages
                //             delete givenAnswer[fieldName]['images'];
                //         }
                //     })
                //     dispatch(createReferralCreators.successPrefillRheu3Images())
                // }
                dispatch(createReferralCreators.successPrefillRheu3Images())
                setGiInvestigateFeatureValues(givenAnswer);
                dispatch(createReferralCreators.updateRheuScreenPrefillStatus({ 'CLININVES3': true }))

                break;
            case 'CLINFEAT':
            case 'rheuClini':
                setClinicalFeatureValues(givenAnswer);
                dispatch(createReferralCreators.updateRheuScreenPrefillStatus({ 'CLINFEAT': true }))
                break;
            case 'VITALSIG':
            case 'rheuVital':
                setVitalFieldValues(givenAnswer);
                dispatch(createReferralCreators.updateRheuScreenPrefillStatus({ 'VITALSIG': true }))
                break;
            //add for vitals also
            case 'BPCALC':
                // alert(givenAnswer)
                setTextInput(givenAnswer)
                dispatch(createReferralCreators.updateRheuScreenPrefillStatus({ 'BPCALC': true }))
                break;
        }
    }


    // handles editing questions when jump from summary to particular question 
    useEffect(() => {
        debugger;
        if (questionIndex != null && !incompleteCase) {
            let selectedQuestionToEdit =
                questionAnswers[questionIndex] ||
                submittedAnswers[questionIndex];

            let newQuestionAnswers = [...questionAnswers] || [
                ...submittedAnswers,
            ];

            if (selectedQuestionToEdit?.currentQuestion?.calculation === true) {
                let index = findBackwardCalcQuestions(newQuestionAnswers);
                newQuestionAnswers.splice(questionIndex - index);
                selectedQuestionToEdit =
                    questionAnswers[questionIndex - index] ||
                    submittedAnswers[questionIndex - index];
            }
            else {
                newQuestionAnswers.splice(questionIndex);
            }
            setConsents([
                {
                    consent: 'Assessment, treatment and referral',
                    isOptional: false,
                    checked: false,
                },
                {
                    consent: 'Medical teaching and research',
                    isOptional: true,
                    checked: false,
                },
                // {
                //     consent: 'Research & development and medical publication',
                //     isOptional: true,
                //     checked: false,
                // },
            ]);

            console.log('QQQQQQQQQQ', selectedQuestionToEdit);
            setQuestionAnswers(newQuestionAnswers);
            dispatch(
                createReferralCreators.setQuestionAnswers(newQuestionAnswers)
            );
            console.log('QQQQQQQQQA', newQuestionAnswers);
            let id;
            try {
                id = selectedQuestionToEdit.currentQuestion.id;
            } catch (error) {
                id = selectedQuestionToEdit.questionID;
            }
            // if(selectedQuestionToEdit?.type == "images" || selectedQuestionToEdit?.currentQuestion?.answers?.type == "images"){
            //     setSelectedFiles(selectedQuestionToEdit?.answer?.images)
            // }

            let QuestionCIDType = selectedQuestionToEdit?.currentQuestion?.CID || selectedQuestionToEdit.type;
            //setting answers in screens
            // if(QuestionCIDType != undefined && ( QuestionCIDType == 'CLINTREAT' || QuestionCIDType == 'CLININVES' ||QuestionCIDType == 'CLINFEAT'))
            debugger;

            if (QuestionCIDType != undefined) {
                let givenAnswer = selectedQuestionToEdit.givenAnswer || selectedQuestionToEdit.answer;
                if (givenAnswer != null && givenAnswer != undefined) {
                    prefillQuestionAnswers(givenAnswer, QuestionCIDType);
                }
            }
            setCurrentQuestion({
                ...findQuestionBasedOnId(id),
                givenAnswer: selectedQuestionToEdit.givenAnswer || selectedQuestionToEdit.answer,
            });
            dispatch(createReferralCreators.setEditQuestionIndex(null));
        }
        // else if(questionIndex != null && !incompleteCase){
        //     // prefill rheuScreen data

        //     let selectedQuestionToEdit =
        //     questionAnswers[questionIndex] ||
        //     submittedAnswers[questionIndex];

        //     let newQuestionAnswers = [...questionAnswers] || [
        //         ...submittedAnswers,
        //     ];

        // }
        console.log("questionIndex called")
    }, [questionIndex]);

    //  assign next question when got respnse from calc API(for rheaumatology)
    useEffect(() => {
        let nextQueIndex;
        let nextQuestion;
        try {
            nextQueIndex = currentQuestion?.answers?.next;
        }
        catch (error) { }
        try {
            nextQuestion = findQuestionBasedOnId(nextQueIndex);
        }
        catch (error) { }


        if (ReauNextId && currentQuestion?.calculation === true) {
            console.log("ReauNextId", ReauNextId);
            if (ReauNextId != null) {
                if (ReauNextId.hasOwnProperty("action")) {
                    if (ReauNextId?.action?.includes("Alert")) {
                        //show modal and use onClick method to continue with understood button
                        setShowDynamicAlert(true);
                    } else if (ReauNextId.hasOwnProperty("EUUID") || ReauNextId.hasOwnProperty("priority")) {
                        //summary already submitted when this response came,store this two prop and go to next screen
                        onClick('', ReauNextId.answer, null, ReauNextId)
                        dispatch(
                            createReferralCreators.setDecisionAndQuestionAnswers(
                                ReauNextId,
                                submittedAnswers
                            )
                        );
                        dispatch(createReferralCreators.setTabIndex('5'));
                    }
                }
                else {
                    onClick({ answer: ReauNextId?.answer, next: ReauNextId?.next })
                }
                //store the answer you get in the current answer
                // setCurrentQuestion(findQuestionBasedOnId(ReauNextId));

            }
        }
    }, [ReauNextId])

    useEffect(() => {
        if (currentQuestion?.answers?.type == "postCodeFinder" && localHospital != null) {
            console.log('paprika')

            if (localHospital?.localHospital == true && localHospital?.answer != true ) {
                showToast('Your local hospital was not found in our database', 'danger')
                dispatch(createReferralCreators.setTabIndex('2'));



            }

            else {

                if (localHospital.hasOwnProperty("EUUID") || localHospital.hasOwnProperty("priority")) {
                    //summary already submitted when this response came,store this two prop and go to next screen
                    onClick('', localHospital.answer, null, localHospital)
                    dispatch(
                        createReferralCreators.setDecisionAndQuestionAnswers(
                            localHospital,
                            submittedAnswers
                        )
                    );
                    dispatch(createReferralCreators.setTabIndex('5'));
                }


                else {
                    console.log('else path', localHospital)
                    onClick({ answer: localHospital?.answer, next: localHospital?.next })
                }
                //store the answer you get in the current answer
                // setCurrentQuestion(findQuestionBasedOnId(ReauNextId));

            }
        };
    }, [localHospital]);

    const generateEsrMessage = () => {
        let esr = investigateFeatureValues?.["esr"]?.value;
        let crp = investigateFeatureValues?.["crp"]?.value;
        let message = `You have indicated that the child's CRP ${crp} ; ESR ${esr}. Please check the values are correct before proceeding.`

        return message;
    }

    function renderBaseOnType(question) {
        console.log(question);
        try {
            switch (question.answers.type.toLowerCase()) {
                case 'radio':
                    console.log(question.answers);
                    let answers = Object.keys(question.answers);
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question.split("\n").map((it, ind) => {
                                    if (ind == 0 && question?.url != undefined) {
                                        return (
                                            <div className='mb-1' key={ind}>
                                                {it} <a rel="noreferrer" target="_blank" href={question.url} id="help">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-label"
                                                    >
                                                        <i className="bx bxs-file-pdf label-icon"></i> {'urlName' in question ? question.urlName : 'More info'}
                                                    </button>
                                                </a>
                                                <UncontrolledTooltip target="help">
                                                    Click for more information
                                                </UncontrolledTooltip>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div className='mb-1' key={ind}>{it}</div>
                                    )
                                })}
                            </div>
                            {answers.map((item, index) => {
                                if (index == 0) return;
                                console.log(item);
                                return (
                                    <div
                                        className="mb-3 form-check"
                                        key={index}
                                    >
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={answers[index]}
                                            checked={false}
                                            id={index}
                                            value={item}
                                            onClick={(e) => {
                                                console.log('CALLED');
                                                onClick({
                                                    event: e,
                                                    answer: e.currentTarget
                                                        .value,
                                                });
                                            }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="exampleRadios2"
                                            id={index}
                                        >
                                            {answers[index]}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    );
                case 'textinput':
                    let bool = true;
                    if (typeof question.answers.isOptional == "boolean") {
                        bool = !question.answers.isOptional
                    }
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question}{' '}
                                {question.answers.isOptional ? (
                                    ''
                                ) : (
                                    <span className="text-danger">*</span>
                                )}
                            </div>

                            <form id={question.id}>
                                <AvForm>
                                    <AvField
                                        className="form-control"
                                        id={question.id}
                                        name={question.id}
                                        style={{
                                            textTransform:
                                                question.question ==
                                                    'Duty consultant name'
                                                    ? 'capitalize'
                                                    : 'none',
                                        }}
                                        maxlength={question?.answers?.maxLength}
                                        placeholder={
                                            question.answers.placeholder
                                        }
                                        type={
                                            question.answers.isOnlyNumber
                                                ? 'number'
                                                : 'text'
                                        }
                                        validate={{
                                            required: {
                                                value: bool,
                                                errorMessage: "This field is required"
                                            },
                                            pattern: {
                                                value:
                                                    question.answers.regex ||
                                                    '/[a-zA-Z0-9]*/',
                                                errorMessage:
                                                    question.answers
                                                        .validationMessage,
                                            },
                                        }}
                                        value={textInput}
                                        onChange={(e) => {
                                            if (
                                                question?.question ==
                                                'Duty consultant name'
                                            ) {
                                                setTextInput(
                                                    _.capitalize(
                                                        e.currentTarget.value
                                                    )
                                                );
                                            } else {
                                                setTextInput(
                                                    e.currentTarget.value
                                                );
                                            }
                                        }}
                                    />
                                </AvForm>
                            </form>
                        </div>
                    );
                case 'visual':
                    let examinations = Object.keys(visualAcuity)
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question.split("\n").map(i => {
                                    return i
                                })} {question.answers.isOptional ? "" : <span className="text-danger">*</span>}
                            </div>
                            <Row>
                                <Col lg="6">
                                    <div className="form-check form-switch form-switch-lg mb-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="customSwitchsizelg"
                                            checked={visualAC.cycloplegicRefrection.RE}
                                            onClick={(e) => {
                                                setVisualAC({
                                                    ...visualAC,
                                                    cycloplegicRefrection: {
                                                        fieldName: 'Cycloplegic refraction',
                                                        RE: e.target.checked,
                                                        LE: e.target.checked
                                                    }
                                                })
                                            }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="customSwitchsizelg"
                                        >
                                            Cycloplegic refraction
                                        </label>
                                    </div>
                                </Col>
                                <Col lg="6">
                                    <div className="form-check form-switch form-switch-lg mb-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="glasssswitch"
                                            checked={visualAC.glassesIssued.RE}
                                            onClick={(e) => {
                                                setVisualAC({
                                                    ...visualAC,
                                                    glassesIssued: {
                                                        fieldName: 'Glasses issued',
                                                        RE: e.target.checked,
                                                        LE: e.target.checked
                                                    }
                                                })
                                            }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="glassswitch"
                                        >
                                            Glasses issued today
                                        </label>
                                    </div>
                                </Col>
                            </Row>

                            <Table className="table table-striped mb-0" >
                                <thead>
                                    <tr>
                                        <th className="col-sm-8">Examination</th>
                                        <th className="col-sm-2">Right Eye</th>
                                        <th className="col-sm-2">Left Eye</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examinations.map((it, index) => {
                                        let item = visualAcuity[it]
                                        console.log(visualAC)
                                        return (
                                            <tr key={index}>
                                                <td >{item[0].title} {item[0].measurement ? `(${item[0].measurement})` : ""}</td>
                                                <td>
                                                    {item[0].type == 'select' ? (
                                                        <Input
                                                            type={item[0].type}
                                                            className={
                                                                item[0].type == 'select'
                                                                    ? 'form-select form-control'
                                                                    : 'form-control'
                                                            }
                                                            id={item[0].name}
                                                            name={item[0].name}
                                                            placeholder={item[0].placeholder}
                                                            onChange={(e) => setValue(e, examinations[index])}
                                                            value={visualAC[it].RE}
                                                        >
                                                            <option hidden>N/A</option>
                                                            {item[0].options.map(
                                                                ({ title, value }) => {
                                                                    return (
                                                                        <option
                                                                            key={value}
                                                                            value={value}
                                                                        >
                                                                            {title}
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        </Input>
                                                    ) : (
                                                        <Input
                                                            type={item[0].type}
                                                            className={
                                                                item[0].type == 'select'
                                                                    ? 'form-select form-control'
                                                                    : 'form-control'
                                                            }
                                                            id={item[0].name}
                                                            name={item[0].name}
                                                            placeholder={item[0].placeholder}
                                                            min={item[0]?.min}
                                                            max={item[0]?.max}
                                                            onChange={(e) => setValue(e, examinations[index])}
                                                            value={visualAC[it].RE}
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    {item[1].type == 'select' ? (
                                                        <Input
                                                            type={item[1].type}
                                                            className={
                                                                item[1].type == 'select'
                                                                    ? 'form-select form-control'
                                                                    : 'form-control'
                                                            }
                                                            id={item[1].name}
                                                            name={item[1].name}
                                                            placeholder={item[1].placeholder}
                                                            onChange={(e) => setValue(e, examinations[index])}
                                                            value={visualAC[it].LE}
                                                        >
                                                            <option hidden>N/A</option>
                                                            {item[0].options.map(
                                                                ({ title, value }) => {
                                                                    return (
                                                                        <option
                                                                            key={value}
                                                                            value={value}
                                                                        >
                                                                            {title}
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        </Input>
                                                    ) : (
                                                        <Input
                                                            type={item[1].type}
                                                            className={
                                                                item[1].type == 'select'
                                                                    ? 'form-select form-control'
                                                                    : 'form-control'
                                                            }
                                                            id={item[1].name}
                                                            name={item[1].name}
                                                            min={item[1]?.min}
                                                            max={item[1]?.max}
                                                            placeholder={item[1].placeholder}
                                                            onChange={(e) => setValue(e, examinations[index])}
                                                            value={visualAC[it].LE}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    );
                case 'textarea':
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question.split("\n").map((it, ind) => {
                                    return <div key={ind}>{it}{(question?.question === "Please describe the clinical scenario" || question?.question === "Additional Comments" || question?.question === "Please provide additional history and examination findings") && <span className="text-danger">*</span>}</div>
                                })}
                            </div>
                            <AvForm>
                                <AvField
                                    innerRef={ref}
                                    className="form-control"
                                    id={question.id}
                                    name={question.id}
                                    placeholder={question.answers.placeholder}
                                    maxlength={question?.answers?.maxLength}
                                    type="textarea"

                                    value={textInput}
                                    onChange={(e) => {
                                        if (
                                            e.currentTarget.value.length <=
                                            10000
                                        ) {
                                            setTextInput(e.currentTarget.value);
                                            setTextLength(
                                                e.currentTarget.value.length
                                            );
                                        }
                                    }}
                                    validate={{
                                        required: {
                                            value: !question.answers.isOptional,
                                            errorMessage:
                                                'This field is required',
                                        },
                                        pattern: {
                                            value: '^[\\S\\s]{1,512}$',
                                            errorMessage:
                                                'The character limit was exceeded',
                                        },
                                    }}
                                />

                                <span
                                    className={
                                        textLength < 450
                                            ? 'badgecount badge bg-success'
                                            : textLength < 512
                                                ? 'badgecount badge bg-warning'
                                                : 'badgecount badge bg-danger'
                                    }
                                >
                                    {' '}
                                    {textLength} / 512{' '}
                                </span>
                            </AvForm>
                            {/* <Input
                        className="form-control"
                        id={question.id}
                        name={question.id}
                        placeholder={question.answers.placeholder}
                        type="textarea"
                        value={textInput}
                        onChange={(e) => setTextInput(e.currentTarget.value)}
                    /> */}
                        </div>
                    );
                case 'checkbox':
                    console.log('SEEE', question);
                    let checkboxanswers = question.answers.options;
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question.split("\n").map((it, ind) => {
                                    return (
                                        <div className='mb-1' key={ind}>{it}</div>
                                    )
                                })}
                            </div>
                            {checkboxanswers.map((item, index) => {


                                if (item == "None of above" && pathwayName == "Extravasation") {
                                    return (<div
                                        className="mb-3 form-check"
                                        key={index}
                                        onChange={(e) => {
                                            setNoneOfTheAbove(!noneOfTheAbove);
                                            onCheckBox(e)

                                        }}
                                    >
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name={item}
                                            id={item}
                                            value={item}
                                            checked={!noneOfTheAbove ? false :
                                                checkBox.includes(item)
                                                    ? true
                                                    : false
                                            }
                                            disabled={noneOfTheAbove ? !noneOfTheAbove : false}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="exampleRadios2"
                                            id={item}
                                        >
                                            {item}
                                        </label>
                                    </div>)
                                }
                                else {
                                    console.log(item, 'frank');

                                    return (
                                        <div
                                            className="mb-3 form-check"
                                            key={index}
                                            onChange={(e) => {
                                                onCheckBox(e);

                                            }}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name={item}
                                                id={item}
                                                value={item}
                                                checked={noneOfTheAbove ? false :
                                                    checkBox.includes(item)
                                                        ? true
                                                        : false
                                                }
                                                disabled={noneOfTheAbove ? noneOfTheAbove : false}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="exampleRadios2"
                                                id={item}
                                            >
                                                {item}
                                            </label>
                                        </div>
                                    )
                                };
                            })}
                        </div>
                    );
                case 'images':
                    const files = selectedFiles.map((f, i) => (
                        <Card
                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                            key={i + '-file'}
                        >
                            <div className="p-2">
                                <Row className="align-items-center">
                                    <Col className="col-auto">
                                        {f?.type?.includes('image') && (<img
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                        />)}
                                        {!f?.type?.includes('image') && f?.preview?.includes('blob') && (<img
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                        />)}
                                    </Col>
                                    <Col>
                                        <Link
                                            to="#"
                                            className="text-muted font-weight-bold"
                                        >
                                            {f.name}
                                        </Link>
                                        <p className="mb-0">
                                            <strong>{f.formattedSize}</strong>
                                        </p>
                                    </Col>
                                    <Col className="col-auto">
                                        <div className="pr-3">
                                            {/* <FontAwesomeIcon icon={faTrashAlt} size={'2x'} onClick={()=>{
                                        setImageDelete(selectedFiles[i])
                                        setShowModal(true)
                                    }} /> */}
                                            <i
                                                className="bx bx-trash bx-md"
                                                onClick={() => {
                                                    setImageDelete(
                                                        selectedFiles[i]
                                                    );
                                                    setDelete(true);
                                                }}
                                            ></i>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    ));
                    return (
                        <>
                            <div>
                                <CardTitle className="h4">
                                    Upload Image(s)
                                </CardTitle>
                                <p className="card-title-desc">
                                    {
                                        question.question
                                    }
                                </p>
                                <div className="">
                                    <CardTitle className="h4">
                                        GDPR
                                    </CardTitle>
                                    <CardTitle className="h4">
                                        Please read out the following text to patient/parent/carer:
                                    </CardTitle>
                                    <p>{`"The data and images captured in this application are handled strictly within GDPR and NHS guidelines. All images are transferred securely to the Hospital's IT systems.`}</p>
                                    <p className="mb-3">{`Do you consent to the usage of images for: "`}</p>
                                    <Form>
                                        <FormGroup className="mb-2" row>
                                            {consents.map((item, index) => {
                                                return (
                                                    <div
                                                        style={{
                                                            marginLeft: '1vw',
                                                        }}
                                                        className="form-check mb-3"
                                                        key={index}
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={index}
                                                            id={index}
                                                            checked={consents[index]?.checked}
                                                            onChange={(e) =>
                                                                onConsentChange(
                                                                    e,
                                                                    item,
                                                                    index
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={index}
                                                        >
                                                            {item.consent}{' '}
                                                            <span
                                                                hidden={
                                                                    item.isOptional
                                                                }
                                                                className="text-danger"
                                                            >
                                                                *
                                                            </span>
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                            <p style={{ marginLeft: '1vw' }}>OR</p>
                                            <div style={{ marginLeft: '1vw' }} className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={noConsent}
                                                    id={""}
                                                    onChange={(e) => {
                                                        if (!noConsent) {
                                                            setNoConsent(true)
                                                            setConsents([
                                                                {
                                                                    consent: 'Assessment, treatment and referral',
                                                                    isOptional: false,
                                                                    checked: false,
                                                                },
                                                                {
                                                                    consent: 'Medical teaching and research',
                                                                    isOptional: true,
                                                                    checked: false,
                                                                }
                                                            ])
                                                            setNoImgModal(true)
                                                        } else {
                                                            setNoConsent(false)
                                                        }

                                                    }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={""}
                                                >
                                                    {"Consent to images declined but wishes to continue the referral"}
                                                </label>
                                            </div>
                                            <div className="dropzone">
                                                <div
                                                    className="dz-message needsclick"
                                                    {...getRootProps()}
                                                >
                                                    <input
                                                        {...getInputProps()}
                                                    />
                                                    <div className="mb-3">
                                                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                    </div>
                                                    <h4>
                                                        {
                                                            "Drag 'n' drop or click to select image(s) and video(s)"
                                                        }
                                                    </h4>
                                                </div>
                                            </div>
                                            <div
                                                className="dropzone-previews mt-3"
                                                id="file-previews"
                                            >
                                                {files}
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </div>
                            </div>
                            <Modal
                                isOpen={showDelete}
                                scrollable={true}
                                backdrop={'static'}
                                centered={true}
                                id="staticBackdrop"
                            >
                                <div className="modal-header">
                                    <h5
                                        className="modal-title"
                                        id="staticBackdropLabel"
                                    >
                                        <i className="fa fa-warning"></i> Alert
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setDelete(false);
                                            setImageDelete(null);
                                        }}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {
                                        'Are you sure you want to remove this image?'
                                    }
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => {
                                            setDelete(false);
                                            setImageDelete(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setSelectedFiles(
                                                selectedFiles.filter(
                                                    (item) =>
                                                        item != imageDelete
                                                )
                                            );
                                            setDelete(false);
                                            setImageDelete(null);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </Modal>
                            <Modal
                                isOpen={showNoImgModal}
                                scrollable={true}
                                backdrop={'static'}
                                centered={true}
                                id="staticBackdrop"
                            >
                                <div className="modal-header">
                                    <h5
                                        className="modal-title"
                                        id="staticBackdropLabel"
                                    >
                                        <i className="fa fa-warning"></i> Alert
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setNoImgModal(false);
                                            setNoConsent(false)
                                        }}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {
                                        "Images are integral to TriVice's decision making process, therefore must be included apart from exceptional circumstances.\n\nDo you wish to proceed without image upload?"
                                    }
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setNoImgModal(false);
                                            setNoConsent(false)
                                        }}
                                    >
                                        Upload images
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setSelectedFiles([]);

                                            if (
                                                currentQuestion?.answers
                                                    ?.endpoint != undefined
                                            ) {
                                                onClick({
                                                    answer: {
                                                        consents: consents,
                                                        images: [],
                                                    },
                                                    endpoint:
                                                        currentQuestion.answers
                                                            .endpoint,
                                                });
                                            } else {
                                                onClick({
                                                    answer: {
                                                        consents: consents,
                                                        images: [],
                                                    },
                                                    next: currentQuestion
                                                        .answers.next,
                                                });
                                            }
                                            setNoImgModal(false);
                                        }}
                                    >
                                        Skip image upload
                                    </button>
                                </div>
                            </Modal>
                        </>
                    );
                case 'datetime':
                case 'datetimecalc':
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question.split("\n").map((it, ind) => {
                                    return (
                                        <div className='mb-1' key={ind}>{it}</div>
                                    )
                                })}
                            </div>
                            <Input
                                type="datetime-local"
                                className="form-control"
                                name={question.id}
                                id={question.id}
                                value={datetime == null ? '' : datetime}
                                min={new Date(parseInt(dateOfBirth))
                                    .toISOString()
                                    .slice(
                                        0,
                                        new Date().toISOString().length - 8
                                    )}
                                max={new Date()
                                    .toISOString()
                                    .slice(
                                        0,
                                        new Date().toISOString().length - 8
                                    )}
                                onChange={(e) => {
                                    setDateError(null);
                                    setDatetime(e.target.value);
                                }}
                                invalid={dateError != null}
                            />
                            {dateError != null && (
                                <FormFeedback>{dateError}</FormFeedback>
                            )}
                        </div>
                    );
                case 'drugdropdown':
                    const formatCreateLabel = (inputValue) => `Add New Drug: "${inputValue}"`
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question.split("\n").map((it, ind) => {
                                    return (
                                        <div className='mb-1' key={ind}>{it}</div>
                                    )
                                })}
                            </div>
                            <Creatable
                                formatCreateLabel={formatCreateLabel}
                                options={drugList}
                                onChange={(e) => {
                                    if (e?.__isNew__) {
                                        setDrugModal(true)
                                    }
                                    setDrug(e)
                                }}
                                value={drug}
                            />
                            {drug != null && drug?.__isNew__ == undefined && (
                                <div className="mt-3">
                                    <h5>RAG Status: {drug?.ragStatus ? drug?.ragStatus : "Amber"}</h5>
                                </div>
                            )}
                            {drug?.__isNew__ && (
                                <Modal
                                    isOpen={drugModal}
                                    scrollable={true}
                                    backdrop={'static'}
                                    centered={true}
                                    id="staticBackdrop">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabel">
                                            <i className="fa fa-warning"></i> Warning - Drug not listed
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setDrugModal(false)}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        The drug you have entered is not listed, please ensure you have spelt it correctly.
                                        <br />
                                        If you wish to proceed then the drug will be treated as Amber and pharmacy will be notified.
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => setDrugModal(false)}
                                        >
                                            No
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (drug?.__isNew__) {
                                                    dispatch(createReferralCreators.sendUnknownDrugEmail(drug.value))
                                                }
                                                onClick({
                                                    answer: drug.value,
                                                    next:
                                                        currentQuestion.answers.next[drug.ragStatus] ||
                                                        currentQuestion.answers.next.default,
                                                });
                                            }}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </Modal>
                            )}
                        </div>
                    );

                case 'dropdown':
                    let options = [];
                    let keys = Object.keys(question.answers);
                    keys.map((item, index) => {
                        if (item == 'type') return;
                        options.push({
                            label: item,
                            value: item,
                        });
                    });
                    console.log('options', options);
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question.split("\n").map((it, ind) => {
                                    return (
                                        <div className='mb-1' key={ind}>{it}</div>
                                    )
                                })}
                            </div>
                            <Select
                                options={options}
                                onChange={setDropdown}
                                value={dropdown}
                            />
                        </div>
                    );
                case 'opthoimages':
                    return <OpthoImageUpload save={props.save} setSave={props.setSave} nextButtonCalled={nextButtonCalled} onClick={onClick} currentQuestion={currentQuestion} />;

                // case 'documents':
                //     return <DocumentUpload save={props.save} setSave={props.setSave} nextButtonCalled={nextButtonCalled} onClick={onClick} currentQuestion={currentQuestion} />;

                case 'rheutreat':
                    return <TreatmentToDate fields={reauScreens && renderTreatMentField(reauScreens)} nextButtonCalled={nextButtonCalled} onClick={onClick}
                        featureValues={treatmentFeatureValues}
                        setTreatmentFeatureValues={setTreatmentFeatureValues}
                        question={question} currentQuestion={currentQuestion}
                    />;
                case 'rheuinves':
                    return <InvestigationToDate fields={reauScreens && renderInvestigateField(reauScreens)} nextButtonCalled={nextButtonCalled} onClick={onClick}
                        featureValues={investigateFeatureValues}
                        setInvestigateFeatureValues={setInvestigateFeatureValues}
                        question={question} currentQuestion={currentQuestion} setEsrModal={setEsrModal}
                    />;
                case 'rheuclini':
                    return (<ClinicalFeature fields={reauScreens && renderClinicalField(reauScreens)} nextButtonCalled={nextButtonCalled}
                        onClick={onClick}
                        featureValues={clinicalFeatureValues}
                        setClinicalFeatureValues={setClinicalFeatureValues}
                        question={question}
                        currentQuestion={currentQuestion}
                    />)
                case 'rheuinves2':
                    return (
                        <InvestigationToDate2 fields={reauScreens && renderInvestigateField2(reauScreens)} nextButtonCalled={nextButtonCalled} onClick={onClick}
                            featureValues={secondInvestigateFeatureValues}
                            setSecondInvestigateFeatureValues={setSecondInvestigateFeatureValues}
                            question={question} currentQuestion={currentQuestion}
                        />
                    )
                case 'rheuinves3':
                    return (
                        <GiInvestigation fields={reauScreens && renderGiInvestigateField(reauScreens)} nextButtonCalled={nextButtonCalled} onClick={onClick}
                            featureValues={giInvestigateFeatureValues}
                            setGiInvestigateFeatureValues={setGiInvestigateFeatureValues}
                            question={question || ""} currentQuestion={currentQuestion}
                        />
                    )
                case 'rheuvital':
                    return (
                        <div>
                            <div className="mb-3 h4 card-title">
                                {question.question.split("\n").map((it, ind) => {
                                    return (
                                        <div className='mb-1' key={ind}>{it}</div>
                                    )
                                })}
                            </div>
                            <VitalScreen fields={reauScreens && renderVitalsField(reauScreens)}
                                vitalFieldValues={vitalFieldValues}
                                setVitalFieldValues={setVitalFieldValues}
                                question={question}
                                nextButtonCalled={nextButtonCalled}
                                onClick={onClick}
                                currentQuestion={currentQuestion}
                            />
                        </div>
                    )

                case 'documents':
                return <DocumentUpload save={props.save} setSave={props.setSave} nextButtonCalled={nextButtonCalled} onClick={onClick} currentQuestion={currentQuestion} />;
                
                default:
                    console.log('default');
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (loading || loadingCalcQuestion) return <p>Loading ... </p>;
    // if(hideCurrentQuestion) return <></>;
    return (
        <>
            <div>
                <CardTitle className="h4">{pathwayName}</CardTitle>
                <p className="card-title-desc">
                    Please complete the questions in as much detail as possible
                </p>
                <div className="p-4 border">
                    {renderBaseOnType(currentQuestion)}
                </div>
            </div>

            <Modal
                isOpen={vaModal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Advice
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setVaModal(false)}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    {"You have not filled in the Visual Acuity form. Are you sure you want to leave it blank?"}
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            onClick({
                                answer: visualAC,
                                next: currentQuestion.answers.next,
                            }); setVaModal(false)
                        }}
                    >
                        Skip visual acuity
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => { setVaModal(false) }}
                    >
                        Fill out visual acuity
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={esrModal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Advice
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setEsrModal(false)}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    {generateEsrMessage()}
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => { setEsrModal(false) }}
                    >
                        Understood
                    </button>
                </div>
            </Modal>
            <Modal
                isOpen={showModal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Advice
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    {action?.split('\n').map((i, ind) => {
                        return <p key={ind}>{i}</p>;
                    })}
                    {url != null && (
                        <object
                            data={url}
                            type="application/pdf"
                            width="500"
                            height="678"
                        >

                            <iframe
                                src={url}
                                width="500"
                                height="678"
                            >
                                <p>This browser does not support PDF!</p>
                            </iframe>
                        </object>
                    )}
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            if (tempEndpoint && action) {
                                dispatch(
                                    createReferralCreators.setDecisionAndQuestionAnswers(
                                        tempEndpoint,
                                        questionAnswers
                                    )
                                );
                                dispatch(createReferralCreators.setTabIndex('5'));
                                setEndpoint()
                            }

                            setShowModal(false);
                            setURL(null)
                        }}
                    >
                        Understood
                    </button>
                </div>
            </Modal>
            <Modal
                isOpen={saveModal}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop">
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        <i className="fa fa-warning"></i> Advice
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSaveModal(false)}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    {"Please note that your referral has not been submitted until its completed."}
                    {" "}
                    {"You can find your incomplete cases from the dashboard or my referral menu. "}
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            props.setSave(false)
                            setSaveModal(false)
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            if (currentQuestion.answers.type == "visual") {
                                let answer = [...questionAnswers,
                                {
                                    question: currentQuestion.question,
                                    answer: visualAC,
                                    currentQuestion: currentQuestion
                                }
                                ]
                                dispatch(createReferralCreators.saveMidResponse(caseDetails.caseID, answer, pathwayName, selectedSpeciality))
                                history.push('/dashboard')
                                setSaveModal(false)
                                return;
                            } else if (currentQuestion.answers.type == "images") {
                                let answer = [...questionAnswers,
                                {
                                    question: currentQuestion.question,
                                    answer: { consents: consents, images: selectedFiles },
                                    currentQuestion: currentQuestion
                                }
                                ]
                                dispatch(createReferralCreators.saveMidResponse(caseDetails.caseID, answer, pathwayName, selectedSpeciality))
                                history.push('/dashboard')
                                setSaveModal(false)
                                return;
                            } else if (currentQuestion.answers.type == "opthoimages" || currentQuestion.answers.type == "documents") { return; }
                            dispatch(createReferralCreators.saveMidResponse(caseDetails.caseID, questionAnswers, pathwayName, selectedSpeciality))
                            history.push('/dashboard')
                            setSaveModal(false)
                        }}
                    >
                        Save & Exit
                    </button>
                </div>
            </Modal>
            <Modal
                isOpen={showDelete}
                scrollable={true}
                backdrop={'static'}
                centered={true}
                id="staticBackdrop"
            >
                <div className="modal-header">
                    <h5
                        className="modal-title"
                        id="staticBackdropLabel"
                    >
                        <i className="fa fa-warning"></i> Alert
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                            setDelete(false);
                            setImageDelete(null);
                        }}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    {
                        'Are you sure you want to remove this image?'
                    }
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => {
                            setDelete(false);
                            setImageDelete(null);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            setSelectedFiles(
                                selectedFiles.filter(
                                    (item) =>
                                        item != imageDelete
                                )
                            );
                            setDelete(false);
                            setImageDelete(null);
                        }}
                    >
                        Remove
                    </button>
                </div>
            </Modal>
            <DynamicActionModal
                showModal={showModal}
                setShowModal={setShowModal}
                setURL={setURL}
                action={action}
                url={url}
                tempEndpoint={tempEndpoint}
                questionAnswers={questionAnswers}
                setEndpoint={setEndpoint}
                caseDetails={caseDetails}
                pathwayName={pathwayName}
                selectedSpeciality={selectedSpeciality}
                actionAnswer={actionAnswer}
            />
            <DynamicAlertModal
                showModal={showDynamicAlert}
                onClose={() => setShowDynamicAlert(false)}
                ReauNextId={ReauNextId}
                onClickNext={onClickNext}
                onClick={onClick}
            />
        </>
    );
});

Response.propTypes = {
    questions: PropTypes.any,
    loading: PropTypes.any,
    questionIndex: PropTypes.any,
    nextButtonCalled: PropTypes.any,
    disabled: PropTypes.bool,
    endpoint: PropTypes.any,
    onSubmit: PropTypes.any,
    setNextButton: PropTypes.any,
    save: PropTypes.any,
    setSave: PropTypes.any,
};
Response.displayName = "Response"
export default Response;
