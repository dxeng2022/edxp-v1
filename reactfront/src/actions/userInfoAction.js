export const SET_USER_LOGIN_AUTH = 'SET_USER_LOGIN_AUTH';
export const SET_USER_INFO = 'SET_USER_INFO';

export function setUserLoginAuth(userLoginAuth) {
  return {
    type: SET_USER_LOGIN_AUTH,
    userLoginAuth,
  }
}

export function setUserInfo(userInfo) {
  return {
    type: SET_USER_INFO,
    userInfo,
  }
}
