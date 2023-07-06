import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    CardTitle,
    Form,
    FormGroup,
    Label,
    Col,
    Collapse,
    Table
} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux';
import { createReferralCreators } from 'store/create-referral/reducer';
import CdBasicInfo from './CdBasicInfo';
import GenerateCaseDetails from 'components/GeneratecaseDetails';
import styled from 'styled-components';


const Leaflets = (props) => {
    const leafpatientarray = [];
    const leafclinicianarray = [];
    props.leaflets && props.leaflets.map((item,key)=>{
      if(item.typeOfdocument === "Patient"){
        leafpatientarray.push({
          name:item.name,
          link:item.s3Url
        })
      }
      else if(item.typeOfdocument === "Clinician"){
        leafclinicianarray.push({
          name:item.name,
          link:item.s3Url
        })
      }
    })
    //console.log(leafpatientarray,leafclinicianarray,'leafies')
    return (
        <div>
            <div className='p-4 border'>
                <h4>Clinician Leaflets</h4>
               {leafclinicianarray.map((item,index)=>{
                   return(
                    <div key={index+"clinician"}><a  target="_blank"  rel="noreferrer"  href={item.link}>
                    <span className="bx bx-book-open p-1"/> {item.name}</a></div>
                   )
                   
               })}
              {leafclinicianarray.length == 0 ? "No leaflets available" : ""}
            </div>
            <div className='p-4 border'>
                <h4>Patient Leaflets</h4>
                {leafpatientarray.length == 0 ? "No leaflets available" : ""}
                {leafpatientarray.map((item,index)=>{
                   return(
                    <div key={index+"patient"}><a  target="_blank"  rel="noreferrer"  href={item.link}>
                    <span className="bx bx-book-open p-1"/> {item.name}</a></div>
                   )
                   
               })}
              
            </div>
        </div>
    );
};

Leaflets.propTypes = {
    Case: PropTypes.object.isRequired,
    leaflets: PropTypes.array.isRequired
}

export default Leaflets;
