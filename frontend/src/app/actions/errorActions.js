import {
    ERROR_SET,
    ERROR_CLEAR
} from './actionTypes'

export const setError = (status_code, message) => {
    return {
        type: ERROR_SET,
        payload: {
            status_code: status_code,
            message: message
        }
    }
}

export const clearError = () => {
    return {
        type: ERROR_CLEAR
    }
}