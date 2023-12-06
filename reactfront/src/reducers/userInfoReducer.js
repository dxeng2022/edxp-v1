import { SET_USER_NAME } from '../actions';

const userInfoReducers = {
  userName,
}

function userName(state = {}, action) {
  switch (action.type) {
    case SET_USER_NAME:
      return action.userName;
    default:
      return state;
  }
}


export default userInfoReducers;