import {
    ADD_ERROR,
    CLEAR_ERRORS
} from '../actions/errorActions'

const initialState = {
    errors: []
}

function errorReducerFunction(state = initialState, action) {
    switch (action.type) {
        case ADD_ERROR:
            return {
                errors: [
                    ...state.errors,
                    {
                        status_code: action.payload.status_code,
                        message: action.payload.message
                    }
                ]
            }
        case CLEAR_ERRORS:
            return {
                errors: []
            }
        default:
            return state
    }
}

export default errorReducerFunction