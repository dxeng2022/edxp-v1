export const SET_LOGIN_BUTTON_STATUS = 'SET_LOGIN_BUTTON_STATUS';
export const SET_FIND_EMAIL_BUTTON_STATUS = 'SET_FIND_EMAIL_BUTTON_STATUS';
export const SET_FIND_PW_BUTTON_STATUS = 'SET_FIND_PW_BUTTON_STATUS';
export const SET_EMAIL_CHECK_BUTTON_STATUS = 'SET_EMAIL_CHECK_BUTTON_STATUS';
export const SET_SEND_AUTH_CODE_BUTTON_STATUS = 'SET_SEND_AUTH_CODE_BUTTON_STATUS';
export const SET_CHECK_AUTH_CODE_BUTTON_STATUS = 'SET_CHECK_AUTH_CODE_BUTTON_STATUS';
export const SET_SIGN_UP_BUTTON_STATUS = 'SET_SIGN_UP_BUTTON_STATUS'
export const SET_CHANGE_PHONE_BUTTON_STATUS = 'SET_CHANGE_PHONE_BUTTON_STATUS'
export const SET_CHANGE_PW_BUTTON_STATUS = 'SET_CHANGE_PW_BUTTON_STATUS'

export function setLoginButtonStatus(loginButtonStatus) {
  return {
    type: SET_LOGIN_BUTTON_STATUS,
    loginButtonStatus,
  };
};

export function setFindEmailButtonStatus(findEmailButtonStatus) {
  return {
    type: SET_FIND_EMAIL_BUTTON_STATUS,
    findEmailButtonStatus,
  };
};

export function setFindPwButtonStatus(findPwButtonStatus) {
  return {
    type: SET_FIND_PW_BUTTON_STATUS,
    findPwButtonStatus,
  };
};

export function setEmailCheckButtonStatus(emailCheckButtonStatus) {
  return {
    type: SET_EMAIL_CHECK_BUTTON_STATUS,
    emailCheckButtonStatus,
  }
}

export function setSendAuthCodButtonStatus(sendAuthCodButtonStatus) {
  return {
    type: SET_SEND_AUTH_CODE_BUTTON_STATUS,
    sendAuthCodButtonStatus,
  }
}

export function setCheckAuthCodeButtonStatus(checkAuthCodeButtonStatus) {
  return {
    type: SET_CHECK_AUTH_CODE_BUTTON_STATUS,
    checkAuthCodeButtonStatus,
  }
}

export function setSignUpButtonStatus(signUpButtonStatus) {
  return {
    type: SET_SIGN_UP_BUTTON_STATUS,
    signUpButtonStatus,
  }
}

export function setChangePhoneButtonStatus(changePhoneButtonStatus) {
  return {
    type: SET_CHANGE_PHONE_BUTTON_STATUS,
    changePhoneButtonStatus,
  }
}

export function setChangePwButtonStatus(changePwButtonStatus) {
  return {
    type: SET_CHANGE_PW_BUTTON_STATUS,
    changePwButtonStatus,
  }
}

