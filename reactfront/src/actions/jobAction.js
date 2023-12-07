export const SET_JOB = 'SET_JOB';
export const SET_JOB_ERROR = 'SET_JOB_ERROR';

export function setJob(job) {
  return {
    type: SET_JOB,
    job,
  };
}

export function setJobError(jobError) {
  return {
    type: SET_JOB_ERROR,
    jobError,
  };
}
