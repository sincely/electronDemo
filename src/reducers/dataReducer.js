import {
  SET_SETTING,
  SET_HOST_FILE,
  SET_MY_PROJECTS,
} from "actionTypes/dataTypes";

// 初始化数据
const initialState = {
  settings: {},
  hostFile: [],
  projects: [],
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SETTING:
      return {
        ...state,
        settings: action.data,
      };
    case SET_HOST_FILE:
      return {
        ...state,
        hostFile: action.data,
      };
    case SET_MY_PROJECTS:
      return {
        ...state,
        projects: action.data
      }
    default:
      return state;
  }
}
