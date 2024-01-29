export const SET_USER_LOGIN_AUTH = 'SET_USER_LOGIN_AUTH';
export const SET_USER_NAME_INFO = 'SET_USER_NAME_INFO';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_USER_DIALOG = 'SET_USER_DIALOG';

export function setUserLoginAuth(userLoginAuth) {
  return {
    type: SET_USER_LOGIN_AUTH,
    userLoginAuth,
  }
}

export function setUserNameInfo(userNameInfo) {
  return {
    type: SET_USER_NAME_INFO,
    userNameInfo,
  }
}

export function setUserInfo(userInfo) {
  return {
    type: SET_USER_INFO,
    userInfo,
  }
}

export function setUserDialog(userDialog) {
  return {
    type: SET_USER_DIALOG,
    userDialog,
  }
}