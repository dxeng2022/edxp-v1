import { SET_GENDER } from '../actions';

const genderReducers = {
  gender,
}

function gender(state = '', action) {
  switch (action.type) {
    case SET_GENDER:
      return action.gender;
    default:
      return state;
  }
}

export default genderReducers;