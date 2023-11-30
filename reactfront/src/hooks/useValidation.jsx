//useButtonStatus.jsx
//useAlert.jsx
//useInfo.jsx
//나눠져있는게 베스트

import { useState, useEffect } from 'react';

export default function useValidation({
  setLoginButtonStatus, 
  setFindEmailButtonStatus, setFindPwButtonStatus,
  setEmailCheckButtonStatus, setSignUpButtonStatus,
  emailReadOnlyStatus, sendAuthCodButtonStatus, checkAuthCodeButtonStatus,
  } = {}) {
  


  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  
  // email 검증 로직
  const validateEmail = (email) => {
    const re = 
    //eslint-disable-next-line
    /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(String(email));
  };
  // email 검증 로직
  
  // email 검증 결과 반영
  const handleEmailValidation = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setEmailError(!validateEmail(emailValue) && emailValue !== '');
    // 아래 if문 줄이는 방법
    // if (!validateEmail(event.target.value)) {
    //   setEmailError(true);
    // } else {
    //   setEmailError(false);
    //   setEmail(event.target.value);
    // }
  };
  // email 검증 결과 반영
  

  
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);

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
    setPw(pwValue);
    setPwError(!validatePw(pwValue) && pwValue !== '');
  };
  // pw 검증 결과 반영
  

  
  // 로그인 버튼 활성화 여부(Login.jsx-setLoginButtonStatus)
  useEffect(() => {
    if(setLoginButtonStatus) {
      if(!emailError && !pwError && email && pw ) {
        setLoginButtonStatus(false);
        return;
      } else {
        setLoginButtonStatus(true);
      }
    }
    //eslint-disable-next-line
  }, [emailError, pwError, email, pw]);
  // 로그인 버튼 활성화 여부(Login.jsx-setLoginButtonStatus)



  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);

  // name 검증 로직
  const validateName = (name) => {
    const re = 
    //eslint-disable-next-line
    /^[가-힣a-zA-Z]{2,20}$/;
    return re.test(String(name));
  };
  // name 검증 로직

  // name 검증 결과 반영
  const handleNameValidation = (event) => {
    const nameValue = event.target.value;
    setName(nameValue);
    setNameError(!validateName(nameValue) && nameValue !== '');
  };
  // name 검증 결과 반영



  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);

  // phone 검증 로직
  const validatePhone = (phone) => {
    const re =
    //eslint-disable-next-line
    /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
    return re.test(String(phone));
  };
  // phone 검증 로직

  // phone 검증 결과 반영
  const handlePhoneValidation = (event) => {
    const phoneValue = event.target.value;
    setPhone(phoneValue);
    setPhoneError(!validatePhone(phoneValue) && phoneValue !== '');
  };
  // phone 검증 결과 반영



  const [birth, setBirth] = useState('');

  // birth 변환
  const handleDateChange = (date) => {
    const jsDate = date.toDate();
    const yyyy = jsDate.getFullYear();
    const mm = String(jsDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하기
    const dd = String(jsDate.getDate()).padStart(2, '0');

    setBirth(`${yyyy}${mm}${dd}`);
  };
  // birth 변환



  // findEmail button 활성화 여부(Find.jsx-setFindEmailButtonStatus)
  useEffect(() => {
    if(setFindEmailButtonStatus) {
      if(!nameError && !phoneError && name && phone && birth ) {
        setFindEmailButtonStatus(false);
        return;
      } else {
        setFindEmailButtonStatus(true);
      }
    }
    //eslint-disable-next-line
  }, [nameError, phoneError, name, phone, birth]);
  // findEmail button 활성화 여부(Find.jsx-setFindEmailButtonStatus)



  // findPw button 활성화 여부(Find.jsx-setFindPwButtonStatus)
  useEffect(() => {
    if(setFindPwButtonStatus) {
      if(!emailError && !nameError && !phoneError && email && name && phone && birth ) {
        setFindPwButtonStatus(false);
        return;
      } else {
        setFindPwButtonStatus(true);
      }
    }
    //eslint-disable-next-line
  }, [emailError, nameError, phoneError, name, phone, birth]);
  // findPw button 활성화 여부(Find.jsx-setFindPwButtonStatus)



  // tab 변수 초기화
  const findTabReset = () => {
    setEmail('');
    setName('');
    setPhone('');
    setBirth('');
  };
  // tab 변수 초기화



  // emailCheck button 활성화 여부(Find.jsx-setEmailCheckButtonStatus)
  useEffect(() => {
    if(setEmailCheckButtonStatus) {
      if(!emailError && email) {
        setEmailCheckButtonStatus(false);
        return;
      } else {
        setEmailCheckButtonStatus(true);
      }
    }
    //eslint-disable-next-line
  }, [emailError, email]);
  // emailCheck button 활성화 여부(Find.jsx-setEmailCheckButtonStatus)



  const [authCode, setAuthCode] = useState('');

  // authCodoe 저장
  const handleAuthCode = (event) => {
    setAuthCode(event.target.value);
  };
  // authCodoe 저장



  const [pwConfirm, setPwConfirm] = useState('');
  const [pwConfirmError, setPwConfirmError] = useState(false);

  // pwConfirm 저장
  const handlePwConfirm = (event) => {
    setPwConfirm(event.target.value);
  };
  // pwConfirm 저장

  // pwConfirm 확인
  useEffect(() => {
    if(setPwConfirmError) {
      if(pw === pwConfirm) {
        setPwConfirmError(false);
        return;
      } else {
        setPwConfirmError(true);
      }
    }
    //eslint-disable-next-line
  }, [pw, pwConfirm]);
  // pwConfirm 확인



  const [org, setOrg] = useState('');
  const [orgError, setOrgError] = useState(false);

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
    setOrg(orgValue);
    setOrgError(!validateOrg(orgValue) && orgValue !== '');
  };
  // org 검증 결과 반영



  const [job, setJob] = useState('');
  const [jobError, setJobError] = useState(false);

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
    setJob(jobValue);
    setJobError(!validateJob(jobValue) && jobValue !== '');
  };
  // job 검증 결과 반영



  const [gender, setGender] = useState('');

  // gender 저장
  const handleGender = (event) => {
    setGender(event.target.value);
  };
  // gender 저장



  // signUp button 활성화 여부(SignUp.jsx-setSignUpButtonStatus)
  useEffect(() => {
    if(setSignUpButtonStatus) {
      if(emailReadOnlyStatus && sendAuthCodButtonStatus && checkAuthCodeButtonStatus && !pwError && !pwConfirmError && !nameError && !phoneError && !orgError && !jobError && authCode && gender && birth && (birth, org, job) !== '') {
        setSignUpButtonStatus(false);
      } else {
        setSignUpButtonStatus(true);
      }
    }
    //eslint-disable-next-line
  }, [emailReadOnlyStatus, sendAuthCodButtonStatus, checkAuthCodeButtonStatus, pwError, pwConfirmError, nameError, phoneError, orgError, jobError, authCode, gender, birth]);
  // signUp button 활성화 여부(SignUp.jsx-setSignUpButtonStatus)
  


  return { email, pw, name, phone, birth, authCode, gender, org, job,
    emailError, pwError, nameError, phoneError, pwConfirmError, orgError, jobError,
    handleEmailValidation, handlePwValidation, handleNameValidation,
    handlePhoneValidation, handleDateChange, handleAuthCode,
    handlePwConfirm, handleOrgValidation, handleJobValidation,
    handleGender,
    findTabReset,
  };
};
