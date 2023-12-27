import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setChangePhoneResult, setChangePhoneAlert,
  setCompleteDeactivateUserResult, setCompleteDeactivateUserAlert, setDeactivateUserAlert,
  setCompleteChangePwResult, setCompleteChangePwAlert, setChangePwAlert, setUserLoginAuth, setChangePhone } from '../actions';


export default function UserAPI() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector(state => state.userInfo);
  const changePhone = useSelector(state => state.changePhone);
  const changeCurrentPw = useSelector(state => state.changeCurrentPw);
  const changePwConfirm = useSelector(state => state.changePwConfirm);
  
  useEffect(() => {
    const userInfo = async () => {
      try {
        const response = await axios.get("/api/v1/user/my-info");
        dispatch(setUserInfo(response.data.result));
      } catch (error) {
        console.error(error);
      }
    };
    userInfo();
    //eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   const userLoginAuth = async () => {
  //     try {
  //       const response = await axios.get("/isLogin");
        
  //       // 로그인 상태가 아니라면 로그인 페이지로 리다이렉트
  //       if (!response.data.result) {
  //         alert('세션이 만료되어 다시 로그인해주세요.');
  //         window.location.href = '/';
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  
  //   // 로그인 확인 후, 55분 후에 다시 확인
  //   const timerId = setTimeout(userLoginAuth, 30000);
  
  //   const intervalId = setInterval(() => {
  //     console.log('1분 지났습니다.');
  //   }, 3000);
  
  //   return () => {
  //     clearTimeout(timerId);
  //     clearInterval(intervalId);  // 컴포넌트 언마운트 시 인터벌 제거
  //   };
    
  //   //eslint-disable-next-line
  // }, []);


  const logOutButton = async () => {
      try {
        const response = await axios.get("/logout");
        if (response.status === 200) {
          dispatch(setUserLoginAuth(false));
          navigate("/");
        };
      } catch (error) {
        console.error(error);
      }
  };


  const onClickChangePhoneButton = async () => {
    const changePhoneInfo = {
      'id': userInfo.id,
      'phone': changePhone,
    }
  
    if (userInfo.phone === changePhone) {
      dispatch(setChangePhoneResult('현재 전화번호와 같습니다. 다른 전화번호를 입력해주세요.'));
      dispatch(setChangePhoneAlert(true));
    } else {
      try {
        const response = await axios.put("/api/v1/user/" + changePhoneInfo.id, changePhoneInfo);
        if (response.status === 200) {
          dispatch(setChangePhoneResult('전화번호가 변경되었습니다.'));
          dispatch(setChangePhoneAlert(true));
          dispatch(setUserInfo(response.data.result));
          dispatch(setChangePhone());
        }
      } catch (error) {
        if (error.response && error.response.status !== 200) {
          dispatch(setChangePhoneResult('전화번호 변경에 실패하였습니다.'));
          dispatch(setChangePhoneAlert(true));
        }
      }
    }
  }
  


  const onClickChangePwButton = async () => {

    const changePwInfo = {
      'id': userInfo.id,
      'prePassword': changeCurrentPw,
      'newPassword' : changePwConfirm,
    }

    if (changeCurrentPw === changePwConfirm) {
      dispatch(setCompleteChangePwResult('현재 비밀번호와 같습니다. 다른 비밀번호를 입력해주세요.'));
      dispatch(setChangePwAlert(false));
      dispatch(setCompleteChangePwAlert(true));
    } else {
      try {
        const response = await axios.put("/api/v1/user/" + changePwInfo.id, changePwInfo);
        if (response.status === 200) {
          dispatch(setCompleteChangePwResult('비밀번호가 변경되었습니다. 다시 로그인해주세요.'));
          dispatch(setChangePwAlert(false));
          dispatch(setCompleteChangePwAlert(true));
          dispatch(setUserLoginAuth(false));
        }
      } catch (error) {
        if (error.response && error.response.status !== 200) {
          dispatch(setCompleteChangePwResult('비밀번호 변경에 실패하였습니다. Contact Us로 문의바랍니다.'));
          dispatch(setChangePwAlert(false));
          dispatch(setCompleteChangePwAlert(true));
        } else {
          console.log(error.response);
        }
      }
    }
  }


  const onClickDeactivateUser = async () => {

    const deactivateUserInfo = {
      'id': userInfo.id,
    }
    try {
      const response = await axios.delete("/api/v1/user/" + deactivateUserInfo.id,);
      if (response.status === 200) {
        dispatch(setCompleteDeactivateUserResult("저희 서비스를 사용해주셔서 감사합니다."));
        dispatch(setDeactivateUserAlert(false));
        dispatch(setCompleteDeactivateUserAlert(true));
        dispatch(setUserLoginAuth(false));
      } 
    } catch (error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setCompleteDeactivateUserResult("실패하였습니다. Contact Us로 문의바랍니다."));
        dispatch(setDeactivateUserAlert(false));
        dispatch(setCompleteDeactivateUserAlert(true));
      } else {
        console.log(error.response);
      }
    }

  }

  return { logOutButton, onClickChangePhoneButton, onClickChangePwButton, onClickDeactivateUser };
};
