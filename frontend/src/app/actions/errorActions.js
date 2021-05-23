export const ADD_ERROR = 'ADD_ERROR'
export const CLEAR_ERRORS = 'CLEAR_ERRORS'

export const addError = (status_code, message) => {
    return {
        type: ADD_ERROR,
        payload: {
            status_code: status_code,
            message: message
        }
    }
}

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}