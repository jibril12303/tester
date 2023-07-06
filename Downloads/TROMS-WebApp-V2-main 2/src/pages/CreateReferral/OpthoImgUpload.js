import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Form, FormGroup, Label, Col, Card, Row, Modal,Button,Input } from 'reactstrap';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import  Dropzone  from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { createReferralCreators } from 'store/create-referral/reducer';
import { setClient } from 'utils/apiUtils';
import { Link } from 'react-router-dom';
import { showToast } from 'utils/toastnotify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import BootstrapTable from "react-bootstrap-table-next"
import DeleteIcon from "assets/icon/delete.svg"
import { useHistory } from "react-router-dom";

const OpthoImageUpload = (props) => {

    const history = useHistory()
    function onDrop(acceptedFiles){
        handleAcceptedFiles(acceptedFiles)
    }

    
    function onDropReye(acceptedFiles){
        handleAcceptedReyeFiles(acceptedFiles)
    }

    
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({onDrop, accept: 'image/jpeg, image/png, video/mp4'});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [showNoImgModal, setNoImgModal] = useState(false)
    const [imageDelete, setImageDelete] = useState(null)

    const [eyeselect,setEyeSelect] = useState('')
    //right eye states
    const [rEyeselectedFiles, setReyeSelectedFiles] = useState([]);
    const [rEyeimageDelete, setReyeImageDelete] = useState(null)
    const [saveModal, setSaveModal] = useState(false)
    const [imageConfirm, setImageConfirm] = useState(false)

    const dispatch = useDispatch();

    const handleAcceptedReyeFiles = files => {
        files.map(file =>
          Object.assign(file, {
            preview: file.preview ? file.preview : URL.createObjectURL(file),
            formattedSize:formatBytes(file.size),
            ophthoType: file.ophthoType || "Other",
            mimeType: file.type
          })
        )
        setReyeSelectedFiles([...rEyeselectedFiles,...files])
        }

    const handleAcceptedFiles = files => {
        files.map(file =>
          Object.assign(file, {
            preview: file.preview ? file.preview : URL.createObjectURL(file),
            formattedSize:formatBytes(file.size),
            ophthoType: file.ophthoType || "Other",
            mimeType: file.type
          })
        )
        setSelectedFiles([...selectedFiles,...files])
        }
    console.log(selectedFiles)
    console.log(rEyeselectedFiles)

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
      }

    console.log(selectedFiles,"selectedFiles")
    

    useEffect(() => {
        //debugger;
        try{
            if('givenAnswer' in props.currentQuestion){
                if(props.currentQuestion.answers.type == "opthoimages"){
                    setSelectedFiles(props.currentQuestion.givenAnswer.images.leftEye)
                    setReyeSelectedFiles(props.currentQuestion.givenAnswer.images.rightEye)
                    // handleAcceptedFiles(props.currentQuestion.givenAnswer.images.leftEye)
                    // handleAcceptedReyeFiles(props.currentQuestion.givenAnswer.images.rightEye)
                    return;
                }
            }
        }
        catch (err){}
        try{
            if('givenAnswer' in lastResponse){
                if(lastResponse.type == "opthoimages"){
                    setSelectedFiles(lastResponse.givenAnswer.images.leftEye)
                    setReyeSelectedFiles(lastResponse.givenAnswer.images.rightEye)
                    // handleAcceptedFiles(lastResponse.givenAnswer.images.leftEye)
                    // handleAcceptedReyeFiles(lastResponse.givenAnswer.images.rightEye)
                    return;
                }
            }
        }
        catch (err){}
    }, [props.currentQuestion]);
   

     
let imagelist = generateData(selectedFiles);
let Reyeimagelist = generateData(rEyeselectedFiles);

