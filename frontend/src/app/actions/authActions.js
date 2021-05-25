import axios from 'axios'

import {
    setError,
    clearError
} from './errorActions'

export const USER_AUTH_SUCCESS = 'USER_AUTH_SUCCESS'
export const USER_AUTH_FAILURE = 'USER_AUTH_FAILURE'
export const USER_LOADING = 'USER_LOADING'
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE'
export const USER_LOGOUT = 'USER_LOGOUT'
export const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS'
export const USER_REGISTER_FAILURE = 'USER_REGISTER_FAILURE'
export const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS'
export const USER_DELETE_FAILURE = 'USER_DELETE_FAILURE'
export const USER_MODIFY_EMAIL_SUCCESS = 'USER_MODIFY_EMAIL_SUCCESS'
export const USER_MODIFY_EMAIL_FAILURE = 'USER_MODIFY_EMAIL_FAILURE'
export const USER_MODIFY_USERNAME_SUCCESS = 'USER_MODIFY_USERNAME_SUCCESS'
export const USER_MODIFY_USERNAME_FAILURE = 'USER_MODIFY_USERNAME_FAILURE'
export const USER_MODIFY_PASSWORD_SUCCESS = 'USER_MODIFY_PASSWORD_SUCCESS'
export const USER_MODIFY_PASSWORD_FAILURE = 'USER_MODIFY_PASSWORD_FAILURE'

export const authenticateUser = () => async (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    const url = '/account/'
    const body = {}
    const config = tokenConfig(getState)

    await axios.post(url, body, config)
        .then(() => {
            dispatch(clearError())
            dispatch({ type: USER_AUTH_SUCCESS })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
            } else if (error.request) {
                dispatch(setError(500, 'No respose recieved from the server'))
            } else {
                dispatch(setError(400, 'Error creating request'))
            }
            dispatch({ type: USER_AUTH_FAILURE })
        })
}

export const loginUser = (username, password) => async (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    const url = '/account/login'
    const body = {
        username,
        password
    }
    const config = tokenConfig(getState)

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    authToken: response.data.token
                }
            })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
            } else if (error.request) {
                dispatch(setError(500, 'No respose recieved from the server'))
            } else {
                dispatch(setError(400, 'Error creating request'))
            }
            dispatch({ type: USER_LOGIN_FAILURE })
        })
}

export const registerUser = (email_address, username, password) => async (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    const url = '/account/register'
    const body = {
        email_address,
        username,
        password
    }
    const config = tokenConfig(getState)

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: USER_REGISTER_SUCCESS,
                payload: {
                    authToken: response.data.token
                }
            })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
            } else if (error.request) {
                dispatch(setError(500, 'No respose recieved from the server'))
            } else {
                dispatch(setError(400, 'Error creating request'))
            }
            dispatch({ type: USER_REGISTER_FAILURE })
        })
}

export const deleteUser = () => async (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    const url = '/account/delete'
    const config = tokenConfig(getState)

    await axios.delete(url, config)
        .then(() => {
            dispatch(clearError())
            dispatch({ type: USER_DELETE_SUCCESS })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
            } else if (error.request) {
                dispatch(setError(500, 'No respose recieved from the server'))
            } else {
                dispatch(setError(400, 'Error creating request'))
            }
            dispatch({ type: USER_DELETE_FAILURE })
        })
}

export const modifyEmailAddress = (new_email_address) => async (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    const url = '/account/update/email'
    const body = {
        new_email_address
    }
    const config = tokenConfig(getState)

    await axios.post(url, body, config)
        .then(() => {
            dispatch(clearError())
            dispatch({ type: USER_MODIFY_EMAIL_SUCCESS })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
            } else if (error.request) {
                dispatch(setError(500, 'No respose recieved from the server'))
            } else {
                dispatch(setError(400, 'Error creating request'))
            }
            dispatch({ type: USER_MODIFY_EMAIL_FAILURE })
        })
}

export const modifyUsername = (new_username) => async (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    const url = '/account/update/username'
    const body = {
        new_username
    }
    const config = tokenConfig(getState)

    await axios.post(url, body, config)
        .then(() => {
            dispatch(clearError())
            dispatch({ type: USER_MODIFY_USERNAME_SUCCESS })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
            } else if (error.request) {
                dispatch(setError(500, 'No respose recieved from the server'))
            } else {
                dispatch(setError(400, 'Error creating request'))
            }
            dispatch({ type: USER_MODIFY_USERNAME_FAILURE })
        })
}

export const modifyPassword = (new_password) => async (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    const url = '/account/update/password'
    const body = {
        new_password
    }
    const config = tokenConfig(getState)

    await axios.post(url, body, config)
        .then(() => {
            dispatch(clearError())
            dispatch({ type: USER_MODIFY_PASSWORD_SUCCESS })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
            } else if (error.request) {
                dispatch(setError(500, 'No respose recieved from the server'))
            } else {
                dispatch(setError(400, 'Error creating request'))
            }
            dispatch({ type: USER_MODIFY_PASSWORD_FAILURE })
        })
}

export const logoutUser = () => (dispatch) => {
    dispatch({ type: USER_LOADING })
    dispatch({ type: USER_LOGOUT })
}

export const tokenConfig = getState => {
    const token = getState().auth.authToken

    const config = {
        headers: {
            'Content-type': 'application/json'
        },
        timeout: 1000
    }

    if (token) config.headers['auth-token'] = token

    return config
}