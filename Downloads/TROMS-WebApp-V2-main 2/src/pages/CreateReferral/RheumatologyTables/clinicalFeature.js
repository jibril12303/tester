import React,{ useEffect, useState,useRef} from 'react';
import {Table,Input,Label,Form,FormGroup,Row,Col,UncontrolledTooltip} from 'reactstrap';
import PropTypes from 'prop-types';
import { showToast } from 'utils/toastnotify';
import moment from 'moment';
import "./styles.css"

const ClinicalFeature = ({fields,nextButtonCalled,onClick,featureValues,setClinicalFeatureValues,question,currentQuestion}) => {

    let inputNodes = new Map();
    let rowNodes = new Map();

    const handleValueChange = (value,label,key)=>{
        console.log("checked",value,"label")
        console.log("featureValues[label]?.present",featureValues[label]?.present);
        if(key == "dateResolved" && featureValues[label]?.present == "yes" ){
            let OnsetDate = new Date(featureValues[label]?.dateOnset);
            let ResolvedDate = new Date(value);
            console.log("OnsetDate",OnsetDate,"ResolvedDate",ResolvedDate);
            if(ResolvedDate< OnsetDate){
                showToast("resolved Date must be greater than onset Date", 'error')
            }
            else{
                setClinicalFeatureValues({...featureValues,[label]:{...featureValues[label],[key]:value}});        
            }

        }
        else if(key == "dateOnset"){
            let OnsetDate = new Date(value);
            let ResolvedDate = new Date(featureValues[label]?.dateResolved);
            if(ResolvedDate< OnsetDate){
                setClinicalFeatureValues({...featureValues,[label]:{...featureValues[label],[key]:value,dateResolved:value}})    
            }
            else{
                setClinicalFeatureValues({...featureValues,[label]:{...featureValues[label],[key]:value}})      
            }
        }
        else if(key == "present" && value == "no"){
            setClinicalFeatureValues({...featureValues,[label]:{...featureValues[label],dateOnset:'',present:'no'}})
        }
        else{
            setClinicalFeatureValues({...featureValues,[label]:{...featureValues[label],[key]:value}})
        }
        
    }

    const makeFieldValueObj = (fields)=>{

        const obj = {}

        fields?.content?.map((item,index)=>{
         //       console.log("fieldName",fieldName);
         //           console.log("fieldName.value",fieldName.value);
                    obj[item?.name?.objName] = {
                        present:'null',
                        dateOnset:'',
                        dateResolved:'',
                        fieldName:item?.name?.value
                    }
        })
        setClinicalFeatureValues(obj)
        console.log("value obj=>",obj);
    }

    const handleFocusonRow = (i)=>{
        console.log("onFocusonRow",i);
        const node = rowNodes.get(i);
        console.log("node",node);
        node.classList.add("errorRow")
        node.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
        // node.;
    //     node.focus();
        setTimeout(()=>{
            node.classList.remove("errorRow");
        },3000)
    }

    const handleFocusonField = (i)=>{
        const node = inputNodes.get(i);
        console.log("node",node);
        node.classList.add("errorBorder")
        node.focus();
    //     node.focus();
        setTimeout(()=>{
            node.classList.remove("errorBorder");
        },4000)
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
        if(fields){
            if(Object.keys(featureValues).length ==0 ){
                makeFieldValueObj(fields);
            }
        }
    },[fields])

    useEffect(() => {

        if (currentQuestion?.answers?.type?.toLowerCase() == 'rheuclini' && nextButtonCalled) {
            const validateClinicalFields = ()=>{
                    let error = false;
                    let featureValueKeys = Object.keys(featureValues);
                    for(let i=0; i<featureValueKeys.length; i++) {
                    let objName = featureValueKeys[i];
                        if(featureValues[objName].present === "null"){
                            console.log("Error: " + objName + " is not a valid featureValues");
                            handleFocusonRow(objName);
                            error = true;
                            break;
                        }
                        else if(featureValues[objName].present == "yes"){
                            if(featureValues[objName].dateOnset.length <=0){
                                const fieldName = objName+"-"+"dateOnset";
                                handleFocusonField(fieldName);
                                error = true;
                                break;
                            }
                        }
                    }
                    return error;
                }

            const validateClinic = validateClinicalFields();
                    if(validateClinic){
                        showToast("Please select all the fields",'error');
                    }else{
                        debugger;
                        onClick({
                            answer: featureValues,
                            endpoint: currentQuestion.answers.endpoint,
                        });
                    }
        }

    }, [nextButtonCalled])


    // useEffect(() => {

    //     let error = null;
    //     if(nextButtonCalled){
    //     // fieldValues && Object.keys(fieldValues).forEach(field=>{
    //     //     if(fieldValues[field]){
    //     //         if(fieldValues[field].present == null){
    //     //             error="true"
    //     //         }
    //     //     }
    //     // })

    //     onClick();

    //     if(error = "true"){
    //         showToast('Please fill all the fields','error');
    //     }}
    // },[nextButtonCalled])


    useEffect(() => {
        console.log("featureValues",featureValues);
    },[featureValues])

  return (
      <>
          <div className="mb-3 h4 card-title">
            {question?.question?.split("\n").map((it,ind)=>{
                return (
                    <div className='mb-1' key={ind}>{it}</div>
                )
            })}
        </div>
        <div className="border p-2" >
        {fields &&
        <Table className="table table-striped mb-0">
            <thead>
                <tr>
                    {/* <th className="col-sm-5 col-lg-5" >
                    Clinical Features
                    </th>
                    <th className="col-sm-4 col-lg-2">Present</th>
                    <th className="col-sm-auto col-lg-auto">Date Onset</th>
                    <th className="col-sm-auto col-lg-auto">Date Resolved</th> */}
                    <th className="col-sm-6  " >
                    {fields?.headers[0]?.label}<span className="text-danger">*</span>
                    </th>
                    <th className="col-sm-3  ">{fields?.headers[1]?.label}<span className="text-danger">*</span></th>
                    <th className="col-sm-auto">
                        <div className='d-flex align-items-center' >
                        {fields?.headers[2]?.label} 
                        <i className='bx bxs-info-circle text-primary mx-1' id="DateOnsetTooltip" style={{fontSize:"large",cursor:"pointer"}}/>
                        <UncontrolledTooltip
                        target="DateOnsetTooltip"
                        // target={"priorityBadge" + row.caseID}
                        placement="top"
                        >
                        {`Date of onset is required if present is selected "Yes" for the given feature`}
                        </UncontrolledTooltip>
                        </div>
                    </th>
                    <th className="col-sm-auto">{fields?.headers[3]?.label}</th>
                </tr>
            </thead>
            <tbody>
                {featureValues != undefined &&   fields?.content?.map((item,index)=>{
                    return(
                        <tr key={index} style={{verticalAlign:"middle"}} ref={(c)=>rowNodes.set(item?.name?.objName,c)}>
                        <td>{item?.name?.value}</td>
                        <td>
                            <div>
                            <Form>
                            <Row style={{maxWidth:"170px"}} >
                             <Col  onClick={(e)=> handleValueChange("yes",item?.name?.objName,"present") } style={{cursor: "pointer"}}  >
                             <div style={{cursor: "pointer"}}  >
                                <Input type="radio" checked={featureValues[item?.name?.objName]?.present == "yes"} />
                                {' '}
                                <label style={{margin:"0px"}} >Yes</label>
                            </div>
                             </Col>
                             <Col style={{cursor: "pointer"}}>
                             <div  onClick={(e)=> handleValueChange("no",item?.name?.objName,"present") } >
                                <Input type="radio" checked={featureValues[item?.name?.objName]?.present == "no"} />
                                {' '}
                                <label style={{margin:"0px"}} >No</label>
                            </div>
                             </Col>   
                            </Row>
    
    
                            </Form>
                            </div>
    
                        </td>
                        <td>
                        <Input
                        innerRef={(c)=>inputNodes.set(`${item?.name?.objName}-dateOnset`,c)}
                        type="date"
                        className="form-control"
                        placeholder="DD/MM/YYYY"
                        name="dateOnset"
                        value = {featureValues[item?.name?.objName]?.dateOnset}
                        onChange={(e)=>handleValueChange(e.target.value,item?.name?.objName,"dateOnset")}
                        disabled={featureValues[item?.name?.objName]?.present !== "yes" ? true : false}
                        max={moment(new Date()).format('YYYY-MM-DD')}
                        />
                        </td>
                        <td>
                        <Input
                        type="date"
                        className="form-control"
                        placeholder="DD/MM/YYYY"
                        name = "dateResolved"
                        value = {featureValues[item?.name?.objName]?.dateResolved}
                        onChange = {(e)=>handleValueChange(e.target.value,item?.name?.objName,"dateResolved")}
                        // disabled={featureValues[item?.name?.objName]?.present !== "yes" ? true : false}                        
                        min={featureValues[item?.name?.objName]?.dateOnset}
                        /></td>
                    </tr>
                    )
                })}

            </tbody>
        </Table>
        }
    
    </div>
    </>
  )
}

ClinicalFeature.propTypes = {
    fields: PropTypes.any,
    nextButtonCalled : PropTypes.any,
    onClick:PropTypes.any,
    setClinicalFeatureValues:PropTypes.any,
    featureValues:PropTypes.any,
    question: PropTypes.any,
    currentQuestion: PropTypes.any

};

export default ClinicalFeature