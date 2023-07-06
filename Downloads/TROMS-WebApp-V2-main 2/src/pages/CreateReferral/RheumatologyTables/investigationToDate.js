import React,{ useEffect, useState} from 'react';
import {Table,Input,Label,Form,FormGroup,Row,Col,UncontrolledTooltip} from 'reactstrap';
import "./styles.css"
import PropTypes from 'prop-types';
import { showToast } from 'utils/toastnotify';



const InvestigationToDate = ({currentQuestion,fields,nextButtonCalled,onClick,featureValues,setInvestigateFeatureValues,question,setEsrModal}) => {

    const [investigationList,setInvestigationList] = useState([]) // table labels data max 3 labels in 1 row
    const [demo,setDemo] =useState("positive");
    const [storedCrpEsr,setStoredCrpEsr] = useState({
        crp: 0,
        esr: 0
    });

    let inputNodes = new Map();

    const handleValueChange = (value,label,key)=>{
        console.log("checked",value)
        setInvestigateFeatureValues({...featureValues,[label]:{...featureValues[label],[key]:value}})
    }



    //break list into object of 3 labels
    const renderValues = (list)=>{
        const Ol = list.map((item)=>item)
        let arr = [];
        let obj ={};
        let count =0;
        for(let i=0; i<Ol.length; i++){
                switch(count){
                case 0:
                obj.investigation1 = Ol[i].investigation;
                obj.investigation1.type = Ol[i].presentation.type;
                obj.investigation1.presentation =  Ol[i]?.presentation;
                if(i==Ol.length-1){
                arr.push(obj);
                }
                break;
                case 1:
                obj.investigation2 = Ol[i].investigation;
                obj.investigation2.type = Ol[i].presentation.type;
                obj.investigation2.presentation =  Ol[i]?.presentation;
                if(i==Ol.length-1){
                arr.push(obj);
                }
                break;
                case 2:
                obj.investigation3 = Ol[i].investigation;
                obj.investigation3.type = Ol[i].presentation.type;
                obj.investigation3.presentation =  Ol[i]?.presentation;
                arr.push(obj);
                obj = {};
                count =-1;
                break;
                }		
                count++;
            }
        console.log("formated",arr);
        setInvestigationList(arr);
    }

    const makeFieldValueObj = (fields)=>{
        
        const obj = {}

        fields?.content?.map((item,index)=>{
        let mandatoryFieldCheck;
        try{
            mandatoryFieldCheck = item["presentation"]?.required?.base;   
        }
        catch(err){
            mandatoryFieldCheck = false;
        }
        
            const objName = item["investigation"]["objName"]; 
            const fieldName = item["investigation"]?.value;
            obj[objName]={
                type:item["investigation"]["type"],
                value:"",
                mandatoryField:mandatoryFieldCheck,
                fieldName:fieldName,
                unit:item["investigation"]?.unit,

               
            }
            if(item["presentation"]["type"] == 'radio' ){
                obj[objName].value = null;
            }
            if(item["presentation"]?.required?.textarea === true){
                obj[objName].Description = "";

            }
        })
        setInvestigateFeatureValues(obj)
        console.log("value obj=>",obj);
    }

    const mandatoryFieldCheck = (presentation)=>{
        let present;
        try{
            present = presentation?.required?.base;
        }
        catch(e){
            present = false;
        }
        if(present===true){
            return <span className="text-danger">*</span>
        }
        return "";

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
            renderValues(fields.content);
            if(featureValues == undefined){
                makeFieldValueObj(fields)
            }else if(Object.keys(featureValues).length ==0  ){
                    makeFieldValueObj(fields);
            }
        }
    },[featureValues, fields])
    
    useEffect(()=>{
        console.log("fields=>",fields);
        if(fields){
            renderValues(fields.content);
            if(featureValues == undefined){
                makeFieldValueObj(fields)
            }else if(Object.keys(featureValues).length ==0  ){
                    makeFieldValueObj(fields);
            }
        }
    },[fields])

    useEffect(()=>{
        console.log("investigationList=>",investigationList);
    },[investigationList])

     useEffect(()=>{
        console.log("featureValues=>",featureValues);
    },[featureValues])

    useEffect(()=>{
    if(currentQuestion?.answers?.type?.toLowerCase() == 'rheuinves' && nextButtonCalled){

            const validateInvestigation = ()=>{
                let error = false;

                let featureValueKeys = Object.keys(featureValues);

                for(let i=0; i<featureValueKeys.length; i++){
                    let objName = featureValueKeys[i];
                    if(featureValues[objName]?.type == "input" && featureValues[objName]?.mandatoryField === true){
                        if(featureValues[objName]?.value?.length<=0){
                            // console.log('error',featureValues[objName])
                            error =true;
                            handleFocusonField(objName);
                            // showToast(`${objName} field must be filled to proceed`,'error');
                            break;
                        }
                    }
                    else if(featureValues[objName]?.type == "radio"  && featureValues[objName]?.mandatoryField === true){
                        if(featureValues[objName]?.value?.length<=0 || featureValues[objName]?.value?.length == null ){
                            error =true;
                            // showToast(`${objName} field must be filled to proceed`,'error');
                            break;

                                                    
                        }
                        else if(featureValues[objName].hasOwnProperty('Description')){
                            if(featureValues[objName]?.value == "positive" &&featureValues[objName]?.Description?.length<=2){
                            error =true;
                            handleFocusonField(objName);
                            // showToast(`please add description for ${objName} to proceed`,'error');
                            break;
                            }
                        }  
                    }                        
                }
                return error;
            }

            const validateinv = validateInvestigation();
            if(validateinv){
                showToast("All mandatory fields must be filled to proceed",'error');
            }
            else{
                if(featureValues["esr"]?.value != storedCrpEsr.esr || featureValues["crp"]?.value != storedCrpEsr.crp){
                    setEsrModal(true);
                    setStoredCrpEsr({
                        ...storedCrpEsr,
                        crp:featureValues["crp"]?.value,
                        esr:featureValues["esr"]?.value
                    })
                }
                else{
                    onClick({
                        answer: featureValues,
                        next: currentQuestion.answers.next,
                    });
                }
            }
        }
    },[nextButtonCalled])


    const renderRadioFields = (label)=>{
        return(   
                <div className="mt-2">
                        <Form>
                         <Row>
                          <Col onClick={(e)=> handleValueChange('positive',label,'value')} >
                          <div style={{cursor: "pointer"}}  >
                             <Input 
                            innerRef={c=>inputNodes.set(label,c)}
                             
                             type="radio" checked={featureValues[label]?.value == 'positive'} />
                             {' '}
                             <label style={{margin:"0px"}} >+ve</label>
                         </div>
                          </Col>
                          <Col  style={{padding:"initial"}} >
                          <div  onClick={(e)=>handleValueChange('negative',label,'value')} >
                             <Input
                           innerRef={c=>inputNodes.set(label,c)}
                             
                             type="radio" checked={featureValues[label]?.value == 'negative'}/>
                             {' '}
                             <label style={{margin:"0px"}} >-ve</label>
                         </div>
                          </Col>
                         </Row>
                         </Form>
                        
                      </div>         
               
        )
    }



    return (
        <>
    <div className="mb-3 h4 card-title">
            {question?.question?.split("\n").map((it,ind)=>{
                return (
                    <div className='mb-1' key={ind}>{it}</div>
                )
            })}
    </div>  
    <div className="border p-2 investigation-table " >
    <Table className="border table table-striped mb-0">
        <thead>
            <tr>
                <th className="col-sm-4" >
                    <Row>
                        <Col className="col-sm-6 ">
                        Investigation
                        </Col>
                        <Col className="col-sm-6 ">
                        Presentation
                        </Col>
                    </Row>
                </th>
                <th className="col-sm-4">
                     <Row>
                        <Col className="col-sm-6 ">
                        Investigation
                        </Col>
                        <Col className="col-sm-6 ">
                        Presentation
                        </Col>
                    </Row>
                </th>
                <th className="col-sm-4" >
                     <Row>
                        <Col className="col-sm-6 ">
                        Investigation
                        </Col>
                        <Col className="col-sm-6 ">
                        Presentation
                        </Col>
                    </Row>
                </th>
                {/* <th className="col-sm-2" style={{borderRight:"1px solid #dddddd"}} >Presentation</th>
                <th className="col-sm-2" >Investigation</th>
                <th className="col-sm-2" >Presentation</th> */}
            </tr>
        </thead>
        <tbody>
            {featureValues != undefined && fields && investigationList?.map((item,index)=>{
                    return(
                        <tr key={index}  >
                        <td className="font-weight-500"  >
                            <Row>
                                <Col className="col-sm-6" style={{marginTop:"auto",marginBottom:"auto"}}> 
                                {item?.investigation1?.value}{" "}{mandatoryFieldCheck(item?.investigation1?.presentation)}
                                </Col>
                                <Col className="col-sm-6 ">
                                    {item?.investigation1?.type === 'input' && <Input
                                        type="text"
                                        innerRef={c=>inputNodes.set(item?.investigation1?.objName,c)}
                                        className="form-control"
                                        placeholder={item?.investigation1?.placeholder}
                                        name = {item?.investigation1?.value}
                                        style={{display: `${item?.investigation1 ? "":"none"}`,paddingRight:"10px"}}
                                        value = {item?.investigation1?.objName && featureValues[item?.investigation1?.objName]?.value}
                                        onChange = {(e)=>handleValueChange(e.target.value,item?.investigation1?.objName,'value')} 
                                        />
                                    }
                                    {item?.investigation1?.type === 'radio' && 
                                        renderRadioFields(item?.investigation1?.objName)
                                    }
  
                                </Col>
                                {featureValues[item?.investigation1?.objName]?.value == "positive" &&
                                 item?.investigation1?.presentation?.required?.textarea === true && <div className="mt-2">
                                        <Input
                                            type="textarea"
                                            className="form-control"
                                            placeholder="Description"
                                            value = {item?.investigation1?.objName && featureValues[item?.investigation1?.objName]?.value}
                                            onChange = {(e)=>handleValueChange(e.target.value,item?.investigation1?.objName,'value')} 
                                        />
                                     </div>
                                     }
                            </Row>
                        </td>
                        {/* <td style={{borderRight:"1px solid #dddddd"}}  >
                            
                        </td> */}
                        <td style={{borderLeft:"1px solid #dddddd",borderRight:"1px solid #dddddd"}}>
                            <Row>
                                <Col className="col-sm-6 " style={{marginTop:"auto",marginBottom:"auto"}}>
                                {item?.investigation2?.value}{" "}{mandatoryFieldCheck(item?.investigation2?.presentation)}
                                </Col>
                                <Col className="col-sm-6 ">
                               {item?.investigation2?.type === 'input' &&  <Input
                                    type="text"
                                    className="form-control"
                                    innerRef={c=>inputNodes.set(item?.investigation2?.objName,c)}
                                    style={{display: `${item?.investigation2 ? "":"none"}`}}
                                    placeholder={item?.investigation2?.unit}
                                    name = {item?.investigation2?.value}
                                    value = {item?.investigation2?.objName && featureValues[item?.investigation2?.objName]?.value}
                                    onChange = {(e)=>handleValueChange(e.target.value,item?.investigation2?.objName,'value')} 
                                    />
                                 }
                                 {item?.investigation2?.type === 'radio' && 
                                        renderRadioFields(item?.investigation2?.objName)
                                 }
                                </Col>
                                {featureValues[item?.investigation2?.objName]?.value == "positive" && 
                                 item?.investigation2?.presentation?.required?.textarea === true &&<div className="mt-2">
                                        <Input
                                            type="textarea"
                                            className="form-control"
                                            placeholder="Description"
                                            value = {item?.investigation2?.objName && featureValues[item?.investigation2?.objName]?.Description}
                                            onChange = {(e)=>handleValueChange(e.target.value,item?.investigation2?.objName,'Description')} 
                                        />
                                     </div>
                                }                              
                            </Row>
                        </td>
                        {/* <td style={{borderRight:"1px solid #dddddd"}} >
                          
                        </td> */}
                        
                        <td>
                        <Row>
                                <Col className="col-sm-6 " style={{marginTop:"auto",marginBottom:"auto"}}>
                                <div className='d-flex align-items-center' >
                                {item?.investigation3?.value}{" "}{mandatoryFieldCheck(item?.investigation3?.presentation)}{" "}
                                {item?.investigation3.helpfulInfo && 
                                    <>
                                        <i className='bx bxs-info-circle text-primary mx-1' id="DateOnsetTooltip" style={{fontSize:"large",cursor:"pointer"}}/>
                                        <UncontrolledTooltip
                                        target="DateOnsetTooltip"
                                        // target={"priorityBadge" + row.caseID}
                                        placement="top"
                                        >
                                        {item?.investigation3.helpfulInfo}
                                        </UncontrolledTooltip>
                                    </>
                                }
                                </div>
                                </Col>
                                <Col className="col-sm-6 ">
                                {item?.investigation3?.type === 'input' && <Input
                                    type="text"
                                    innerRef={c=>inputNodes.set(item?.investigation3?.objName,c)}
                                    className="form-control"
                                    style={{display: `${item?.investigation3 ? "":"none"}`}}
                                    placeholder={item?.investigation3?.placeholder}
                                    name = {item?.investigation3?.value}
                                    value = {item?.investigation3?.objName && featureValues[item?.investigation3?.objName]?.value}
                                    onChange = {(e)=>handleValueChange(e.target.value,item?.investigation3?.objName,'value')} 
                                    />
                                    }
                                {item?.investigation3?.type === 'radio' && 
                                        renderRadioFields(item?.investigation3?.objName)
                                }
                                </Col>
                                {featureValues[item?.investigation3?.objName]?.value == "positive" && 
                                item?.investigation3?.presentation?.required?.textarea === true && 
                                <div className="mt-2">
                                        <Input
                                            type="textarea"
                                            className="form-control"
                                            placeholder="Description"
                                            value = {item?.investigation3?.objName && featureValues[item?.investigation3?.objName]?.Description}
                                            onChange = {(e)=>handleValueChange(e.target.value,item?.investigation3?.objName,'Description')} 
                                        />
                                     </div>
                                }
                            </Row>
                             </td>
                    </tr>
                    )}            
            )}
        </tbody>
    
    
    </Table>
    </div>
    </>
  )
}

InvestigationToDate.propTypes={
    fields: PropTypes.any,
    nextButtonCalled : PropTypes.any,
    onClick:PropTypes.any,
    featureValues: PropTypes.any,
    setInvestigateFeatureValues:PropTypes.any,
    question: PropTypes.any,
    currentQuestion: PropTypes.any,
    setEsrModal: PropTypes.any,
}

export default InvestigationToDate;