export const SET_EMAIL = 'SET_EMAIL';
export const SET_EMAIL_ERROR = 'SET_EMAIL_ERROR';

export function setEmail(email) {
  return {
    type: SET_EMAIL,
    email,
  };
}

export function setEmailError(emailError) {
  return {
    type: SET_EMAIL_ERROR,
    emailError,
  };
}