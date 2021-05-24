import {
    USER_LOADING,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_LOGOUT,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAILURE,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAILURE,
    USER_MODIFY_EMAIL_SUCCESS,
    USER_MODIFY_EMAIL_FAILURE,
    USER_MODIFY_USERNAME_SUCCESS,
    USER_MODIFY_USERNAME_FAILURE,
    USER_MODIFY_PASSWORD_SUCCESS,
    USER_MODIFY_PASSWORD_FAILURE
} from '../actions/authActions'

const initialState = {
    isAuthenticated: false,
    authToken: null,
    isLoading: false
}

function authReducerFunction(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case USER_LOGIN_SUCCESS:
        case USER_REGISTER_SUCCESS:
            return {
                isAuthenticated: true,
                authToken: action.payload.authToken,
                isLoading: false
            }
        case USER_LOGIN_FAILURE:
        case USER_LOGOUT:
        case USER_DELETE_SUCCESS:
        case USER_REGISTER_FAILURE:
            return {
                isAuthenticated: false,
                authToken: null,
                isLoading: false
            }
        case USER_DELETE_FAILURE:
        case USER_MODIFY_EMAIL_SUCCESS:
        case USER_MODIFY_EMAIL_FAILURE:
        case USER_MODIFY_USERNAME_SUCCESS:
        case USER_MODIFY_USERNAME_FAILURE:
        case USER_MODIFY_PASSWORD_SUCCESS:
        case USER_MODIFY_PASSWORD_FAILURE:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state
    }
}

export default authReducerFunction