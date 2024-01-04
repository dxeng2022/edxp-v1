export const SET_ADMINISTRATOR_INFO = 'SET_ADMINISTRATOR_INFO';

export function setAdministratorInfo(administratorInfo) {
  return {
    type: SET_ADMINISTRATOR_INFO,
    administratorInfo,
  }
}