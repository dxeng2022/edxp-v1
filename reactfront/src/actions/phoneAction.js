export const SET_FIND_EMAIL_PHONE = 'SET_FIND_EMAIL_PHONE';
export const SET_FIND_EMAIL_PHONE_ERROR = 'SET_FIND_EMAIL_PHONE_ERROR';
export const SET_FIND_PW_PHONE = 'SET_FIND_PW_PHONE';
export const SET_FIND_PW_PHONE_ERROR = 'SET_FIND_PW_PHONE_ERROR';
export const SET_SIGN_UP_PHONE = 'SET_SIGN_UP_PHONE';
export const SET_SIGN_UP_PHONE_ERROR = 'SET_SIGN_UP_PHONE_ERROR';
export const SET_CHANGE_PHONE = 'SET_CHANGE_PHONE';
export const SET_CHANGE_PHONE_ERROR = 'SET_CHANGE_PHONE_ERROR';

export function setFindEmailPhone(findEmailPhone) {
  return {
    type: SET_FIND_EMAIL_PHONE,
    findEmailPhone,
  };
}

export function setFindEmailPhoneError(findEmailPhoneError) {
  return {
    type: SET_FIND_EMAIL_PHONE_ERROR,
    findEmailPhoneError,
  };
}

export function setFindPwPhone(findPwPhone) {
  return {
    type: SET_FIND_PW_PHONE,
    findPwPhone,
  };
}

export function setFindPwPhoneError(findPwPhoneError) {
  return {
    type: SET_FIND_PW_PHONE_ERROR,
    findPwPhoneError,
  };
}

export function setSignUpPhone(signUpPhone) {
  return {
    type: SET_SIGN_UP_PHONE,
    signUpPhone,
  };
}

export function setSignUpPhoneError(signUpPhoneError) {
  return {
    type: SET_SIGN_UP_PHONE_ERROR,
    signUpPhoneError,
  };
}

export function setChangePhone(changePhone) {
  return {
    type: SET_CHANGE_PHONE,
    changePhone,
  };
}

export function setChangePhoneError(changePhoneError) {
  return {
    type: SET_CHANGE_PHONE_ERROR,
    changePhoneError,
  };
}

