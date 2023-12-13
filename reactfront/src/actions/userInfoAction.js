export const SET_USER_INFO = 'SET_USER_INFO';

export function setUserInfo(userInfo) {
  return {
    type: SET_USER_INFO,
    userInfo,
  }
}