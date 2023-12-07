export const SET_FIND_EMAIL_NAME = 'SET_FIND_EMAIL_NAME';
export const SET_FIND_EMAIL_NAME_ERROR = 'SET_FIND_EMAIL_NAME_ERROR';
export const SET_FIND_PW_NAME = 'SET_FIND_PW_NAME';
export const SET_FIND_PW_NAME_ERROR = 'SET_FIND_PW_NAME_ERROR';
export const SET_SIGN_UP_NAME = 'SET_SIGN_UP_NAME';
export const SET_SIGN_UP_NAME_ERROR = 'SET_SIGN_UP_NAME_ERROR';

export function setFindEmailName(findEmailName) {
  return {
    type: SET_FIND_EMAIL_NAME,
    findEmailName,
  };
}

export function setFindEmailNameError(findEmailNameError) {
  return {
    type: SET_FIND_EMAIL_NAME_ERROR,
    findEmailNameError,
  };
}

export function setFindPwName(findPwName) {
  return {
    type: SET_FIND_PW_NAME,
    findPwName,
  };
}

export function setFindPwNameError(findPwNameError) {
  return {
    type: SET_FIND_PW_NAME_ERROR,
    findPwNameError,
  };
}

export function setSignUpName(signUpName) {
  return {
    type: SET_SIGN_UP_NAME,
    signUpName,
  };
}

export function setSignUpNameError(signUpNameError) {
  return {
    type: SET_SIGN_UP_NAME_ERROR,
    signUpNameError,
  };
}
