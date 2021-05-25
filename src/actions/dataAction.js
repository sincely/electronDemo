import {
    SET_SETTING,
    SET_HOST_FILE,
    SET_MY_PROJECTS,
} from 'actionTypes/dataTypes'

export function setSetting(data) {
    return {
        type: SET_SETTING,
        data
    }
}

export function setHostFile(data) {
    return {
        type: SET_HOST_FILE,
        data
    }
}

export function setMyProjects(data) {
    return {
        type: SET_MY_PROJECTS,
        data
    }
}