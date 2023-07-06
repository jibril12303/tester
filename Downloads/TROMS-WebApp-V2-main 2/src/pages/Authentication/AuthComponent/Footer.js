import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React,{useState} from "react"
import { Row, Col, CardBody, Card, Alert, Container, Form ,Input,FormFeedback } from "reactstrap"
import  Trivicelogo  from 'pages/Authentication/Trivicelogo.png';
import CapriLogo from 'assets/images/CapriLogo1.png'
import styled from 'styled-components';
const CapriImg = styled.img`
    display: block;
    width: auto;
    height: auto;
    margin: 0 auto;
`;


const AuthHFooter = () =>{
return(
    <div className="mt-auto">
    <CapriImg  src={CapriLogo} alt="Capri Ram" />
      <p style={{textAlign:'center'}}>Powered by: Capri Healthcare</p>
    </div>
)
}
export default AuthHFooter