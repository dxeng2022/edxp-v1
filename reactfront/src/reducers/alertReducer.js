import { SET_LOGIN_ALERT, SET_FIND_EMAIL_ALERT, SET_FIND_PW_ALERT,
  SET_EMAIL_CHECK_ALERT, SET_AUTH_CODE_ALERT, SET_SIGN_UP_ALERT,
  SET_SIGN_UP_COMPLETE_ALERT, SET_MODULE_DOWNLOAD_ALERT,
  SET_CHANGE_PHONE_ALERT, SET_CHANGE_PW_ALERT, SET_COMPLETE_CHANGE_PW_ALERT,
  SET_DEACTIVATE_USER_ALERT, SET_COMPLETE_DEACTIVATE_USER_ALERT } from '../actions';

const alertReducers = {
  loginAlert,
  findEmailAlert,
  findPwAlert,
  emailCheckAlert,
  authCodeAlert,
  signUpAlert,
  signUpCompleteAlert,
  moduleDownloadAlert,
  changePhoneAlert,
  changePwAlert,
  completeChangePwAlert,
  deactivateUserAlert,
  completeDeactivateUserAlert,
}

function loginAlert(state = false, action) {
  switch (action.type) {
    case SET_LOGIN_ALERT:
      return action.loginAlert;
    default:
      return state;
  }
}

function findEmailAlert(state = false, action) {
  switch (action.type) {
    case SET_FIND_EMAIL_ALERT:
      return action.findEmailAlert;
    default:
      return state;
  }
}

function findPwAlert(state = false, action) {
  switch (action.type) {
    case SET_FIND_PW_ALERT:
      return action.findPwAlert;
    default:
      return state;
  }
}

function emailCheckAlert(state = false, action) {
  switch (action.type) {
    case SET_EMAIL_CHECK_ALERT:
      return action.emailCheckAlert;
    default:
      return state;
  }
}

function authCodeAlert(state = false, action) {
  switch (action.type) {
    case SET_AUTH_CODE_ALERT:
      return action.authCodeAlert;
    default:
      return state;
  }
}

function signUpAlert(state = false, action) {
  switch (action.type) {
    case SET_SIGN_UP_ALERT:
      return action.signUpAlert;
    default:
      return state;
  }
}

function signUpCompleteAlert(state = false, action) {
  switch (action.type) {
    case SET_SIGN_UP_COMPLETE_ALERT:
      return action.signUpCompleteAlert;
    default:
      return state;
  }
}

function moduleDownloadAlert(state = false, action) {
  switch (action.type) {
    case SET_MODULE_DOWNLOAD_ALERT:
      return action.moduleDownloadAlert;
    default:
      return state;
  }
}

function changePhoneAlert(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_PHONE_ALERT:
      return action.changePhoneAlert;
    default:
      return state;
  }
}

function changePwAlert(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_PW_ALERT:
      return action.changePwAlert;
    default:
      return state;
  }
}

function completeChangePwAlert(state = false, action) {
  switch (action.type) {
    case SET_COMPLETE_CHANGE_PW_ALERT:
      return action.completeChangePwAlert;
    default:
      return state;
  }
}

function deactivateUserAlert(state = false, action) {
  switch (action.type) {
    case SET_DEACTIVATE_USER_ALERT:
      return action.deactivateUserAlert;
    default:
      return state;
  }
}

function completeDeactivateUserAlert(state = false, action) {
  switch (action.type) {
    case SET_COMPLETE_DEACTIVATE_USER_ALERT:
      return action.completeDeactivateUserAlert;
    default:
      return state;
  }
}

export default alertReducers;