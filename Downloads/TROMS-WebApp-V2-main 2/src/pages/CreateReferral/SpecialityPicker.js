import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    CardTitle,
    Form,
    FormGroup,
    Label,
    Col,
} from 'reactstrap'
import Select from "react-select"
import { useSelector, useDispatch } from 'react-redux';
import { createReferralCreators } from 'store/create-referral/reducer';

const SpecialityPicker = (props) => {
    console.log(props)

    const [subscriptionOptions,setSubscriptionOptions] = useState([]);

    const dispatch = useDispatch()

    const {subscriptions} = useSelector(
        (state) => ({
            subscriptions: state.CreateReferral.subscriptions,
        })
    );

    function handleSelectGroup(event){
        console.log(event)
        props.onChange(event)
    }
    console.log("subscriptions=>",subscriptions);


    useEffect(()=>{
        console.log(dispatch(createReferralCreators.getSubscriptions()))
    },[])

    useEffect(()=>{
        if(subscriptions){
            let options = subscriptions;
            // options[0]["options"].push({label:"Rheumatology",value:"Rheumatology"});
            // console.log("options",options)
            setSubscriptionOptions(options);
        }
    },[subscriptions])

    return (
        <div>
            <CardTitle className="h4">Hospital, Department or Specialty</CardTitle>
            <p className="card-title-desc">
                Please select the specialty you wish to refer
            </p>
            <div className="p-4 border">
                <Form>
                    <FormGroup className="mb-4" row>
                        <Col >
                            <Select
                                value={props.value}
                                onChange={handleSelectGroup}
                                options={subscriptionOptions}
                                className="select2"
                                placeholder="Select..."
                                classNamePrefix="select2 select2-selection"
                            />
                    
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        </div>
    );
};

SpecialityPicker.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.any.isRequired,
    options: PropTypes.any.isRequired,
}

export default SpecialityPicker;
