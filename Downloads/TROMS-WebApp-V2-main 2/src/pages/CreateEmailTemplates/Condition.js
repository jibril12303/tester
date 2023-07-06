import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import PropTypes from "prop-types"
import {
    CardTitle,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Table,
    Option,
} from "reactstrap"
import {v4 as uuid} from "uuid"
import {emailTemplateCreators} from "store/email-templates/reducer"
import {showToast} from "utils/toastnotify"
import Select from 'react-select'

//data for prefill test

const prefillData = [
    {
        id: "e9c1aefe-0e73-4333-88d1-1cc6903f4386",
        name: "pathway",
        answer: "Watery or sticky eyes",
    },
    {
        id: "57661ae1-ab69-45df-8183-faa259f66425",
        name: "outOfHours",
        answer: "false",
    },
]

function Condition({shouldSubmit, next, setSubmitfalse, emailEditMode, singleEmailTemplate}) {
    const dispatch = useDispatch()

    const {emailTriggers, emailEvents} = useSelector(state => ({
        emailTriggers: state.EmailTemplateReducer.emailTriggers,
        emailEvents: state.EmailTemplateReducer.emailEvents || [],
    }))

    console.log("emailTriggers", emailTriggers)

    const [fields, setFields] = useState(["0"])

    const [apiSpeciality, setApiSpeciality] = useState({
        api: '',
        caseSepciality: '',
    })

    const [conditionFields, setConditionFields] = useState([
        {
            id: uuid(),
            name: "",
            answer: "",
            type: ""
        },
    ])

    // const [conditionFields, setConditionFields] = useState(prefillData);

    const handleFieldChoose = (fieldname, id) => {
        //Array type for multiselect to work with pathwayOutcomes etc.
        let type = emailTriggers.find(item => item.fieldName == fieldname).type
        let data = conditionFields.map(field => field)
        let index = data.findIndex(item => item.id == id)
        if (index != -1) {
            data[index].name = fieldname
        }
        if(type == "Array"){
            data[index].answer = []
        }
        setConditionFields(data)
    }

    const handleValueChoose = (value, id) => {
        let data = conditionFields.map(field => field)
        let index = data.findIndex(item => item.id == id)
        if (index != -1) {
            data[index].answer = value
        }
        setConditionFields(data)
    }

    const addField = () => {

        debugger;
        let lastIndex = conditionFields.length - 1;
        if (conditionFields[lastIndex].answer === "") {
            //showtoast
            showToast("Please select answer for last field", "warning")
        } else {
            setConditionFields([
                ...conditionFields,
                {
                    id: uuid(),
                    name: "",
                    answer: "",
                },
            ])
        }
    }

    const removeField = id => {
        // alert(id)
        console.log("conditionFields", conditionFields)
        let Data = conditionFields.map(item => item)
        let filterData = Data.filter(field => field.id != id)
        console.log("filterData", filterData)
        setConditionFields(filterData)
    }

    const findTypeofField = fieldname => {
        console.log("fieldname", fieldname)
        let type
        let options = []
        let data = emailTriggers?.map(item => item) || []
        if (data.length > 0) {
            let index = data && data.findIndex(item => item.fieldName == fieldname)
            console.log("index", index)

            if (index != -1) {
                // console.log("index",data[index])
                type = data[index].type
                switch (type) {
                    case "Boolean":
                        options = ["true", "false"]
                        break
                    case "Array":
                        options = data[index].values || []
                }
            }
        }
        return options
    }

    const selectOptions = field => {
        const options = findTypeofField(field.name)
        return options.map(item => {
            return {label: item, value: item}
        })
    }

    const selectValue = field => {
        let index = conditionFields.findIndex(item => item.id == field.id)
        if (index != -1){
            return conditionFields[index].answer.map((item)=>{
                return {value: item, label: item}
            })
        } else {
            return []
        }
    }

    const selectSet = (values,id) => {
        console.log('JIH',values)
        let arr = []
        values.map((item)=>{
            arr.push(item.value)
        })
        handleValueChoose(arr, id)
    }

    const renderOptions = field => {
        const options = findTypeofField(field.name)
        console.log("options", options)
        return options.map(item => {
            return (
                <option value={item} key={item}>
                    {item}
                </option>
            )
        })
    }

    useEffect(() => {
        console.log("conditionFields", conditionFields)
    }, [conditionFields])

    useEffect(() => {
        if (shouldSubmit) {

            if (apiSpeciality.api == "") {
                //showtoast
                showToast("Please select event field.", "error")
            }
            else if (apiSpeciality.caseSepciality == "") {
                //showtoast
                showToast("Please select case speciality field.", "error")
            }
            else{
                let conditionFieldData = conditionFields?.map(field => field) || [];
                let conditonValues = {};
                let filteredData = [];
                // removes the inconsistent fields
                if (conditionFieldData.length > 0) {
                    filteredData = conditionFieldData.filter(field => field.name !== "")
                    filteredData.map(field => {
                        conditonValues[field.name] = field.answer
                    })
                }

                dispatch(
                    emailTemplateCreators.saveEmailDataLocally({
                        triggers: conditonValues,
                        api: apiSpeciality.api,
                        caseSpeciality: apiSpeciality.caseSepciality,
                    })
                )
                next()
                setSubmitfalse()
            }
        }
        setSubmitfalse()
    }, [shouldSubmit])

    useEffect(() => {
        if (emailEditMode == "edit" && singleEmailTemplate.length > 0) {
            let data = singleEmailTemplate[0];
            setApiSpeciality({...apiSpeciality, api: data.api, caseSepciality: data.caseSpeciality})
            let TriggerData = [];
            const {triggers} = data;
            if(JSON.stringify(triggers) != '{}') {
                if (Object.keys(triggers).length > 0) {
                    Object.keys(triggers).map((triggerName) => {
                        const answer = triggers[triggerName];
                        TriggerData = [...TriggerData,
                            {
                                id: uuid(),
                                name: triggerName,
                                answer: answer
                            },
                        ]
                    })
                    setConditionFields(TriggerData);
                }
            }
            
        }
    }, [emailEditMode,singleEmailTemplate])

    return (
        <div>
            <CardTitle>Condition</CardTitle>
            <p className="card-title-desc">
                Enter the condition when you want this notification to send.
            </p>
            <div className="p-4 border">
                <Table>
                    <thead>
                    <tr>
                        <th className="col-sm-1"></th>
                        <th>Field</th>
                        <th className="text-center">Operator</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {emailEvents.map((field, fieldKey) => {
                        return (
                            <tr key={fieldKey}>
                                <td>

                                </td>
                                <td>
                                    <div className="p-2 border">
                                        {field.name}<span className="text-danger"> *</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="mt-2 text-center">equals</div>
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={apiSpeciality[field.fieldName]}
                                        onChange={e => {
                                            setApiSpeciality({...apiSpeciality, [field.fieldName]: e.target.value})
                                        }}
                                    >
                                        <option value="">Please select Field</option>
                                        {field.values?.map((option, optionKey) => {
                                            return (
                                                <option value={option.value} key={optionKey}>
                                                    {option.label}
                                                </option>
                                            )
                                        })}
                                    </Input>
                                </td>
                            </tr>
                        )
                    })}
                    {conditionFields?.map((field, i) => {
                        return (
                            <tr key={i}>
                                <td
                                    style={{
                                        fontSize: "1.5rem",
                                        textAlign: "right",
                                        marginTop: "6px",
                                        color: "#f46a6a",
                                        cursor: "pointer",
                                    }}
                                >
                                    <i
                                        className="mdi mdi-close"
                                        onClick={() => {
                                            removeField(field.id)
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={field.name}
                                        onChange={e => {
                                            handleFieldChoose(e.target.value, field.id)
                                        }}
                                    >
                                        <option value="">Please select Field</option>
                                        {emailTriggers?.map((trigger, i) => {
                                            return (
                                                <option value={trigger.fieldName} key={i}>
                                                    {trigger.name}
                                                </option>
                                            )
                                        })}
                                    </Input>
                                </td>
                                <td>
                                    <div className="mt-2 text-center">equals</div>
                                </td>
                                <td>
                                    
                                    {Array.isArray(field.answer) ? (

                                        <Select
                                            value={selectValue(field)}
                                            options={selectOptions(field)}
                                            onChange={(val)=>selectSet(val,field.id)}
                                            isMulti
                                        />
                                    ) : (

                                        <Input
                                            type="select"
                                            value={field.answer}
                                            onChange={e =>
                                                handleValueChoose(e.target.value, field.id)
                                            }
                                            disabled={field.name === ""}
                                        >
                                            <option value="">Please select Value</option>
                                            {renderOptions(field)}
                                        </Input>
                                    )}


                                    

                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
                <div className="d-flex align-items-center mx-3">
                    <i
                        className="bx bx-plus"
                        style={{
                            fontSize: "1.5rem",
                            textAlign: "right",
                            color: "#34c38f",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            addField()
                        }}
                    />
                    Add new clause
                </div>
                {/* <Form>
          <Row >
            <Col sm={6} md={5} >
            <FormGroup>
              <Label>To</Label>
              <Input type="text" id="templateName" name="templateName" placeholder="Enter a template name" className="form-control" style={{height:"36px"}} />
            </FormGroup>
            </Col>
            <Col sm={6} md={5}>
            <FormGroup>
              <Label>Equal to</Label>
              <Input type="text" id="templateName" name="templateName" placeholder="Enter a template name" className="form-control" style={{height:"36px"}} />
            </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={10}>
            <FormGroup>
              <Label>CC</Label>
              <Input type="textarea" id="templateDescription" name="templateDescription" placeholder="Enter a template Description" className="form-control"  />
            </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={10}>
            <FormGroup>
              <Label>BCC</Label>
              <Input type="textarea" id="templateDescription" name="templateDescription" placeholder="Enter a template Description" className="form-control"  />
            </FormGroup>
            </Col>
          </Row>
        </Form> */}
            </div>
        </div>
    )
}

Condition.propTypes = {
    shouldSubmit: PropTypes.bool,
    next: PropTypes.func,
    setSubmitfalse: PropTypes.func,
    emailEditMode: PropTypes.any,
    singleEmailTemplate: PropTypes.any

}

export default Condition
