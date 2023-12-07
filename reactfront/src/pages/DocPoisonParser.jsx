import './DocPoisonParser.css';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Grid, Tab, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField } from "@mui/material";


function DocPoisonParser({ selectedFile, fileName, parserJson, updateLabelJson }) {
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [progress, setProgress] = useState(0);
  const [editingRows, setEditingRows] = useState([]);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  //python 모델로 보내기
  const python = async (event) => {
    event.preventDefault();

    let data = {
      'fileName': fileName,
    }

    setIsLoading(true); // 요청 시작 전에 로딩 상태를 true로 설정
  
    try {
      const response = await fetch("/api/v1/doc/analysis", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(data),
      });
  
      if (response.status === 200) {
        const data = await response.json();
        const resultArray = data.result;
        updateLabelJson(resultArray);
        navigate('/module/doc/poison/label');
      }
  
  
    } catch(err) {
        console.error(err);
    }
    setIsLoading(false); // 요청 완료 후에 로딩 상태를 false로 설정
  };
  //python 모델로 보내기

  // 행 편집 중 인지 확인하고 상태 업데이터 함수  얘도 문제인듯
  const isRowEditing = (index) => {
    return editingRows.includes(index);
  };
  // 행 편집 중 인지 확인하고 상태 업데이터 함수


  // 로딩 가상 시간
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        const newProgress = oldProgress + Math.random() * 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 500);
  
    return () => {
      clearInterval(timer);
    };
  }, []);
  // 로딩 가상 시간

  return (
    <div className="docpoisonparser_box">
      {isLoading ? (
        <div className='docpoisonupload_circularprogress'>
          <CircularProgress />
          <p>잠시만 기다려주세요... 예상 남은 시간: {Math.round((100 - progress) / progress * 5)}초</p>
        </div>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Document file={selectedFile}>
                <Page pageNumber={1} />
              </Document>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className='docpoisonparser_table'>
                <TableContainer>
                  <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "50px" }}>INDEX</TableCell>
                          <TableCell style={{ width: "50px" }}>PAGE</TableCell>
                          <TableCell style={{ width: "50px" }}>SECTION</TableCell>
                          <TableCell>SENTENCE</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody> 
                        {parserJson.map((row) => (
                          <TableRow key={row.INDEX}>
                            <TableCell>
                              <TextField
                                value={row.INDEX}
                                InputProps={{
                                  readOnly: !isRowEditing(row.INDEX),
                                  style: {
                                    fontSize: "13px",
                                  },
                                }}
                                />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={row.PAGE}
                                InputProps={{
                                  readOnly: !isRowEditing(row.INDEX),
                                  style: {
                                    fontSize: "13px",
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={row.SECTION}
                                InputProps={{
                                  readOnly: !isRowEditing(row.INDEX),
                                  style: {
                                    fontSize: "13px",
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={row.SENTENCE}
                                // multiline
                                // minRows={1}
                                // maxRows={4}
                                InputProps={{
                                  readOnly: !isRowEditing(row.INDEX),
                                  style: {
                                    fontSize: "13px",
                                    width: "250px",
                                  },
                                }}
                              />
                            </TableCell>              
                          </TableRow>))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell align="right">
                            <div className='docpoisonparser_python'>
                              <Button 
                                variant="contained"
                                onClick={python}>
                                독소조항 분석
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>

        </>
      )}
    </div>
  );
}

export default DocPoisonParser;