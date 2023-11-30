import './DocPoisonLabel.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField } from "@mui/material";


function DocPoisonLabel({ labelJson }) {

  const navigate = useNavigate();
  const [editingRows, setEditingRows] = useState([]);

  // 행 편집 중 인지 확인하고 상태 업데이터 함수  얘도 문제인듯
  const isRowEditing = (index) => {
    return editingRows.includes(index);
  };
  // 행 편집 중 인지 확인하고 상태 업데이터 함수

  return (
    <div className="docpoisonlabel_box">

      <TableContainer>
        <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "50px" }}>INDEX</TableCell>
                <TableCell style={{ width: "50px" }}>PAGE</TableCell>
                <TableCell style={{ width: "50px" }}>SECTION</TableCell>
                <TableCell>SENTENCE</TableCell>
                <TableCell style={{ width: "70px" }}>LABEL</TableCell>
              </TableRow>
            </TableHead>

            <TableBody> 
              {labelJson.map((row) => (
                <TableRow key={row.INDEX}>
                  <TableCell>{row.INDEX}</TableCell>
                  <TableCell>{row.PAGE}</TableCell>
                  <TableCell>{row.SECTION}</TableCell>
                  <TableCell
                    style={{ maxWidth: "300px", whiteSpace: 'normal', wordBreak: 'break-all' }}
                  >{row.SENTENCE}</TableCell> 
                  <TableCell>
                    <TextField
                      value={row.LABEL ? 'True' : 'False'}
                      InputProps={{
                        readOnly: !isRowEditing(row.INDEX),
                        style: {
                          fontSize: "13px",
                        },
                      }}
                    />
                  </TableCell>             
                </TableRow>)
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>
                  <Button 
                    variant="contained"
                  >
                    결과 저장
                  </Button>
                  <Button 
                    variant="contained"
                  >
                    시각화
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
        </Table>
      </TableContainer>

    </div>
  );
}

export default DocPoisonLabel;