import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { SET_USER_LOGIN_AUTH, SET_USER_NAME_INFO, SET_USER_INFO, SET_USER_DIALOG } from '../actions';

const userLoginAuthPersistConfig = {
  key: 'userLoginAuth',
  storage: sessionStorage,
};

const userLoginAuth = (state = { auth: false }, action) => {
  switch (action.type) {
    case SET_USER_LOGIN_AUTH:
      return { auth: action.userLoginAuth };
    default:
      return state;
  }
};

const userNameInfoPersistConfig = {
  key: 'userNameInfo',
  storage: sessionStorage,
};

const userNameInfo = (state = { name: '' }, action) => {
  switch (action.type) {
    case SET_USER_NAME_INFO:
      return { name: action.userNameInfo };
    default:
      return state;
  }
};

function userInfo(state = {}, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return action.userInfo;
    default:
      return state;
  }
}

function userDialog(state = false, action) {
  switch (action.type) {
    case SET_USER_DIALOG:
      return action.userDialog;
    default:
      return state;
  }
}

const userInfoReducers = {
  userInfo,
  userDialog,
  userLoginAuth: persistReducer(userLoginAuthPersistConfig, userLoginAuth),
  userNameInfo: persistReducer(userNameInfoPersistConfig, userNameInfo),
};

export default userInfoReducers;