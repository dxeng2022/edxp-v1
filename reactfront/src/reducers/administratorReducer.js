import { SET_ADMINISTRATOR_INFO } from '../actions';

function administratorInfo(state = [], action) {
  switch (action.type) {
    case SET_ADMINISTRATOR_INFO:
      return action.administratorInfo;
    default:
      return state;
  }
}

const administratorReducer = {
  administratorInfo,
}

export default administratorReducer;