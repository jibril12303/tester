import React,{ useEffect, useState} from 'react';
import {Table,Input,Label,Form,FormGroup,Row,Col,Tooltip,UncontrolledTooltip } from 'reactstrap';
import "./styles.css"
import PropTypes from 'prop-types';
import { showToast } from 'utils/toastnotify';
import { ReactComponent as FileUploadIcon } from "assets/icon/fileUploadIcon.svg";
import {v4 as uuid} from 'uuid';



let inputNodes = new Map();

export const TextInput = ({objName,placeholder,name,hide,value,handleValueChange,id})=>{
    
    return(
        <>
            <Input
            type="text"
            innerRef={c=>objName &&inputNodes.set(objName,c)}
            id={id}
            className="form-control"
            placeholder={placeholder && placeholder}
            name = {name && name}
            style={{display: `${!hide ? "":"none"}`,paddingRight:"10px"}}
            value ={value && value}
            onChange = {(e)=>handleValueChange(e.target.value)} 
            />
            { value?.length > 0  &&  (name == "Electrocardiogram" || placeholder == "Enter/upload result") &&
             <UncontrolledTooltip 
                placement="top"
                target={id}
                autohide={false}
                trigger = "hover"
            >
                {value}
             </UncontrolledTooltip >}
  
            </>
    )
}

