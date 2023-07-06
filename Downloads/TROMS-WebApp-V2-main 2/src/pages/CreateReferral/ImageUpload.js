import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Form, FormGroup, Label, Col, Card, Row, Modal } from 'reactstrap';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { createReferralCreators } from 'store/create-referral/reducer';
import { setClient } from 'utils/apiUtils';
import { Link } from 'react-router-dom';
import { showToast } from 'utils/toastnotify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";


const ImageUpload = (props) => {

    let nextButtonCalled = props.nextButtonClicked;
    if (props.disabled) return <p>Loading ...</p>;

    function onDrop(acceptedFiles){
        handleAcceptedFiles(acceptedFiles)
    }
    
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({onDrop, accept: 'image/jpeg, image/png, video/mp4'});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [showNoImgModal, setNoImgModal] = useState(false)
    const [imageDelete, setImageDelete] = useState(null)
    const dispatch = useDispatch();
    const handleAcceptedFiles = files => {
        files.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size),
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

    const files = selectedFiles.map((f,i) => (
        <Card
            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
            key={i + '-file'}
        >
            <div className="p-2">
                <Row className="align-items-center">
                    <Col className="col-auto">
                        <img
                            data-dz-thumbnail=""
                            height="80"
                            className="avatar-sm rounded bg-light"
                            alt={f.name}
                            src={f.preview}
                        />

                    </Col>
                    <Col>
                        <Link to="#" className="text-muted font-weight-bold">
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
                    <i className="bx bx-trash bx-md" onClick={()=>{
                        setImageDelete(selectedFiles[i])
                        setShowModal(true)
                    }}  ></i>
                    </div>
                    </Col>
                </Row>
            </div>
        </Card>
    ));
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
        },
        // {
        //     consent: 'Research & development and medical publication',
        //     isOptional: true,
        //     checked: false,
        // },
    ]);

    const onConsentChange = (e, item, index) => {
        const newConsent = [...consents];
        newConsent[index].checked = !newConsent[index].checked;
        setConsents(newConsent);
    };

    const { token, caseDetails } = useSelector((state) => ({
        token: state.appReducer.token,
        caseDetails: state.CreateReferral.caseDetails,
    }));

    return (
        <>
        <div>
            <CardTitle className="h4">Upload Image(s)</CardTitle>
            <p className="card-title-desc">
                {
                    "Please note that images are integral to TriVice's decision making process, hence must be included apart from exceptional circumstances."
                }
            </p>
            <div className="p-4 border">
            <h5>GDPR</h5>
            <h5>Please read out the following text to patient/parent/carer:</h5>
            <p >{`"The data and images captured in this application are handled strictly within GDPR and NHS guidelines. All images are transferred securely to the Hospital's IT systems.`}</p>
            <p className="mb-3">{`Do you consent to the usage of images and data for: "`}</p>
            <Form>
                <FormGroup className="mb-2" row>
                    {consents.map((item, index) => {
                        return (
                            <div style={{marginLeft:'1vw'}} className="form-check mb-3" key={index}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={index}
                                    id={index}
                                    onChange={(e) =>
                                        onConsentChange(e, item, index)
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
                                    "Drag 'n' drop or click to select image(s)"
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
                            onClick={() => {setSelectedFiles(selectedFiles.filter(item=> item != imageDelete));setShowModal(false); setImageDelete(null)}}
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
                            onClick={() => {setNoImgModal(false);}}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">{"Images are integral to TriVice's decision making process, hence must be included apart from exceptional circumstances.\n\nAre you sure you do not want to upload images?"}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {dispatch(
                                createReferralCreators.submitConsentAndImages(
                                    caseDetails.caseID,
                                    consents[0].checked,
                                    consents[1].checked,
                                    selectedFiles
                                )
                            );setNoImgModal(false);}}
                        >
                            Skip image upload
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {setNoImgModal(false)}}
                        >
                            Upload images
                        </button>
                    </div>
                </Modal>
                </>
    );
};

ImageUpload.propTypes = {
    disabled: PropTypes.bool,
    nextButtonClicked: PropTypes.any,
    setImageUploadNext: PropTypes.func
};

export default ImageUpload;
