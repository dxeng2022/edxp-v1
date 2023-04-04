import './FindEmail.css';
import React, { useEffect, useState } from 'react'
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function FindEmail() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [birth, setBirth] = useState('');

    const [nameValid, setNameValid] = useState(false);
    const [phoneValid, setPhoneValid] = useState(false);
    const [birthValid, setBirthValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);

    const [resUser, setResUser] = useState({
        username: ""
    });

    useEffect(() => {
        if(nameValid && phoneValid && birthValid) {
        setNotAllow(false);
        return;
        }
        setNotAllow(true);
    }, [nameValid, phoneValid, birthValid]);

    const handleName = (e) => {
        setName(e.target.value);
        const regex = 
        /^[가-힣a-zA-Z]{2,20}$/;
        if (regex.test(e.target.value)) {
        setNameValid(true);
        } else {
        setNameValid(false);
        }
    };

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

    const handleBirth = (e) => {
        setBirth(e.target.value);
        if (e.target.value) {
        setBirthValid(true);
        } else {
        setBirthValid(false);
        }
    };
    
    const onClickConfirmButton = () => {

        const newBirth = birth.replace(/-/g, "")

        let details = {
            'name': name,
            'phone': phone,
            'birth' : newBirth
        };

        fetch("/find-mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(details)
        })
            .then(res => {
                console.log(1, res)
                if (res.status === 200) {
                    return res.json();
                } else if (res.status === 400) {
                    return null;
                }
            })
            .then(res => {
                console.log("정상", res);
                if (res !== null) {
                    setResUser(res);
                    alert('회원님의 이메일은' + JSON.stringify(res.username) + '입니다. ');
                } else {
                    alert(' 입력하신 정보와 일치한 Email이 없습니다. ');
                }})
    }

    return (
        <div className='findemail_box'>
            
            <div className='findemail_tab'>
                <div className='findemail_tabemail'>이메일 찾기</div>
                <div onClick={()=>{ navigate('/findpw') }}>비밀번호 찾기</div>
            </div>

            <div className="findemail_inputName">이름</div>
            <div className="findemail_inputbox">
                <input
                    autoFocus
                    className="findemail_input"
                    type="text"
                    placeholder=" 2글자 이상 입력해주세요. "
                    value={name}
                    onChange={handleName} />
            </div>
            <div className="findemail_errorMessageWrap">
            {!nameValid && name.length > 0 && (
                <div>올바른 이름을 입력해주세요.</div>
            )}
            </div>

            <div className="findemail_inputName">전화번호</div>
            <div className="findemail_inputbox">
                <input
                    className="findemail_input"
                    type="text"
                    placeholder=" '-' 을 제외한 10~11자리 입력해주세요. "
                    value={phone}
                    onChange={handlePhone} />
            </div>
            <div className="findemail_errorMessageWrap">
            {!phoneValid && phone.length > 0 && (
                <div>올바른 전화번호를 입력해주세요.</div>
            )}
            </div>

            <div className="findemail_inputName">생년월일</div>
            <div className="findemail_inputbox">
                <input
                    required
                    className="findemail_input"
                    type="date"
                    data-placeholder=" 우측 달력을 선택해주세요. "
                    min="1950-01-01"
                    max="2002-12-31"
                    value={birth}
                    onChange={handleBirth} />
            </div>

            <div className="findemail_buttons">
                <Button
                    onClick={()=>{ navigate('/') }} 
                    className="cancelButton"
                    type="submit" 
                    variant="contained"
                    sx={{
                        backgroundColor:'#a8a8a8', 
                        height: '4.5vh', 
                        width: '9vw', 
                        borderRadius: '10px',
                        fontSize: '1.6vw',
                        fontWeight: 600,
                        '&:hover': {backgroundColor: '#7e7e7e'}
                        }}>
                    취 소
                </Button>

                <Button
                    onClick={onClickConfirmButton}
                    disabled={notAllow}
                    className="nextButton"
                    type="submit" 
                    variant="contained" 
                    sx={{
                        backgroundColor:'#7ccc46', 
                        height: '4.5vh', 
                        width: '9vw',
                        borderRadius: '10px',
                        fontSize: '1.6vw',
                        fontWeight: '600',
                        '&:hover': {backgroundColor: '#7c9a67'}
                    }}>
                    다 음
                </Button>
            </div>
        </div>
    );
}

export default FindEmail;