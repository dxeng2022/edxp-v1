export const SET_AUTH_CODE = 'SET_AUTH_CODE';

export function setAuthCode(authCode) {
  return {
    type: SET_AUTH_CODE,
    authCode,
  };
}