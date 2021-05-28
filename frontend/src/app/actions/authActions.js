import axios from 'axios'

import {
    AUTH_LOADING,
    AUTH_SUCCESS,
    AUTH_FAILURE,
    AUTH_REGISTER_FAILURE,
    AUTH_REFRESH_FAILURE,
    AUTH_LOGOUT,
    AUTH_ERROR
} from './actionTypes'

import {
    setError,
    clearError
} from './errorActions'

export const loginUser = (username, password) => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    const url = '/auth/login'
    const body = {
        username,
        password
    }
    const config = authTokenConfig(getState)

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: AUTH_SUCCESS,
                payload: {
                    accessToken: response.data.access_token
                }
            })
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    dispatch(setError(error.response.status, 'Invalid credentials'))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
                dispatch({ type: AUTH_FAILURE })
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: AUTH_ERROR })
            } else {
                dispatch(setError(400, 'Error creating login request'))
                dispatch({ type: AUTH_ERROR })
            }
        })
}

export const registerUser = (email_address, username, password) => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    const url = '/auth/register'
    const body = {
        email_address,
        username,
        password
    }
    const config = authTokenConfig(getState)

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: AUTH_SUCCESS,
                payload: {
                    accessToken: response.data.access_token
                }
            })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
                dispatch({ type: AUTH_REGISTER_FAILURE })
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: AUTH_ERROR })
            } else {
                dispatch(setError(400, 'Error creating register request'))
                dispatch({ type: AUTH_ERROR })
            }
        })
}

export const refreshToken = () => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    const url = '/auth/refresh'
    const config = authTokenConfig(getState)

    await axios.get(url, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: AUTH_SUCCESS,
                payload: {
                    accessToken: response.data.access_token
                }
            })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
                dispatch({ type: AUTH_REFRESH_FAILURE })
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: AUTH_ERROR })
            } else {
                dispatch(setError(400, 'Error access token refresh request'))
                dispatch({ type: AUTH_ERROR })
            }
        })
}

export const logoutUser = () => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    const url = '/auth/logout'
    const body = {}
    const config = authTokenConfig(getState)

    await axios.post(url, body, config)
        .then(() => {
            dispatch(clearError())
            dispatch({ type: AUTH_LOGOUT })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
                dispatch({ type: AUTH_LOGOUT })
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: AUTH_ERROR })
            } else {
                dispatch(setError(400, 'Error creating logout request'))
                dispatch({ type: AUTH_ERROR })
            }
        })
}

export const logoutAllUserDevices = () => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    const url = '/auth/logout_all'
    const config = authTokenConfig(getState)

    await axios.delete(url, config)
        .then(() => {
            dispatch(clearError())
            dispatch({ type: AUTH_LOGOUT })
        })
        .catch((error) => {
            if (error.response) {
                dispatch(setError(error.response.status, error.response.data.msg))
                dispatch({ type: AUTH_LOGOUT })
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
            } else {
                dispatch(setError(400, 'Error creating logout request'))
            }
            dispatch({ type: AUTH_ERROR })
        })
}

export const authTokenConfig = getState => {
    const token = getState().auth.accessToken

    const config = {
        headers: {
            'Content-type': 'application/json'
        },
        timeout: 1000
    }

    if (token) config.headers['Authorization'] = 'Bearer '.concat(token)

    return config
}