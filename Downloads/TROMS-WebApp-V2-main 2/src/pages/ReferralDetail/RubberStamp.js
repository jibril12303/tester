import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
Table,
Row,
Col,
Button,
Input
} from 'reactstrap'
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import caseDetails, {caseTypes,caseCreators } from "store/caseDeatils/reducer"
import find from 'lodash/find';
import { showToast } from 'utils/toastnotify';
import {useHistory} from "react-router-dom";

const RubberStamp = (props) => {

    const dispatch = useDispatch()
    let history = useHistory();

    const [formData, setFormData] = useState({})
    const [validationSchema, setValidationSchema] = useState({})
    const [currentQuestion, setCurrentQuestion] = useState()
    const [currentAnswer, setCurrentAnswer] = useState()
    const [RBAnswers, setRBAnswers] = useState([])
    const [showSummary, setShowSummary] = useState(false)

    const [currentSection, setCurrentSection] = useState()
    const [sectionName, setSectionName] = useState()
    const [answers, setAnswers] = useState({})
    const [prevSection, setPrevSection] = useState(null)
    const [showSubmit, setShowSubmit] = useState(false)
    const [toggle, setToggle] = useState({})
    const [mandatory, setMandatory] = useState({})
    //debugger;
    const {rsqloading, questions,rubberStamp, caseID} =useSelector( state=>({
        rsqloading: state.caseDetails.rsqloading,
        questions: state.caseDetails.rubberStampQuestions,
        rubberStamp: state.caseDetails?.caseDetails?.case?.rubberStamp,
        caseID: state.caseDetails?.caseDetails?.case?.caseID,
      }))

      console.log("QUEST",questions)

    const findQuestionBasedOnId = (id) =>
    find(questions, (obj) => {
        return obj.id == id;
    });

    useEffect(()=>{
        if(typeof rubberStamp != 'undefined'){
            setAnswers(rubberStamp)
            setShowSummary(true)
        }
    },[rubberStamp])

    // useEffect(()=>{
    //     setCurrentQuestion(questions[0])
    // },[questions])

    //This determines whether the questions are mandatory or not
    //The tenary operator is used so makes it a little confusing
    //May refactor
    //Basically -> if item.mandatory is selected then we set to true
    //if not then undefined
    //if item.defualt then also undefined
    useEffect(()=>{
        let _form = {}
        let _mandatory = {}
        if(currentSection != null){
            currentSection.questions?.map((item,index)=>{
                debugger
                _form[sectionName] = {..._form[sectionName],[item.fieldName]:answers?.[sectionName]?.[item.fieldName]||item?.default}
                _mandatory[sectionName] = {..._mandatory[sectionName], [item.fieldName]: mandatory?.[sectionName]?.[item.fieldName]||item?.mandatory ? item?.default ? undefined : true : undefined}
            })
            console.log("FORMM",_form)
            setAnswers((prev)=>{
                return({
                    ...prev,
                    ..._form
                })
            })
            setMandatory((prev)=>{
                return({
                    ...prev,
                    ..._mandatory
                })
            })
        }
    },[currentSection])

    /*
    @param(text): this is the text displayed when editing is false
    @param(item): item object which will be passed through to getFormElement
    @param(index): row numer
    @param(givenSection): this is the section of row we are editing e.gs [Tests Required]
    */
    function textEditSelect (text, item,index,givenSection) {
        debugger
        console.log("ITEM",item)
        if (toggle?.[item?.fieldName] == false || toggle?.[item?.fieldName] == undefined){
            if(item.type == "leaflets"){
                return (
                    <div>
                        <ul>
                        {text?.map((it,ind)=>{
                            return(
                                <li key={ind}><a target="_blank" rel="noopener noreferrer" href={it.s3Url}>{it.name}</a></li>
                            )
                        })}
                        {(typeof text == "undefined" || text?.length == 0) && (
                            <p>No Leaflets Selected</p>
                        )}
                        </ul>
                    </div>
                )
            }
            return (
                <p>{text}</p>
            )
        } else {
            return getFormElement(item,index,givenSection)
        }
    }
    function fieldsFilledIn(obj) {
        return Object.values(obj).every(x => x === undefined || x === false);
      }

    function getFormElement(item, key, givenSection){
        console.log("GIVENSECTION",givenSection)
        console.log("item",item)
        // set them all to mandatory to begin with. 
        // then as user input is given make non mandotry
        //so when they press next we see if fields are unmarked as mandaotry and let them move on.

        switch (item.type) {
            case 'radio':
                let options = item.answers?.map(element => {
                    return {value:element, label:element}
                })
                return(
                    
                    <div key={key} className='col-6'>

                        {typeof givenSection == "undefined" && (
                        <label>
                        {item.question} <span className='text-danger'>{item.mandatory ? '*' : '' }</span>
                        </label>
                        )}
                        <Select 
                        id={sectionName+item.question}
                        options={options}
                        defaultValue={typeof item?.default != "undefined" ? options[0] : ""}
                        value={answers?.[givenSection || sectionName]?.[item.fieldName] != undefined ? {label: answers?.[givenSection || sectionName]?.[item.fieldName], value:answers?.[givenSection || sectionName]?.[item.fieldName]}: ""}
                        onChange={(val)=>{
                            console.log('hu',val)
                            setAnswers((prev)=>{
                                return({
                                    ...prev,
                                    [givenSection || sectionName]:{
                                        ...prev[givenSection || sectionName],
                                        [item.fieldName]: val.value
                                    }
                                })
                            })
                            if(item.mandatory){
                                setMandatory((prev)=>{
                                    return({
                                        ...prev,
                                        [givenSection || sectionName]:{
                                            ...prev[givenSection || sectionName],
                                            [item.fieldName]: val.value.length == 0 ? true : undefined
                                        }
                                    })
                                })
                            }
                        }}
                        className="mb-3"
                        />
                    </div>
                )
            case 'nradio':
                console.log(item.answers);
                return (
                    <div className='col-6'>
                        <div className="mb-3 h4 card-title">
                            {item.question.split("\n")?.map((it,ind)=>{
                                return (
                                    <div className='mb-1' key={ind}>{it}</div>
                                )
                            })} <span className='text-danger'>{item?.mandatory ? '*' : '' }</span>
                        </div>
                        {item.answers?.map((it, index) => {
                            if (it == 'type') return;
                            return (
                                <div
                                    className="mb-2 form-check"
                                    key={index}
                                >
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={it}
                                        checked={answers[sectionName]?.[item.fieldName] == it}
                                        id={index}
                                        value={it}
                                        onClick={(e) => {
                                            setAnswers((prev)=>{
                                                return({
                                                    ...prev,
                                                    [sectionName]:{
                                                        ...prev[sectionName],
                                                        [item.fieldName]: e.target.value
                                                    }
                                                })
                                            })
                                        }}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="exampleRadios2"
                                        id={index}
                                    >
                                        {it}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                );
            case 'checkbox':
                let multioption = item.answers.map(element => {
                    return {value:element, label:element}
                })
                return(
                    <div key={key} className='col-6'>
                        {typeof givenSection == "undefined" && (
                        <label>
                        {item.question} <span className='text-danger'>{item?.mandatory ? '*' : '' }</span>
                        </label>
                        )}

                        <Select
                        id={sectionName+item.question}
                        isMulti
                        value={answers?.[givenSection || sectionName]?.[item.fieldName] != undefined ? answers?.[givenSection || sectionName]?.[item.fieldName].map(it => {return {value: it, label: it}}) : ""}
                        onChange={(val)=>{
                            let ret = val.map(element =>{
                                return element.value
                            })
                            setAnswers((prev)=>{
                                return({
                                    ...prev,
                                    [givenSection || sectionName]:{
                                        ...prev[givenSection || sectionName],
                                        [item.fieldName]: ret
                                    }
                                })
                            })
                            if(item?.mandatory){
                                setMandatory((prev)=>{
                                    return({
                                        ...prev,
                                        [givenSection || sectionName]:{
                                            ...prev[givenSection || sectionName],
                                            [item.fieldName]: val.length == 0 ? undefined : true
                                        }
                                    })
                                })
                            }


                        }}
                        options={multioption}
                        className="mb-3"
                        />
                    </div>
                )
            case 'ncheckbox':
                return(
                    <div className='col-6'>
                        <h5 className='mt-2'>{item.question}</h5>
                        {item.answers?.map((it,index)=>{
                            if(it == "type") return; 
                            return (
                                <div key={index} className='mb-2 form-check'>
                                <div >
                                    <input 
                                    className='form-check-input'
                                    type="checkbox"
                                    checked={answers[sectionName]?.[item.fieldName]?.includes(it) ? true : false}
                                    value={it}
                                    onClick={(e)=>{
                                        if(answers[sectionName]?.[item.fieldName]?.includes(it)){
                                            setAnswers((prev)=>{
                                                return({
                                                    ...prev,
                                                    [sectionName]:{
                                                        ...prev[sectionName],
                                                        [item.fieldName]: [...prev[sectionName][item.fieldName]?.filter(item => item != e.target.value)]
                                                    }
                                                })
                                            })
                                            //setCurrentAnswer([...currentAnswer?.filter(item => item != e.currentTarget.value)])
                                        } else {
                                            if(Array.isArray(answers[sectionName]?.[item.fieldName])){
                                                setAnswers((prev)=>{
                                                    return({
                                                        ...prev,
                                                        [sectionName]: {
                                                            ...prev[sectionName],
                                                            [item.fieldName]: [...prev[sectionName][item.fieldName], e.target.value]
                                                        }
                                                    })
                                                })
                                                //setCurrentAnswer([...currentAnswer, e.currentTarget.value])
                                            } else {
                                                setAnswers((prev)=>{
                                                    return({
                                                        ...prev,
                                                        [sectionName]:{
                                                            ...prev[sectionName],
                                                            [item.fieldName]: [e.target.value]
                                                        }
                                                    })
                                                })
                                                //setCurrentAnswer([e.currentTarget.value])
                                            }
                                        }

                                    }}
                                    name={it}
                                    id={it}
                                    />
                                    <label style={{marginLeft: '0.5vw'}} htmlFor={it}>
                                        {it} <span className='text-danger'>{item.mandatory ? '*' : '' }</span>
                                    </label>
                                </div>
                                </div>
                            )
                        })}

                    </div>
                )
            case 'text':
                return(
                    <div key={key} className='col-6'>
                        <div>
                        {typeof givenSection == "undefined" && (
                        <label>
                        {item.question} <span className='text-danger'>{item.mandatory ? '*' : '' }</span>
                        </label>
                        )}
                            <Input 
                                className='mb-3'
                                value={answers[givenSection || sectionName]?.[item.fieldName]}
                                onChange={(e)=>{
                                    setAnswers((prev)=>{
                                        return({
                                            ...prev,
                                            [givenSection || sectionName]:{
                                                ...prev[givenSection || sectionName],
                                                [item.fieldName]: e.target.value
                                            }
                                        })
                                    })
                                    if(item.mandatory){
                                        setMandatory((prev)=>{
                                            return({
                                                ...prev,
                                                [givenSection || sectionName]:{
                                                    ...prev[givenSection || sectionName],
                                                    [item.fieldName]: e.target.value.length != 0 ? undefined : true
                                                }
                                            })
                                        })
                                    }
                                }}
                            />
                        </div>
                    </div>
                    
                
                )
            case 'textarea':
                return(<>
                    
                    {item.question == "Notes to referrer (recommended action)" && currentAnswer == "Yes" && currentSection.title == "Action Accepted" && (
                        <div className='col-6'><span></span></div>
                        )}
                    <div key={key} className='col-6'>
                        <div>    
                        {typeof givenSection == "undefined" && (
                        <label>
                        {item.question} <span className='text-danger'>{item.mandatory ? '*' : '' }</span>
                        </label>
                        )}
                            <Input 
                                className='mb-3'
                                type='textarea'
                                value={answers[givenSection || sectionName]?.[item.fieldName]}
                                onChange={(e)=>{
                                    setAnswers((prev)=>{
                                        return({
                                            ...prev,
                                            [givenSection ||sectionName]:{
                                                ...prev[givenSection ||sectionName],
                                                [item.fieldName]: e.target.value
                                            }
                                        })
                                    })
                                    if(item.mandatory){
                                        setMandatory((prev)=>{
                                            return({
                                                ...prev,
                                                [givenSection || sectionName]:{
                                                    ...prev[givenSection || sectionName],
                                                    [item.fieldName]: e.target.value.length != 0 ? undefined : true
                                                }
                                            })
                                        })
                                    }
                                }}
                            />
                        </div>
                    </div>
                    </>
                )
            case 'leaflets':
                let leaflets = item.leaflets?.map((it,index)=>{
                    return {
                        name: it.name,
                        s3Url: it.s3Url,
                        _id: it._id,
                        value: it.name,
                        label: it.name
                    }
                })
                return(
                    <div key={key} className='col-6'>
                        {typeof givenSection == "undefined" && (
                        <label>
                        {item.question} <span className='text-danger'>{item?.mandatory ? '*' : '' }</span>
                        </label>
                        )}
                        <Select
                        id={sectionName+item.question}
                        isMulti
                        value={answers?.[givenSection || sectionName]?.[item.fieldName] != undefined ? answers?.[givenSection || sectionName]?.[item.fieldName] : ""}
                        onChange={(val)=>{
                            let ret = val.map(element =>{
                                return element.value
                            })
                            setAnswers((prev)=>{
                                return({
                                    ...prev,
                                    [givenSection || sectionName]:{
                                        ...prev[givenSection || sectionName],
                                        [item.fieldName]: val
                                    }
                                })
                            })

                        }}
                        options={leaflets}
                        className="mb-3"
                        />
                        {/* {item.leaflets.map((it,index)=>{
                            let obj = {
                                name: it.name,
                                s3Url: it.s3Url,
                                _id: it._id
                            }
                            console.log(obj)
                            if(it == "type") return; 
                            return (
                                <div key={index} className='mb-2 form-check'>
                                <div >
                                    <input 
                                    className='form-check-input'
                                    type="checkbox"
                                    checked={find(answers[sectionName]?.[item.fieldName], obj) ? true : false}
                                    value={it.name}
                                    onClick={(e)=>{
                                        if(find(answers[sectionName]?.[item.fieldName], obj)){
                                            setAnswers((prev)=>{
                                                return({
                                                    ...prev,
                                                    [sectionName]:{
                                                        ...prev[sectionName],
                                                        [item.fieldName]: [...prev[sectionName][item.fieldName]?.filter(item => item.name != it.name)]
                                                    }
                                                })
                                            })
                                            //setCurrentAnswer([...currentAnswer?.filter(item => item != e.currentTarget.value)])
                                        } else {
                                            if(Array.isArray(answers[sectionName]?.[item.fieldName])){
                                                setAnswers((prev)=>{
                                                    return({
                                                        ...prev,
                                                        [sectionName]: {
                                                            ...prev[sectionName],
                                                            [item.fieldName]: [...prev[sectionName][item.fieldName], obj]
                                                        }
                                                    })
                                                })
                                                //setCurrentAnswer([...currentAnswer, e.currentTarget.value])
                                            } else {
                                                setAnswers((prev)=>{
                                                    return({
                                                        ...prev,
                                                        [sectionName]:{
                                                            ...prev[sectionName],
                                                            [item.fieldName]: [obj]
                                                        }
                                                    })
                                                })
                                                //setCurrentAnswer([e.currentTarget.value])
                                            }
                                        }

                                    }}
                                    name={it}
                                    id={it.name}
                                    />
                                    <label style={{marginLeft: '0.5vw'}} htmlFor={it}>
                                        {it.name}
                                    </label>
                                </div>
                                </div>
                            )
                        })} */}

                    </div>
                    
                )
            default:
                break;
        }
    }
    if(rsqloading || questions.length == 0) return <p>loading...</p>
    if(rsqloading) return <p>Loading...</p>

    let anss = Object.keys(questions.Section1.questions[0].answers)

    //showSubmit is similar to showSummary but the user is able to edit the repsonse before submitting the form.

    if(showSubmit){
        debugger;
        let keys = Object.keys(answers)
        return(
            <>
            <Row>
            {keys?.map((item,index)=>{
                return(
                    <Col key={index} sm={keys.length == 1 ? '12' : '6'} md={keys.length == 1 ? '12' : '6'}>
                    <div key={index} >
                        <h4>{currentSection.title}</h4>
                        <Table striped>
                        <thead>
                            <tr>
                            <th className='ml-2'></th>
                            <th className='ml-2'></th>
                            <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Object.keys(answers[item])?.map((it,index)=>{
                            ///let toggle = false
                            if(it.includes('leafldfffd')){
                               return(
                                   <tr key={index}>
                                       <td>{it}</td>
                                       <td>
                                        <ul>
                                        { answers[item][it]?.map((item,index)=>{
                                           return <li key={index}><a target="_blank" rel="noopener noreferrer" href={item.s3Url}>{item.name}</a></li>
                                        })}
                                        </ul>
                     
                                       </td>
                                   </tr>
                               )
                            } else{
                                return (<tr key={index}>
                                    <td>{it}</td>
                                    <td>{textEditSelect(questions[item].questions[index]?.type == "leaflets" ? answers[item][it] : Array.isArray(answers[item][it]) ? answers[item][it]?.join(', ') : answers[item][it]?.toString(),questions[item]['questions'][index],index,item)}</td>
                                    <td onClick={()=>{
                                        //If toggle is not empty set it empty
                                        debugger
                                        if(toggle != {}){
                                            setToggle({})
                                        }
                                        //If user clicks edit button on a row already being edited then we set toggle empty
                                        if(Object.keys(toggle).includes(questions[item]['questions'][index]['fieldName'])){
                                            setToggle({})
                                        } else {
                                            //if not we then let the user edit the response
                                            setToggle({[questions[item]['questions'][index]['fieldName']]: true})    
                                        }                                    
                                    }} ><i className="far fa-edit"></i></td>
                                    </tr>
                                )
                            }
                            })}
                        </tbody>
                    </Table>
                    </div>
                    </Col>
                )
            })}
            </Row>
            <div className='mb-4'>
            <Button
                        disabled={false}
                        type="button"
                        style={{float:'right'}}
                        // innerRef={nextButton}
                          onClick={(e)=>{
                                dispatch(caseCreators.submitRubberStampForm(caseID,answers,history))
                                setShowSummary(true)
                                setShowSubmit(false)

                          }}
                          className="btn btn-success"
                        >
                        {"Submit"}
                    </Button>
            </div>
            </>
        )
    }

    if(!showSummary){
        debugger;

        if (!(props.Case?.pathwayOutcome == 'LOCAL' && props.Case?.specialitySelected == "Plastic Surgery"))
        {
            return (
                <div className='p-4 border mb-3'>
                    {/*<h4>{currentSection?.title ? currentSection?.title : "Further action"}</h4>*/}
                    {/*<br />*/}
                    {currentSection == null &&(
                        <div className=''>
                            <h4>{questions.Section1.questions[0].question}</h4>
                            <div >
                                {anss?.map((item,index)=>{
                                    return (
                                        <div
                                            className="mb-2 form-check-inline"
                                            key={index}
                                        >
                                            <input
                                                className="me-1 form-check-input"
                                                type="radio"
                                                name={anss[index]}
                                                checked={currentAnswer == item}
                                                id={index}
                                                value={item}
                                                onClick={(e) => {
                                                    setCurrentAnswer(e.currentTarget.value)
                                                }}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="exampleRadios2"
                                                id={index}
                                            >
                                                {anss[index]}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    {currentSection != null && (
                        <div className='mb-1'>
                            <h4>{currentSection.title}</h4>
                            <Row className='row'>
                                    {currentSection.questions?.map((item,index)=>{
                                        if(true == true){
                                            return getFormElement(item, index+"L"+sectionName)
                                        }

                                    })}
                            </Row>

                        </div>
                    )}

                    <Row>
                        <Col sm="10">
                            {(prevSection !=null || currentSection !=null) && (
                                <p
                                    disabled={prevSection== null && currentSection == null}
                                    // innerRef={nextButton}
                                    onClick={(e)=>{
                                        if(prevSection){
                                            setSectionName(prevSection);
                                            setCurrentSection(questions[prevSection])
                                            setPrevSection(null)
                                            return;
                                        } else {
                                            setSectionName()
                                            setCurrentSection()
                                            setPrevSection(null)
                                            setAnswers({})
                                            setMandatory({})
                                            return;
                                        }


                                    }}
                                    className="btn text-muted d-none d-sm-inline-block btn-link"
                                >
                                    <p><i className="mdi mdi-arrow-left me-1" /> Back {" "}</p>
                                </p>
                            )}
                        </Col>
                        <Col sm="2">
                            <Button
                                disabled={currentSection == null && currentAnswer == null}
                                type="button"
                                style={{float:'right'}}
                                // innerRef={nextButton}
                                onClick={(e)=>{
                                    if(currentSection == null){
                                        setCurrentSection(questions[questions.Section1.questions[0].answers[currentAnswer].next])
                                        setSectionName(questions.Section1.questions[0].answers[currentAnswer].next)
                                        return;
                                    }
                                    debugger;
                                    if(fieldsFilledIn(mandatory[sectionName])){
                                        if('next' in currentSection){
                                            setPrevSection(sectionName)
                                            setSectionName(currentSection.next)
                                            setCurrentSection(questions[currentSection.next])
                                            return;
                                        }
                                        if('endpoint' in currentSection){
                                            // dispatch(caseCreators.submitRubberStampForm(caseID,answers))
                                            setShowSummary(true)
                                            setShowSubmit(true)
                                            return;
                                        }
                                    } else {
                                        showToast('Please fill in mandatory fields','error')
                                    }

                                }}
                                className="btn btn-success"
                            >
                                {"Next"}
                            </Button>
                        </Col>
                    </Row>
                </div>
            )
        }else{
            return '';
        }
    } else{
        let keys = Object.keys(answers)
        return(
            <div className='p-4 border mb-3'>
            <Row>
            {keys?.map((item,index)=>{
                return(
                    <Col key={index} sm={keys.length == 1 ? '12' : '6'} md={keys.length == 1 ? '12' : '6'} >
                    <div key={index} >
                        <h4>{item}</h4>
                        <Table striped>
                        <thead>
                            <tr>
                            <th className='ml-2'></th>
                            <th className='ml-2'></th>
                            </tr>
                        </thead>
                        <tbody>
                        {Object.keys(answers[item])?.map((it,index)=>{
                            if(it.includes('leaflet')){
                               return(
                                   <tr key={index}>
                                       <td>{it}</td>
                                       <td>
                                        <ul>
                                        {
                                        answers[item][it]?.length > 0 ? 
                                        (
                                        <>
                                        {
                                        answers[item][it]?.map((item,index)=>{
                                           return <li key={index}><a target="_blank" rel="noopener noreferrer" href={item.s3Url}>{item.name}</a></li>
                                        })}
                                        </>
                                        )
                                        :
                                        (<>No Leaflets Available</>)
                                        }
                                        </ul>
                     
                                       </td>
                                   </tr>
                               )
                            }
                                return (<tr key={index}>
                                    <td>{it}</td>
                                    <td>{Array.isArray(answers[item][it]) ? answers[item][it]?.join(', ') : answers[item][it]?.toString()}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    </div>
                    </Col>
                )
            })}
            {/* <Table striped>
                <thead>
                    <tr>
                        <th>Rubber</th>
                        <th>Stamp</th>
                    </tr>
                </thead>
                <tbody>
                    {answers.map((item,index)=>{
                        return(
                            <tr key={index}>
                                <td>{item.fieldName}</td>
                                <td>{item.answer}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> */}
            </Row>
            </div>
        )
    }
};

RubberStamp.propTypes = {
    Case: PropTypes.object
}

export default RubberStamp;
