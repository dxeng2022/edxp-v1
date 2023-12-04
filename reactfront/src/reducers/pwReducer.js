import { SET_PW, SET_PW_ERROR, SET_PW_CONFIRM, SET_PW_CONFIRM_ERROR } from '../actions';

const pwReducers = {
  pw,
  pwError,
  pwConfirm,
  pwConfirmError,
};

function pw(state = '', action) {
  switch (action.type) {
    case SET_PW:
      return action.pw;
    default:
      return state;
  }
}
    
function pwError(state = false, action) {
  switch (action.type) {
    case SET_PW_ERROR:
      return action.pwError;
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