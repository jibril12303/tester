import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Form, FormGroup, Label, Col } from 'reactstrap';
import Select from 'react-select';

const PathwaySelector = (props) => {
    const [chosenPathway, setChosenPathway] = useState()

    let pathway = props.pathway;

    function handlePathwaySelect(index){
        props.onClick(pathway[index])
    }

    console.log(props);
    return (
        <div>
            <CardTitle className="h4">Clinical concerns</CardTitle>
            <p className="card-title-desc">
            Please select an area of clinical concern
            </p>
            <div className="p-4 border">
                <div className="form-check mb-3">
                    {pathway.length > 0 &&
                        pathway.map((item, index) => {
                            return (
                                <div className="mb-3 form-check" key={item.name}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="exampleRadios"
                                        id={index}
                                        value={item}
                                        onClick={(e)=>handlePathwaySelect(e.currentTarget.id)}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="exampleRadios2"
                                        id={item.name}
                                    >
                                        {item.name}
                                    </label>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

PathwaySelector.propTypes = {
    pathway: PropTypes.any,
    onClick: PropTypes.any
};

export default PathwaySelector;
