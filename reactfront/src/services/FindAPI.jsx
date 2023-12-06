import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setFindEmailAlert, setFindPwAlert, 
  setFindEmailResult, setFindPwResult, } from '../actions';


export default function FindAPI() {

  const dispatch = useDispatch();

  const findPwEmail = useSelector(state => state.findPwEmail);
  const findEmailName = useSelector(state => state.findEmailName);
  const findPwName = useSelector(state => state.findPwName);
  const findEmailPhone = useSelector(state => state.findEmailPhone);
  const findPwPhone = useSelector(state => state.findPwPhone);
  const findEmailBirth = useSelector(state => state.findEmailBirth);
  const findPwBirth = useSelector(state => state.findPwBirth);


  //email 찾기
  const onClickFindEmailButton = async () => {


    const findEmailInfo = {
      'name': findEmailName,
      'phone': findPwPhone,
      'birth': findEmailBirth,
    };
    
    try {
      const response = await axios.post('/api/v1/user/find-mail', findEmailInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (response.status === 200) {
        dispatch(setFindEmailResult('회원님의 이메일은 ' + JSON.stringify(response.data.result.username) + '입니다.'));
        dispatch(setFindEmailAlert(true));
      }
    } catch (error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setFindEmailResult('일치하는 정보가 없습니다.'));
        dispatch(setFindEmailAlert(true));
      } else {
        console.log(error.response);
      }
    }
  };
  //email 찾기


  //pw 찾기
  const onClickFindPwButton = async () => {

    const findPwInfo = {
      'username': findPwEmail,
      'name': findPwName,
      'phone': findEmailPhone,
      'birth': findPwBirth,
    };

    try {
      const response = await axios.post('/api/v1/user/find-pw', findPwInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })
      if (response.status === 200) {
        dispatch(setFindPwResult(' 회원님의 이메일로 임시비밀번호를 발송했습니다. '));
        dispatch(setFindPwAlert(true));
      }
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setFindPwResult('일치하는 정보가 없습니다.'));
        dispatch(setFindPwAlert(true));
      } else {
        console.log(error.response);
      }
    }
  };
  //pw 찾기

  
  return { onClickFindEmailButton, onClickFindPwButton };
}