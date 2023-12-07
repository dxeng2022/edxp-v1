import axios from 'axios';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEmailCheckButtonStatus, setSendAuthCodButtonStatus, setCheckAuthCodeButtonStatus,
  setEmailCheckAlert, setAuthCodeAlert, setSignUpAlert, setSignUpCompleteAlert,
  setEmailReadOnlyStatus, setAuthCodeReadOnlyStatus,
  setEmailCheckResult, setAuthCodeResult, setSignUpResult } from '../actions';

export default function SignUpAPI() {

  const dispatch = useDispatch();
  
  const signUpEmail = useSelector(state => state.signUpEmail);
  const signUpPw = useSelector(state => state.signUpPw);
  const signUpName = useSelector(state => state.signUpName);
  const signUpPhone = useSelector(state => state.signUpPhone);
  const signUpBirth = useSelector(state => state.signUpBirth);
  const authCode = useSelector(state => state.authCode);
  const org = useSelector(state => state.org);
  const job = useSelector(state => state.job);
  const gender = useSelector(state => state.gender);



  //email 중복 확인
  const onClickEmailCheckButton = async () => {

    const emailCheckInfo = {
      'username': signUpEmail,
    };

    try {
      const response = await axios.post('/api/v1/user/check-dupl', emailCheckInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        dispatch(setEmailCheckResult('사용 가능한 이메일 입니다. 인증을 진행 해주세요.'));
        dispatch(setEmailCheckAlert(true));
        dispatch(setEmailReadOnlyStatus(true));
        dispatch(setEmailCheckButtonStatus(true));
        dispatch(setSendAuthCodButtonStatus(false));
      }
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setEmailCheckResult('중복된 이메일입니다.'));
        dispatch(setEmailCheckAlert(true));
      } else {
        console.log(error.response);
      }
    }
  };
  //email 중복 확인


  const [sendAuthCodeLoading, setSendAuthCodeLoading] = useState(false);
  
  //인증번호 발송
  const onClickSendAuthCodeButton = async () => {
    setSendAuthCodeLoading(true);

    const sendAuthCodeInfo = {
      'username': signUpEmail,
    };
    try {
      const response = await axios.post('/api/v1/user/signup-auth', sendAuthCodeInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });
      if (response.status === 200) {
        dispatch(setAuthCodeResult('인증번호가 발송되었습니다.'));
        dispatch(setCheckAuthCodeButtonStatus(false));
        dispatch(setAuthCodeReadOnlyStatus(false));
        dispatch(setAuthCodeAlert(true));
      };
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setAuthCodeResult('실패하였습니다. 관리자에게 문의바랍니다.'));
        dispatch(setEmailCheckAlert(true));
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
      'username': signUpEmail,
      'authCode': authCode,
    };

    try {
      const response = await axios.post('/api/v1/user/signup-authcheck', checkAuthCodeInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        dispatch(setAuthCodeResult('인증 완료되었습니다.'));
        dispatch(setSendAuthCodButtonStatus(true));
        dispatch(setCheckAuthCodeButtonStatus(true));
        dispatch(setAuthCodeReadOnlyStatus(true));
        dispatch(setAuthCodeAlert(true));
      };
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setAuthCodeResult('인증번호가 틀렸습니다.'));
        dispatch(setAuthCodeAlert(true));
      } else {
        console.log(error.response);
      }
    }
  };
  //인증번호 발송



  //회원가입 진행
  const onClickSignUp = async () => {

    const signUpInfo = {
      'username': signUpEmail,
      'password' : signUpPw,
      'name': signUpName,
      'gender' : gender,
      'organization': org,
      'job' : job,
      'phone': signUpPhone,
      'birth' : signUpBirth,
    };

    try {
      const response = await axios.post('/api/v1/user/sign-up', signUpInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        dispatch(setSignUpResult('완료되었습니다. 로그인 화면으로 이동합니다.'));
        dispatch(setSignUpAlert(false));
        dispatch(setSignUpCompleteAlert(true));
      };
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setAuthCodeResult('실패하였습니다. 관리자 문의 바랍니다.'));
        dispatch(setSignUpAlert(false));
        dispatch(setSignUpCompleteAlert(true));
      } else {
        console.log(error.response);
      }
    }
  };
  //회원가입 진행



  return { sendAuthCodeLoading,
    onClickEmailCheckButton, onClickSendAuthCodeButton,
    onClickCheckAuthCodeButton, onClickSignUp,
  };
}