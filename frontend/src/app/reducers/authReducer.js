import {
    AUTH_LOADING,
    AUTH_SUCCESS,
    AUTH_FAILURE,
    AUTH_REGISTER_FAILURE,
    AUTH_REFRESH_FAILURE,
    AUTH_LOGOUT,
    AUTH_ERROR
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
        case AUTH_SUCCESS:
            return {
                accessToken: action.payload.accessToken,
                isAuthenticated: true,
                isLoading: false
            }
        case AUTH_FAILURE:
        case AUTH_REGISTER_FAILURE:
        case AUTH_REFRESH_FAILURE:
        case AUTH_LOGOUT:
        case AUTH_ERROR:
            return {
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            }
        default:
            return state
    }
}

export default authReducerFunction