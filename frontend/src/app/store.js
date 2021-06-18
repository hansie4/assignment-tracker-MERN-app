import {
    createStore,
    applyMiddleware,
    compose
} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers/rootReducer'

const initialState = {};

let store

if (process.env.NODE_ENV === 'production') {
    store = createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(thunk)),
    )
} else {
    store = createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()),
    )
}

export default store