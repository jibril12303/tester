import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Form, FormGroup, Label, Col, Card, Table } from 'reactstrap';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { createReferralCreators } from 'store/create-referral/reducer';

const GENDER_OPTIONS = [
    {
        title: 'Male',
        value: 'male',
    },
    {
        title: 'Female',
        value: 'female',
    },
    {
        title: 'Not Known',
        value: 'not known',
    },
    {
        title: 'Not Specified',
        value: 'not specified',
    },
];

const VISION_OPTIONS = [
    {
        title: '6/5',
        value: '6/5',
    },
    {
        title: '6/6',
        value: '6/6',
    },
    {
        title: '6/9',
        value: '6/9',
    },
    {
        title: '6/12',
        value: '6/12',
    },
    {
        title: '6/18',
        value: '6/18',
    },
    {
        title: '6/24',
        value: '6/24',
    },
    {
        title: '6/36',
        value: '6/36',
    },
    {
        title: '6/60',
        value: '6/60',
    },
];

let SPH_OPTIONS = [
    {
        value: '-4.25',
        title: '-4.25',
    },
    {
        value: '-4.00',
        title: '-4.00',
    },
    {
        value: '-3.75',
        title: '-3.75',
    },
    {
        value: '-3.50',
        title: '-3.50',
    },
    {
        value: '-3.25',
        title: '-3.25',
    },
    {
        value: '-3.00',
        title: '-3.00',
    },
    {
        value: '-2.75',
        title: '-2.75',
    },
    {
        value: '-2.50',
        title: '-2.50',
    },
    {
        value: '-2.25',
        title: '-2.25',
    },
    {
        value: '-2.00',
        title: '-2.00',
    },
    {
        value: '-1.75',
        title: '-1.75',
    },
    {
        value: '-1.50',
        title: '-1.50',
    },
    {
        value: '-1.25',
        title: '-1.25',
    },
    {
        value: '-1.00',
        title: '-1.00',
    },
    {
        value: '-0.75',
        title: '-0.75',
    },
    {
        value: '-0.50',
        title: '-0.50',
    },
    {
        value: '-0.25',
        title: '-0.25',
    },
    {
        value: '0',
        title: '0',
    },
    {
        value: '+0.25',
        title: '+0.25',
    },
    {
        value: '+0.50',
        title: '+0.50',
    },
    {
        value: '+0.75',
        title: '+0.75',
    },
    {
        value: '+1.00',
        title: '+1.00',
    },
    {
        value: '+1.25',
        title: '+1.25',
    },
    {
        value: '+1.50',
        title: '+1.50',
    },
    {
        value: '+1.75',
        title: '+1.75',
    },
    {
        value: '+2.00',
        title: '+2.00',
    },
    {
        value: '+2.25',
        title: '+2.25',
    },
    {
        value: '+2.50',
        title: '+2.50',
    },
    {
        value: '+2.75',
        title: '+2.75',
    },
    {
        value: '+3.00',
        title: '+3.00',
    },
    {
        value: '+3.25',
        title: '+3.25',
    },
    {
        value: '+3.50',
        title: '+3.50',
    },
    {
        value: '+3.75',
        title: '+3.75',
    },
    {
        value: '+4.00',
        title: '+4.00',
    },
    {
        value: '+4.25',
        title: '+4.25',
    },
];

// for (let index = -4.25; index <= 4.25; index = index + 0.25) {
//     SPH_OPTIONS = [
//         ...SPH_OPTIONS,
//         {
//             value: index.toString(),
//             title: index.toString(),
//         },
//     ];
// }

const ADD_OPTIONS = [
    { value: '+0.75', title: '+0.75' },
    { value: '+1.00', title: '+1.00' },
    { value: '+1.25', title: '+1.25' },
    { value: '+1.50', title: '+1.50' },
    { value: '+1.75', title: '+1.75' },
    { title: '+2.00', value: '+2.00' },
];

const NVISION_OPTIONS = [
    {
        title: 'N.5',
        value: 'N.5',
    },
    {
        title: 'N.6',
        value: 'N.6',
    },
    {
        title: 'N.8',
        value: 'N.8',
    },
    {
        title: 'N.10',
        value: 'N.10',
    },
    {
        title: 'N.12',
        value: 'N.12',
    },
    {
        title: 'N.14',
        value: 'N.14',
    },
    {
        title: 'N.18',
        value: 'N.18',
    },
    {
        title: 'N.24',
        value: 'N.24',
    },
    {
        title: 'N.36',
        value: 'N.36',
    },
    {
        title: 'N.48',
        value: 'N.48',
    },
    {
        title: 'N.60',
        value: 'N.60',
    },
];

const YN_OPTIONS = [
    { title: 'Yes', value: 'yes' },
    { title: 'No', value: 'no' },
    { title: 'N/A', value: 'n/a' },
];

const VAN_OPTIONS = [
    { title: 'Grade 1(<1:4)', value: 'Grade 1(<1:4)' },
    { title: 'Grade 2(1:4)', value: 'Grade 2(1:4)' },
    { title: 'Grade 3(1:2)', value: 'Grade 3(1:2)' },
    { title: 'Grade 4(=>1:1)', value: 'Grade 4(=>1:1)' },
];

