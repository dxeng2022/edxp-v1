export const SET_LOGIN_EMAIL = 'SET_LOGIN_EMAIL';
export const SET_LOGIN_EMAIL_ERROR = 'SET_LOGIN_EMAIL_ERROR';
export const SET_FIND_PW_EMAIL = 'SET_FIND_PW_EMAIL';
export const SET_FIND_PW_EMAIL_ERROR = 'SET_FIND_PW_EMAIL_ERROR';
export const SET_SIGN_UP_EMAIL = 'SET_SIGN_UP_EMAIL';
export const SET_SIGN_UP_EMAIL_ERROR = 'SET_SIGN_UP_EMAIL_ERROR';

export function setLoginEmail(loginEmail) {
  return {
    type: SET_LOGIN_EMAIL,
    loginEmail,
  };
}

export function setLoginEmailError(loginEmailError) {
  return {
    type: SET_LOGIN_EMAIL_ERROR,
    loginEmailError,
  };
}

export function setFindPwEmail(findPwEmail) {
  return {
    type: SET_FIND_PW_EMAIL,
    findPwEmail,
  };
}

export function setFindPwEmailError(findPwEmailError) {
  return {
    type: SET_FIND_PW_EMAIL_ERROR,
    findPwEmailError,
  };
}

export function setSignUpEmail(signUpEmail) {
  return {
    type: SET_SIGN_UP_EMAIL,
    signUpEmail,
  };
}

export function setSignUpEmailError(signUpEmailError) {
  return {
    type: SET_SIGN_UP_EMAIL_ERROR,
    signUpEmailError,
  };
}
