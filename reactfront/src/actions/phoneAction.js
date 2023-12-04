export const SET_PHONE = 'SET_PHONE';
export const SET_PHONE_ERROR = 'SET_PHONE_ERROR';

export function setPhone(phone) {
  return {
    type: SET_PHONE,
    phone,
  };
}

export function setPhoneError(phoneError) {
  return {
    type: SET_PHONE_ERROR,
    phoneError,
  };
}