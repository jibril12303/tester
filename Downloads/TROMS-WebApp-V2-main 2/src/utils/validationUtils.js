import React from 'react';
import moment from 'moment';

const createRule = (ruleName, ruleValue, message) => ({
    [ruleName]: ruleValue,
    message,
});
export const FULLNAME_VALIDATION_RULE = /^[a-z\s]+$/i;
// const PASSWORD_VALIDATION_RULE = /^(?=.*[\d])(?=.*[!@$#])((?=.*[A-Z]))[a-zA-Z0-9!@#$%^&*]{8,}$/;
export  const PASSWORD_VALIDATION_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@$#])[a-zA-Z0-9!@#$]{8,}$/;
export const NAME_VALIDATION_RULE = /^[a-zA-Z ]{2,30}$/;
export const OTP_RULE = /^[0-9]{8}$/;
export const MOBILE_RULE = /^[0-9]{11}$/;
export const NHS_NUMBER_RULE = /^[0-9]{10}$/
export const type = (type, message) => createRule('type', type, message);

const required = (message) => createRule('required', true, message);
const pattern = (pattern, message) => createRule('pattern', pattern, message);
const validator = (validationHandler, message) =>
    createRule('validator', validationHandler, message);

const isNhsEmail = (rule, value, callback) => {
    if (!value.endsWith('@nhs.net') && !value.endsWith('.nhs.uk')) {
        callback(new Error('Invalid Email'));
        return;
    }
    callback();
};

const isNhsValid = (rule, value, callback) => {
    if (value && value.length < 10) {
        callback(new Error('Invalid NHS Number'));
        return;
    }
    callback();
};

export const isNameValid = (requiredMsg, invalidName) => [
    required(requiredMsg),
    pattern(NAME_VALIDATION_RULE, invalidName),
];

export const isEmailValid = (requiredMsg, invalidEmailMsg) => [
    required(requiredMsg),
    // type('email', invalidEmailMsg),
    validator((rule, value, callback) => {
        isNhsEmail(rule, value, callback);
    }, invalidEmailMsg),
];

export const isEmailValidWithoutRequired = (invalidEmailMsg) => [
    type('email', invalidEmailMsg),
];

export const isValidNhsNumber = (invalidNhsNumber) => [
    required(invalidNhsNumber),
    validator((rule, value, callback) => {
        isNhsValid(rule, value, callback);
    }, invalidNhsNumber),
];

export const isPasswordValid = (requiredMsg, invalidPasswordMsg) => [
    required(requiredMsg),
    pattern(PASSWORD_VALIDATION_RULE, invalidPasswordMsg),
];

export const isFullnameValid = (requiredMsg, invalidFullnameMsg) => [
    required(requiredMsg),
    pattern(FULLNAME_VALIDATION_RULE, invalidFullnameMsg),
];

export const isMobileValid = (requiredMsgId, invalidMobileMsgId) => [
    required(requiredMsgId),
    pattern(MOBILE_RULE, invalidMobileMsgId),
];

export const isRequired = (requiredMsgId) => [required(requiredMsgId)];

export const isValidDate = (
    requiredMessage,
    invalidDateMessage,
    ageRestrictionMessage,
    ageRestriction
) => [
    isRequired(requiredMessage),
    validator((rule, value, callback) => {
        if (value) {
            let dateMoment = moment(value);
            if (dateMoment.isValid()) {
                if (ageRestrictionMessage) {
                    let currentDate = moment();
                    let difference = currentDate.diff(dateMoment, 'years');
                    if (difference > ageRestriction || difference < 0) {
                        callback(new Error(ageRestrictionMessage));
                        return;
                    }
                } else callback();
            } else {
                callback(new Error(invalidDateMessage));
                return;
            }
        } else {
            callback(new Error(requiredMessage));
            return;
        }
        callback();
    }),
];
