import axios from 'axios'

import {
    ACCOUNT_LOADING,
    ACCOUNT_DONE_LOADING,
    ACCOUNT_INFO_SUCCESS,
    ACCOUNT_MODIFY_EMAIL_SUCCESS,
    ACCOUNT_MODIFY_USERNAME_SUCCESS,
    ACCOUNT_LOGOUT,
    AUTH_LOADING,
    AUTH_DONE_LOADING,
    AUTH_LOGOUT,
    SERVER_ERROR,
    CLIENT_ERROR
} from './actionTypes'

import {
    authTokenConfig,
    handle401Error
} from './authActions'

import {
    setError,
    clearError
} from './errorActions'

export const getAccountInfo = () => async (dispatch, getState) => {
    dispatch({ type: ACCOUNT_LOADING })

    const url = '/account/'
    const config = authTokenConfig(getState)

    await axios.get(url, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: ACCOUNT_INFO_SUCCESS,
                payload: {
                    email_address: response.data.email_address,
                    username: response.data.username,
                    date_registered: response.data.date_registered
                }
            })
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(getAccountInfo, {}, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating login request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: ACCOUNT_DONE_LOADING })
}

export const changeEmailAddress = ({ new_email_address }) => async (dispatch, getState) => {
    dispatch({ type: ACCOUNT_LOADING })

    if (!new_email_address) {
        dispatch(setError(400, 'New email address is required'))
        return dispatch({ type: ACCOUNT_DONE_LOADING })
    }

    const url = '/account/update/email'
    const body = {
        new_email_address
    }
    const config = authTokenConfig(getState)

    await axios.put(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: ACCOUNT_MODIFY_EMAIL_SUCCESS,
                payload: {
                    new_email_address: response.data.new_email_address
                }
            })
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(changeEmailAddress, { new_email_address }, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating login request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: ACCOUNT_DONE_LOADING })
}

export const changeUsername = ({ new_username }) => async (dispatch, getState) => {
    dispatch({ type: ACCOUNT_LOADING })

    if (!new_username) {
        dispatch(setError(400, 'New username is required'))
        return dispatch({ type: ACCOUNT_DONE_LOADING })
    }

    const url = '/account/update/username'
    const body = {
        new_username
    }
    const config = authTokenConfig(getState)

    await axios.put(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: ACCOUNT_MODIFY_USERNAME_SUCCESS,
                payload: {
                    new_username: response.data.new_username
                }
            })
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(changeUsername, { new_username }, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating login request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: ACCOUNT_DONE_LOADING })
}

export const changePassword = ({ new_password, accessToken }) => async (dispatch, getState) => {
    dispatch({ type: ACCOUNT_LOADING })

    if (!new_password) {
        dispatch(setError(400, 'New password is required'))
        return dispatch({ type: ACCOUNT_DONE_LOADING })
    }

    const url = '/account/update/password'
    const body = {
        new_password
    }
    let config
    if (accessToken) {
        config = {
            headers: {
                'Content-type': 'application/json'
            },
            timeout: 1000
        }
        config.headers['Authorization'] = 'Bearer '.concat(accessToken)
    } else {
        config = authTokenConfig(getState)
    }

    await axios.put(url, body, config)
        .then(() => {
            dispatch(clearError())
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(changePassword, { new_password }, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating login request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: ACCOUNT_DONE_LOADING })
}

export const logoutUser = () => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    const url = '/account/logout'
    const config = authTokenConfig(getState)

    await axios.delete(url, config)
        .then(() => {
            dispatch(clearError())
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(logoutUser, {}, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating logout request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: ACCOUNT_LOGOUT })
    dispatch({ type: AUTH_LOGOUT })
    dispatch({ type: AUTH_DONE_LOADING })
}

export const logoutUserAllDevices = () => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    const url = '/account/logout_all'
    const config = authTokenConfig(getState)

    await axios.delete(url, config)
        .then(() => {
            dispatch(clearError())
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(logoutUserAllDevices, {}, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating logout request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: ACCOUNT_LOGOUT })
    dispatch({ type: AUTH_LOGOUT })
    dispatch({ type: AUTH_DONE_LOADING })
}

export const deleteAccount = () => async (dispatch, getState) => {
    dispatch({ type: AUTH_LOADING })

    const url = '/account/delete'
    const config = authTokenConfig(getState)

    await axios.delete(url, config)
        .then(() => {
            dispatch(clearError())
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(deleteAccount, {}, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from authentication server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating login request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: AUTH_LOGOUT })
    dispatch({ type: AUTH_DONE_LOADING })
}