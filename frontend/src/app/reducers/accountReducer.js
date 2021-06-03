import {
    ACCOUNT_LOADING,
    ACCOUNT_DONE_LOADING,
    ACCOUNT_INFO_SUCCESS,
    ACCOUNT_MODIFY_EMAIL_SUCCESS,
    ACCOUNT_MODIFY_USERNAME_SUCCESS,
    ACCOUNT_LOGOUT,
    SERVER_ERROR,
    CLIENT_ERROR
} from '../actions/actionTypes'

const initialState = {
    email_address: null,
    username: null,
    date_registered: null,
    isLoading: false
}

function accountReducerFunction(state = initialState, action) {
    switch (action.type) {
        case ACCOUNT_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case ACCOUNT_DONE_LOADING:
            return {
                ...state,
                isLoading: false
            }
        case ACCOUNT_INFO_SUCCESS:
            return {
                ...state,
                email_address: action.payload.email_address,
                username: action.payload.username,
                date_registered: action.payload.date_registered
            }
        case ACCOUNT_MODIFY_EMAIL_SUCCESS:
            return {
                ...state,
                email_address: action.payload.new_email_address
            }
        case ACCOUNT_MODIFY_USERNAME_SUCCESS:
            return {
                ...state,
                username: action.payload.new_username
            }
        case ACCOUNT_LOGOUT:
            return {
                ...state,
                email_address: null,
                username: null,
                date_registered: null
            }
        case SERVER_ERROR:
        case CLIENT_ERROR:
            return {
                ...state,
                email_address: null,
                username: null,
                date_registered: null,
                isLoading: false
            }
        default:
            return state
    }
}

export default accountReducerFunction