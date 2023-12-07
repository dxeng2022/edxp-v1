import { SET_LOGIN_EMAIL, SET_LOGIN_EMAIL_ERROR,
  SET_FIND_PW_EMAIL, SET_FIND_PW_EMAIL_ERROR, SET_SIGN_UP_EMAIL, SET_SIGN_UP_EMAIL_ERROR } from '../actions';

const emailReducers = {
  loginEmail,
  loginEmailError,
  findPwEmail,
  findPwEmailError,
  signUpEmail,
  signUpEmailError,
}

function loginEmail(state = '', action) {
  switch (action.type) {
    case SET_LOGIN_EMAIL:
      return action.loginEmail;
    default:
      return state;
  }
}

function loginEmailError(state = false, action) {
  switch (action.type) {
    case SET_LOGIN_EMAIL_ERROR:
      return action.loginEmailError;
    default:
      return state;
  }
}

function findPwEmail(state = '', action) {
  switch (action.type) {
    case SET_FIND_PW_EMAIL:
      return action.findPwEmail;
    default:
      return state;
  }
}

function findPwEmailError(state = false, action) {
  switch (action.type) {
    case SET_FIND_PW_EMAIL_ERROR:
      return action.findPwEmailError;
    default:
      return state;
  }
}

function signUpEmail(state = '', action) {
  switch (action.type) {
    case SET_SIGN_UP_EMAIL:
      return action.signUpEmail;
    default:
      return state;
  }
}

function signUpEmailError(state = false, action) {
  switch (action.type) {
    case SET_SIGN_UP_EMAIL_ERROR:
      return action.signUpEmailError;
    default:
      return state;
  }
}

export default emailReducers;