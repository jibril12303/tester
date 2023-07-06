import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React,{useState} from "react"
import { Row, Col, CardBody, Card, Alert, Container, Form ,Input,FormFeedback } from "reactstrap"
import  Trivicelogo  from 'assets/images/triViceHeaderlogo.svg';

const AuthHeader = () =>{
return(
    <div className="mb-1 mb-md-1 d-flex" >
                       <img 
                          src={Trivicelogo}
                          alt=""
                          height="30"
                          className="auth-logo-dark"
                        />
                        <p className="h-20px ">TriVice</p>
                    </div>
)
}
export default AuthHeader