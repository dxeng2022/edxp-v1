import { SET_USER_INFO } from '../actions';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

const userInfoPersistConfig = {
  key: 'userInfo',
  storage: sessionStorage,
};

function userInfo(state = {}, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return action.userInfo;
    default:
      return state;
  }
}

const persistedUserInfoReducer = persistReducer(userInfoPersistConfig, userInfo);

const reducers = { userInfo: persistedUserInfoReducer };

export default reducers;