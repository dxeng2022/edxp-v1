import { SET_JOB, SET_JOB_ERROR } from '../actions';

const jobReducers = {
  job,
  jobError,
}

function job(state = '', action) {
  switch (action.type) {
    case SET_JOB:
      return action.job;
    default:
      return state;
  }
}

function jobError(state = false, action) {
  switch (action.type) {
    case SET_JOB_ERROR:
      return action.jobError;
    default:
      return state;
  }
}

export default jobReducers;