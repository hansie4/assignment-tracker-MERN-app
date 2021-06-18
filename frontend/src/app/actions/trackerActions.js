import axios from 'axios'

import {
    TRACKER_LOADING,
    TRACKER_DONE_LOADING,
    TRACKER_SUCCESS,
    TRACKER_SEMESTER_SELECTED,
    TRACKER_CLASS_SELECTED,
    SERVER_ERROR,
    CLIENT_ERROR
} from './actionTypes'

import {
    authTokenConfig,
    handle401Error,
    getOffsetDate
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
                    await dispatch(handle401Error(getTrackerInfo, {}))
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
        start_date: getOffsetDate(start_date),
        end_date: getOffsetDate(end_date)
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
                    await dispatch(handle401Error(addSemester, { name, start_date, end_date }))
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
                    await dispatch(handle401Error(deleteSemester, { semester_id }))
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

export const modifySemester = ({ semester_id, new_name, new_start_date, new_end_date, deleteDates }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    } else if (!new_name && !new_start_date && !new_end_date && !deleteDates) {
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
        new_start_date: getOffsetDate(new_start_date),
        new_end_date: getOffsetDate(new_end_date),
        deleteDates
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
                    await dispatch(handle401Error(modifySemester, { semester_id, new_name, new_start_date, new_end_date }))
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


export const addClass = ({ semester_id, name, description }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!name) {
        dispatch(setError(400, 'Semester name is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/class'
    const body = {
        name,
        description
    }
    let config = authTokenConfig(getState)

    config.headers['semester_id'] = semester_id

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: TRACKER_SUCCESS,
                payload: {
                    semesters: response.data.semesters
                }
            })
            const classes = getState().tracker.semesters.find(value => value._id === semester_id).classes
            const class_id = classes[(classes.length - 1)]._id
            dispatch(selectClass(class_id))
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(addClass, { semester_id, name, description }))
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

export const deleteClass = ({ class_id, semester_id }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/class'
    let config = authTokenConfig(getState)

    config.headers['class_id'] = class_id
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
            dispatch(selectClass())
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(deleteClass, { class_id, semester_id }))
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

export const modifyClass = ({ class_id, semester_id, new_name, new_description }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!new_name && !new_description) {
        dispatch(setError(400, 'Values to update are required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/class'
    const body = {
        new_name,
        new_description
    }
    let config = authTokenConfig(getState)

    config.headers['class_id'] = class_id
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
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(modifyClass, { class_id, semester_id, new_name, new_description }))
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


export const addInstructor = ({ class_id, semester_id, name, email_address, office_hours_info }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!name) {
        dispatch(setError(400, 'Instructor name is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/instructor'
    const body = {
        name,
        email_address,
        office_hours_info
    }
    let config = authTokenConfig(getState)

    config.headers['class_id'] = class_id
    config.headers['semester_id'] = semester_id

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: TRACKER_SUCCESS,
                payload: {
                    semesters: response.data.semesters
                }
            })
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(addInstructor, { class_id, semester_id, name, email_address, office_hours_info }))
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

export const deleteInstructor = ({ instructor_id, class_id, semester_id }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!instructor_id) {
        dispatch(setError(400, 'Instructor id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/instructor'
    let config = authTokenConfig(getState)

    config.headers['instructor_id'] = instructor_id
    config.headers['class_id'] = class_id
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
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(deleteInstructor, { instructor_id, class_id, semester_id }))
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


export const addAssignmentType = ({ class_id, semester_id, name, weight }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!name) {
        dispatch(setError(400, 'Assignment type name is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!weight) {
        dispatch(setError(400, 'Assignment type weight is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/assignment_type'
    const body = {
        name,
        weight
    }
    let config = authTokenConfig(getState)

    config.headers['class_id'] = class_id
    config.headers['semester_id'] = semester_id

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: TRACKER_SUCCESS,
                payload: {
                    semesters: response.data.semesters
                }
            })
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(addAssignmentType, { class_id, semester_id, name, weight }))
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

export const deleteAssignmentType = ({ assignment_type_id, class_id, semester_id }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!assignment_type_id) {
        dispatch(setError(400, 'Assignment type id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/assignment_type'
    let config = authTokenConfig(getState)

    config.headers['assignment_type_id'] = assignment_type_id
    config.headers['class_id'] = class_id
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
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(deleteAssignmentType, { assignment_type_id, class_id, semester_id }))
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


export const addAssignment = ({ class_id, semester_id, name, notes, due_date, assignment_type_id, turned_in, grade }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!name) {
        dispatch(setError(400, 'Assignment name is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/assignment'
    const body = {
        name,
        notes,
        due_date: (due_date ? getOffsetDate(due_date) : getOffsetDate(new Date())),
        assignment_type_id,
        turned_in,
        grade
    }
    let config = authTokenConfig(getState)

    config.headers['class_id'] = class_id
    config.headers['semester_id'] = semester_id

    await axios.post(url, body, config)
        .then((response) => {
            dispatch(clearError())
            dispatch({
                type: TRACKER_SUCCESS,
                payload: {
                    semesters: response.data.semesters
                }
            })
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(addAssignment, { class_id, semester_id, name, notes, due_date, assignment_type_id, turned_in, grade }))
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

export const deleteAssignment = ({ assignment_id, class_id, semester_id }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!assignment_id) {
        dispatch(setError(400, 'Assignment id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/assignment'
    let config = authTokenConfig(getState)

    config.headers['assignment_id'] = assignment_id
    config.headers['class_id'] = class_id
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
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(deleteAssignment, { assignment_id, class_id, semester_id }))
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

export const modifyAssignment = ({ assignment_id, class_id, semester_id, new_name, new_notes, new_due_date, new_assignment_type_id, new_turned_in, new_grade }) => async (dispatch, getState) => {
    dispatch({ type: TRACKER_LOADING })

    if (!assignment_id) {
        dispatch(setError(400, 'Assignment id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!class_id) {
        dispatch(setError(400, 'Class id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!semester_id) {
        dispatch(setError(400, 'Semester id is required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }
    if (!new_name && !new_notes && !new_due_date && !new_assignment_type_id && !new_turned_in && !new_grade) {
        dispatch(setError(400, 'Values to modify are required'))
        return dispatch({ type: TRACKER_DONE_LOADING })
    }

    const url = '/tracker/assignment'
    const body = {
        new_name,
        new_notes,
        new_due_date: getOffsetDate(new_due_date),
        new_assignment_type_id,
        new_turned_in,
        new_grade
    }
    let config = authTokenConfig(getState)

    config.headers['assignment_id'] = assignment_id
    config.headers['class_id'] = class_id
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
        })
        .catch(async (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    await dispatch(handle401Error(modifyAssignment, { assignment_id, class_id, semester_id, new_name, new_notes, new_due_date, new_assignment_type_id, new_turned_in, new_grade }))
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
                dispatch({
                    type: TRACKER_SEMESTER_SELECTED,
                    payload: {
                        selected_semester_id: semester._id
                    }
                })
            } else {
                dispatch({
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
                    dispatch({
                        type: TRACKER_SEMESTER_SELECTED,
                        payload: {
                            selected_semester_id: selected_semester_id
                        }
                    })
                } else {
                    dispatch({
                        type: TRACKER_SEMESTER_SELECTED,
                        payload: {
                            selected_semester_id: semesters[0]._id
                        }
                    })
                }
            } else {
                dispatch({
                    type: TRACKER_SEMESTER_SELECTED,
                    payload: {
                        selected_semester_id: semesters[0]._id
                    }
                })
            }
        }
    } else {
        dispatch({
            type: TRACKER_SEMESTER_SELECTED,
            payload: {
                selected_semester_id: null
            }
        })
    }

    return dispatch(selectClass())
}

export const selectClass = (class_id) => (dispatch, getState) => {
    const selected_semester_id = getState().tracker.selected_semester_id
    const selected_class_id = getState().tracker.selected_class_id

    if (selected_semester_id) {

        const semester = getState().tracker.semesters.find(value => value._id === selected_semester_id)

        if (semester) {
            if (semester.classes.length > 0) {
                if (class_id) {
                    const class_ = semester.classes.find(value => value._id === class_id)
                    if (semester) {
                        return dispatch({
                            type: TRACKER_CLASS_SELECTED,
                            payload: {
                                selected_class_id: class_._id
                            }
                        })
                    } else {
                        return dispatch({
                            type: TRACKER_CLASS_SELECTED,
                            payload: {
                                selected_class_id: semester.classes[0]._id
                            }
                        })
                    }
                } else {
                    // If there is already a semester selected and a semester id was not passed in
                    if (selected_class_id) {
                        const class_ = semester.classes.find(value => value._id === selected_semester_id)
                        if (class_) {
                            return dispatch({
                                type: TRACKER_CLASS_SELECTED,
                                payload: {
                                    selected_class_id: selected_semester_id
                                }
                            })
                        } else {
                            return dispatch({
                                type: TRACKER_CLASS_SELECTED,
                                payload: {
                                    selected_class_id: semester.classes[0]._id
                                }
                            })
                        }
                    } else {
                        return dispatch({
                            type: TRACKER_CLASS_SELECTED,
                            payload: {
                                selected_class_id: semester.classes[0]._id
                            }
                        })
                    }
                }
            } else {
                return dispatch({
                    type: TRACKER_CLASS_SELECTED,
                    payload: {
                        selected_class_id: null
                    }
                })
            }
        } else {
            dispatch(selectSemester())
            dispatch({
                type: TRACKER_CLASS_SELECTED,
                payload: {
                    selected_class_id: null
                }
            })
        }
    } else {
        dispatch(selectSemester())
        dispatch({
            type: TRACKER_CLASS_SELECTED,
            payload: {
                selected_class_id: null
            }
        })
    }
}

export const getSelectedSemesterInfo = () => (dispatch, getState) => {
    const selected_semester_id = getState().tracker.selected_semester_id

    if (!selected_semester_id) dispatch(selectSemester())

    return getState().tracker.semesters.find(semester => semester._id === selected_semester_id)
}

export const getSelectedClassInfo = () => (dispatch, getState) => {
    const selected_semester_id = getState().tracker.selected_semester_id
    const selected_class_id = getState().tracker.selected_class_id

    if (!selected_semester_id) dispatch(selectSemester())
    if (!selected_class_id) dispatch(selectClass())

    const semester = getState().tracker.semesters.find(semester => semester._id === selected_semester_id)

    if (semester) {
        return semester.classes.find(value => value._id === selected_class_id)
    } else {
        return null
    }
}