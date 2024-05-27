import BrowserUpdatedOutlinedIcon from '@mui/icons-material/BrowserUpdatedOutlined';
import { Box, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setParserChangeButton, setRiskPDFPreview } from '../actions';
import DocVisualAPI from '../services/DocVisualAPI';

export default function DocVisualRiskLocalFile() {
  
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const { riskVisualLocalAPI } = DocVisualAPI();
  const [dragging, setDragging] = useState(false);

  function handleFileUpload(event) {
    event.preventDefault();
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension === "json") {
        const url = URL.createObjectURL(file);  // File 객체를 URL로 변환
        dispatch(setRiskPDFPreview(url));
        riskVisualLocalAPI(file);
        dispatch(setParserChangeButton(false));
      } else {
        alert("'.json' 확장자를 가진 파일만 업로드 가능합니다.");
      }
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(event) {
    handleFileUpload(event);
    setDragging(false);
  }

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: dragging ? '#CFD8DC' : '#BDBDBD',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        cursor: 'pointer',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept=".json"
      />
      <BrowserUpdatedOutlinedIcon sx={{ mb: 2, fontSize: 60, color: "#616161" }} />
      <Typography>로컬 파일 불러오기</Typography>
    </Box>
  );
}
