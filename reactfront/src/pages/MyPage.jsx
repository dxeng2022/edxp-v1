import './MyPage.css';
import React, { useEffect, useState }  from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


function genderConverter(gender) {
  switch (gender) {
    case 'M':
      return '남성';
    case 'F':
      return '여성';
    default:
      return 'unknown';
  }
}


function MyPage() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [pw, setPw] = useState('');
  const [pw_confirm, setPw_confirm] = useState('');

  const [phoneValid, setPhoneValid] = useState(false);
  const [currentPwValid, setCurrentPwValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [pw_confirmValid, setPw_confirmValid] = useState(false);

  const [complete, setComplete] = useState(true);

  const [notAllow, setNotAllow] = useState(true);

  const [phoneChanged, setPhoneChanged] = useState(false);

  const [response, setResponse] = useState({});

  const [user, setUser] = useState({});

  const newbirth = user.birth?.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

  const newphone = user.phone?.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
  
  
  useEffect(() => {
    fetch("/api/v1/user/my-info").then(res => res.json()).then(res => {
      setResponse(res);
      setUser(res.result);
    });
    
  }, [phoneChanged]);

  useEffect(() => {
    if(phoneValid === true) {
    setNotAllow(false);
    return;
    }
    setNotAllow(true);
  }, [phoneValid]);

  useEffect(() => {
    if(pw_confirm === pw) {
    setPw_confirmValid(true);
    } else {
    setPw_confirmValid(false);
    }
  }, [pw_confirm, pw])

  useEffect(() => {
    if(currentPwValid && pwValid && pw_confirmValid ) {
    setComplete(false);
    return;
    }
    setComplete(true);
  }, [currentPwValid, pwValid, pw_confirmValid]);

  const handlePhone = (e) => {
    setPhone(e.target.value);
    const regex = 
    /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    if (regex.test(e.target.value)) {
    setPhoneValid(true);
    } else {
    setPhoneValid(false);
    }
  };

  const handleCurrentPw = (e) => {
    setCurrentPw(e.target.value);
    const regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if (regex.test(e.target.value)) {
    // if (e.target.value) {
    setCurrentPwValid(true);
    } else {
    setCurrentPwValid(false);
    }
  };

  const handlePw = (e) => {
    setPw(e.target.value);
    const regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if (regex.test(e.target.value)) {
    // if (e.target.value) {
    setPwValid(true);
    } else {
    setPwValid(false);
    }
  };

  const handlePw_confirm = (e) => {
    setPw_confirm(e.target.value);
  };


  const changePwButton = () => {

    let details = {
      'id': response.result.id,
      'prePassword': currentPw,
      'newPassword' : pw_confirm
    };

    if (currentPw === pw_confirm) {
      alert("현재 비밀번호와 같습니다.\n현재 비밀번호와 다른 비밀번호를 입력해주세요.")
    } else {

      fetch("/api/v1/user/" + details.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(details)
      })
      .then(res => {
        console.log(1, res)
        if (res.status === 200) {
          fetch("/logout", {
            method: "GET",
          })
          .then(res => {
            console.log(1, res)
            const form = res.url.substring(res.url.lastIndexOf(":"));
            const url = form.slice(form.indexOf("/"));
            if (res.status === 200) {
              navigate(url);
            }
          })
          alert("비밀번호 수정이 완료되었습니다.\n다시 로그인해주세요.");
        } else {
          alert("Contact Us로 문의바랍니다.");
        }
      })

    }
  }

  const changePhoneButton = () => {

    let details = {
      'id': response.result.id,
      'phone': phone
    };
    
    if (response.result.phone === phone) {
      alert("현재 전화번호와 같습니다.\n현재 전화번호와 다른 전화번호를 입력해주세요.")
    } else {

      fetch("/api/v1/user/" + details.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(details)
      })
      .then(res => {
        console.log(1, res)
        if (res.status === 200) {
          alert("전화번호 변경이 완료되었습니다.");
          setPhoneChanged(!phoneChanged);
        } else {
          alert("Contact Us로 문의바랍니다.");
        }
      })

    }

  }

  const outButton = () => {

    let details = {
      'id': response.result.id,
    };

    if (window.confirm("정말 회원 탈퇴를 하시겠습니까?") === true){
      
      fetch("/api/v1/user/" + details.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: ""
      })
      .then(res => {
        console.log(1, res)
        if (res.status === 200) {
          fetch("/logout", {
            method: "GET",
          })
          .then(res => {
            console.log(1, res)
            const form = res.url.substring(res.url.lastIndexOf(":"));
            const url = form.slice(form.indexOf("/"));
            if (res.status === 200) {
              navigate(url);
            }
          })
          alert("저희 서비스를 사용해주셔서 감사합니다.");
        } else {
          alert("Contact Us로 문의바랍니다.");
        }
      })

    }
    return false;
  }


  return (
    <div className="mypage_box">

      <img src="/img/back.png" alt="img" className="mypage_back" onClick={()=>{ navigate(-1) }} />
      <div className='mypage_title'>마이페이지</div>

      <div className="mypage_userbox">
        <div className="mypage_subtitle">회원 정보</div>
        <div className="mypage_infobox">
          <div className="mypage_class">
            <img src="/img/demo_img.png" alt="img" className="mypage_img" />
            <div className="mypage_name">현재 등급</div>
          </div>
          <div className="mypage_userinfobox">
            <div className="mypage_userinfo1">
              <ul className="mypage_userinfo">이메일 : {user.username}</ul>
              <ul className="mypage_userinfo">생년월일 : {newbirth}</ul>
              <ul className="mypage_userinf">전화번호 : {newphone}</ul>
            </div>
            <div className="mypage_userinfo2">
              <ul className="mypage_userinfo">이름 : {user.name}</ul>
              <ul className="mypage_userinfo">성별 : {genderConverter(user.gender)}</ul>
              <ul className="mypage_userinfo">소속 : {user.organization}</ul>
              <ul className="mypage_userinf">직책 : {user.job}</ul>
            </div>
          </div>
        </div>
        <div className="mypage_classinfo">* Demo가 아닌 다른 등급을 사용하기 위해서는 Contact Us로 문의 바랍니다. </div>


        <div className="mypage_subtitle2">정보 수정</div>
        <div className="mypage_changebox">

          <div className="mypage_changepw">

            <div className="mypage_pwbox">
              <div className="mypage_inputName">현재 비밀번호</div>
                <div className="mypage_inputbox">
                  <form>
                    <input
                      className="mypage_input"
                      type="password"
                      placeholder=" 영문,숫자,특수문자를 포함 8자이상 "
                      value={currentPw}
                      onChange={handleCurrentPw}
                      autoComplete="off"
                      />
                  </form>
                </div>
                <div className="signup_errorMessageWrap">
                {!currentPwValid && currentPw.length > 0 && (
                    <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                )}
                </div>
            </div>

            <div className="mypage_pwbox">
              <div className="mypage_inputName">변경할 비밀번호</div>
                <div className="mypage_inputbox">
                  <form>
                    <input
                      className="mypage_input"
                      type="password"
                      placeholder=" 영문,숫자,특수문자를 포함 8자이상 "
                      value={pw}
                      onChange={handlePw}
                      autoComplete="off"
                      />
                  </form>
                </div>
                <div className="signup_errorMessageWrap">
                {!pwValid && pw.length > 0 && (
                <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                )}
                </div>
            </div>

            <div className="mypage_confirmpwbox">
              <div className='mypage_inputpw'>
                <div className="mypage_inputName">변경할 비밀번호 확인</div>
                  <div className="mypage_inputbox">
                    <form>
                      <input
                        className="mypage_input"
                        type="password"
                        placeholder=" 비밀번호를 한번 더 입력해주세요. "
                        value={pw_confirm}
                        onChange={handlePw_confirm}
                        autoComplete="off"
                        />
                    </form>
                  </div>
                  <div className="signup_errorMessageWrap">
                  {!pw_confirmValid && pw_confirm.length > 0 && (
                  <div> 위 비밀번호와 똑같이 입력해주세요. </div>
                  )}
                  </div>
              </div>
              
              <div className="mypage_button">
                <Button
                  disabled= {complete}
                  onClick={changePwButton}
                  type="submit" 
                  variant="contained"
                  sx={{
                    backgroundColor:'#7ccc46', 
                    height: '4.5vh', 
                    width: '4vw', 
                    borderRadius: '10px',
                    fontSize: '1vw',
                    fontWeight: 600,
                    '&:hover': {backgroundColor: '#7c9a67'}}}>
                  변경
                </Button>
              </div>
            </div>


          </div>

          <div className="mypage_changenum">

            <div className='mypage_inputnum'>
              <div className="mypage_inputName">변경할 전화번호</div>
                <div className="mypage_inputbox">
                  <input
                    className="mypage_input"
                    type="text"
                    placeholder=" '-' 을 제외한 10~11자리 입력해주세요. "
                    value={phone}
                    onChange={handlePhone}
                    />
                </div>
                <div className="mypage_errorMessageWrap">
                {!phoneValid && phone.length > 0 && (
                <div>올바른 전화번호를 입력해주세요.</div>
                )}
                </div>
            </div>
            
            <div className="mypage_button">
              <Button
                disabled={notAllow}
                onClick={changePhoneButton}
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor:'#7ccc46', 
                    height: '4.5vh', 
                    width: '4vw', 
                    borderRadius: '10px',
                    fontSize: '1vw',
                    fontWeight: 600,
                    '&:hover': {backgroundColor: '#7c9a67'}}}>
                변경
              </Button>
            </div>


          </div>
        </div>
        <div className="mypage_out" onClick={outButton}>회원 탈퇴</div>
      </div>

        


    </div>
  )
}

export default MyPage;