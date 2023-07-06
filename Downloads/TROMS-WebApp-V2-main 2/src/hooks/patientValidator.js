import {useState} from 'react'
import SimpleReactValidator from 'simple-react-validator'
import {isValidNhsNumber, isMobileValid, isNameValid, MOBILE_RULE, NAME_VALIDATION_RULE, NHS_NUMBER_RULE} from 'utils/validationUtils.js'

const usePatientValidator = () => {
    const [show, setShow] = useState(false)
    const validator = new SimpleReactValidator({
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
                    let reg = /^[a-zA-Z0-9]{7,8}$/
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

export default usePatientValidator




{/*
    passwordRule: {  // name the rule
        message: 'The new password must be at least 8 characters and must contain one(a-A,0,9,@!$#)',
        rule: (val, params, validator) => {
            return validator.helpers.testRegex(PASSWORD_VALIDATION_RULE) ? true :false
        },
        messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),  // optional
        required: true  // optional
    },
*/}