function generateData(selectedFiles){

    let length = 0;  
    if(selectedFiles){
        length = selectedFiles.length
    }
    var returnedValue = [];


    for(let index=0; index<length; index++){
        
        returnedValue.push({
            id:index,
            fileName:selectedFiles[index].name || selectedFiles[index].path,
            fileType:"input",
            preview:selectedFiles[index].preview,
            size:selectedFiles[index].formattedSize,
            ophthoType: selectedFiles[index].ophthoType || "Other"
        })
    }
    return returnedValue;
}


    const [imageList, setImagesList] = useState([]);
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
        }
    ]);

    const [noConsent,setNoConsent] = useState(false);

    const onConsentChange = (e, item, index) => {
        const newConsent = [...consents];
        newConsent[index].checked = !newConsent[index].checked;
        setConsents(newConsent);
    };

    const { token, caseDetails, questionAnswers, pathwayName, selectedSpeciality, lastResponse } = useSelector((state) => ({
        token: state.appReducer.token,
        caseDetails: state.CreateReferral.caseDetails,
        questionAnswers: state.CreateReferral.questionAnswers,
        pathwayName: state.CreateReferral?.selectedPathway.name,
        selectedSpeciality: state.CreateReferral?.speciality.value,
        lastResponse: state.CreateReferral.lastResponse
    }));


    const columns = [
        
        {
          dataField: "fileName",
          text: "File name",
          formatter:(cellContent,row)=>(
              <>
              <div className="align-items-center">
                    <div className="col-auto">
                        <img
                            data-dz-thumbnail=""
                            height="80"
                            className="avatar-sm rounded bg-light"
                            alt={row.fileName}
                            src={row.preview}
                            style={{border:'2px solid #2A3042'}}
                        />

                    </div>
                    <div>
                        <Link to="#" className="text-muted font-weight-bold">
                            {row.fileName}
                        </Link>
                        <p className="mb-0">
                            <strong>{row.size}</strong>
                        </p>
                    </div>
                    </div>
              </>
          )
        },
        // {
        //   dataField: "fileType",
        //   text: "File Type",
        //   formatter:(cellContent,row)=>(
        //       <>
        //        <Input type="select" className='form-select form-control' defaultValue={row.ophthoType} onChange={(e)=>{
        //            let newArr = selectedFiles.map((element,index) => {
        //             if(element.preview === row.preview ){
        //                 return Object.assign(element,{
        //                     ophthoType: e.target.value
        //                 })
        //             } else {
        //                 return element
        //             }
        //         })
        //         setSelectedFiles(newArr)
        //        }}> 
        //           <option value="OCT" name="OCT">OCT</option>
        //           <option value="Fundus" name="Fundus">Fundus</option>
        //           <option value="Visual Fields" name="Visual Fields">Visual Fields</option>
        //           <option value="External Eye" name="External Eye">External Eye</option>
        //           <option value="Other" name="Other">Other</option>
        //       </Input>
        //       </>
        //  )
        // },
        {
          dataField: "btn",
          isDummyField: true,
          text: "Action",
          formatter:(cellContent,row)=>(
          <>
              <Button type="button" 
              style={{background:'none',border:'none'}}
              onClick={()=>{
                 
                        setImageDelete(selectedFiles[row.id])
                        setEyeSelect("left")
                        setShowModal(true)
                
                    }}>
                  <span >
                     <i className="bx bx-trash bx-md" style={{color:"#495057"}} /> 
                  </span>
              </Button>
              </>
          )
        },
    
      ]

      const rEyecolumns = [
        
        {
          dataField: "fileName",
          text: "File name",
          formatter:(cellContent,row)=>(
              <>
              <div className="align-items-center">
                    <div className="col-auto">
                        <img
                            data-dz-thumbnail=""
                            height="80"
                            className="avatar-sm rounded bg-light"
                            alt={row.fileName}
                            src={row.preview}
                            style={{border:'2px solid #2A3042'}}
                        />

                    </div>
                    <div>
                        <Link to="#" className="text-muted font-weight-bold">
                            {row.fileName}
                        </Link>
                        <p className="mb-0">
                            <strong>{row.size}</strong>
                        </p>
                    </div>
                    </div>
              </>
          )
        },
        // {
        //   dataField: "fileType",
        //   text: "File Type",
        //   formatter:(cellContent,row)=>(
        //       <>
        //        <Input type="select" className='form-select form-control' defaultValue={row.ophthoType} onChange={(e)=>{
        //            console.log("TYPEEE",e.target.value)
        //            debugger;
        //            let newArr = rEyeselectedFiles.map((element,index) => {
        //             if(element.preview === row.preview ){
        //                 return Object.assign(element,{
        //                     ophthoType: e.target.value
        //                 })
        //             } else {
        //                 return element
        //             }
        //            })
        //            setReyeSelectedFiles(newArr)
        //        }}> 
        //           <option value="OCT" name="OCT">OCT</option>
        //           <option value="Fundus" name="Fundus">Fundus</option>
        //           <option value="Visual Fields" name="Visual Fields">Visual Fields</option>
        //           <option value="External Eye" name="External Eye">External Eye</option>
        //           <option value="Other" name="Other">Other</option>
        //       </Input>
        //       </>
        //  )
        // },
        {
          dataField: "btn",
          isDummyField: true,
          text: "Action",
          formatter:(cellContent,row)=>(
          <>
              <Button type="button" 
              style={{background:'none',border:'none'}}
              onClick={()=>{
                
                setReyeImageDelete(  rEyeselectedFiles[row.id])
                    setEyeSelect("right")
                    setShowModal(true)
                  
                    }}>
                  <span >
                     <i className="bx bx-trash bx-md" style={{color:"#495057"}} /> 
                  </span>
              </Button>
              </>
          )
        },
    
      ]

      console.log("opthprops",props)
    useEffect(() => {
        if (props.nextButtonCalled) {
            if (!consents[0].checked){
                showToast("You must selected the mandatory fields before continuing", 'error')
                return;
            }
            if (selectedFiles.length == 0 && rEyeselectedFiles.length == 0){
                return setNoImgModal(true);
            }
            setClient(token);
            setImageConfirm(true)
        }
    }, [props.nextButtonCalled]);

    useEffect(()=>{
        if(props.save){
            if(props.currentQuestion.answers.type == "opthoimages"){
                setSaveModal(true)
            }
        }
    },[props.save])

    return (
        <>
        <div>
            <CardTitle className="h4">Upload Image(s)</CardTitle>
            <p className="card-title-desc">
                {
                   props.currentQuestion.question
                }
            </p>
            <div>
            <h5>GDPR</h5>
            <h5>Please read out the following text to patient and/or their carer:</h5>
            <p >{`"The data and images captured in this application are handled strictly within GDPR and NHS guidelines. All images are transferred securely to the hospital's IT systems.`}</p>
            <p className="mb-3">{`Do you consent to the usage of images for: "`}</p>
            <Form>
                <FormGroup className="mb-2" row>
                    {consents.map((item, index) => {
                        return (
                            <div style={{marginLeft:'1vw'}} className="form-check mb-3" key={index}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={index}
                                    checked={consents[index]?.checked}
                                    id={index}
                                    onChange={(e) =>{
                                        onConsentChange(e, item, index)
                                        setNoConsent(false)
                                    }
                                        
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={index}
                                >
                                    {item.consent} <span hidden={item.isOptional} className="text-danger">*</span>
                                </label>
                            </div>
                        );
                    })}
                    <p style={{marginLeft:'1vw'}}>OR</p>
                    <div style={{marginLeft:'1vw'}} className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={noConsent}
                                    id={""}
                                    onChange={(e) =>{
                                        if(!noConsent){
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
                    <Row>
                    <Col xl="6">
                        <div>
                        <h5>Right Eye : </h5>
                        <div className="dropzone">
                        <Dropzone onDrop={onDropReye} accept={'image/jpeg, image/png, video/mp4'} >
                                {({getRootProps, getInputProps}) => (
                                    <div {...getRootProps()} className="dz-message needsclick">
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                    </div>
                                                    <h4>
                                                        {
                                                            "Drag 'n' drop or click to select image(s) and video(s)"
                                                        }
                                                    </h4>
                                    </div>
                                )}
                    </Dropzone>
                    </div>
                    {rEyeselectedFiles.length > 0 &&
                   <div className="table-responsive mt-3 ">
                    <BootstrapTable
                      keyField="id"
                      data={Reyeimagelist}
                      columns={rEyecolumns}
                      className="table-dark"
                      style={{border:'red'}}
                      bordered={false}
                      rowStyle={ { backgroundColor: '#F8F8FB' } }
                      headeStyle={ { backgroundColor: '#F8F8FB' } }
                    />
                  </div>
                }
                   {/* <div
                        className="dropzone-previews mt-3"
                        id="file-previews"
                    >
                        {files}
                    </div>
                   */}
                    </div>
                        </Col>
                        <Col xl="6">
                        <div>
                            <h5>Left Eye : </h5>
                            
                    <div className="dropzone">
                        <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()}/>
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
                    {/*<div
                        className="dropzone-previews mt-3"
                        id="file-previews"
                    >
                        {files}
                    </div>
                    */}
                   
                    {selectedFiles.length > 0 &&
                   <div className="table-responsive mt-3 ">
                    <BootstrapTable
                      keyField="id"
                      data={imagelist}
                      columns={columns}
                      className="table-dark"
                      style={{border:'red'}}
                      bordered={false}
                      rowStyle={ { backgroundColor: '#F8F8FB' } }
                      headeStyle={ { backgroundColor: '#F8F8FB' } }
                    />
                  </div>
                }
                    
                    </div>
                        </Col>
                        
                    </Row>
               
                </FormGroup>
            </Form>
            </div>
        </div>
                    <Modal
                    isOpen={showModal}
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
                            onClick={() => {setShowModal(false); setImageDelete(null)}}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">{"Are you sure you want to remove this image?"}</div>
                    <div className="modal-footer">
                    <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {setShowModal(false); setImageDelete(null)}}
                        >
                          Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => { if(eyeselect == "left"){
                                 setSelectedFiles(selectedFiles.filter(item=> item != imageDelete));setShowModal(false);
                                  setImageDelete(null)
                                }
                                if(eyeselect == "right"){
                                    setReyeSelectedFiles(rEyeselectedFiles.filter(item=> item != rEyeimageDelete));setShowModal(false);
                                    setReyeImageDelete(null)    
                                  }
                                
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
                        <h5 className="modal-title" id="staticBackdropLabel">
                            <i className="fa fa-warning"></i> Alert
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {setNoImgModal(false);setNoConsent(false)}}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">{"Images are integral to TriVice's decision making process, therefore must be included apart from exceptional circumstances.\n\nDo you wish to proceed without image upload?"}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                setSelectedFiles([])
                                setReyeSelectedFiles([])
                                if (props.currentQuestion?.answers?.endpoint != undefined) {
                                    props.onClick({
                                        answer: { consents: consents, images: {leftEye: [], rightEye: []} },
                                        endpoint: props.currentQuestion.answers.endpoint,
                                    });
                                } else {
                                    props.onClick({
                                        answer: { consents: consents, images: {leftEye: [], rightEye: []} },
                                        next: props.currentQuestion.answers.next,
                                    });
                                    
                                }
                                setNoImgModal(false);}}
                        >
                            Skip image upload
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {setNoImgModal(false);setNoConsent(false)}}
                        >
                            Upload images
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
                        className="btn btn-secondary"
                        onClick={() => {
                            props.setSave(false)
                            setSaveModal(false)
                        }}
                    >
                        Stay here
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            if(props.currentQuestion.answers.type == "opthoimages"){
                                let answer = [...questionAnswers,
                                    {question: props.currentQuestion.question,
                                        answer: { consents: consents, images: [...selectedFiles, ...rEyeselectedFiles] },
                                        currentQuestion: props.currentQuestion}
                                ]
                                dispatch(createReferralCreators.saveMidResponse(caseDetails.caseID, answer, pathwayName, selectedSpeciality))
                                history.push('/dashboard')
                                setSaveModal(false)
                            }
                        }}
                    >
                        Understood
                    </button>
                </div>
            </Modal>
            <Modal
                    isOpen={imageConfirm}
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
                            onClick={() => {setImageConfirm(false)}}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">{"Please confirm that the images uploaded are of the patient referred. We encourage you to verify before confirming. Thank you."}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                if (props.currentQuestion?.answers?.endpoint != undefined) {
                                    props.onClick({
                                        answer: { consents: consents, images: {leftEye: selectedFiles, rightEye: rEyeselectedFiles} },
                                        endpoint: props.currentQuestion.answers.endpoint,
                                    });
                                } else {
                                    props.onClick({
                                        answer: { consents: consents, images: {leftEye: selectedFiles, rightEye: rEyeselectedFiles} },
                                        next: props.currentQuestion.answers.next,
                                    });
                                    
                                }
                                setImageConfirm(false)
                            }}
                        >
                            I confirm
                        </button>
                    </div>
                </Modal>
                </>
    );
};

OpthoImageUpload.propTypes = {
    disabled: PropTypes.bool,
    nextButtonCalled: PropTypes.any,
    setImageUploadNext: PropTypes.func,
    onClick: PropTypes.func,
    currentQuestion: PropTypes.any,
    save: PropTypes.any,
    setSave: PropTypes.any
};

export default OpthoImageUpload;