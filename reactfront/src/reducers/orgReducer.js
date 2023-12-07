import { SET_ORG, SET_ORG_ERROR } from '../actions';

const orgReducers = {
  org,
  orgError,
}

function org(state = '', action) {
  switch (action.type) {
    case SET_ORG:
      return action.org;
    default:
      return state;
  }
}

function orgError(state = false, action) {
  switch (action.type) {
    case SET_ORG_ERROR:
      return action.orgError;
    default:
      return state;
  }
}

export default orgReducers;