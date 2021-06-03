import { combineReducers } from 'redux'

import errorReducer from '../reducers/errorReducer'
import authReducer from '../reducers/authReducer'
import accountReducer from '../reducers/accountReducer'

const rootReducer = combineReducers({
    error: errorReducer,
    auth: authReducer,
    account: accountReducer
})

export default rootReducer