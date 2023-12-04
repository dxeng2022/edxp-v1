import { SET_EMAIL, SET_EMAIL_ERROR } from '../actions';

const emailReducers = {
  email,
  emailError,
}

function email(state = '', action) {
  switch (action.type) {
    case SET_EMAIL:
      return action.email;
    default:
      return state;
  }
}

function emailError(state = false, action) {
  switch (action.type) {
    case SET_EMAIL_ERROR:
      return action.emailError;
    default:
      return state;
  }
}

export default emailReducers;