import {Paper} from "@mui/material";
import React, {useEffect, useState} from "react";
import DataGrid from "./DataGrid";

const TableBox = () => {
    const [user, setUser] = useState([]);
    const [check, setCheck] = useState([]);

    const getInfo = () => {
        fetch("/admin/v1/user").then(res => res.json()).then(res => {
            setUser(res.result);
        });
    }

    useEffect(() => {
        getInfo();
    }, []);

    return <Paper
        elevation={8}
        sx={{
            position: "relative",
            width: "78vw",
            height: "74vh",
            borderRadius: "27px",
            backgroundColor: "#fcfcfc",
        }}
    >
        <div className={"data-box"}>
            <div className="data-title">
                <p>회원 관리</p>
            </div>
            <div className="data-grid">
                <DataGrid data={user} check={check} setCheck={setCheck}></DataGrid>
            </div>
        </div>
    </Paper>;
};

export default TableBox;