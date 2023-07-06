import React, {useEffect, useState} from 'react';
import {Table, Input, Label, Form, FormGroup, Row, Col, Button, Modal} from 'reactstrap';
import "./styles.css"
import PropTypes from 'prop-types';
import {showToast} from 'utils/toastnotify';
import SweetAlert from "react-bootstrap-sweetalert";
import moment from 'moment';

import "./styles.css"

const TreatmentToDate = ({fields, nextButtonCalled, onClick, featureValues, setTreatmentFeatureValues, question, currentQuestion}) => {

    const [showModal, setShowModal] = useState(false)
    const [getData, setData] = useState({
        key: '',
        objName: ''
    })

    let inputNodes = new Map();
    let rowNodes = new Map();

    const makeFieldValueObj = (fields) => {

        const obj = {}

        fields?.content?.map((item, index) => {
            //       console.log("fieldName",fieldName);
            //           console.log("fieldName.value",fieldName.value);
            if (item?.name?.value == "Intropes" || item?.name?.value == "Antiobiotics therapy") {
                obj[item?.name?.objName] = {
                    present: 'null',
                    fieldName:item?.name?.value,
                    fields: [{
                        doseDate: '',
                        drug: '',
                        dose: ''
                    }]
                }
            } else {
                obj[item?.name?.objName] = {
                    present: 'null',
                    doseDate: '',
                    drug: '',
                    dose:'',
                    fieldName:item?.name?.value,

                }
            }

        })
        setTreatmentFeatureValues(obj)
        console.log("value obj=>", obj);
    }

    const handleValueChange = (value, label, key, index) => {
        console.log("checked", value)
        if (label == "inotropes" || label == "antibioticTherapy") {
            let fields = featureValues[label]["fields"];
            fields[index][key] = value;
            setTreatmentFeatureValues({...featureValues, [label]: {...featureValues[label], fields}})
        } else {
            setTreatmentFeatureValues({...featureValues, [label]: {...featureValues[label], [key]: value}})
        }
    }

    const handleRadioValueChange = (value, label, key,) => {
        if (value == "no") {
            if(label == "inotropes" || label == "antibioticTherapy"){
                let fields = [{
                    doseDate: '',
                    drug: '',
                    dose: ''
                }]
                setTreatmentFeatureValues({...featureValues, [label]: {...featureValues[label], [key]: value, fields}})
            }
            else{
                setTreatmentFeatureValues({...featureValues, [label]:
                     {
                        ...featureValues[label],
                         [key]: value,
                         doseDate: '',
                         drug: '',
                         dose:'',
                        }})
            }
        } else {
            setTreatmentFeatureValues({...featureValues, [label]: {...featureValues[label], [key]: value}})
        }
    }

    const addNewRow = (objName) => {

        let fields = featureValues[objName]["fields"];
        if (fields.length < 5) {
            fields.push({doseDate: '', drug: '', dose: ''})

            setTreatmentFeatureValues(
                {
                    ...featureValues,
                    [objName]: {...featureValues[objName], fields}
                })
        }
    }

    const removeRow = (index, objName) => {
        let fields = featureValues[objName]["fields"];
        fields.splice(index, 1)
        setTreatmentFeatureValues(
            {
                ...featureValues,
                [objName]: {...featureValues[objName], fields}
            })

        setShowModal(false)
    }

    const renderMultipleRowFieldsData = (objName, columnName,unit) => {
        if (columnName == "drug") {
            return (
                <div className="flex flex-column gap5">
                    {featureValues[objName]?.fields?.length > 0 && featureValues[objName].fields.map((item, key) => {
                            return (
                                <Input
                                    key={key}
                                    type="text"
                                    className="form-control"
                                    name="dateResolved"
                                    value={featureValues[objName]?.fields[key]["drug"]}
                                    onChange={(e) => handleValueChange(e.target.value, objName, "drug", key)}
                                    disabled={featureValues[objName]?.present !== "yes" ? true : false}
                                />
                            )
                        }
                    )}
                </div>
            )
        } else if (columnName == "dateOnset") {
            return (
                <div className="flex flex-column gap5">
                    {featureValues[objName]?.fields?.length > 0 && featureValues[objName].fields.map((item, key) => {
                        return (
                            <Input
                                key={key}
                                type="date"
                                className="form-control"
                                placeholder="DD/MM/YYYY"
                                name="dateOnset"
                                value={featureValues[objName]?.fields[key]["doseDate"]}
                                onChange={(e) => handleValueChange(e.target.value, objName, "doseDate", key)}
                                disabled={featureValues[objName]?.present !== "yes" ? true : false}
                                max={moment(new Date()).format('YYYY-MM-DD')}
                                
                            />
                        )
                    })}
                </div>
            )
        } else if (columnName == "dose") {
            return (
                <div className="flex flex-column gap5">
                    {
                        featureValues[objName]?.fields?.length > 0 && featureValues[objName].fields?.map((item, key) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <Row>
                                        <Col style={{display: "flex", flex: "1", flexDirection: "row", gap:"10px"}}>
                                            <Input
                                                key={key}
                                                type="text"
                                                className="form-control W-100 numinput "
                                                name="dose"
                                                placeholder= {unit ?? "units"}
                                                value={featureValues[objName]?.fields[key]["dose"]}
                                                onChange={(e) => handleValueChange(e.target.value, objName, "dose", key)}
                                                disabled={featureValues[objName]?.present !== "yes" ? true : false}
                                                style={{maxWidth: "87px",minWidth: "87px"}}
                                            />
                                            {/* <div style={{backgroundColor:"#EFF2F7",border:"1px solid #ced4da",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"0.25rem",padding:"0px 5px 0px 5px"}}>ml</div> */}

                                            {
                                                (key == 0) ? (<Button
                                                    onClick={() => {
                                                        if (featureValues[objName]?.present == "yes") {
                                                            addNewRow(objName)
                                                        }
                                                    }}
                                                    style={{
                                                        backgroundColor: "white",
                                                        border: "1px solid #ced4da",
                                                        padding: "1.5px 8px",
                                                        fontSize: "21px",
                                                        marginTop: "auto"
                                                    }}>
                                                    <i className="bx bx-plus" style={{color: "#74788d"}}/>
                                                </Button>) : (<Button
                                                    onClick={() => {
                                                        if (featureValues[objName]?.present == "yes") {
                                                            setData({
                                                                key: key,
                                                                objName: objName
                                                            });
                                                            setShowModal(true)
                                                        }
                                                    }}
                                                    style={{
                                                        backgroundColor: "white",
                                                        border: "1px solid #ced4da",
                                                        padding: "1.5px 8px",
                                                        fontSize: "21px",
                                                        marginTop: "auto"
                                                    }}>
                                                    <i className="bx bx-minus" style={{color: "#74788d"}}/>
                                                </Button>)
                                            }
                                        </Col>
                                    </Row>

                                )
                            }
                        )}
                </div>

            )
        }
    }

    const handleFocusonField = (i)=>{
        const node = inputNodes.get(i);
        // console.log("node",node.classList());
        node.classList.add("errorBorder")
        node.focus();
    //     node.focus();
        setTimeout(()=>{
            node.classList.remove("errorBorder");
        },4000)
    }
    const handleFocusonRow = (i)=>{
        const node = rowNodes.get(i);
        // console.log("node",node.classList());
        node.classList.add("errorRow")
        node.focus();
    //     node.focus();
        setTimeout(()=>{
            node.classList.remove("errorRow");
        },3000)
    }

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
                makeFieldValueObj(fields);
            }
        }
    }, [fields])

    useEffect(() => {
        console.log("featureValues=>", featureValues)
    }, [featureValues])

    useEffect(() => {

        if (currentQuestion?.answers?.type?.toLowerCase() == 'rheutreat' && nextButtonCalled) {

            const validateTreatmentFields = () => {

                let error = false;
                let fieldName;
                let featureValueKeys = Object.keys(featureValues);
                for (let i = 0; i < featureValueKeys.length; i++) {
                    let objName = featureValueKeys[i];  
                    if (featureValues[objName].present === "null") {
                        handleFocusonRow(objName)
                        error = true;
                        break;
                    } else if (featureValues[objName].present == "yes") {
                        if (objName == "inotropes" || objName == "antibioticTherapy") {
                            let innerError = false;
                            const fieldLength = featureValues[objName]?.fields?.length;
                            // checks the the multiple rows of a field
                            for(let j =0; j< fieldLength; j++) {
                                if (featureValues[objName]?.fields[j]?.doseDate?.length <= 0 || featureValues[objName]?.fields[j]?.drug.length <= 0 || featureValues[objName]?.fields[j]?.dose == 0) {
                                    handleFocusonRow(objName)
                                    error = true;
                                    innerError = true;
                                    break;
                                }
                            }
                            if(innerError) break;
                        } else {
                            if(featureValues[objName].doseDate.length <= 0){
                                fieldName = objName+"-"+"doseDate";
                                console.log("fieldName",fieldName)
                                handleFocusonField(fieldName)
                                error = true;
                                break;
                            }
                            else if(featureValues[objName].drug.length <= 0){
                                fieldName = objName+"-"+"drug";
                                console.log("fieldName",fieldName)
                                handleFocusonField(fieldName)
                                error = true;
                                break;
                            }
                            else if(featureValues[objName].dose == 0){
                                fieldName = objName+"-"+"dose";
                                console.log("fieldName",fieldName)
                                handleFocusonField(fieldName)
                                error = true;
                                break;
                            }
                        }

                    }
                }
                return error;
            }
            const validateTreat = validateTreatmentFields();
            if (validateTreat) {
                showToast("Please select all the fields", 'error');
            } else {
                onClick({
                    answer: featureValues,
                    next: currentQuestion.answers.next,
                });
            }
        }

    }, [nextButtonCalled])


    return (
        <>
            <div className="mb-3 h4 card-title">
                {question?.question?.split("\n").map((it, ind) => {
                    return (
                        <div className='mb-1' key={ind}>{it}</div>
                    )
                })}
            </div>
            <div className="border p-2 table-condensed" >
                <Table className="table table-striped mb-0" responsive style={{minWidth:"690px",overflowX:"auto"}}>
                    <thead>
                    <tr>
                        <th className="col-sm-5">
                            {fields?.headers[0]?.label}<span className="text-danger">*</span>
                        </th>
                        <th className="col-sm-3">{fields?.headers[1]?.label}<span className="text-danger">*</span></th>
                        <th>{fields?.headers[2]?.label}</th>
                        <th className="col-sm-2">{fields?.headers[3]?.label}</th>
                        <th className="col-sm-2">{fields?.headers[4]?.label}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {featureValues != undefined && fields?.content?.map((item, index) => {
                        return (
                            <tr key={index} style={{verticalAlign: "middle"}} ref={(c)=>rowNodes.set(item?.name?.objName,c)}>
                                <td>{item?.name?.value}</td>
                                <td>
                                    <div>
                                        <Form>
                                            <Row style={{maxWidth: "170px"}}>
                                                <Col
                                                    onClick={(e) => handleRadioValueChange("yes", item?.name?.objName, "present")}
                                                    style={{cursor: "pointer"}}>
                                                    <div className="mb-0">
                                                        <Input type="radio"
                                                               checked={featureValues[item?.name?.objName]?.present == "yes"}/>
                                                        {' '}
                                                        <label style={{margin: "0px"}}>Yes</label>
                                                    </div>
                                                </Col>
                                                <Col style={{cursor: "pointer"}}
                                                     onClick={(e) => handleRadioValueChange("no", item?.name?.objName, "present")}>
                                                    <div>
                                                        <Input type="radio"
                                                               checked={featureValues[item?.name?.objName]?.present == "no"}/>
                                                        {' '}
                                                        <label style={{margin: "0px"}}>No</label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </td>
                                <td>
                                    {
                                        (item?.name?.value == "Intropes" || item?.name?.value == "Antiobiotics therapy") ?
                                            (
                                                renderMultipleRowFieldsData(item?.name?.objName, "dateOnset")
                                            )
                                            :
                                            (
                                                <Input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="DD/MM/YYYY"
                                                    name="dateOnset"
                                                    innerRef={c=>inputNodes.set(`${item?.name?.objName}-doseDate`,c)}
                                                    value={featureValues[item?.name?.objName]?.doseDate}
                                                    onChange={(e) => handleValueChange(e.target.value, item?.name?.objName, "doseDate")}
                                                    disabled={featureValues[item?.name?.objName]?.present !== "yes" ? true : false}
                                                    max={moment(new Date()).format('YYYY-MM-DD')}

                                                />
                                            )
                                    }
                                </td>
                                <td>
                                    {
                                        (item?.name?.value == "Intropes" || item?.name?.value == "Antiobiotics therapy") ?
                                            (
                                                renderMultipleRowFieldsData(item?.name?.objName, "drug")
                                            )
                                            :
                                            (
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    innerRef={c=>inputNodes.set(`${item?.name?.objName}-drug`,c)}
                                                    name="dateResolved"
                                                    value={featureValues[item?.name?.objName]?.drug}
                                                    onChange={(e) => handleValueChange(e.target.value, item?.name?.objName, "drug")}
                                                    disabled={featureValues[item?.name?.objName]?.present !== "yes" ? true : false}
                                                    style={{minWidth:"66px"}}
                                                />
                                            )

                                    }

                                </td>
                                <td className="flex flex-row gap5">
                                    <div>
                                        {(item?.name?.value == "Intropes" || item?.name?.value == "Antiobiotics therapy") ?
                                            (
                                                renderMultipleRowFieldsData(item?.name?.objName, "dose",item?.name?.unit)
                                            )
                                            :
                                            (<div className="flex flex-row">
                                                <>
                                                <Input
                                                    innerRef={c=>inputNodes.set(`${item?.name?.objName}-dose`,c)}
                                                    type="text"
                                                    className="form-control W-100 numinput "
                                                    name="dose" 
                                                    placeholder= {item?.name?.unit ?? "units"}
                                                    value={featureValues[item?.name?.objName]?.dose}
                                                    onChange={(e) => {
                                                        handleValueChange(e.target.value, item?.name?.objName, "dose")}
                                                        //checks the value should be alpha numeric
                                                        // if(/^[0-9a-zA-Z]+$/.test(e.target.value)){
                                                        //     handleValueChange(e.target.value, item?.name?.objName, "dose")}
                                                        // }
                                                    }
                                                    disabled={featureValues[item?.name?.objName]?.present !== "yes" ? true : false}
                                                    style={{maxWidth: "87px"}}
                                                />
                                                </>
                                            </div>
                                            )
                                        }
                                    </div>
                                </td>

                            </tr>
                        )
                    })}

                    </tbody>
                </Table>

                <Modal
                    isOpen={showModal}
                    scrollable={true}
                    backdrop={'static'}
                    centered={true}
                    id="staticBackdrop"
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i style={{color:'red'}} className="fa fa-exclamation-triangle"></i> Alert!
                        </h5>
                    </div>
                    <div className="modal-body" style={{whiteSpace:"pre-line"}} >
                        Are you sure to delete ?
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>{
                                removeRow(getData.key, getData.objName)
                            }}
                        > Ok
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>{
                               setShowModal(false)
                            }}
                        > Close
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    )
}

TreatmentToDate.propTypes = {
    fields: PropTypes.any,
    nextButtonCalled: PropTypes.any,
    onClick: PropTypes.any,
    featureValues: PropTypes.any,
    setTreatmentFeatureValues: PropTypes.any,
    question: PropTypes.any,
    currentQuestion: PropTypes.any,

}

export default TreatmentToDate