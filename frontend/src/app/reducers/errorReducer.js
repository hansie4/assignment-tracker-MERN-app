import {
    ERROR_SET,
    ERROR_CLEAR
} from '../actions/actionTypes'

const initialState = {
    error: null
}

function errorReducerFunction(state = initialState, action) {
    switch (action.type) {
        case ERROR_SET:
            return {
                error: {
                    status_code: action.payload.status_code,
                    message: action.payload.message
                }
            }
        case ERROR_CLEAR:
            return {
                error: null
            }
        default:
            return state
    }
}

export default errorReducerFunction