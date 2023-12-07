import { SET_AUTH_CODE } from '../actions';

const authCodeReducers = {
  authCode,
};

function authCode(state = '', action) {
  switch (action.type) {
    case SET_AUTH_CODE:
      return action.authCode;
    default:
      return state;
  }
}

export default authCodeReducers;