import { SET_BIRTH } from '../actions';

const birthReducers = {
  birth,
}

function birth(state = '', action) {
  switch (action.type) {
    case SET_BIRTH:
      return action.birth;
    default:
      return state;
  }
}

export default birthReducers;