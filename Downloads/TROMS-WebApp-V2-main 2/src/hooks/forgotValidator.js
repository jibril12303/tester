import {useState} from 'react'
import SimpleReactValidator from 'simple-react-validator'
import {PASSWORD_VALIDATION_RULE} from 'utils/validationUtils.js'

const useValidator = () => {
    const [show, setShow] = useState(false)
    const validator = new SimpleReactValidator({
        validators: {
            emailEndWithNhs: {  // name the rule
                message: 'The :attribute must be NHS email',
                rule: (val, params, validator) => {
                    let domain = val.split("@")[1];
                    return (domain != 'nhs.net' && !domain.endsWith('.nhs.uk')) ? false : true
                },
                messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),  // optional
                required: true  // optional
            },
            
            strongPassword: {  // name the rule
            message: 'The :attribute must be at least 8 characters and must contain one(a-A,0,9,@!$#)',
                 rule: (val, params, validator) => {
                 return validator.helpers.testRegex(PASSWORD_VALIDATION_RULE) ? true :false
                 },
             messageReplace: (message, params) => message.replace(':values', validator.helpers.toSentence(params)),  // optional
             required: true  // optional
    },
            
          
        },
    })
    if (show) {
        validator.showMessages()
    }
    return [validator, setShow]
}

export default useValidator




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