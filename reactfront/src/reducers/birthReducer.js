import { SET_FIND_EMAIL_BIRTH, SET_FIND_PW_BIRTH, SET_SIGN_UP_BIRTH } from '../actions';

const birthReducers = {
  findEmailBirth,
  findPwBirth,
  signUpBirth,
}

function findEmailBirth(state = '', action) {
  switch (action.type) {
    case SET_FIND_EMAIL_BIRTH:
      return action.findEmailBirth;
    default:
      return state;
  }
}

function findPwBirth(state = '', action) {
  switch (action.type) {
    case SET_FIND_PW_BIRTH:
      return action.findPwBirth;
    default:
      return state;
  }
}

function signUpBirth(state = '', action) {
  switch (action.type) {
    case SET_SIGN_UP_BIRTH:
      return action.signUpBirth;
    default:
      return state;
  }
}

export default birthReducers;