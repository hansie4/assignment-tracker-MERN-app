export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

export const setError = (status_code, message) => {
    return {
        type: SET_ERROR,
        payload: {
            status_code: status_code,
            message: message
        }
    }
}

export const clearError = () => {
    return {
        type: CLEAR_ERROR
    }
}