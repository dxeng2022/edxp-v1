export const SET_GENDER = 'SET_GENDER';

export function setGender(gender) {
  return {
    type: SET_GENDER,
    gender,
  };
}