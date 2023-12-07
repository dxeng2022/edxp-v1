import { SET_LOGIN_BUTTON_STATUS, SET_FIND_EMAIL_BUTTON_STATUS,
  SET_FIND_PW_BUTTON_STATUS, SET_EMAIL_CHECK_BUTTON_STATUS,
  SET_SEND_AUTH_CODE_BUTTON_STATUS, SET_CHECK_AUTH_CODE_BUTTON_STATUS,
  SET_SIGN_UP_BUTTON_STATUS,} from '../actions';


const buttonStatusReducers = {
  loginButtonStatus,
  findEmailButtonStatus,
  findPwButtonStatus,
  emailCheckButtonStatus,
  sendAuthCodButtonStatus,
  checkAuthCodeButtonStatus,
  signUpButtonStatus,
}

function loginButtonStatus(state = true, action) {
  switch (action.type) {
    case SET_LOGIN_BUTTON_STATUS:
      return action.loginButtonStatus;
    default:
      return state;
  }
}

function findEmailButtonStatus(state = true, action) {
  switch (action.type) {
    case SET_FIND_EMAIL_BUTTON_STATUS:
      return action.findEmailButtonStatus;
    default:
      return state;
  }
}

function findPwButtonStatus(state = true, action) {
  switch (action.type) {
    case SET_FIND_PW_BUTTON_STATUS:
      return action.findPwButtonStatus;
    default:
      return state;
  }
}

function emailCheckButtonStatus(state = true, action) {
  switch (action.type) {
    case SET_EMAIL_CHECK_BUTTON_STATUS:
      return action.emailCheckButtonStatus;
    default:
      return state;
  }
}

function sendAuthCodButtonStatus(state = true, action) {
  switch (action.type) {
    case SET_SEND_AUTH_CODE_BUTTON_STATUS:
      return action.sendAuthCodButtonStatus;
    default:
      return state;
  }
}

function checkAuthCodeButtonStatus(state = true, action) {
  switch (action.type) {
    case SET_CHECK_AUTH_CODE_BUTTON_STATUS:
      return action.checkAuthCodeButtonStatus;
    default:
      return state;
  }
}

function signUpButtonStatus(state = true, action) {
  switch (action.type) {
    case SET_SIGN_UP_BUTTON_STATUS:
      return action.signUpButtonStatus;
    default:
      return state;
  }
}



export default buttonStatusReducers;