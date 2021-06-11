import axios from 'axios'

import {
    TRACKER_LOADING,
    TRACKER_DONE_LOADING,
    TRACKER_SUCCESS,
    TRACKER_SEMESTER_SELECTED,
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

export const getTrackerInfo = () => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    const url = '/tracker'
    const config = authTokenConfig(getState)

    await axios.get(url, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: TRACKER_SUCCESS,
                payload: {
                    semesters: response.data.semesters
                }
            })
            dispatch(selectSemester())
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(getTrackerInfo, {}, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: TRACKER_DONE_LOADING })
}

export const addSemester = ({ name, start_date, end_date }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!name) {
        dispatch(setError(400, 'Semester name is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    if (start_date && end_date) {
        if (start_date > end_date) {
            dispatch(setError(400, 'Semester start date must be before end date'))
            return dispatch({ type: TRACKER_DONE_LOADING })
        }
    }

    const url = '/tracker/semester'
    const body = {
        name,
        start_date,
        end_date
    }
    const config = authTokenConfig(getState)

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: TRACKER_SUCCESS,
                payload: {
                    semesters: response.data.semesters
                }
            })
            dispatch(selectSemester(response.data.semesters[(response.data.semesters.length - 1)]._id))
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(addSemester, body, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: TRACKER_DONE_LOADING })
}

export const deleteSemester = ({ semester_id }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/semester'
    let config = authTokenConfig(getState)

    config.headers['semester_id'] = semester_id

    await axios.delete(url, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: TRACKER_SUCCESS,
                payload: {
                    semesters: response.data.semesters
                }
            })
            dispatch(selectSemester())
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(addSemester, { semester_id }, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: TRACKER_DONE_LOADING })
}

export const modifySemester = ({ semester_id, new_name, new_start_date, new_end_date }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    } else if (!new_name && !new_start_date && !new_end_date) {
        dispatch(setError(400, 'Values to update are required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    if (new_start_date && new_end_date) {
        if (new_start_date > new_end_date) {
            dispatch(setError(400, 'Semester start date must be before end date'))
            return dispatch({ type: TRACKER_DONE_LOADING })
        }
    }

    const url = '/tracker/semester'
    const body = {
        new_name,
        new_start_date,
        new_end_date
    }
    let config = authTokenConfig(getState)

    config.headers['semester_id'] = semester_id

    await axios.put(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: TRACKER_SUCCESS,
                payload: {
                    semesters: response.data.semesters
                }
            })
            dispatch(selectSemester())
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(addSemester, { semester_id, new_name, new_start_date, new_end_date }, []))
                } else {
                    dispatch(setError(error.response.status, error.response.data.msg))
                }
            } else if (error.request) {
                dispatch(setError(500, 'No response from server'))
                dispatch({ type: SERVER_ERROR })
            } else {
                dispatch(setError(0, 'Error creating request'))
                dispatch({ type: CLIENT_ERROR })
            }
        })

    dispatch({ type: TRACKER_DONE_LOADING })
}

export const selectSemester = (semester_id) => (dispatch, getState) => {
    const selected_semester_id = getState().tracker.selected_semester_id
    const semesters = getState().tracker.semesters

    if (semesters.length > 0) {
        if (semester_id) {
            const semester = semesters.find(value => value._id === semester_id)
            if (semester) {
                return dispatch({
                    type: TRACKER_SEMESTER_SELECTED,
                    payload: {
                        selected_semester_id: semester._id
                    }
                })
            } else {
                return dispatch({
                    type: TRACKER_SEMESTER_SELECTED,
                    payload: {
                        selected_semester_id: semesters[0]._id
                    }
                })
            }
        } else {
            // If there is already a semester selected and a semester id was not passed in
            if (selected_semester_id) {
                const semester = semesters.find(value => value._id === selected_semester_id)
                if (semester) {
                    return dispatch({
                        type: TRACKER_SEMESTER_SELECTED,
                        payload: {
                            selected_semester_id: selected_semester_id
                        }
                    })
                } else {
                    return dispatch({
                        type: TRACKER_SEMESTER_SELECTED,
                        payload: {
                            selected_semester_id: semesters[0]._id
                        }
                    })
                }
            } else {
                return dispatch({
                    type: TRACKER_SEMESTER_SELECTED,
                    payload: {
                        selected_semester_id: semesters[0]._id
                    }
                })
            }
        }
    } else {
        return dispatch({
            type: TRACKER_SEMESTER_SELECTED,
            payload: {
                selected_semester_id: null
            }
        })
    }
}

export const getSelectedSemesterInfo = () => (dispatch, getState) => {
    const selected_semester_id = getState().tracker.selected_semester_id

    if (!selected_semester_id) dispatch(selectSemester())

    return getState().tracker.semesters.find(semester => semester._id === selected_semester_id)
}