import { Button, CircularProgress, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import './DocPoisonUpload.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DocPoisonUpload( { updateSelectedFile, updateFileName, updateParserJson } ) {

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(); //파일 불러오기
  const [fileInfo, setFileInfo] = useState({ name: '', size: 0, extension: '' }); //파일 정보
  const [fileName, setFileName] = useState(''); //응답 받은 filename 저장
  const [parserJson, setParserJson] = useState(''); //응답받은 json 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    updateSelectedFile(file); // 추가

    const fileNameParts = file.name.split('.');
    setFileInfo({
      name: fileNameParts.slice(0, -1).join('.'), // 확장자 제외한 파일 이름
      size: file.size,
      extension: fileNameParts.pop(), // 확장자
    });
  };

  const handleButtonParser = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true); // 요청 시작 전에 로딩 상태를 true로 설정

    try {
      const response = await fetch('/api/v1/doc/parser', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();
        
        const contentDisposition = response.headers.get('Content-Disposition');
    
        let extractedFileName = '';
    
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            let matches = filenameRegex.exec(contentDisposition);
            
            if (matches != null && matches[1]) { 
              extractedFileName = matches[1].replace(/['"]/g, '');
            }
        }
  
        setFileName(extractedFileName); // 추출한 파일 이름 저장
        updateFileName(extractedFileName); // 추가
        setParserJson(data);
        updateParserJson(data); // 추가
        navigate('/module/doc/poison/parser');
      }
      
    } catch (error) {
      console.error('Error during API call', error);
    }
    
    setIsLoading(false); // 요청 완료 후에 로딩 상태를 false로 설정
  };

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

  return (
    <div className='docposionupload_box'>
      {isLoading ? (
        <div className='docpoisonupload_circularprogress'>
          <CircularProgress />
          <p>잠시만 기다려주세요... 예상 남은 시간: {Math.round((100 - progress) / progress * 5)}초</p>
        </div>
      ) : (
        <>
          <h1 className="docposionupload_title">
            파일 불러오기
          </h1>

          <div className='docposionupload_table'>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">파일 이름</TableCell>
                    <TableCell align="center">확장자</TableCell>
                    <TableCell align="center">파일 용량</TableCell>
                  </TableRow>
                </TableHead>

                
                <TableBody>
                  <TableRow key={fileInfo.name}>
                    <TableCell align="center">{fileInfo.name}</TableCell>
                    <TableCell align="center">{fileInfo.extension}</TableCell> 
                    <TableCell align="center">{fileInfo.size ? (fileInfo.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}</TableCell>
                  </TableRow>
                </TableBody>
                
              </Table> 
            </TableContainer>   
            <div className='docposionupload_upload'>
              <Button variant="contained" component="label">
                불러오기
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </div>
          </div>

          <div className='docposionupload_buttons'>
            {selectedFile && (
              <>
                <Button variant="contained" onClick={handleButtonParser}>PDF 인식 실행</Button>
                <Button variant="contained">독소조항 재분석</Button>
                <Button variant="contained">결과 파일 수정</Button>
              </>
            )}
          </div>
        </>
      )}

    </div>
  );
}

export default DocPoisonUpload;