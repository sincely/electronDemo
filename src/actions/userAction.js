import * as types from 'actionTypes/userTypes'

export function login(data) {
    return {
        type: types.LOGIN_ACTION,
        data
    }
}

export function logout() {
    return {
        type: types.LOGOUT_ACTION,
        data: ''
    }
}

export function setUserInfo(data) {
    return {
        type: types.SETUSERINFO_ACTION,
        data
    }
}

export function savePassword(data) {
    return {
        type: types.REMEMBER_PASSWORD_ACTION,
        data
    }
}