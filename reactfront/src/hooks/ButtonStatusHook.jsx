import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginButtonStatus, setFindEmailButtonStatus, setFindPwButtonStatus,
  setEmailCheckButtonStatus, setSignUpButtonStatus } from '../actions';

export default function ButtonStatus() {

  const dispatch = useDispatch();

  const loginEmail = useSelector(state => state.loginEmail);
  const findPwEmail = useSelector(state => state.findPwEmail);
  const signUpEmail = useSelector(state => state.signUpEmail);

  const loginPw = useSelector(state => state.loginPw);
  
  const findEmailName = useSelector(state => state.findEmailName);
  const findPwName = useSelector(state => state.findPwName);
  
  const findEmailPhone = useSelector(state => state.findEmailPhone);
  const findPwPhone = useSelector(state => state.findPwPhone);

  const findEmailBirth = useSelector(state => state.findEmailBirth);
  const findPwBirth = useSelector(state => state.findPwBirth);
  const signUpBirth = useSelector(state => state.signUpBirth);

  const authCode = useSelector(state => state.authCode);
  const gender = useSelector(state => state.gender);
  const org = useSelector(state => state.org);
  const job = useSelector(state => state.job);

  const loginEmailError = useSelector(state => state.loginEmailError);
  const findPwEmailError = useSelector(state => state.findPwEmailError);
  const signUpEmailError = useSelector(state => state.signUpEmailError);

  const loginPwError = useSelector(state => state.loginPwError);
  const signUpPwError = useSelector(state => state.signUpPwError);

  const findEmailNameError = useSelector(state => state.findEmailNameError);
  const findPwNameError = useSelector(state => state.findPwNameError);
  const signUpNameError = useSelector(state => state.signUpNameError);


  const findEmailPhoneError = useSelector(state => state.findEmailPhoneError);
  const findPwPhoneError = useSelector(state => state.findPwPhoneError);
  const signUpPhoneError = useSelector(state => state.signUpPhoneError);

  const pwConfirmError = useSelector(state => state.pwConfirmError);
  const orgError = useSelector(state => state.orgError);
  const jobError = useSelector(state => state.jobError);

  const emailReadOnlyStatus = useSelector(state => state.emailReadOnlyStatus);
  const sendAuthCodButtonStatus = useSelector(state => state.sendAuthCodButtonStatus);
  const checkAuthCodeButtonStatus = useSelector(state => state.checkAuthCodeButtonStatus);


  // login button 활성화 여부
  useEffect(() => {
    if(!loginEmailError && !loginPwError && loginEmail && loginPw ) {
      dispatch(setLoginButtonStatus(false));
    } else {
      dispatch(setLoginButtonStatus(true));
    }
  //eslint-disable-next-line
  }, [loginEmailError, loginPwError, loginEmail, loginPw]);
  // login button 활성화 여부


  // findEmail button 활성화 여부(Find.jsx-setFindEmailButtonStatus)
  useEffect(() => {
    if(!findEmailNameError && !findEmailPhoneError && findEmailName && findEmailPhone && findEmailBirth ) {
      dispatch(setFindEmailButtonStatus(false));
      return;
    } else {
      dispatch(setFindEmailButtonStatus(true));
    }
    //eslint-disable-next-line
  }, [findEmailNameError, findEmailPhoneError, findEmailName, findEmailPhone, findEmailBirth]);
  // findEmail button 활성화 여부(Find.jsx-setFindEmailButtonStatus)


  // findPw button 활성화 여부(Find.jsx-setFindPwButtonStatus)
  useEffect(() => {
    if(!findPwEmailError && !findPwNameError && !findPwPhoneError && findPwEmail && findPwName && findPwPhone && findPwBirth ) {
      dispatch(setFindPwButtonStatus(false));
      return;
    } else {
      dispatch(setFindPwButtonStatus(true));
    }
    //eslint-disable-next-line
  }, [findPwEmailError, findPwNameError, findPwPhoneError, findPwEmail, findPwName, findPwPhone, findPwBirth]);
  // findPw button 활성화 여부(Find.jsx-setFindPwButtonStatus)


  // emailCheck button 활성화 여부(Find.jsx-setEmailCheckButtonStatus)
  useEffect(() => {
    if(!signUpEmailError && signUpEmail) {
      dispatch(setEmailCheckButtonStatus(false));
      return;
    } else {
      dispatch(setEmailCheckButtonStatus(true));
    }
    //eslint-disable-next-line
  }, [signUpEmailError, signUpEmail]);
  // emailCheck button 활성화 여부(Find.jsx-setEmailCheckButtonStatus)

  // signUp button 활성화 여부(SignUp.jsx-setSignUpButtonStatus)
  useEffect(() => {
    if(emailReadOnlyStatus && sendAuthCodButtonStatus && checkAuthCodeButtonStatus && !signUpPwError && !pwConfirmError && !signUpNameError && !signUpPhoneError && !orgError && !jobError && authCode && gender && signUpBirth && (signUpBirth, org, job) !== '') {
      dispatch(setSignUpButtonStatus(false));
    } else {
      dispatch(setSignUpButtonStatus(true));
    }
    //eslint-disable-next-line
  }, [emailReadOnlyStatus, sendAuthCodButtonStatus, checkAuthCodeButtonStatus, signUpPwError, pwConfirmError, signUpNameError, signUpPhoneError, orgError, jobError, authCode, gender, signUpBirth]);
    // signUp button 활성화 여부(SignUp.jsx-setSignUpButtonStatus)

};
