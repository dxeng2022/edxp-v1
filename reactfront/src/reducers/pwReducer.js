import { SET_LOGIN_PW, SET_LOGIN_PW_ERROR, SET_SIGN_UP_PW, SET_SIGN_UP_PW_ERROR,
  SET_PW_CONFIRM, SET_PW_CONFIRM_ERROR, SET_CHANGE_CURRENT_PW, SET_CHANGE_CURRENT_PW_ERROR,
  SET_CHANGE_PW, SET_CHANGE_PW_ERROR, SET_CHANGE_PW_CONFIRM, SET_CHANGE_PW_CONFIRM_ERROR } from '../actions';

const pwReducers = {
  loginPw,
  loginPwError,
  signUpPw,
  signUpPwError,
  pwConfirm,
  pwConfirmError,
  changeCurrentPw,
  changeCurrentPwError,
  changePw,
  changePwError,
  changePwConfirm,
  changePwConfirmError
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

function changeCurrentPw(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_CURRENT_PW:
      return action.changeCurrentPw;
    default:
      return state;
  }
}

function changeCurrentPwError(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_CURRENT_PW_ERROR:
      return action.changeCurrentPwError;
    default:
      return state;
  }
}

function changePw(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_PW:
      return action.changePw;
    default:
      return state;
  }
}

function changePwError(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_PW_ERROR:
      return action.changePwError;
    default:
      return state;
  }
}

function changePwConfirm(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_PW_CONFIRM:
      return action.changePwConfirm;
    default:
      return state;
  }
}

function changePwConfirmError(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_PW_CONFIRM_ERROR:
      return action.changePwConfirmError;
    default:
      return state;
  }
}

export default pwReducers;