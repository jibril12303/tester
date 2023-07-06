import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardTitle,
  CardBody,
  Media,
  Button,
  Form ,
  Input ,
  Modal,
  FormFeedback
} from "reactstrap"

import profileImg from "assets/images/profileLogonew.jpg"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

import avatar from "../../assets/images/users/avatar-1.jpg"
// actions
import { editProfile, resetProfileFlag } from "../../store/actions"

//Import validator
import useValidator from 'hooks/useValidator.js'

//Import Load button
import Loadbtn from "components/Common/Loadbtn"
import Multiselect from 'multiselect-react-dropdown';
import { useHistory } from "react-router-dom";

const UserProfile = props => {
  
  let history = useHistory();
  const [, forceUpdate] = useState()
  const dispatch = useDispatch()
  
  const [validator, showValidationMessage] = useValidator()
  
  const { userDetails } = useSelector(state => ({
    userDetails: state.appReducer.userDetails
  }))

  const [edit,setEdit] = useState(false)

  
    const [updateForm, setupdateForm] = useState({
        firstname: userDetails.firstName,
        lastname: userDetails.lastName,
        phoneno:userDetails.phoneNumber,
        grade:userDetails.grade,
        specialities:userDetails.speciality,

    })
    
const setValue = (e) => {
        
    setupdateForm({...updateForm, [e.currentTarget.name]: e.currentTarget.value})
  

    setError({
      ...error,
      firstname: !validator.fieldValid('firstname'),
      lastname: !validator.fieldValid('lastname'),
      phoneno:!validator.fieldValid('lastname'),
      email: !validator.fieldValid('email'),
      grade: !validator.fieldValid('grade'),
      consultantcode: !validator.fieldValid('consultantcode'),
      })
    }

  const [error, setError] = useState({
    firstname: false,
    lastname: false,
    phoneno:false,
    email:false,
    grade:false,
    consultantcode:false

})

    // Set Login Form Field Error State
    const onSubmit = (e)=>{
      e.preventDefault();
    
      // Set Login Form Field Error State
      setError({
          ...error,
          firstname: !validator.fieldValid('firstname'),
          lastname: !validator.fieldValid('lastname'),
          phoneno: !validator.fieldValid('phoneno'),
          hospital: !validator.fieldValid('hospital'),
          grade: !validator.fieldValid('grade'),
          consultantcode: !validator.fieldValid('consultantcode'),
    
      })
    
      if (validator.allValid()) {

        let payload = {}
  
         payload = {
          firstName:updateForm.firstname,
          lastName:updateForm.lastname,
          phoneNumber:updateForm.phoneno,
          grade:updateForm.grade,
          consultantCode:updateForm.consultantcode,
        }
      
      } else {
          showValidationMessage(true)
          forceUpdate(1)
      }
     console.log(updateForm);  
      
       
     }
  

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Update Profile | TriVice</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Profile" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">

              <Card>
                <CardBody>
                
                  <Media>
                    <div>
                    <div className="ms-3">
                      <img    
                        src={profileImg}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <Media body className="align-self-center">
                      <div className="text-muted ms-4 mt-4">
                        <h4>{userDetails && userDetails.firstName} {userDetails && userDetails.lastName}</h4> 
                      </div>
                      
                    </Media>
                    </div>

                    <div style={{marginLeft:'auto'}}>
                      <button type="button" className="btn btn-success  w-sm" onClick={()=>setEdit(true)}>
                      <i className="mdi mdi-pencil d-block font-size-16"></i>{" "}
                      Edit
                      </button>
                    </div>

                  </Media>
                   <Media>
                
                    <Media body className="align-self-center">
                      <div className="text-muted ms-4 mt-4">
                        <dl className="row mb-0">
                          <dt className="col-sm-3">Id</dt>
                          <dd className="col-sm-9">{userDetails && userDetails._id ? userDetails._id:"Not Available"}</dd>

                          <dt className="col-sm-3">Email</dt>
                          <dd className="col-sm-9">{userDetails && userDetails.email?userDetails.email:"Not Available"}</dd>

                          <dt className="col-sm-3">AppRole</dt>
                          <dd className="col-sm-9">{userDetails && userDetails.appRole?userDetails.appRole:"Not Available"}</dd>

                          <dt className="col-sm-3">AccountType</dt>
                          <dd className="col-sm-9">{userDetails && userDetails.accountType?userDetails.accountType:"Not Available"}</dd>

                          <dt className="col-sm-3">PhoneNumber</dt>
                          <dd className="col-sm-9">{userDetails && userDetails.phoneNumber?userDetails.phoneNumber:"Not Available"}</dd>

                          <dt className="col-sm-3">Grade</dt>
                          <dd className="col-sm-9">{userDetails && userDetails.grade?userDetails.grade:"Not Available"}</dd>

                          <dt className="col-sm-3">SpecialityID</dt>
                          <dd className="col-sm-9">{userDetails && userDetails.specialityID?userDetails.specialityID:"Not Available"} </dd>

                          <dt className="col-sm-3">Speciality</dt>
                          <dd className="col-sm-9">{userDetails && userDetails.speciality?userDetails.speciality:"Not Available"}</dd>
                          
                    </dl>
                        
                      </div>
                    </Media>
                    </Media>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Change User Information</h4>

          <Card>
            <CardBody>

              <div className="mt-4">
                      <Form onSubmit={onSubmit} >
                        <div className="mt-3 d-grid">
                        <Row>
                            <Col xl={4}>
                            <div className="mb-3">
                            <label>First name <span className="text-danger">*</span></label>
                                <Input
                                    type="text"
                                    name="firstname"
                                    className="form-control"
                                    placeholder=" Enter first name"
                                    value={updateForm.firstname}
                                    onChange={setValue}
                                    invalid={error.firstname}
                            
                                />
                                <FormFeedback>{validator.message('first name', updateForm.firstname, 'required|alpha')}</FormFeedback>
                            </div>
                            </Col>
                            <Col xl={4}>
                            <div className="mb-3">
                            <label>Last name <span className="text-danger">*</span></label>
                                <Input
                                    type="text"
                                    name="lastname"
                                    className="form-control"
                                    placeholder="Enter last name"
                                    value={updateForm.lastname}
                                    onChange={setValue}
                                    invalid={error.lastname}
                            
                                />
                                <FormFeedback>{validator.message('last name', updateForm.lastname, 'required|alpha')}</FormFeedback>
                            </div>
                            </Col>
                            </Row>
                            <Row>
                            <Col xl={4}>
                            <div className="mb-3">
                            <label>Phone number <span className="text-danger">*</span></label>
                                <Input
                                    type="text"
                                    name="phoneno"
                                    className="form-control"
                                    placeholder="Enter phone number"
                                    value={updateForm.phoneno}
                                    onChange={setValue}
                                    invalid={error.phoneno}
                                    maxlength="11"
                            
                                />
                                <FormFeedback>{validator.message('phone number', updateForm.phoneno, 'required|phone|min:11|max:11')}</FormFeedback>
                            </div>
                            </Col>
                         
                            </Row>
                            <Row>
                         
                            </Row>
                            <Row>
                            <Col xl={4}>
                            <div className="mb-3">
                            <label>Grade <span className="text-danger">*</span></label>
                                <select
                                
                                    name="grade"
                                    className="form-select custom-select"
                                    value={updateForm.grade}
                                    onChange={setValue}
                                    invalid={error.grade}
                            
                                >
                                  <option value='' selected disabled>Select...</option>
                                                            {/*
                                sortgrades  && sortgrades.map((item, key)=>{
                                return(<option key={key} value={item}>{item}</option>
                                )
                                })
                              */}
                            </select>
                            <span style={{
                                fontSize: '80%',
                                color: '#f46a6a',
                          }}>{validator.message('grade', updateForm.grade, 'required')}</span>
                          
                            
                            </div>
                            </Col>
                           
                        </Row>
                         
                        <Row>
                          <Col >
                        <Loadbtn btnname ={'Submit'} btnloadname={'Submit'} loading = {false} />
                        </Col>
                        </Row>
                        
                              </div>
                        </Form>
                  
                      </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile)
