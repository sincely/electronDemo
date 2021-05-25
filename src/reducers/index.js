import { combineReducers } from 'redux'
import userReducer from './userReducer'
import dataReducer from './dataReducer'

const rootReducer = combineReducers({
    userReducer,
    dataReducer,
})

export default rootReducer