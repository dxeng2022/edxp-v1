import React from 'react';
import { Routes, Route } from "react-router-dom";
import SignPolicy from "./SignPolicy.jsx";
import SignUp from "./SignUp.jsx";
import SignDone from "./SignDone.jsx";

function Sign() {

    return (
        <>
            <div className="sign_box">
                <div className="sign_title">
                    DX Platform
                    <div className='sign_subtitle'>회원가입</div>
                </div>

                <Routes>
                    <Route path="/" element={<SignPolicy />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signup/done" element={<SignDone />} />
                </Routes>

            </div>
        </>
    )
}

export default Sign;