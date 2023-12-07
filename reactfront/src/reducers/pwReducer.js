import { SET_LOGIN_PW, SET_LOGIN_PW_ERROR, SET_SIGN_UP_PW, SET_SIGN_UP_PW_ERROR,
  SET_PW_CONFIRM, SET_PW_CONFIRM_ERROR, } from '../actions';

const pwReducers = {
  loginPw,
  loginPwError,
  signUpPw,
  signUpPwError,
  pwConfirm,
  pwConfirmError,
};

function loginPw(state = '', action) {
  switch (action.type) {
    case SET_LOGIN_PW:
      return action.loginPw;
    default:
      return state;
  }
}

function loginPwError(state = false, action) {
  switch (action.type) {
    case SET_LOGIN_PW_ERROR:
      return action.loginPwError;
    default:
      return state;
  }
}

function signUpPw(state = '', action) {
  switch (action.type) {
    case SET_SIGN_UP_PW:
      return action.signUpPw;
    default:
      return state;
  }
}

function signUpPwError(state = false, action) {
  switch (action.type) {
    case SET_SIGN_UP_PW_ERROR:
      return action.signUpPwError;
    default:
      return state;
  }
}

function pwConfirm(state = false, action) {
  switch (action.type) {
    case SET_PW_CONFIRM:
      return action.pwConfirm;
    default:
      return state;
  }
}

function pwConfirmError(state = false, action) {
  switch (action.type) {
    case SET_PW_CONFIRM_ERROR:
      return action.pwConfirmError;
    default:
      return state;
  }
}

export default pwReducers;