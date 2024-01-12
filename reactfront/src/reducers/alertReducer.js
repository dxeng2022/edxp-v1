import { SET_LOGIN_ALERT, SET_FIND_EMAIL_ALERT, SET_FIND_PW_ALERT,
  SET_EMAIL_CHECK_ALERT, SET_AUTH_CODE_ALERT, SET_SIGN_UP_ALERT,
  SET_SIGN_UP_COMPLETE_ALERT, SET_MODULE_DOWNLOAD_ALERT,
  SET_CHANGE_PHONE_ALERT, SET_CHANGE_PW_ALERT, SET_COMPLETE_CHANGE_PW_ALERT,
  SET_DEACTIVATE_USER_ALERT, SET_COMPLETE_DEACTIVATE_USER_ALERT,
  SET_FOLDER_ALERT, SET_ADD_FOLDER_ALERT, SET_UPLOAD_FILE_ALERT,
  SET_DOWNLOAD_FILE_ALERT, SET_DELETE_FILE_ALERT, SET_COMPLETE_DELETE_FILE_ALERT,
  SET_CHANGE_NAME_ALERT, SET_CHANGE_NAME_INPUT_ALERT, SET_PASSWORD_RESET_ALERT,
  SET_COMPLETE_PASSWORD_RESET_ALERT, SET_USER_DELETE_ALERT, SET_COMPLETE_USER_DELETE_ALERT,
  SET_VISUAL_DRAW_POST_ALERT } from '../actions';

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
  folderAlert,
  addFolderAlert,
  uploadFileAlert,
  downloadFileAlert,
  deleteFileAlert,
  completeDeleteFileAlert,
  changeNameAlert,
  changeNameInputAlert,
  passwordResetAlert,
  CompletepasswordResetAlert,
  userDeleteAlert,
  CompleteUserDeleteAlert,
  visualDrawPostAlert
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

function folderAlert(state = false, action) {
  switch (action.type) {
    case SET_FOLDER_ALERT:
      return action.folderAlert;
    default:
      return state;
  }
}

function addFolderAlert(state = false, action) {
  switch (action.type) {
    case SET_ADD_FOLDER_ALERT:
      return action.addFolderAlert;
    default:
      return state;
  }
}

function uploadFileAlert(state = false, action) {
  switch (action.type) {
    case SET_UPLOAD_FILE_ALERT:
      return action.uploadFileAlert;
    default:
      return state;
  }
}

function downloadFileAlert(state = false, action) {
  switch (action.type) {
    case SET_DOWNLOAD_FILE_ALERT:
      return action.downloadFileAlert;
    default:
      return state;
  }
}

function deleteFileAlert(state = false, action) {
  switch (action.type) {
    case SET_DELETE_FILE_ALERT:
      return action.deleteFileAlert;
    default:
      return state;
  }
}

function completeDeleteFileAlert(state = false, action) {
  switch (action.type) {
    case SET_COMPLETE_DELETE_FILE_ALERT:
      return action.completeDeleteFileAlert;
    default:
      return state;
  }
}

function changeNameAlert(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_NAME_ALERT:
      return action.changeNameAlert;
    default:
      return state;
  }
}

function changeNameInputAlert(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_NAME_INPUT_ALERT:
      return action.changeNameInputAlert;
    default:
      return state;
  }
}

function passwordResetAlert(state = false, action) {
  switch (action.type) {
    case SET_PASSWORD_RESET_ALERT:
      return action.passwordResetAlert;
    default:
      return state;
  }
}

function CompletepasswordResetAlert(state = false, action) {
  switch (action.type) {
    case SET_COMPLETE_PASSWORD_RESET_ALERT:
      return action.CompletepasswordResetAlert;
    default:
      return state;
  }
}

function userDeleteAlert(state = false, action) {
  switch (action.type) {
    case SET_USER_DELETE_ALERT:
      return action.userDeleteAlert;
    default:
      return state;
  }
}

function CompleteUserDeleteAlert(state = false, action) {
  switch (action.type) {
    case SET_COMPLETE_USER_DELETE_ALERT:
      return action.CompleteUserDeleteAlert;
    default:
      return state;
  }
}

function visualDrawPostAlert(state = false, action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_POST_ALERT:
      return action.visualDrawPostAlert;
    default:
      return state;
  }
}

export default alertReducers;