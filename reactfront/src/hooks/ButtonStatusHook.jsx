import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginButtonStatus, setFindEmailButtonStatus, setFindPwButtonStatus,
  setEmailCheckButtonStatus, setSignUpButtonStatus } from '../actions';

export default function ButtonStatus() {

  const dispatch = useDispatch();

  const email = useSelector(state => state.email);
  const pw = useSelector(state => state.pw);
  const name = useSelector(state => state.name);
  const phone = useSelector(state => state.phone);
  const birth = useSelector(state => state.birth);
  const authCode = useSelector(state => state.authCode);
  const gender = useSelector(state => state.gender);
  const org = useSelector(state => state.org);
  const job = useSelector(state => state.job);

  const emailError = useSelector(state => state.emailError);
  const pwError = useSelector(state => state.pwError);
  const nameError = useSelector(state => state.nameError);
  const phoneError = useSelector(state => state.phoneError);
  const pwConfirmError = useSelector(state => state.pwConfirmError);
  const orgError = useSelector(state => state.orgError);
  const jobError = useSelector(state => state.jobError);

  const emailReadOnlyStatus = useSelector(state => state.emailReadOnlyStatus);
  const sendAuthCodButtonStatus = useSelector(state => state.sendAuthCodButtonStatus);
  const checkAuthCodeButtonStatus = useSelector(state => state.checkAuthCodeButtonStatus);


  // login button 활성화 여부
  useEffect(() => {
    if(!emailError && !pwError && email && pw ) {
      dispatch(setLoginButtonStatus(false));
    } else {
      dispatch(setLoginButtonStatus(true));
    }
  //eslint-disable-next-line
  }, [emailError, pwError, email, pw]);
  // login button 활성화 여부


  // findEmail button 활성화 여부(Find.jsx-setFindEmailButtonStatus)
  useEffect(() => {
    if(!nameError && !phoneError && name && phone && birth ) {
      dispatch(setFindEmailButtonStatus(false));
      return;
    } else {
      dispatch(setFindEmailButtonStatus(true));
    }
    //eslint-disable-next-line
  }, [nameError, phoneError, name, phone, birth]);
  // findEmail button 활성화 여부(Find.jsx-setFindEmailButtonStatus)


  // findPw button 활성화 여부(Find.jsx-setFindPwButtonStatus)
  useEffect(() => {
    if(!emailError && !nameError && !phoneError && email && name && phone && birth ) {
      dispatch(setFindPwButtonStatus(false));
      return;
    } else {
      dispatch(setFindPwButtonStatus(true));
    }
    //eslint-disable-next-line
  }, [emailError, nameError, phoneError, name, phone, birth]);
  // findPw button 활성화 여부(Find.jsx-setFindPwButtonStatus)


  // emailCheck button 활성화 여부(Find.jsx-setEmailCheckButtonStatus)
  useEffect(() => {
    if(!emailError && email) {
      dispatch(setEmailCheckButtonStatus(false));
      return;
    } else {
      dispatch(setEmailCheckButtonStatus(true));
    }
    //eslint-disable-next-line
  }, [emailError, email]);
  // emailCheck button 활성화 여부(Find.jsx-setEmailCheckButtonStatus)

  // signUp button 활성화 여부(SignUp.jsx-setSignUpButtonStatus)
  useEffect(() => {
    if(emailReadOnlyStatus && sendAuthCodButtonStatus && checkAuthCodeButtonStatus && !pwError && !pwConfirmError && !nameError && !phoneError && !orgError && !jobError && authCode && gender && birth && (birth, org, job) !== '') {
      dispatch(setSignUpButtonStatus(false));
    } else {
      dispatch(setSignUpButtonStatus(true));
    }
    //eslint-disable-next-line
  }, [emailReadOnlyStatus, sendAuthCodButtonStatus, checkAuthCodeButtonStatus, pwError, pwConfirmError, nameError, phoneError, orgError, jobError, authCode, gender, birth]);
    // signUp button 활성화 여부(SignUp.jsx-setSignUpButtonStatus)

};
