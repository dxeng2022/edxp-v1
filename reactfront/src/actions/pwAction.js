export const SET_PW = 'SET_PW';
export const SET_PW_ERROR = 'SET_PW_ERROR';
export const SET_PW_CONFIRM = 'SET_PW_CONFIRM';
export const SET_PW_CONFIRM_ERROR = 'SET_PW_CONFIRM_ERROR';

export function setPw(pw) {
  return {
    type: SET_PW,
    pw,
  };
}

export function setPwError(pwError) {
  return {
    type: SET_PW_ERROR,
    pwError,
  };
}

export function setPwConfirm(pwConfirm) {
  return {
    type: SET_PW_CONFIRM,
    pwConfirm,
  };
}

export function setPwConfirmError(pwConfirmError) {
  return {
    type: SET_PW_CONFIRM_ERROR,
    pwConfirmError,
  };
}
