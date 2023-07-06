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


const ContactsAndGDPR = (props) => {

    
   
   
    return (
        <div>
            <div className='p-4 border'>
                <h4>Patient Address</h4>

               
                Address:  {props.Case?.patientAddress ? (props.Case?.patientAddress) : "Not Available"}
                
                <br />
                Postcode:  {props.Case?.postCode ? (props.Case?.postCode).toUpperCase() : "Not Available"}
            </div>
            <div className='p-4 border'>
                <h4>Parent/Carer Details</h4>
                Name: {props.Case?.parent?.firstName + " " + props.Case?.parent?.lastName}
                <br />
                Email: {props.Case?.parent?.emailAddress ? props.Case?.parent?.emailAddress : "Not Available" }
                <br />
                Phone: {props.Case?.parent?.contactNumber ? props.Case?.parent?.contactNumber : "Not Available" }
            </div>
            <div className='p-4 border'>
                <h4>Consents</h4>
                {!props.Case?.consent?.treatment && !props.Case?.consent?.research ? (
                    <div>
                        Consent to images declined but wishes to continue the referral
                    </div>
                ) : (
                    <div>
                        Assessment, Treatment and Referral: {props.Case?.consent?.treatment === true ? "Yes" : "No"}
                <br />
                Medical Teaching and Research: {props.Case?.consent?.research === true ? "Yes" : "No"}
                </div>
                )}
                
            </div>
             <div className='p-4 border'>
                <h4>GP Details</h4>
                Name: {props.Case?.gpFirstName ? props.Case?.gpFirstName : "Not Available"}
                <br />
                Address: {props.Case?.gpStoreAddress ? props.Case?.gpStoreAddress : "Not Available"}
                <br />
                Email: {props.Case?.gpEmailAddress ? props.Case?.gpEmailAddress : "Not Available"}
                <br />
                Phone Number: {props.Case?.gpPhoneNumber ? props.Case?.gpPhoneNumber : "Not Available"}
            </div>
        </div>
    );
};

ContactsAndGDPR.propTypes = {
    Case: PropTypes.object.isRequired
}

export default ContactsAndGDPR;
