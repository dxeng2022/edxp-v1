import { SET_PHONE, SET_PHONE_ERROR } from '../actions';

const phoneReducers = {
  phone,
  phoneError,
}

function phone(state = '', action) {
  switch (action.type) {
    case SET_PHONE:
      return action.phone;
    default:
      return state;
  }
}

function phoneError(state = false, action) {
  switch (action.type) {
    case SET_PHONE_ERROR:
      return action.phoneError;
    default:
      return state;
  }
}

export default phoneReducers;