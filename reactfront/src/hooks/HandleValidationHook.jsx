import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPw, setName, setPhone, setBirth, setAuthCode, setPwConfirm, setOrg, setJob, setGender,
  setEmailError, setPwError, setNameError, setPhoneError, setPwConfirmError, setOrgError, setJobError, } from '../actions';

export default function HandleValidationHook() {
  
  const dispatch = useDispatch();
  
  const pw = useSelector(state => state.pw);
  const pwConfirm = useSelector(state => state.pwConfirm);
  
  
  
  // email 검증 로직
  const validateEmail = (emailValue) => {
    const re = 
    //eslint-disable-next-line
    /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(String(emailValue));
  };
  // email 검증 로직
  
  // email 검증 결과 반영
  const handleEmailValidation = (event) => {
    const emailValue = event.target.value;
    dispatch(setEmail(emailValue));
    dispatch(setEmailError(!validateEmail(emailValue)  && emailValue !== ''));
    // 아래 if문 줄이는 방법
    //   if (!validateEmail(event.target.value)) {
    //     dispatch(setEmailError(true));
    // } else {
    //     dispatch(setEmailError(false));
    //     dispatch(setEmail(event.target.value));
    // }
  };
  // email 검증 결과 반영
  

  // pw 검증 로직
  const validatePw = (pw) => {
    const re = 
    //eslint-disable-next-line
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    return re.test(String(pw));
  };
  // pw 검증 로직
  
  // pw 검증 결과 반영
  const handlePwValidation = (event) => {
    const pwValue = event.target.value;
    dispatch(setPw(pwValue));
    dispatch(setPwError(!validatePw(pwValue) && pwValue !== ''));
  };
  // pw 검증 결과 반영


  // name 검증 로직
  const validateName = (nameValue) => {
    const re = 
    //eslint-disable-next-line
    /^[가-힣a-zA-Z]{2,20}$/;
    return re.test(String(nameValue));
  };
  // name 검증 로직

  // name 검증 결과 반영
  const handleNameValidation = (event) => {
    const nameValue = event.target.value;
    dispatch(setName(nameValue));
    dispatch(setNameError(!validateName(nameValue) && nameValue !== ''));
  };
  // name 검증 결과 반영



  // phone 검증 로직
  const validatePhone = (phoneValue) => {
    const re =
    //eslint-disable-next-line
    /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
    return re.test(String(phoneValue));
  };
  // phone 검증 로직

  // phone 검증 결과 반영
  const handlePhoneValidation = (event) => {
    const phoneValue = event.target.value;
    dispatch(setPhone(phoneValue));
    dispatch(setPhoneError(!validatePhone(phoneValue) && phoneValue !== ''));
  };
  // phone 검증 결과 반영


  // birth 변환
  const handleDateChange = (date) => {
    const jsDate = date.toDate();
    const yyyy = jsDate.getFullYear();
    const mm = String(jsDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하기
    const dd = String(jsDate.getDate()).padStart(2, '0');
    
    dispatch(setBirth(`${yyyy}${mm}${dd}`));
  };
  // birth 변환
  
  
  // authCodoe 저장
  const handleAuthCode = (event) => {
    dispatch(setAuthCode(event.target.value));
  };
  // authCodoe 저장
  
  // gender 저장
  const handleGender = (event) => {
    dispatch(setGender(event.target.value));
  };
  // gender 저장
  
  // pwConfirm 저장
  const handlePwConfirm = (event) => {
    dispatch(setPwConfirm(event.target.value));
  };
  // pwConfirm 저장

  // pwConfirm 확인
  useEffect(() => {
    if(pw === pwConfirm) {
      dispatch(setPwConfirmError(false));
      return;
    } else {
      dispatch(setPwConfirmError(true));
    }
    //eslint-disable-next-line
  }, [pw, pwConfirm]);
  // pwConfirm 확인


  // org 검증 로직
  const validateOrg = (org) => {
    const re = 
    //eslint-disable-next-line
    /^[가-힣a-zA-Z]{2,20}$/;
    return re.test(String(org));
  };
  // org 검증 로직

  // org 검증 결과 반영
  const handleOrgValidation = (event) => {
    const orgValue = event.target.value;
    dispatch(setOrg(orgValue));
    dispatch(setOrgError(!validateOrg(orgValue) && orgValue !== ''));
  };
  // org 검증 결과 반영

  // job 검증 로직
  const validateJob = (job) => {
    const re = 
    //eslint-disable-next-line
    /^[가-힣a-zA-Z]{2,20}$/;
    return re.test(String(job));
  };
  // job 검증 로직

  // job 검증 결과 반영
  const handleJobValidation = (event) => {
    const jobValue = event.target.value;
    dispatch(setJob(jobValue));
    dispatch(setJobError(!validateJob(jobValue) && jobValue !== ''));
  };
  // job 검증 결과 반영






  return  { handleEmailValidation, handlePwValidation, handleNameValidation,
    handlePhoneValidation, handleDateChange, handleAuthCode,
    handlePwConfirm, handleOrgValidation, handleJobValidation,
    handleGender,
  };
};
