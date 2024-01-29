import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginAuth, setUserNameInfo, setUserDialog, setCurrentPath } from '../actions';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UserAuthCheckAPI() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [pathName, setPathName] = useState(location.pathname);
  

  useEffect(() => {
    const userAuth = async () => {
      try {
        const response = await axios.get("/isLogin");
        if (response.status === 200) {
          dispatch(setUserLoginAuth(true));
        }
      } catch (error) {
        if (error.response && error.response.status !== 200) {
          dispatch(setUserDialog(true));
          dispatch(setUserNameInfo(''));
          dispatch(setCurrentPath(''));
        }
      }
    };
  
    const onLoad = () => {
      userAuth();
    };
  
    // window.addEventListener('load', onLoad);
  
    if (location.pathname !== pathName) {
      setPathName(location.pathname);
      userAuth();
    }
  
    return () => {
      window.removeEventListener('load', onLoad);
    };
  }, [location, pathName, dispatch, navigate]);

  return null;
}