import createAxiosConfig from './AxiosConfig';
import { setAdministratorInfo, setPasswordResetAlert, setUserDeleteAlert } from '../actions';
import { useDispatch } from 'react-redux';

export default function AdministratorListAPI() {

  const dispatch = useDispatch();
  const axiosConfig = createAxiosConfig(dispatch);

  const administratorInfo = async () => {
    try {
      const response= await axiosConfig.get('/admin/v1/user')

      if(response.status === 200) {
        dispatch(setAdministratorInfo(response.data.result));
      }
    } catch(error) {
      console.error(error);
    }
  };

  const passwordReset = async (id) => {
    try {
      const response = await axiosConfig.put('/admin/v1/user/' + id);

      if (response.status === 200) {
        dispatch(setPasswordResetAlert(false));
        alert("초기화가 완료되었습니다.");
      } else {
        alert("초기화에 실패하였습니다.");
      }
    } catch(error) {
      console.error(error);
    }
  };

  const userDelete = async (id) => {
    try {
      const response = await axiosConfig.delete('/admin/v1/user/' + id);

      if (response.status === 200) {
        dispatch(setUserDeleteAlert(false));
        alert("탈퇴처리가 완료되었습니다.\n회원 정보 탭을 눌러 최신화해주세요.");
        window.location.replace("/module/admin");
      } else {
        alert("탈퇴처리에 실패하였습니다.");
      }
    } catch(error) {
      console.error(error);
    }
  };
  

  return { administratorInfo, passwordReset, userDelete }
}