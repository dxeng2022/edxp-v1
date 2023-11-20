import React from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import {Button} from "@mui/material";

const passwordReset = (id) => {
    console.log(id);

    if (window.confirm("비밀번호를 초기화 하시겠습니까?") === true){
        fetch("/admin/v1/user/" + id, {
            method: "PUT",
            body: ""
        })
            .then(res => {
                console.log(1, res)
                if (res.status === 200) {
                    alert("초기화가 완료되었습니다.");
                } else {
                    alert("초기화에 실패하였습니다.");
                }
            })
    }
}

const userDelete = (id) => {
    if (window.confirm("탈퇴처리를 진행 하시겠습니까?") === true){
        fetch("/admin/v1/user/" + id, {
            method: "DELETE",
            body: ""
        })
            .then(res => {
                console.log(1, res)
                if (res.status === 200) {
                    alert("탈퇴처리가 완료되었습니다.");
                    window.location.replace("/module/admin");
                } else {
                    alert("탈퇴처리에 실패하였습니다.");
                }
            })
    }
}

const gridStyle = {
    borderRadius: "3px",
    fontSize: "14px",
    width: "100%",
    height: "100%"
}

const columns = [
    { name: 'role', header: '등급', defaultFlex: 0.7,
        render: () =>
            <div
                className={"grade-badge"}
            >
                <p>D</p>
            </div>
    },
    { name: 'id', header: 'No', defaultFlex: 0.7 },
    { name: 'name', header: '이름', defaultFlex: 1 },
    { name: 'username', header: 'E-Mail', defaultFlex: 1.5 },
    { name: 'registeredAtFormed', header: '가입날짜', defaultFlex: 1.3 },
    {
        header: '비밀번호 관리', defaultFlex: 0,
        render: ({data}) =>
            <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: '#969696',
                    height: '23px',
                    width: '5px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#636363' }
                }}
                onClick={() => passwordReset(data.id)}
            >
                초기화
            </Button>
    },
    {
        header: '탈퇴 관리', defaultFlex: 0,
        render: ({data}) =>
            <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: '#ED073C',
                    height: '23px',
                    width: '8px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#A6052A' }
                }}
                onClick={() => userDelete(data.id)}
            >
                탈 퇴
            </Button>
    },
]

export default ({data}) => <ReactDataGrid
    idProperty="id"
    columns={columns}
    dataSource={data}
    style={gridStyle}
/>