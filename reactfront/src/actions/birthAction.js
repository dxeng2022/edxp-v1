export const SET_FIND_EMAIL_BIRTH = 'SET_FIND_EMAIL_BIRTH';
export const SET_FIND_PW_BIRTH = 'SET_FIND_PW_BIRTH';
export const SET_SIGN_UP_BIRTH = 'SET_SIGN_UP_BIRTH';

export function setFindEmailBirth(findEmailBirth) {
  return {
    type: SET_FIND_EMAIL_BIRTH,
    findEmailBirth,
  };
}

export function setFindPwBirth(findPwBirth) {
  return {
    type: SET_FIND_PW_BIRTH,
    findPwBirth,
  };
}

export function setSignUpBirth(signUpBirth) {
  return {
    type: SET_SIGN_UP_BIRTH,
    signUpBirth,
  };
}