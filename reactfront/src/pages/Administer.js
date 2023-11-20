import React from "react";
import ListBox from "../components/ListBox";
import TableBox from "../components/TableBox";
import "./Administer.css"

const Administer = () => {
    return <div className="admin__container">
        <div className="admin__list_box">
            <ListBox />
        </div>
        <div className="admin__table_box">
            <TableBox />
        </div>
    </div>;
};

export default Administer;