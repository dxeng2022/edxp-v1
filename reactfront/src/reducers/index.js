import { combineReducers } from 'redux';
import emailReducer from './emailReducer';
import pwReducer from './pwReducer';
import nameReducer from './nameReducer';
import phoneReducer from './phoneReducer';
import birthReducer from './birthReducer';
import buttonStatusReducer from './buttonStatusReducer';
import alertReducer from './alertReducer';
import readOnlyStatusReducer from './readOnlyStatusReducer';
import resultReducer from './resultReducer';
import authCodeReducer from './authKeyReducer';
import orgReducer from './orgReducer';
import jobReducer from './jobReducer';
import genderReducer from './genderReducer';
import userInfoReducer from './userInfoReducer';
import cloudReducer from './cloudReducer';
import administratorReducer from './administratorReducer';

export default combineReducers({
  ...emailReducer,
  ...pwReducer,
  ...nameReducer,
  ...phoneReducer,
  ...birthReducer,
  ...buttonStatusReducer,
  ...alertReducer,
  ...readOnlyStatusReducer,
  ...resultReducer,
  ...authCodeReducer,
  ...orgReducer,
  ...jobReducer,
  ...genderReducer,
  ...userInfoReducer,
  ...cloudReducer,
  ...administratorReducer,
});
