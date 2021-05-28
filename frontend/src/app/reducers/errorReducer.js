import {
    SET_ERROR,
    CLEAR_ERROR
} from '../actions/actionTypes'

const initialState = {
    error: null
}

function errorReducerFunction(state = initialState, action) {
    switch (action.type) {
        case SET_ERROR:
            return {
                error: {
                    status_code: action.payload.status_code,
                    message: action.payload.message
                }
            }
        case CLEAR_ERROR:
            return {
                error: null
            }
        default:
            return state
    }
}

export default errorReducerFunction