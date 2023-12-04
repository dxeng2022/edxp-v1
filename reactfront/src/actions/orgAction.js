export const SET_ORG = 'SET_ORG';
export const SET_ORG_ERROR = 'SET_ORG_ERROR';

export function setOrg(org) {
  return {
    type: SET_ORG,
    org,
  };
}

export function setOrgError(orgError) {
  return {
    type: SET_ORG_ERROR,
    orgError,
  };
}
