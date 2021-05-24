import { combineReducers } from 'redux'

import errorReducer from '../reducers/errorReducer'
import authReducer from '../reducers/authReducer'

const rootReducer = combineReducers({
    error: errorReducer,
    auth: authReducer
})

export default rootReducer