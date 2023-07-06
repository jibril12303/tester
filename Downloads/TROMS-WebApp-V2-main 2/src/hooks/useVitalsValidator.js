import {useState} from 'react'
import SimpleReactValidator from 'simple-react-validator'
import {isValidNhsNumber, isMobileValid, isNameValid, MOBILE_RULE, NAME_VALIDATION_RULE, NHS_NUMBER_RULE} from 'utils/validationUtils.js'

const useVitalsValidator = () => {
    const [show, setShow] = useState(false)
    const validator = new SimpleReactValidator({
        messages:{
            integer:"The :attribute must be a number"
        },
        validators: {
            emailEndWithNhs: {  // name the rule
                message: 'The :attribute must be NHS email',
                rule: (val, params, validator) => {
                    let domain = val.split("@")[1];
                    return (domain != 'nhs.net' && !domain?.endsWith('.nhs.uk')) ? false : true
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),  // optional
                required: true  // optional
            },
            nhsNumber:{
                message: 'Please supply a valid NHS Number',
                rule: (val, params, validator) =>{
                    let reg = NHS_NUMBER_RULE;
                    return reg.test(val)
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params))
            },
            name:{
                message: 'Please supply a valid name',
                rule: (val, params, validator) =>{
                    let reg = NAME_VALIDATION_RULE;
                    return reg.test(val)
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),  // optional
                required: true
            },
            phoneNumber:{
                message: 'Please enter a valid phone number',
                rule: (val, params, validator) =>{
                    let reg = MOBILE_RULE;
                    return reg.test(val)
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),  // optional
                required: true
            },
            email: {
                message: 'Please enter a valid email address',
                rule: (val, params, validator) =>{
                    let res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return res.test(val.toLowerCase())
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),  // optional
            },
            gender: {
                message:'Please chose a valid gender option',
                rule: (val, params, validator) =>{
                    console.log()
                    return val == "Select..." || val == '' ? false : true
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),
                required: true

            },
            dateOfBirth18 : {
                message: "Patient's age should be less than 16 years old",
                rule: (val, params, validator) =>{
                    let dob = new Date(val)
                    let today = new Date()
                    let age = today.getFullYear() - dob.getFullYear() 
                    let month = today.getMonth() - dob.getMonth()
                    if (month < 0 || month === 0 &&(today.getDate() < dob.getDate())) age--;
                    console.log(age)
                    return age < 16 ? true : false
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),
                required: true

            },
            dateOfBirthFuture : {
                message: "Patient's date of birth can not be in the future",
                rule: (val, params, validator) =>{
                    let dob = new Date(val)
                    let today = new Date()
                    return dob.getTime() < today.getTime()
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),
                required: true

            },
            hospitalNumber: {
                message: "Please supply a valid Hospital Number",
                rule: (val, params, validator) =>{
                    let reg = /^[a-zA-Z0-9]{7}$/
                    return reg.test(val)
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),
            
            },
            BloodPressure:{
                message:"Please enter in format Systolic/diastolic",
                rule:(val,param,validator)=>{
                    // const regex = new RegExp('/^[0-9]{2,3}\/[0-9]{2,3}/');
                    let reg =/^[0-9]{2,3}\/[0-9]{2,3}/
                    return reg.test(val)
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),

            }
               
        }
    })
    if (show) {
        validator.showMessages()
    }
    return [validator, setShow]
}

export default useVitalsValidator;

