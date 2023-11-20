import React from "react";
import {Paper} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const ListBox = () => {
    return <Paper
        elevation={8}
        sx={{
            position: "relative",
            width: "17vw",
            height: "74vh",
            borderRadius: "27px",
            backgroundColor: "#fcfcfc",
        }}
    >
        <div className="user-manage">
            <p>회원관리</p>
            <div className="side_bar"></div>
            <div className="user-manage__list">
                <ul>
                    <li>
                        <div className={"list__icon"}>
                            <PeopleAltIcon sx={{
                                marginTop: "3px",
                                marginRight: "8px",
                                color: "#2A71ED",
                                fontSize: "23px",
                            }}/>
                        </div>
                        <div>
                            <span>회원정보</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div className="file-manage">
            <p>파일관리</p>
            <div className="side_bar"></div>
            <div className="file-manage__list">
                <ul>
                    <li>
                        <div className={"list__icon"}>
                            <FolderIcon sx={{
                                marginTop: "3px",
                                marginRight: "8px",
                                color: "#F0CD48",
                                fontSize: "23px"
                            }}/>
                        </div>
                        <div>
                            <span>도면</span>
                        </div>
                    </li>
                    <li>
                        <div className={"list__icon"}>
                            <FolderIcon
                                sx={{
                                marginTop: "3px",
                                marginRight: "8px",
                                color: "#F0CD48",
                                fontSize: "23px"
                            }}/>
                        </div>
                        <div>
                            <span>시트</span>
                        </div>
                    </li>
                    <li>
                        <div className={"list__icon"}>
                            <FolderIcon
                                sx={{
                                marginTop: "3px",
                                marginRight: "8px",
                                color: "#F0CD48",
                                fontSize: "23px"
                            }}/>
                        </div>
                        <div>
                            <span>문서</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </Paper>;
};

export default ListBox;