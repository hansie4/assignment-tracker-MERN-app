import {
    createStore,
    applyMiddleware,
    compose
} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers/rootReducer'

const initialState = {};

const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunk), ((process.env.NODE_ENV === 'production') ? null : (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))),
)

export default store