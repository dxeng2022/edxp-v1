import { SET_FIND_EMAIL_RESULT, SET_FIND_PW_RESULT, SET_EMAIL_CHECK_RESULT,
  SET_AUTH_CODE_RESULT, SET_SIGN_UP_RESULT, SET_CHANGE_PHONE_RESULT,
  SET_COMPLETE_DEACTIVATE_USER_RESULT, SET_COMPLETE_CHANGE_PW_RESULT,
  SET_ADD_FOLDER_RESULT, SET_UPLOAD_FILE_RESULT, SET_CHANGE_NAME_RESULT } from '../actions';


const resultReducers = {
  findEmailResult,
  findPwResult,
  emailCheckResult,
  authCodeResult,
  signUpResult,
  changePhoneResult,
  completeChangePwResult,
  completeDeactivateUserResult,
  addFolderResult,
  uploadFileResult,
  changeNameResult,
}

function findEmailResult(state = '', action) {
  switch (action.type) {
    case SET_FIND_EMAIL_RESULT:
      return action.findEmailResult;
    default:
      return state;
  }
}

function findPwResult(state = '', action) {
  switch (action.type) {
    case SET_FIND_PW_RESULT:
      return action.findPwResult;
    default:
      return state;
  }
}

function emailCheckResult(state = '', action) {
  switch (action.type) {
    case SET_EMAIL_CHECK_RESULT:
      return action.emailCheckResult;
    default:
      return state;
  }
}

function authCodeResult(state = '', action) {
  switch (action.type) {
    case SET_AUTH_CODE_RESULT:
      return action.authCodeResult;
    default:
      return state;
  }
}

function signUpResult(state = '', action) {
  switch (action.type) {
    case SET_SIGN_UP_RESULT:
      return action.signUpResult;
    default:
      return state;
  }
}

function changePhoneResult(state = '', action) {
  switch (action.type) {
    case SET_CHANGE_PHONE_RESULT:
      return action.changePhoneResult;
    default:
      return state;
  }
}

function completeChangePwResult(state = '', action) {
  switch (action.type) {
    case SET_COMPLETE_CHANGE_PW_RESULT:
      return action.completeChangePwResult;
    default:
      return state;
  }
}

function completeDeactivateUserResult(state = '', action) {
  switch (action.type) {
    case SET_COMPLETE_DEACTIVATE_USER_RESULT:
      return action.completeDeactivateUserResult;
    default:
      return state;
  }
}

function addFolderResult(state = '', action) {
  switch (action.type) {
    case SET_ADD_FOLDER_RESULT:
      return action.addFolderResult;
    default:
      return state;
  }
}

function uploadFileResult(state = '', action) {
  switch (action.type) {
    case SET_UPLOAD_FILE_RESULT:
      return action.uploadFileResult;
    default:
      return state;
  }
}

function changeNameResult(state = '', action) {
  switch (action.type) {
    case SET_CHANGE_NAME_RESULT:
      return action.changeNameResult;
    default:
      return state;
  }
}

export default resultReducers;