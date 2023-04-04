import React from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import FindEmail from "./FindEmail";
import FindPw from "./FindPw";

function Main() {

    const navigate = useNavigate();

    return (
        <>

            <div className="main_box">

                <div className="main_title" onClick={()=>{ navigate('/') }}>
                    DX Platform
                </div>

                <div className="main_content">
                    <img src="/img/main.png" alt="img" className="main_img" />
                    <div className="main_line" />
                </div>
                

                <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/findemail" element={<FindEmail />} />
                        <Route path="/findpw" element={<FindPw />} />
                </Routes>
                
            </div>
        </>
    )
}

export default Main;