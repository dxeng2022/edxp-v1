import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import ModuleHome from "./ModuleHome.jsx";
import Draw from "./Draw.jsx";
import DrawDownload from "./DrawDownload.jsx";
import DrawCloud from "./DrawCloud.jsx";
import Sheet from "./Sheet.jsx";
import SheetDownload from "./SheetDownload.jsx";
import SheetCloud from "./SheetCloud.jsx";
import Doc from "./Doc.jsx";
import DocChoice from "./DocChoice.jsx";
import DocCloud from "./DocCloud.jsx";
import MyPage from "./MyPage.jsx";
import Administer from "./Administer";


function Module() {

    const navigate = useNavigate();


    const [response, setResponse] = useState({});

    useEffect(() => {
        fetch("/api/v1/user/my-info").then(res => res.json()).then(res => {
            setResponse(res);
        });
    }, []);


    const logOutButton = () => {

        fetch("/logout", {
            method: "GET",
        })
            .then(res => {
                console.log(1, res)
                if (res.status === 200) {
                    navigate("/");
                }
            })
    }

    return (
        <>

            <div className="module_title" onClick={() => {
                navigate('/module')
            }}>
                {/* <img src="/img/logo.png" alt="img" className="module_img" /> */}
                DX Platform
            </div>

            <div className="module_user">

                <div className="module_class">
                    <img src="/img/demo.png" alt="img" className="module_classimg" />
                </div>
                <div className="module_info">

                    <div className="module_name">{Object.keys(response).length !== 0 ? response.result.name : ""} 님</div>
                    <div className="module_move">

                        <div className="module_page" onClick={() => {
                            navigate('/module/mypage')
                        }}>마이페이지
                        </div>
                        <div
                            className="module_out"
                            onClick={logOutButton}
                        >
                            로그아웃
                        </div>

                    </div>

                </div>
            </div>


            <Routes>
                <Route path="/" element={<ModuleHome />} />
                <Route path="/draw" element={<Draw />} />
                <Route path="/draw/download" element={<DrawDownload />} />
                <Route path="/draw/cloud" element={<DrawCloud />} />
                <Route path="/sheet" element={<Sheet />} />
                <Route path="/sheet/download" element={<SheetDownload />} />
                <Route path="/sheet/cloud" element={<SheetCloud />} />
                <Route path="/doc" element={<Doc />} />
                <Route path="/doc/choice" element={<DocChoice />} />
                <Route path="/doc/cloud" element={<DocCloud />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/admin" element={<Administer />} />
            </Routes>

        </>
    )
}

export default Module;