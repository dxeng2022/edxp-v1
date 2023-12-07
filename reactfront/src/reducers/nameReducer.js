import { SET_FIND_EMAIL_NAME, SET_FIND_EMAIL_NAME_ERROR,
  SET_FIND_PW_NAME, SET_FIND_PW_NAME_ERROR, SET_SIGN_UP_NAME, SET_SIGN_UP_NAME_ERROR } from '../actions';

const nameReducers = {
  findEmailName,
  findEmailNameError,
  findPwName,
  findPwNameError,
  signUpName,
  signUpNameError,
}

function findEmailName(state = '', action) {
  switch (action.type) {
    case SET_FIND_EMAIL_NAME:
      return action.findEmailName;
    default:
      return state;
  }
}

function findEmailNameError(state = false, action) {
  switch (action.type) {
    case SET_FIND_EMAIL_NAME_ERROR:
      return action.findEmailNameError;
    default:
      return state;
  }
}

function findPwName(state = '', action) {
  switch (action.type) {
    case SET_FIND_PW_NAME:
      return action.findPwName;
    default:
      return state;
  }
}

function findPwNameError(state = false, action) {
  switch (action.type) {
    case SET_FIND_PW_NAME_ERROR:
      return action.findPwNameError;
    default:
      return state;
  }
}

function signUpName(state = '', action) {
  switch (action.type) {
    case SET_SIGN_UP_NAME:
      return action.signUpName;
    default:
      return state;
  }
}

function signUpNameError(state = false, action) {
  switch (action.type) {
    case SET_SIGN_UP_NAME_ERROR:
      return action.signUpNameError;
    default:
      return state;
  }
}

export default nameReducers;