import {
    AUTH_LOADING,
    AUTH_DONE_LOADING,
    AUTH_SUCCESS,
    AUTH_FAILURE,
    AUTH_LOGOUT,
    SERVER_ERROR,
    CLIENT_ERROR
} from '../actions/actionTypes'

const initialState = {
    accessToken: null,
    isAuthenticated: false,
    isLoading: false
}

function authReducerFunction(state = initialState, action) {
    switch (action.type) {
        case AUTH_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case AUTH_DONE_LOADING:
            return {
                ...state,
                isLoading: false
            }
        case AUTH_SUCCESS:
            return {
                ...state,
                accessToken: action.payload.accessToken,
                isAuthenticated: true
            }
        case AUTH_FAILURE:
            return {
                ...state,
                accessToken: null,
                isAuthenticated: false
            }
        case AUTH_LOGOUT:
            return {
                ...state,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            }
        case SERVER_ERROR:
        case CLIENT_ERROR:
        default:
            return state
    }
}

export default authReducerFunction