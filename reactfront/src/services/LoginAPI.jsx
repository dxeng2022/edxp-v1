import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { JSEncrypt } from "jsencrypt";
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginAlert } from '../actions';

export default function LoginAPI() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = useSelector(state => state.email);
  const pw = useSelector(state => state.pw);

  //eslint-disable-next-line
  const [keyRes, setKeyRes] = useState({"publicKeyModulus": '', "publicKeyExponent": '' });

  const onClickLoginButton = async () => {

    const rsa = new JSEncrypt();

    try {

      const res = await axios.get("public-key");
      const publicKeyModulus = res.data.result.publicKeyModulus;
      setKeyRes(res.data.result);

      rsa.setPublicKey(publicKeyModulus);
      const encPassword = rsa.encrypt(pw);

      const details = {
        "username": email,
        "password": encPassword,
      };

      const response = await axios.post("log", details, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      });

      if (response.status === 200) {
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