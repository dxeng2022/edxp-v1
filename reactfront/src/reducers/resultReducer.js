import { SET_FIND_EMAIL_RESULT, SET_FIND_PW_RESULT, SET_EMAIL_CHECK_RESULT,
  SET_AUTH_CODE_RESULT, SET_SIGN_UP_RESULT, } from '../actions';


const resultReducers = {
  findEmailResult,
  findPwResult,
  emailCheckResult,
  authCodeResult,
  signUpResult,
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

export default resultReducers;