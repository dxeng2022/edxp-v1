import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginAuth, setUserNameInfo } from '../actions';



export default function UserLoginCheckAPI() {

  const dispatch = useDispatch();

  useEffect(() => {
    const loginAuth = async () => {
      try {
        const response = await axios.get("/isLogin");
        if (response.status === 200) {
          try {
            const response = await axios.get("/api/v1/user/my-info");
            const userName = (response.data.result.name);
            dispatch(setUserNameInfo(userName));
          } catch (error) {
            console.error(error);
          }
          dispatch(setUserLoginAuth(true));
          window.location.href = `/module`;
        };
      } catch (error) {
        if (error.response && error.response.status !== 200) {
          dispatch(setUserLoginAuth(false));
        }
      }
    };
    loginAuth();
    //eslint-disable-next-line
  }, []);
}