import axios from 'axios'

import {
    AUTH_LOADING,
    AUTH_DONE_LOADING,
    AUTH_SUCCESS,
    AUTH_FAILURE,
    AUTH_LOGOUT,
    SERVER_ERROR,
    CLIENT_ERROR
} from '../actions/actionTypes'

import {
    setError,
    clearError
} from './errorActions'

export const loginUser = ({ username, password }) => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    if (!username || username === '') {
        dispatch(setError(400, 'Username is required'))
        dispatch({ type: AUTH_FAILURE })
        return dispatch({ type: AUTH_DONE_LOADING })
    }
    if (!password || password === '') {
        dispatch(setError(400, 'Password is required'))
        dispatch({ type: AUTH_FAILURE })
        return dispatch({ type: AUTH_DONE_LOADING })
    }

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
                dispatch(setError(500, 'No response from server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: AUTH_DONE_LOADING })
}

export const registerUser = ({ email_address, username, password }) => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    if (!email_address || email_address === '') {
        dispatch(setError(400, 'Email address is required'))
        dispatch({ type: AUTH_FAILURE })
        return dispatch({ type: AUTH_DONE_LOADING })
    }
    if (!username || username === '') {
        dispatch(setError(400, 'Username is required'))
        dispatch({ type: AUTH_FAILURE })
        return dispatch({ type: AUTH_DONE_LOADING })
    }
    if (!password || password === '') {
        dispatch(setError(400, 'Password is required'))
        dispatch({ type: AUTH_FAILURE })
        return dispatch({ type: AUTH_DONE_LOADING })
    }

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
                dispatch({ type: AUTH_FAILURE })
            } else if (error.request) {
                dispatch(setError(500, 'No response from server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: AUTH_DONE_LOADING })
}

export const refreshToken = () => async (dispatch, getState) => {
    const url = '/auth/refresh'
    const config = authTokenConfig(getState)

    return await axios.get(url, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: AUTH_SUCCESS,
                payload: {
                    accessToken: response.data.access_token
                }
            })
            return true
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status !== 401) {
                    dispatch(setError(error.response.status, error.response.data.msg))
                    dispatch({ type: AUTH_FAILURE })
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error access token request'))
                dispatch({ type: CLIENT_ERROR })
            }
            return false
        })
}

export const recoveryEmail = ({ email_address }) => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    if (!email_address) dispatch({ type: AUTH_FAILURE })

    const url = '/auth/recover'
    const body = {
        email_address
    }
    const config = authTokenConfig(getState)

    await axios.post(url, body, config)
        .then(() => {
            dispatch(clearError())
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
                dispatch(setError(500, 'No response from server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: AUTH_DONE_LOADING })
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

export const handle401Error = (actionToCallAfterRefresh, functionArgumentsObject) => async (dispatch) => {
    const refreshSuccessful = await dispatch(refreshToken())

    if (refreshSuccessful) {
        await dispatch(actionToCallAfterRefresh(functionArgumentsObject))
    } else {
        dispatch({ type: AUTH_LOGOUT })
    }
}

export const initialAuthLoad = () => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })
    await dispatch(refreshToken())
    dispatch({ type: AUTH_DONE_LOADING })
}