const InvestigationToDate2 = ({currentQuestion,fields,nextButtonCalled,onClick,featureValues,setSecondInvestigateFeatureValues,question}) => {
    const [investigationList,setInvestigationList] = useState([]);
    const [inputTooltips, setInputTooltips] = useState({});

    const handleValueChange = (value,label,key)=>{
        console.log("checked",value)
        setSecondInvestigateFeatureValues({...featureValues,[label]:{...featureValues[label],[key]:value}})
    }
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
      }


    
    const handleTooltipToggle = (fieldName)=>{
        if(fieldName) setInputTooltips({...inputTooltips,[fieldName]:!inputTooltips.fieldName})
    }

    const handleChange = (e,objName) => {  
        console.log("f",e.target.files);
        if(e.target.files.length>0){
            let files = Object.keys(e.target.files).map((index)=>{
                let indexedFile = e.target.files[index]
                Object.assign(indexedFile,{
                    preview: indexedFile.preview ? indexedFile.preview : URL.createObjectURL(indexedFile),
                    formattedSize:formatBytes(indexedFile.size),
                })
                return {file:indexedFile,id:uuid()}
            });
            debugger;
            console.log('FILESOBJ',featureValues[objName])
            setSecondInvestigateFeatureValues({...featureValues,[objName]:{...featureValues[objName],file:typeof featureValues[objName]['file'] === 'number' ?[...files]:[...featureValues[objName]['file'],...files]}})
        }
        e.value = null
      };

      const handleDeleteImageOfField = (objName,imgId)=>{
        let files = featureValues[objName]?.file?.map((item)=>item);
        let index = files?.findIndex((item)=>item.id==imgId);
        if(index != -1){
            files.splice(index,1);
        }
        setSecondInvestigateFeatureValues({...featureValues,[objName]:{...featureValues[objName],file:typeof featureValues[objName]['file'] === 'number' ?[...files]:[...files]}});
    }
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
        const tooTipObj ={}

        fields?.content?.map((item,index)=>{
            const objName = item["investigation"]["objName"]; 
            obj[objName]={
                type:item["investigation"]["type"],
                value:"",
                fieldName:item["investigation"]?.value,
                unit:item["investigation"]?.unit
            }
            tooTipObj[objName] = false;
            if(item["presentation"]?.fields?.includes("images") ){
                obj[objName].file = [];
                
            }
            else if(item["presentation"]["type"] == 'radio' ){
                obj[objName].value = null;
            }


        })
        setSecondInvestigateFeatureValues(obj)
        setInputTooltips(tooTipObj)
        console.log("value obj=>",obj);
    }
    const renderRadioFields = (label,options)=>{
        return(   
                <div className="mt-2">
                        <Form>
                         <Row style={{maxWidth:"201px"}}>
                            {
                                options?.length == 2 && options.map((optionName,key)=>{
                                    return(
                                        <Col key={key} onClick={(e)=> handleValueChange(optionName,label,'value')} >
                                            <div style={{cursor: "pointer"}}  >
                                                <Input 
                                                // innerRef={c=>inputNodes.set(label,c)}
                                                
                                                type="radio" checked={featureValues && featureValues[label]?.value == optionName} />
                                                {' '}
                                                <label style={{marginTop:"1px"}} >{optionName}</label>
                                            </div>
                                         </Col>
                                    )
                                })
                            }
                         </Row>
                         </Form>
                        
                      </div>         
               
        )
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
        if(currentQuestion?.answers?.type?.toLowerCase() == 'rheuinves2' && nextButtonCalled){
    
                const validateInvestigation = ()=>{
                    let error = false;
                    let featureValueKeys = Object.keys(featureValues);
                    
                    for(let i=0; i<featureValueKeys.length; i++){
                        let objName = featureValueKeys[i];
                        if(featureValues[objName]?.type == "radio" && featureValues[objName]?.value == null ){
                            error = true;
                            break;                  
                        }
                        if(featureValues[objName]?.type == "textarea" && featureValues[objName]?.value?.length <1 && featureValues[objName]?.hasOwnProperty("file") == false){
                            error = true;
                            handleFocusonField(objName);
                            break;                  
                        }
                        if(featureValues[objName]?.hasOwnProperty("file")){
                            if(featureValues[objName]?.value.length <0 && featureValues[objName]?.file?.length ==0){
                                error = true;
                                handleFocusonField(objName);
                                break;                  
                            }
                        }
                    }
                    

                    return error;
                }

                if(question?.answers?.screenValidation === true){
                    //do validation and go next
                    const validateinv = validateInvestigation();
                    if(validateinv){
                            showToast("All mandatory fields must be filled to proceed",'error');
                    }
                    else
                    {
                            onClick({
                                answer: featureValues,
                                next: currentQuestion.answers.next,
                            });
                    }
                }
                else if(question?.answers?.screenValidation === false){
                    //store answer and go next
                    onClick({
                        answer: featureValues,
                        next: currentQuestion.answers.next,
                    });
                }                 
            }
        },[nextButtonCalled])
    
        return (
            <>
            <div className='mb-3'>
                <div className="mb-1 h4 card-title">
                        {question?.question?.split("\n").map((it,ind)=>{
                            return (
                                <div className='mb-1' key={ind}>{it}</div>
                            )
                        })}
                </div>
                { ("subHeading" in question) &&
                    <div className='card-title-desc' >
                        {
                            question?.subHeading?.split("\n").map((it,ind)=>{
                            return (
                            <p className='mb-1' key={ind}>{it}</p>
                            )
                            })
                        }
                    </div> 
        }
        </div>
        <div className="border p-2 investigation-table " >
        <Table className="border table table-striped mb-0">
            <thead>
                <tr>
                    <th className="col-sm-4" >
                        <Row>
                            <Col className="col-sm-6 ">
                            Investigation{question?.answers?.screenValidation === true && <span className="text-danger">*</span>}
                            </Col>
                            <Col className="col-sm-6 ">
                            Presentation{question?.answers?.screenValidation === true && <span className="text-danger">*</span>}
                            </Col>
                        </Row>
                    </th>
                    <th className="col-sm-4">
                         <Row>
                            <Col className="col-sm-6 ">
                            Investigation{question?.answers?.screenValidation === true && <span className="text-danger">*</span>}
                            </Col>
                            <Col className="col-sm-6 ">
                            Presentation{question?.answers?.screenValidation === true && <span className="text-danger">*</span>}
                            </Col>
                        </Row>
                    </th>
                    {/* <th className="col-sm-2" style={{borderRight:"1px solid #dddddd"}} >Presentation</th>
                    <th className="col-sm-2" >Investigation</th>
                    <th className="col-sm-2" >Presentation</th> */}
                </tr>
            </thead>
            <tbody>
                { featureValues != undefined && fields && investigationList?.map((item,index)=>{
                   
                        return(
                            <tr key={index}  >
                            <td className="font-weight-500"  >
                                <Row>
                                    <Col className="col-sm-6" style={{marginTop:"auto",marginBottom:"auto"}}> 
                                    {item?.investigation1?.value}
                                    </Col>
                                    <Col className="col-sm-6 ">
                                        {item?.investigation1?.presentation?.fields?.length ==1 && item?.investigation1?.presentation?.fields?.includes("textarea") && 
                                        <div key ={index}>

                                        <TextInput
                                        objName = {item?.investigation1?.objName}
                                        placeholder={item?.investigation1?.placeholder}
                                        name = {item?.investigation1?.value}
                                        hide = {item?.investigation1 ? false : true}
                                        value ={item?.investigation1?.objName && featureValues[item?.investigation1?.objName]?.value}
                                        handleValueChange = {(val)=>handleValueChange(val,item?.investigation1?.objName,'value')}
                                        id={"Tooltip-0"+`${index}`}
                                        />
                                        </div>
                                        }
                                        {item?.investigation1?.presentation?.fields?.length ==1 && item?.investigation1?.presentation?.fields?.includes("radio") && 
                                            renderRadioFields(item?.investigation1?.objName,item?.investigation1?.presentation?.options)
                                        }
                                        {item?.investigation1?.presentation?.fields?.length ==2 && item?.investigation1?.presentation?.fields?.includes("images") &&
                                            <>
                                            <Row>
                                            <Col style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"5px"}} >
                                            <TextInput
                                                objName = {item?.investigation1?.objName}
                                                placeholder={item?.investigation1?.placeholder}
                                                name = {item?.investigation1?.value}
                                                hide = {false}
                                                value ={item?.investigation1?.objName && featureValues[item?.investigation1?.objName]?.value}
                                                handleValueChange = {(val)=>handleValueChange(val,item?.investigation1?.objName,'value')}
                                                id={"Tooltip-0"+`${index}`}
                                            />
                                            <input type="file" value={[]} id={`actual-btn1-${index}`} multiple hidden
                                            onChange={(e)=>{handleChange(e,item?.investigation1?.objName)}} accept="image/*"/>
                                            <Label
                                                className='btn img-button'
                                                for={`actual-btn1-${index}`}
                                                color="#ced4da"
                                                outline
                                                style={{background:"#556EE6",border:"1px solid #ced4da",margin:"0px",}}

                                                >
                                                 <FileUploadIcon fill={"white"} />
                                            </Label>
                                            </Col>
                                            </Row>  
                                            {
                                                featureValues[item?.investigation1?.objName]?.file?.length>0 && featureValues[item?.investigation1?.objName]?.file.map((file,key)=>{
                                                    return(
                                                        <Row key={key} >
                                                        <Col>
                                                            <div className="border mt-1" style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                                           <div className="image-name-div text-bold ">
                                                            <div>
                                                            <img src={file?.file?.preview} style={{height:"63px",width:"90px"}}/>
                                                            </div>
                                                            <div className='text-center'>{file?.file?.name}</div> 
                                                            </div>
                                                            <div className="DelteIcondDiv" onClick={()=>handleDeleteImageOfField(item?.investigation1?.objName,file?.id)}>
                                                            <i className="bx bxs-trash text-danger" style={{fontSize:"16px"}}></i>
                                                            </div>
                                                            </div>
                                                        </Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                            </>
                                            
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
                                    <Col className="col-sm-6" style={{marginTop:"auto",marginBottom:"auto"}}> 
                                    {item?.investigation2?.value}
                                    { item?.investigation2?.value =="Electrocardiogram" && <div style={{maxWidth:"250px"}}>
                                        {`(${item?.investigation2?.placeholder})`}
                                    </div>}
                                    </Col>
                                    <Col className="col-sm-6 ">
                                        {item?.investigation2?.presentation?.fields?.length ==1 && item?.investigation2?.presentation?.fields?.includes("textarea") && 
                                          <>
                                             <TextInput
                                                objName = {item?.investigation2?.objName}
                                                placeholder={item?.investigation2?.placeholder}
                                                name = {item?.investigation2?.value}
                                                hide = {item?.investigation2 ? false : true}
                                                value ={item?.investigation2?.objName && featureValues[item?.investigation2?.objName]?.value}
                                                handleValueChange = {(val)=>handleValueChange(val,item?.investigation2?.objName,'value')}
                                                id={"Tooltip-1"+`${index}`}
                                             />
                                          </>
                                        }
                                        {item?.investigation2?.presentation?.fields?.length ==1 && item?.investigation2?.presentation?.fields?.includes("radio") && 
                                            renderRadioFields(item?.investigation2?.objName,item?.investigation2?.presentation?.options)
                                        }
                                        {item?.investigation2?.presentation?.fields?.length ==2 && item?.investigation2?.presentation?.fields?.includes("images") &&
                                            <>
                                            <Row>
                                            <Col style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"5px"}} >
                                            
                                            <TextInput
                                                objName = {item?.investigation2?.objName}
                                                placeholder={item?.investigation2?.placeholder}
                                                name = {item?.investigation2?.value}
                                                hide = {false}
                                                value ={item?.investigation2?.objName && featureValues[item?.investigation2?.objName]?.value}
                                                handleValueChange = {(val)=>handleValueChange(val,item?.investigation2?.objName,'value')}
                                                id={"Tooltip-1"+`${index}`}
                                            />
                                            <input type="file" id={`actual-btn2-${index}`} multiple hidden
                                            onChange={(e)=>{handleChange(e,item?.investigation2?.objName)}} accept="image/*"/>
                                            <Label
                                                className='btn img-button'
                                                for={`actual-btn2-${index}`}
                                                color="#ced4da"
                                                outline
                                                style={{background:"#556EE6",border:"1px solid #ced4da",margin:"0px",}}
                                                >
                                                 <FileUploadIcon fill={"white"} />
                                            </Label>
                                            </Col>
                                            </Row>
                                            {
                                                featureValues[item?.investigation2?.objName]?.file?.length>0 && featureValues[item?.investigation2?.objName]?.file.map((file,key)=>{
                                                    return(
                                                        <Row key={key} >
                                                        <Col>
                                                            <div className="border mt-1" style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                                            <div className="image-name-div text-bold ">
                                                            <div>
                                                            <img src={file?.file?.preview} style={{height:"63px",width:"90px"}}/>
                                                            </div>
                                                            <div className='text-center'>{file?.file?.name}</div> 
                                                            </div>
                                                            <div className="DelteIcondDiv" onClick={()=>handleDeleteImageOfField(item?.investigation2?.objName,file?.id)}>
                                                            <i className="bx bxs-trash text-danger" style={{fontSize:"16px"}}></i>
                                                            </div>
                                                            </div>
                                                        </Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                            </>
                                        } 

      
                                    </Col>
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

TextInput.propTypes = {
    objName: PropTypes.any,
    placeholder: PropTypes.any,
    name: PropTypes.any,
    hide: PropTypes.any,
    value: PropTypes.any,
    handleValueChange: PropTypes.any,
    id:PropTypes.any
}

InvestigationToDate2.propTypes={
    fields: PropTypes.any,
    nextButtonCalled : PropTypes.any,
    onClick:PropTypes.any,
    featureValues: PropTypes.any,
    setSecondInvestigateFeatureValues:PropTypes.any,
    question: PropTypes.any,
    currentQuestion: PropTypes.any,
}

export default InvestigationToDate2