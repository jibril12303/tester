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

import useVitalsValidator from 'hooks/useVitalsValidator';

const VitalScreen = ({fields,vitalFieldValues = {
  "Blood pressure":'',
  "Respiration rate":'',
  "Heart rate":'',
  "Body temparature":''
},setVitalFieldValues,question,nextButtonCalled,onClick,currentQuestion}) => {
const [validator, showValidationMessage] = useVitalsValidator();

const [error, setError] = useState({
  "Blood pressure":false,
  "Respiration rate":false,
  "Heart rate":false,
  "Body temparature":false
})

const setValue = (e) => {
    validator.hideMessages();
    if (e.currentTarget != null){
        setVitalFieldValues({...vitalFieldValues, [e.currentTarget.name]: e.currentTarget.value})
    } else {
        setVitalFieldValues({...vitalFieldValues, [e.target.name]: e.target.value})
    }
}

useEffect(()=>{
//logic for validating and submitting
if(nextButtonCalled && currentQuestion?.answers?.type?.toLowerCase() == 'rheuvital'){
  setError({
    ...error,
    "Blood pressure":!validator.fieldValid('Blood pressure'),
    "Respiration rate":!validator.fieldValid('Respiration rate'),
    "Heart rate":!validator.fieldValid('Heart rate'),
    "Body temparature":!validator.fieldValid('Body temparature')
})

if (validator.allValid()){
  console.log("lvital values",vitalFieldValues);

  onClick({
    answer: vitalFieldValues,
    next: currentQuestion.answers.next,
});
}
 else{
  showValidationMessage(true)
}
}
},[nextButtonCalled])


  useEffect(()=>{
    console.log("vitalFieldValues",vitalFieldValues);
  },[vitalFieldValues])


  return (
    <div>
      <Form className="form">
          
          <Row  style={{marginBottom:'9px'}} >
            <Col sm="6"  >
            <FormGroup  >
            <Row>
              <Col sm="6"  >
              <Label>Blood pressure<span className="text-danger">*</span></Label>
              </Col>
              <Col sm="6"  >
              <div style={{display:'flex',flexDirection:'column'}} >
                        <Input
                          // innerRef={nhsNumberRef}
                          type="text"
                          className="form-control"
                          style={{height:'36px',width:"200px"}}
                          name="Blood pressure"
                          placeholder={"Systolic/diastolic in mmHg"}
                          value={vitalFieldValues["Blood pressure"]}
                          onChange={setValue}
                          invalid={error["Blood pressure"]}
                        />
                        <FormFeedback>{validator.message("Blood pressure", vitalFieldValues["Blood pressure"], 'required|BloodPressure')}</FormFeedback>
                        </div>
                        </Col>
            </Row>
          </FormGroup>
            </Col>
          </Row>
          <Row  style={{marginBottom:'9px'}} >
            <Col sm="6"  >
            <FormGroup  >
            <Row>
              <Col sm="6"  >
              <Label>Respiration rate<span className="text-danger">*</span></Label>
              </Col>
              <Col sm="6"  >
              <div style={{display:'flex',flexDirection:'column'}} >
                        <Input
                          // innerRef={nhsNumberRef}
                          type="text"
                          className="form-control"
                          style={{height:'36px',width:"200px"}}
                          name="Respiration rate"
                          placeholder={"Breaths/min"}
                          value={vitalFieldValues["Respiration rate"]}
                          onChange={setValue}
                          invalid={error["Respiration rate"]}
                        />
                        <FormFeedback>{validator.message("Respiration rate", vitalFieldValues["Respiration rate"], 'required|integer')}</FormFeedback>
                    </div>  </Col>
            </Row>

          </FormGroup>
            </Col>
          </Row>
          <Row  style={{marginBottom:'9px'}} >
            <Col sm="6"  >
            <FormGroup >
            <Row>
              <Col sm="6"  >
              <Label>Heart rate<span className="text-danger">*</span></Label>
              </Col>
              <Col sm="6"  >
              <div style={{display:'flex',flexDirection:'column'}} >
                        <Input
                          // innerRef={nhsNumberRef}
                          type="text"
                          className="form-control"
                          style={{height:'36px',width:"200px"}}
                          name="Heart rate"
                          placeholder={"Beats/min "}
                          value={vitalFieldValues["Heart rate"]}
                          onChange={setValue}
                          invalid={error["Heart rate"]}
                        />
                        <FormFeedback>{validator.message("Heart rate", vitalFieldValues["Heart rate"], 'required|integer')}</FormFeedback>
                    </div></Col>
            </Row>

          </FormGroup>
            </Col>
          </Row>
          <Row  style={{marginBottom:'9px'}} >
            <Col sm="6">
            <FormGroup >
              <Row>
                <Col sm="6">
                <Label>Body temparature<span className="text-danger">*</span></Label>
                </Col>
                <Col sm="6">
                <div style={{display:'flex',flexDirection:'column'}} >
                  <Input
                    type="text"
                    className="form-control"
                    style={{height:'36px',width:"200px"}}
                    name="Body temparature"
                    placeholder={"Deg C"}
                    value={vitalFieldValues["Body temparature"]}
                    onChange={setValue}
                    invalid={error["Body temparature"]}
                  />
                  <FormFeedback>{validator.message("Body temparature", vitalFieldValues["Body temparature"], 'required|numeric')}</FormFeedback>
                </div>
                </Col>
              </Row>
          </FormGroup>
            </Col>
          </Row>
     
    </Form>
    </div>
  )
}

VitalScreen.propTypes = {
  fields:PropTypes.any,
  vitalFieldValues:PropTypes.any,
  setVitalFieldValues:PropTypes.any,
  question:PropTypes.any,
  nextButtonCalled:PropTypes.any,
  onClick:PropTypes.any,
  currentQuestion:PropTypes.any
}


export default VitalScreen