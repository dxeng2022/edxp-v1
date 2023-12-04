export const SET_LOGIN_ALERT = 'SET_LOGIN_ALERT'
export const SET_FIND_EMAIL_ALERT = 'SET_FIND_EMAIL_ALERT'
export const SET_FIND_PW_ALERT = 'SET_FIND_PW_ALERT'
export const SET_EMAIL_CHECK_ALERT = 'SET_EMAIL_CHECK_ALERT'
export const SET_AUTH_CODE_ALERT = 'SET_AUTH_CODE_ALERT'
export const SET_SIGN_UP_ALERT = 'SET_SIGN_UP_ALERT'
export const SET_SIGN_UP_COMPLETE_ALERT = 'SET_SIGN_UP_COMPLETE_ALERT'

export function setLoginAlert(loginAlert) {
  return {
    type: SET_LOGIN_ALERT,
    loginAlert,
  };
}

export function setFindEmailAlert(findEmailAlert) {
  return {
    type: SET_FIND_EMAIL_ALERT,
    findEmailAlert,
  };
}

export function setFindPwAlert(findPwAlert) {
  return {
    type: SET_FIND_PW_ALERT,
    findPwAlert,
  };
}

export function setEmailCheckAlert(emailCheckAlert) {
  return {
    type: SET_EMAIL_CHECK_ALERT,
    emailCheckAlert,
  }
}

export function setAuthCodeAlert(authCodeAlert) {
  return {
    type: SET_AUTH_CODE_ALERT,
    authCodeAlert,
  }
}

export function setSignUpAlert(signUpAlert) {
  return {
    type: SET_SIGN_UP_ALERT,
    signUpAlert,
  }
}

export function setSignUpCompleteAlert(signUpCompleteAlert) {
  return {
    type: SET_SIGN_UP_COMPLETE_ALERT,
    signUpCompleteAlert,
  }
}