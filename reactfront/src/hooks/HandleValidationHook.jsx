import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginEmail, setFindPwEmail, setSignUpEmail,
  setLoginPw, setSignUpPw, setChangeCurrentPw, setChangePw, setChangePwConfirm,
  setFindEmailName, setFindPwName, setSignUpName,
  setFindEmailPhone, setFindPwPhone, setSignUpPhone, setChangePhone,
  setFindEmailBirth, setFindPwBirth, setSignUpBirth,
  setAuthCode, setPwConfirm, setOrg, setJob, setGender,
  setLoginEmailError, setFindPwEmailError, setSignUpEmailError,
  setLoginPwError, setSignUpPwError, setChangePhoneError,
  setFindEmailNameError, setFindPwNameError, setSignUpNameError,
  setFindEmailPhoneError, setFindPwPhoneError, setSignUpPhoneError,
  setPwConfirmError, setOrgError, setJobError, setChangeCurrentPwError,
  setChangePwError, setChangePwConfirmError } from '../actions';

export default function HandleValidation() {
  
  const dispatch = useDispatch();
  
  const signUpPw = useSelector(state => state.signUpPw);
  const pwConfirm = useSelector(state => state.pwConfirm);
  const changePw = useSelector(state => state.changePw);
  const changePwConfirm = useSelector(state => state.changePwConfirm);
  
  
  
  
  // email 검증 로직
  const validateEmail = (emailValue) => {
    const re = 
    //eslint-disable-next-line
    /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(String(emailValue));
  };
  // email 검증 로직

  const handleLoginEmailValidation = (event) => {
    const emailValue = event.target.value;
    dispatch(setLoginEmail(emailValue));
    dispatch(setLoginEmailError(!validateEmail(emailValue)  && emailValue !== ''));
    // 아래 if문 줄이는 방법
    //   if (!validateEmail(event.target.value)) {
    //     dispatch(setEmailError(true));
    // } else {
    //     dispatch(setEmailError(false));
    //     dispatch(setEmail(event.target.value));
    // }
  };

  const handleFindPwEmailValidation = (event) => {
    const emailValue = event.target.value;
    dispatch(setFindPwEmail(emailValue));
    dispatch(setFindPwEmailError(!validateEmail(emailValue)  && emailValue !== ''));
  };

  const handleSignUpEmailValidation = (event) => {
    const emailValue = event.target.value;
    dispatch(setSignUpEmail(emailValue));
    dispatch(setSignUpEmailError(!validateEmail(emailValue)  && emailValue !== ''));
  };

  

  // pw 검증 로직
  const validatePw = (pwValue) => {
    const re = 
    //eslint-disable-next-line
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    return re.test(String(pwValue));
  };
  // pw 검증 로직

  const handleLoginPwValidation = (event) => {
    const pwValue = event.target.value;
    dispatch(setLoginPw(pwValue));
    dispatch(setLoginPwError(!validatePw(pwValue) && pwValue !== ''));
  };

  const handleSignUpPwValidation = (event) => {
    const pwValue = event.target.value;
    dispatch(setSignUpPw(pwValue));
    dispatch(setSignUpPwError(!validatePw(pwValue) && pwValue !== ''));
  };

  const handleChangeCurrentPwValidation = (event) => {
    const pwValue = event.target.value;
    dispatch(setChangeCurrentPw(pwValue));
    dispatch(setChangeCurrentPwError(!validatePw(pwValue) && pwValue !== ''));
  };

  const handleChangePwValidation = (event) => {
    const pwValue = event.target.value;
    dispatch(setChangePw(pwValue));
    dispatch(setChangePwError(!validatePw(pwValue) && pwValue !== ''));
  };


  // name 검증 로직
  const validateName = (nameValue) => {
    const re = 
    //eslint-disable-next-line
    /^[가-힣a-zA-Z]{2,20}$/;
    return re.test(String(nameValue));
  };
  // name 검증 로직

  const handleFindEmailNameValidation = (event) => {
    const nameValue = event.target.value;
    dispatch(setFindEmailName(nameValue));
    dispatch(setFindEmailNameError(!validateName(nameValue) && nameValue !== ''));
  };

  const handleFindPwNameValidation = (event) => {
    const nameValue = event.target.value;
    dispatch(setFindPwName(nameValue));
    dispatch(setFindPwNameError(!validateName(nameValue) && nameValue !== ''));
  };
  
  const handleSignUpNameValidation = (event) => {
    const nameValue = event.target.value;
    dispatch(setSignUpName(nameValue));
    dispatch(setSignUpNameError(!validateName(nameValue) && nameValue !== ''));
  };


  // phone 검증 로직
  const validatePhone = (phoneValue) => {
    const re =
    //eslint-disable-next-line
    /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
    return re.test(String(phoneValue));
  };
  // phone 검증 로직

  const handleFindEmailPhoneValidation = (event) => {
    const phoneValue = event.target.value;
    dispatch(setFindEmailPhone(phoneValue));
    dispatch(setFindEmailPhoneError(!validatePhone(phoneValue) && phoneValue !== ''));
  };

  const handleFindPwPhoneValidation = (event) => {
    const phoneValue = event.target.value;
    dispatch(setFindPwPhone(phoneValue));
    dispatch(setFindPwPhoneError(!validatePhone(phoneValue) && phoneValue !== ''));
  };

  const handleSignUpPhoneValidation = (event) => {
    const phoneValue = event.target.value;
    dispatch(setSignUpPhone(phoneValue));
    dispatch(setSignUpPhoneError(!validatePhone(phoneValue) && phoneValue !== ''));
  };

  const handleChangePhoneValidation = (event) => {
    const phoneValue = event.target.value;
    dispatch(setChangePhone(phoneValue));
    dispatch(setChangePhoneError(!validatePhone(phoneValue) && phoneValue !== ''));
  };

  // 생년월일 변환
  const handleFindEmailDateChange = (date) => {
    const jsDate = date.toDate();
    const yyyy = jsDate.getFullYear();
    const mm = String(jsDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하기
    const dd = String(jsDate.getDate()).padStart(2, '0');
    
    dispatch(setFindEmailBirth(`${yyyy}${mm}${dd}`));
  };
  // 생년월일 변환

  const handleFindPwDateChange = (date) => {
    const jsDate = date.toDate();
    const yyyy = jsDate.getFullYear();
    const mm = String(jsDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하기
    const dd = String(jsDate.getDate()).padStart(2, '0');
    
    dispatch(setFindPwBirth(`${yyyy}${mm}${dd}`));
  };

  const handleSignUpDateChange = (date) => {
    const jsDate = date.toDate();
    const yyyy = jsDate.getFullYear();
    const mm = String(jsDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하기
    const dd = String(jsDate.getDate()).padStart(2, '0');
    
    dispatch(setSignUpBirth(`${yyyy}${mm}${dd}`));
  };
  
  
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
    if(signUpPw === pwConfirm) {
      dispatch(setPwConfirmError(false));
      return;
    } else {
      dispatch(setPwConfirmError(true));
    }
    //eslint-disable-next-line
  }, [signUpPw, pwConfirm]);
  // pwConfirm 확인

  // changePwConfirm 저장
  const handleChangePwConfirm = (event) => {
    dispatch(setChangePwConfirm(event.target.value));
  };
  // pwConfirm 저장
  
  // pwConfirm 확인
  useEffect(() => {
    if(changePw === changePwConfirm) {
      dispatch(setChangePwConfirmError(false));
      return;
    } else {
      dispatch(setChangePwConfirmError(true));
    }
    //eslint-disable-next-line
  }, [changePw, changePwConfirm]);
  // changePwConfirm 확인


  // org 검증 로직
  const validateOrg = (orgValue) => {
    const re = 
    //eslint-disable-next-line
    /^[가-힣a-zA-Z]{2,20}$/;
    return re.test(String(orgValue));
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
  const validateJob = (jobValue) => {
    const re = 
    //eslint-disable-next-line
    /^[가-힣a-zA-Z]{2,20}$/;
    return re.test(String(jobValue));
  };
  // job 검증 로직

  // job 검증 결과 반영
  const handleJobValidation = (event) => {
    const jobValue = event.target.value;
    dispatch(setJob(jobValue));
    dispatch(setJobError(!validateJob(jobValue) && jobValue !== ''));
  };
  // job 검증 결과 반영
  
  const loginReset = () => {
    dispatch(setLoginEmail(''));
    dispatch(setLoginEmailError(false));
    dispatch(setLoginPw(''));
    dispatch(setLoginPwError(false));
  }

  const findTabReset = () => {
    dispatch(setFindEmailName(''));
    dispatch(setFindEmailNameError(false));
    dispatch(setFindEmailPhone(''));
    dispatch(setFindEmailPhoneError(false));
    dispatch(setFindEmailBirth(''));
    dispatch(setFindPwEmail(''));
    dispatch(setFindPwEmailError(false));
    dispatch(setFindPwName(''));
    dispatch(setFindPwNameError(false));
    dispatch(setFindPwPhone(''));
    dispatch(setFindPwPhoneError(false));
    dispatch(setFindPwBirth(''));
  };

  const signUpReset = () => {
    dispatch(setSignUpEmail(''));
    dispatch(setSignUpEmailError(false));
    dispatch(setSignUpPw(''));
    dispatch(setSignUpPwError(false));
    dispatch(setSignUpName(''));
    dispatch(setSignUpNameError(false));
    dispatch(setSignUpPhone(''));
    dispatch(setSignUpPhoneError(false));
    dispatch(setSignUpBirth(''));
    dispatch(setAuthCode(''));
    dispatch(setGender(''));
    dispatch(setPwConfirm(''));
    dispatch(setPwConfirmError(false));
    dispatch(setOrg(''));
    dispatch(setOrgError(false));
    dispatch(setJob(''));
    dispatch(setJobError(false));
  }


  return  { handleLoginEmailValidation, handleFindPwEmailValidation, handleSignUpEmailValidation,
    handleLoginPwValidation, handleSignUpPwValidation, handleChangeCurrentPwValidation, handleChangePwValidation,
    handleFindEmailNameValidation, handleFindPwNameValidation, handleSignUpNameValidation,
    handleFindEmailPhoneValidation, handleFindPwPhoneValidation, handleSignUpPhoneValidation,
    handleFindEmailDateChange, handleFindPwDateChange, handleSignUpDateChange,
    handleAuthCode, handlePwConfirm, handleChangePwConfirm, handleOrgValidation, handleJobValidation, handleGender,
    handleChangePhoneValidation, loginReset, findTabReset, signUpReset,
  };
};
