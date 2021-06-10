import {
    TRACKER_LOADING,
    TRACKER_DONE_LOADING,
    TRACKER_SUCCESS,
    TRACKER_UPDATE_SUCCESS,
    TRACKER_SEMESTER_SELECTED,
    SERVER_ERROR,
    CLIENT_ERROR
} from '../actions/actionTypes'

const initialState = {
    semesters: [],
    selected_semester_id: localStorage.getItem('selected_semester_id'),
    isLoading: false
}

function trackerReducerFunction(state = initialState, action) {
    switch (action.type) {
        case TRACKER_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case TRACKER_DONE_LOADING:
            return {
                ...state,
                isLoading: false
            }
        case TRACKER_SUCCESS:
            return {
                ...state,
                semesters: action.payload.semesters
            }
        case TRACKER_SEMESTER_SELECTED:
            localStorage.setItem('selected_semester_id', action.payload.selected_semester_id)
            return {
                ...state,
                selected_semester_id: action.payload.selected_semester_id
            }
        case TRACKER_UPDATE_SUCCESS:
        case SERVER_ERROR:
        case CLIENT_ERROR:
        default:
            return state
    }
}

export default trackerReducerFunction