const visualAcuity = [
    {
        title: 'Uncorrected Vision RE',
        placeholder: 'Select...',
        name: 'uncorrVisionRE',
        type: 'dropdown',
        options: VISION_OPTIONS,
    },
    {
        title: 'Uncorrected Vision LE',
        placeholder: 'Select...',
        name: 'uncorrVisionLE',
        type: 'dropdown',
        options: VISION_OPTIONS,
    },
    {
        title: 'Sph RE',
        placeholder: 'Select...',
        name: 'sphRE',
        type: 'dropdown',
        options: SPH_OPTIONS,
    },
    {
        title: 'Sph LE',
        placeholder: 'Select...',
        name: 'sphLE',
        type: 'dropdown',
        options: SPH_OPTIONS,
    },
    {
        title: 'Cylinder RE',
        placeholder: '',
        name: 'clyRE',
    },
    {
        title: 'Cylinder LE',
        placeholder: '',
        name: 'clyLE',
    },
    {
        title: 'Axis RE',
        placeholder: '',
        name: 'axisRE',
    },
    {
        title: 'Axis LE',
        placeholder: '',
        name: 'axisLE',
    },
    {
        title: 'Prism RE',
        placeholder: '',
        name: 'prismRE',
    },
    {
        title: 'Prism LE',
        placeholder: '',
        name: 'prismLE',
    },
    {
        title: 'Add RE',
        placeholder: 'Select...',
        name: 'addRE',
        type: 'dropdown',
        options: ADD_OPTIONS,
    },
    {
        title: 'Add LE',
        placeholder: 'Select...',
        name: 'addLE',
        type: 'dropdown',
        options: ADD_OPTIONS,
    },
    {
        title: 'Corrected Vision RE',
        placeholder: 'Select...',
        name: 'corrVisionRE',
        type: 'dropdown',
        options: VISION_OPTIONS,
    },
    {
        title: 'Corrected Vision LE',
        placeholder: 'Select...',
        name: 'corrVisionLE',
        type: 'dropdown',
        options: VISION_OPTIONS,
    },
    {
        title: 'Near Vision RE',
        placeholder: 'Select...',
        name: 'nearVisionRE',
        type: 'dropdown',
        options: NVISION_OPTIONS,
    },
    {
        title: 'Near Vision LE',
        placeholder: 'Select...',
        name: 'nearVisionLE',
        type: 'dropdown',
        options: NVISION_OPTIONS,
    },
    {
        title: 'Visual Field performed? RE',
        placeholder: 'Select...',
        name: 'visualFieldRE',
        type: 'dropdown',
        options: YN_OPTIONS,
    },
    {
        title: 'Visual Field performed? LE',
        placeholder: 'Select...',
        name: 'visualFieldLE',
        type: 'dropdown',
        options: YN_OPTIONS,
    },
    {
        title: 'Defect confirmed on repeat? RE',
        placeholder: 'Select...',
        name: 'defectConfirmedRE',
        type: 'dropdown',
        options: YN_OPTIONS,
    },
    {
        title: 'Defect confirmed on repeat? LE',
        placeholder: 'Select...',
        name: 'defectConfirmedLE',
        type: 'dropdown',
        options: YN_OPTIONS,
    },
    {
        title: 'C:D ratio / vertical disc size (MM) RE',
        placeholder: '',
        name: 'cdRatioRE',
    },
    {
        title: 'C:D ratio / vertical disc size (MM) LE',
        placeholder: '',
        name: 'cdRatioLE',
    },
    {
        title: 'Optic Disc / Neuro-retinal rim RE',
        placeholder: '',
        name: 'opticDiscRE',
    },
    {
        title: 'Optic Disc / Neuro-retinal rim LE',
        placeholder: '',
        name: 'opticDiscLE',
    },
    {
        title: 'Van Herrick AC grading RE',
        placeholder: 'Select...',
        name: 'vanHerrickRE',
        type: 'dropdown',
        options: VAN_OPTIONS,
    },
    {
        title: 'Van Herrick AC grading LE',
        placeholder: 'Select...',
        name: 'vanHerrickLE',
        type: 'dropdown',
        options: VAN_OPTIONS,
    },
    {
        title: 'If narrow – any symptoms? RE',
        placeholder: '',
        name: 'ifNarrowRE',
    },
    {
        title: 'If narrow – any symptoms? LE',
        placeholder: '',
        name: 'ifNarrowLE',
    },
    {
        title: 'IOP this visit RE',
        placeholder: '',
        name: 'iopCurrentRE',
    },
    {
        title: 'IOP this visit LE',
        placeholder: '',
        name: 'iopCurrentLE',
    },
    {
        title: 'IOP previous visit (If known or available) RE',
        placeholder: '',
        name: 'iopPrevRE',
    },
    {
        title: 'IOP previous visit (If known or available) LE',
        placeholder: '',
        name: 'iopPrevLE',
    },
];

const Summary = (props) => {
    console.log(props);
    return (
        <div>
            
        </div>
    );
};

Summary.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default Summary;
