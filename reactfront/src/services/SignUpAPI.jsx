import axios from 'axios';
import { useState } from 'react';

export default function SignUpAPI({ email, pw, name, phone, birth, authCode, gender, org, job,
  setEmailCheckAlert, setAuthCodeAlert,
  setEmailReadOnlyStatus,
  setSendAuthCodButtonStatus, setCheckAuthCodeButtonStatus, setEmailCheckButtonStatus,
  setAuthCodeReadOnlyStatus, setSignUpAlert, setSignUpCompleteAlert,
  } = {}) {


  const [emailCheckResult, setEmailCheckResult] = useState();
    
  //email 중복 확인
  const onClickEmailCheckButton = async () => {

    const emailCheckInfo = {
      'username': email,
    };

    try {
      const response = await axios.post('/api/v1/user/check-dupl', emailCheckInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        setEmailCheckResult('사용 가능한 이메일 입니다. 인증을 진행 해주세요.');
        setEmailCheckAlert(true);
        setEmailReadOnlyStatus(true);
        setEmailCheckButtonStatus(true);
        setSendAuthCodButtonStatus(false);
      }
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        setEmailCheckResult('중복된 이메일입니다.');
        setEmailCheckAlert(true);
      } else {
        console.log(error.response);
      }
    }
  };
  //email 중복 확인


  const [authCodeResult, setAuthCodeResult] = useState();
  const [sendAuthCodeLoading, setSendAuthCodeLoading] = useState(false);
  
  //인증번호 발송
  const onClickSendAuthCodeButton = async () => {
    setSendAuthCodeLoading(true);

    const sendAuthCodeInfo = {
      'username': email,
    };

    try {
      const response = await axios.post('/api/v1/user/signup-auth', sendAuthCodeInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        setAuthCodeResult('인증번호가 발송되었습니다.');
        setCheckAuthCodeButtonStatus(false);
        setAuthCodeReadOnlyStatus(false);
        setAuthCodeAlert(true);
      };
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        setAuthCodeResult('실패하였습니다. 관리자에게 문의바랍니다.');
        setEmailCheckAlert(true);
      } else {
        console.log(error.response);
      }
    }
    setSendAuthCodeLoading(false);
  };
  //인증번호 발송


  //인증번호 확인
  const onClickCheckAuthCodeButton = async () => {

    const checkAuthCodeInfo = {
      'username': email,
      'authCode': authCode,
    };

    try {
      const response = await axios.post('/api/v1/user/signup-authcheck', checkAuthCodeInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        setAuthCodeResult('인증 완료되었습니다.');
        setSendAuthCodButtonStatus(true);
        setCheckAuthCodeButtonStatus(true);
        setAuthCodeReadOnlyStatus(true);
        setAuthCodeAlert(true);
      };
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        setAuthCodeResult('인증번호가 틀렸습니다.');
        setAuthCodeAlert(true);
      } else {
        console.log(error.response);
      }
    }
  };
  //인증번호 발송


  const [signUpResult, setSignUpResult] = useState('');

  //회원가입 진행
  const onClickSignUp = async () => {

    const signUpInfo = {
      'username': email,
      'password' : pw,
      'name': name,
      'gender' : gender,
      'organization': org,
      'job' : job,
      'phone': phone,
      'birth' : birth,
    };

    try {
      const response = await axios.post('/api/v1/user/sign-up', signUpInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        setSignUpResult('완료되었습니다. 로그인 화면으로 이동합니다.');
        setSignUpAlert(false);
        setSignUpCompleteAlert(true);
      };
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        setAuthCodeResult('실패하였습니다. 관리자 문의 바랍니다.');
        setSignUpAlert(false);
        setSignUpCompleteAlert(true);
      } else {
        console.log(error.response);
      }
    }
  };
  //회원가입 진행



  return { emailCheckResult, authCodeResult, sendAuthCodeLoading, signUpResult,
    onClickEmailCheckButton, onClickSendAuthCodeButton,
    onClickCheckAuthCodeButton, onClickSignUp,
  };
}