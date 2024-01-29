import axios from 'axios';
import { setUserNameInfo, setUserDialog, setCurrentPath } from '../actions';

const createAxiosConfig = (dispatch) => {
  const axiosInstance = axios.create({ });

  axiosInstance.interceptors.response.use(
    response => response, // 정상 응답에 대해서는 그대로 반환
    error => {
      if (error.response) {
        if (error.response.status === 401) {
          dispatch(setUserDialog(true));
          dispatch(setUserNameInfo(''));
          dispatch(setCurrentPath(''));
          // 여기서는 에러를 반환하지 않음
        } else {
          // 401이 아닌 다른 모든 에러에 대해서는 에러 반환
          return Promise.reject(error);
        }
      }
    }
  );

  return axiosInstance;
};

export default createAxiosConfig;