export const SET_LOGIN_PW = 'SET_LOGIN_PW';
export const SET_LOGIN_PW_ERROR = 'SET_LOGIN_PW_ERROR';
export const SET_SIGN_UP_PW = 'SET_SIGN_UP_PW';
export const SET_SIGN_UP_PW_ERROR = 'SET_SIGN_UP_PW_ERROR';
export const SET_PW_CONFIRM = 'SET_PW_CONFIRM';
export const SET_PW_CONFIRM_ERROR = 'SET_PW_CONFIRM_ERROR';

export function setLoginPw(loginPw) {
  return {
    type: SET_LOGIN_PW,
    loginPw,
  };
}

export function setLoginPwError(loginPwError) {
  return {
    type: SET_LOGIN_PW_ERROR,
    loginPwError,
  };
}

export function setSignUpPw(signUpPw) {
  return {
    type: SET_SIGN_UP_PW,
    signUpPw,
  };
}

export function setSignUpPwError(signUpPwError) {
  return {
    type: SET_SIGN_UP_PW_ERROR,
    signUpPwError,
  };
}

export function setPwConfirm(pwConfirm) {
  return {
    type: SET_PW_CONFIRM,
    pwConfirm,
  };
}

export function setPwConfirmError(pwConfirmError) {
  return {
    type: SET_PW_CONFIRM_ERROR,
    pwConfirmError,
  };
}
