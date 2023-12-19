export const SET_LOGIN_PW = 'SET_LOGIN_PW';
export const SET_LOGIN_PW_ERROR = 'SET_LOGIN_PW_ERROR';
export const SET_SIGN_UP_PW = 'SET_SIGN_UP_PW';
export const SET_SIGN_UP_PW_ERROR = 'SET_SIGN_UP_PW_ERROR';
export const SET_PW_CONFIRM = 'SET_PW_CONFIRM';
export const SET_PW_CONFIRM_ERROR = 'SET_PW_CONFIRM_ERROR';
export const SET_CHANGE_CURRENT_PW = 'SET_CHANGE_CURRENT_PW';
export const SET_CHANGE_CURRENT_PW_ERROR = 'SET_CHANGE_CURRENT_PW_ERROR';
export const SET_CHANGE_PW = 'SET_CHANGE_PW';
export const SET_CHANGE_PW_ERROR = 'SET_CHANGE_PW_ERROR';
export const SET_CHANGE_PW_CONFIRM = 'SET_CHANGE_PW_CONFIRM';
export const SET_CHANGE_PW_CONFIRM_ERROR = 'SET_CHANGE_PW_CONFIRM_ERROR';


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

export function setChangeCurrentPw(changeCurrentPw) {
  return {
    type: SET_CHANGE_CURRENT_PW,
    changeCurrentPw,
  };
}

export function setChangeCurrentPwError(changeCurrentPwError) {
  return {
    type: SET_CHANGE_CURRENT_PW_ERROR,
    changeCurrentPwError,
  };
}

export function setChangePw(changePw) {
  return {
    type: SET_CHANGE_PW,
    changePw,
  };
}

export function setChangePwError(changePwError) {
  return {
    type: SET_CHANGE_PW_ERROR,
    changePwError,
  };
}

export function setChangePwConfirm(changePwConfirm) {
  return {
    type: SET_CHANGE_PW_CONFIRM,
    changePwConfirm,
  };
}

export function setChangePwConfirmError(changePwConfirmError) {
  return {
    type: SET_CHANGE_PW_CONFIRM_ERROR,
    changePwConfirmError,
  };
}