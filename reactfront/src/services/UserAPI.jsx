import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserName } from '../actions';

export default function UserAPI() {

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get("/api/v1/user/my-info");
        dispatch(setUserName(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserName();
    //eslint-disable-next-line
  }, []);


  const navigate = useNavigate();
  const logOutButton = async () => {
      try {
        const response = await axios.get("/logout");
        if (response.status === 200) {
          navigate("/");
        };
      } catch (error) {
        console.error(error);
      }
  };

  return { logOutButton };

};
