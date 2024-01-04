import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { JSEncrypt } from "jsencrypt";
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginAlert, setUserLoginAuth } from '../actions';

export default function LoginAPI() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginEmail = useSelector(state => state.loginEmail);
  const loginPw = useSelector(state => state.loginPw);

  //eslint-disable-next-line
  const [keyRes, setKeyRes] = useState({"publicKeyModulus": '', "publicKeyExponent": '' });

  const onClickLoginButton = async () => {

    const rsa = new JSEncrypt();

    try {

      const res = await axios.get("public-key");
      const publicKeyModulus = res.data.result.publicKeyModulus;
      setKeyRes(res.data.result);

      rsa.setPublicKey(publicKeyModulus);
      const encPassword = rsa.encrypt(loginPw);

      const details = {
        "username": loginEmail,
        "password": encPassword,
      };

      const response = await axios.post("log", details, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      });

      if (response.status === 200) {
        dispatch(setUserLoginAuth(true));
        navigate('/module');
      } else {
      }
    } catch (error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setLoginAlert(true));
      } else {
        console.log(error.response);
      }
    }
  };


  return { onClickLoginButton };
}