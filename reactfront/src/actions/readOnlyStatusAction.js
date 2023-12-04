export const SET_EMAIL_READ_ONLY_STATUS = 'SET_EMAIL_READ_ONLY_STATUS';
export const SET_AUTH_CODE_READ_ONLY_STATUS = 'SET_AUTH_CODE_READ_ONLY_STATUS'

export function setEmailReadOnlyStatus(emailReadOnlyStatus) {
  return {
    type: SET_EMAIL_READ_ONLY_STATUS,
    emailReadOnlyStatus,
  };
};

export function setAuthCodeReadOnlyStatus(authCodeReadOnlyStatus) {
  return {
    type: SET_AUTH_CODE_READ_ONLY_STATUS,
    authCodeReadOnlyStatus,
  };
};