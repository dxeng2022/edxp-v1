export const SET_NAME = 'SET_NAME';
export const SET_NAME_ERROR = 'SET_NAME_ERROR';

export function setName(name) {
  return {
    type: SET_NAME,
    name,
  };
}

export function setNameError(nameError) {
  return {
    type: SET_NAME_ERROR,
    nameError,
  };
}
