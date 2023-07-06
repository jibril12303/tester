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


const VisualAcuity = (props) => {
    if(typeof props.visualReport == "undefined"){
        return(
            <div className='p-4 border'>
                No Visual Acuity supplied
            </div>
        )
    }
    let exams  = []
    try {
        exams = Object.keys(props.visualReport)
    } catch (error) {
        exams = []
    }
    console.log(exams)

    
    console.log(props)
    if(exams.length > 0){
        return (
            <Table className="table table-striped mb-0" responsive>
                <thead>
                    <tr>
                        <th>Examination</th>
                        <th>Right Eye</th>
                        <th>Left Eye</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((item,index)=>{
                        if(props.visualReport[item].RE == "true" || props.visualReport[item].RE == "false" || props.visualReport[item].LE == "true" || props.visualReport[item].LE == "false"){
                            let re = props.visualReport[item].RE == "true" ? "Yes" : "No"
                            let le = props.visualReport[item].LE == "true" ? "Yes" : "No"
                            return(
                                <tr key={index}>
                                    <td scope='row'>{props.visualReport[item]?.fieldName || item}</td>
                                    <td>{re}</td>
                                    <td>{le}</td>
                                </tr>
                            )
                        }
                        return(
                            <tr key={index}>
                                <td scope='row'>{props.visualReport[item]?.fieldName || item}</td>
                                <td>{props.visualReport[item].RE}</td>
                                <td>{props.visualReport[item].LE}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    } else {
        return(
            <div className='p-4 border'>
                No Visual Acuity supplied
            </div>
        )
    }
;
};

VisualAcuity.propTypes = {
    visualReport: PropTypes.object
}

export default VisualAcuity;
