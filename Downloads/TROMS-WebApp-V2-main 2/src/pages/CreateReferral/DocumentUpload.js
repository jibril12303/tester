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

const DocumentUpload = (props) => {

    const history = useHistory()
    function onDrop(acceptedFiles){
        handleAcceptedFiles(acceptedFiles)
    }


    
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({onDrop, accept: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [showNoImgModal, setNoImgModal] = useState(false)
    const [imageDelete, setImageDelete] = useState(null)

    const [eyeselect,setEyeSelect] = useState('')
    //right eye states
    const [saveModal, setSaveModal] = useState(false)
    const [imageConfirm, setImageConfirm] = useState(false)

    const dispatch = useDispatch();
    const handleAcceptedFiles = files => {
        files.map(file =>
          Object.assign(file, {
            preview: file.preview ? file.preview : URL.createObjectURL(file),
            formattedSize:formatBytes(file.size)
          })
        )
        setSelectedFiles([...selectedFiles,...files])
        }
    console.log(selectedFiles)

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
                if(props.currentQuestion.answers.type == "documents"){
                    setSelectedFiles([])
                    handleAcceptedFiles(props.currentQuestion.givenAnswer.documents)
                    return;
                }
            }
        }
        catch (err){}
        try{
            if('givenAnswer' in lastResponse){
                if(lastResponse.type == "documents"){
                    setSelectedFiles([])
                    handleAcceptedFiles(lastResponse.givenAnswer.images.documents)
                    return;
                }
            }
        }
        catch (err){}
    }, [props.currentQuestion]);
   

     
let imagelist = generateData(selectedFiles);

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
            size:selectedFiles[index].formattedSize
        })
    }
    return returnedValue;
}


    const [imageList, setImagesList] = useState([]);



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
                        <i className='bx bxs-file' />

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


      console.log("opthprops",props)
    useEffect(() => {
        if (props.nextButtonCalled) {
            if (selectedFiles.length == 0 ){
                return setNoImgModal(true);
            }
            setClient(token);
            setImageConfirm(true)
        }
    }, [props.nextButtonCalled]);

    useEffect(()=>{
        if(props.save){
            if(props.currentQuestion.answers.type == "documents"){
                setSaveModal(true)
            }
        }
    },[props.save])

    return (
        <>
        <div>
            <CardTitle className="h4">Upload Documents</CardTitle>
            <p className="card-title-desc">
                {
                   props.currentQuestion.question
                }
            </p>
            <div>
            <h5>Please upload any additional documents that you feel are relevant for this referral.</h5>
            <Form>
                <FormGroup className="mb-2" row>
                    <Row>
                        <div>
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
                                    "Drag 'n' drop or click to add documents"
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
                    <div className="modal-body">{"Are you sure you want to remove this document?"}</div>
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
                    <div className="modal-body">{"Images are integral to TriVice's decision making process, therefore must be included apart from exceptional circumstances.\n\nDo you wish to proceed without uploading documents?"}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                setSelectedFiles([])
                                if (props.currentQuestion?.answers?.endpoint != undefined) {
                                    props.onClick({
                                        answer: { documents: []},
                                        endpoint: props.currentQuestion.answers.endpoint,
                                    });
                                } else {
                                    props.onClick({
                                        answer: { documents: []},
                                        next: props.currentQuestion.answers.next,
                                    });
                                    
                                }
                                setNoImgModal(false);}}
                        >
                            Skip document upload
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
                                        answer: { documents: selectedFiles},
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
                    <div className="modal-body">{"Please confirm that the documents uploaded are of the patient referred. We encourage you to verify before confirming. Thank you."}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                if (props.currentQuestion?.answers?.endpoint != undefined) {
                                    props.onClick({
                                        answer: { documents: selectedFiles},
                                        endpoint: props.currentQuestion.answers.endpoint,
                                    });
                                } else {
                                    props.onClick({
                                        answer: { documents: selectedFiles},
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

DocumentUpload.propTypes = {
    disabled: PropTypes.bool,
    nextButtonCalled: PropTypes.any,
    setImageUploadNext: PropTypes.func,
    onClick: PropTypes.func,
    currentQuestion: PropTypes.any,
    save: PropTypes.any,
    setSave: PropTypes.any
};

export default DocumentUpload;