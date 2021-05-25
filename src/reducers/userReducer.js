import * as types from 'actionTypes/userTypes'

// 初始化数据
const initialState = {
    uuId: '',
    username: '',
    password: '',
    userInfo: {},
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case types.LOGIN_ACTION:
            return {
                ...state,
                uuId: action.data
            }
        case types.LOGOUT_ACTION:
            return {
                ...state,
                uuId: ''
            }
        case types.REMEMBER_PASSWORD_ACTION:
            return {
                ...state,
                username: action.data.username,
                password: action.data.password
            }
        case types.SETUSERINFO_ACTION:
            return {
                ...state,
                userInfo: action.data
            }
        default:
            return state
    }
}