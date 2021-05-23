import { combineReducers } from 'redux'

import errorReducer from '../reducers/errorReducer'

const rootReducer = combineReducers({
    error: errorReducer
})

export default rootReducer