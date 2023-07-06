import {
    API_SUCCESS,
    API_FAIL,
    GET_AVAILABLE_PATHWAYS,
    CREATE_CASE,
    CASE_PDF_DOWNLOAD
} from "./actionTypes";

export const apiSuccess = (actionType, data) => ({
    type: API_SUCCESS,
    payload: { actionType, data },
});

export const apiFail = (actionType, error) => ({
    type: API_FAIL,
    payload: { actionType, error },
});


export const getAvailablePathways = (periodType) => ({
    type: GET_AVAILABLE_PATHWAYS,
    payload: periodType
});

export const createCase = (actionType) => ({
    type: CREATE_CASE,
    payload: actionType
})

