export const SET_FIND_EMAIL_RESULT = 'SET_FIND_EMAIL_RESULT'
export const SET_FIND_PW_RESULT = 'SET_FIND_PW_RESULT'
export const SET_EMAIL_CHECK_RESULT = 'SET_EMAIL_CHECK_RESULT'
export const SET_AUTH_CODE_RESULT = 'SET_AUTH_CODE_RESULT'
export const SET_SIGN_UP_RESULT = 'SET_SIGN_UP_RESULT'
export const SET_CHANGE_PHONE_RESULT = 'SET_CHANGE_PHONE_RESULT'
export const SET_COMPLETE_CHANGE_PW_RESULT = 'SET_COMPLETE_CHANGE_PW_RESULT'
export const SET_COMPLETE_DEACTIVATE_USER_RESULT = 'SET_COMPLETE_DEACTIVATE_USER_RESULT'

export function setFindEmailResult(findEmailResult) {
  return {
    type: SET_FIND_EMAIL_RESULT,
    findEmailResult,
  };
};

export function setFindPwResult(findPwResult) {
  return {
    type: SET_FIND_PW_RESULT,
    findPwResult,
  };
};

export function setEmailCheckResult(emailCheckResult) {
  return {
    type: SET_EMAIL_CHECK_RESULT,
    emailCheckResult,
  };
};

export function setAuthCodeResult(authCodeResult) {
  return {
    type: SET_AUTH_CODE_RESULT,
    authCodeResult,
  };
};

export function setSignUpResult(signUpResult) {
  return {
    type: SET_SIGN_UP_RESULT,
    signUpResult,
  };
};

export function setChangePhoneResult(changePhoneResult) {
  return {
    type: SET_CHANGE_PHONE_RESULT,
    changePhoneResult,
  };
};

export function setCompleteDeactivateUserResult(completeDeactivateUserResult) {
  return {
    type: SET_COMPLETE_DEACTIVATE_USER_RESULT,
    completeDeactivateUserResult,
  };
};

export function setCompleteChangePwResult(completeChangePwResult) {
  return {
    type: SET_COMPLETE_CHANGE_PW_RESULT,
    completeChangePwResult,
  };
};