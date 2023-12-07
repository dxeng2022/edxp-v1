import { SET_EMAIL_READ_ONLY_STATUS, SET_AUTH_CODE_READ_ONLY_STATUS, } from '../actions';


const readOnlyStatusReducers = {
  emailReadOnlyStatus,
  authCodeReadOnlyStatus,
}

function emailReadOnlyStatus(state = false, action) {
  switch (action.type) {
    case SET_EMAIL_READ_ONLY_STATUS:
      return action.emailReadOnlyStatus;
    default:
      return state;
  }
}

function authCodeReadOnlyStatus(state = true, action) {
  switch (action.type) {
    case SET_AUTH_CODE_READ_ONLY_STATUS:
      return action.authCodeReadOnlyStatus;
    default:
      return state;
  }
}

export default readOnlyStatusReducers;