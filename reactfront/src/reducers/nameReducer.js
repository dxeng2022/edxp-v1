import { SET_NAME, SET_NAME_ERROR } from '../actions';

const nameReducers = {
  name,
  nameError,
}

function name(state = '', action) {
  switch (action.type) {
    case SET_NAME:
      return action.name;
    default:
      return state;
  }
}

function nameError(state = false, action) {
  switch (action.type) {
    case SET_NAME_ERROR:
      return action.nameError;
    default:
      return state;
  }
}

export default nameReducers;