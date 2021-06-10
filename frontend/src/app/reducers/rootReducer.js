import { combineReducers } from 'redux'

import errorReducer from './errorReducer'
import authReducer from './authReducer'
import accountReducer from './accountReducer'
import trackerReducer from './trackerReducer'

const rootReducer = combineReducers({
    error: errorReducer,
    auth: authReducer,
    account: accountReducer,
    tracker: trackerReducer
})

export default rootReducer