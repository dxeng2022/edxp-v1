export const SET_BIRTH = 'SET_BIRTH';

export function setBirth(birth) {
  return {
    type: SET_BIRTH,
    birth,
  };
}