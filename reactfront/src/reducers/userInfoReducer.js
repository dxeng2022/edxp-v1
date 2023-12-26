import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { SET_USER_LOGIN_AUTH, SET_USER_INFO } from '../actions';

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

function userInfo(state = {}, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return action.userInfo;
    default:
      return state;
  }
}

const userInfoReducers = {
  userInfo,
  userLoginAuth: persistReducer(userLoginAuthPersistConfig, userLoginAuth),
};

export default userInfoReducers;