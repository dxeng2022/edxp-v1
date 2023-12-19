import { SET_FIND_EMAIL_PHONE, SET_FIND_EMAIL_PHONE_ERROR,
  SET_FIND_PW_PHONE, SET_FIND_PW_PHONE_ERROR, SET_SIGN_UP_PHONE,
  SET_SIGN_UP_PHONE_ERROR, SET_CHANGE_PHONE, SET_CHANGE_PHONE_ERROR, } from '../actions';

const phoneReducers = {
  findEmailPhone,
  findEmailPhoneError,
  findPwPhone,
  findPwPhoneError,
  signUpPhone,
  signUpPhoneError,
  changePhone,
  changePhoneError,
}

function findEmailPhone(state = '', action) {
  switch (action.type) {
    case SET_FIND_EMAIL_PHONE:
      return action.findEmailPhone;
    default:
      return state;
  }
}

function findEmailPhoneError(state = false, action) {
  switch (action.type) {
    case SET_FIND_EMAIL_PHONE_ERROR:
      return action.findEmailPhoneError;
    default:
      return state;
  }
}

function findPwPhone(state = '', action) {
  switch (action.type) {
    case SET_FIND_PW_PHONE:
      return action.findPwPhone;
    default:
      return state;
  }
}

function findPwPhoneError(state = false, action) {
  switch (action.type) {
    case SET_FIND_PW_PHONE_ERROR:
      return action.findPwPhoneError;
    default:
      return state;
  }
}

function signUpPhone(state = '', action) {
  switch (action.type) {
    case SET_SIGN_UP_PHONE:
      return action.signUpPhone;
    default:
      return state;
  }
}

function signUpPhoneError(state = false, action) {
  switch (action.type) {
    case SET_SIGN_UP_PHONE_ERROR:
      return action.signUpPhoneError;
    default:
      return state;
  }
}

function changePhone(state = '', action) {
  switch (action.type) {
    case SET_CHANGE_PHONE:
      return action.changePhone;
    default:
      return state;
  }
}

function changePhoneError(state = false, action) {
  switch (action.type) {
    case SET_CHANGE_PHONE_ERROR:
      return action.changePhoneError;
    default:
      return state;
  }
}

export default phoneReducers;