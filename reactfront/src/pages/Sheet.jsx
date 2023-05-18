import './Sheet.css';
import React from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Sheet() {

  const navigate = useNavigate();

  return (
    <div className="sheet_box">
      <img src="/img/back.png" alt="img" className="sheet_back" onClick={()=>{ navigate(-1) }} />
      <div className="sheet_imgbox">
        <img src="/img/sheet.png" alt="img" className="sheet_img" />
        <div className="sheet_name">시 트</div>
      </div>
      <div className="sheet_move">
        <div className="sheet_down">
          <div className="sheet_title">모듈 다운로드</div>
          <div className="sheet_explainbox">
            <li className="sheet_explain">시트 모듈을 다운로드합니다.</li>
            <li className="sheet_explain">모듈의 기본 사용 방법을 알려드립니다.</li>
          </div>
          <div className="sheet_buttons">
            <Button
              onClick={()=>{ navigate('/module/sheet/download') }} 
              type="submit" 
              variant="contained"
              sx={{
                  backgroundColor:'#12A3CC', 
                  height: '4.5vh', 
                  width: '17vw', 
                  borderRadius: '10px',
                  fontSize: '1.4vw',
                  fontWeight: 600,
                  '&:hover': {backgroundColor: '#0F6983'}}}>
            이 동 하 기 {'>'}
            </Button>
          </div>
        </div>
        <div className="sheet_data">
          <div className="sheet_title">클라우드 데이터 관리</div>
          <div className="sheet_explainbox">
            <li className="sheet_explain">파일을 업로드 및 삭제할 수 있습니다.</li>
            <li className="sheet_explain">업로드된 파일의 현황을 확인할 수 있습니다.</li>
          </div>
          <div className="sheet_buttons">
            <Button
              onClick={()=>{ navigate(-1) }} 
              type="submit" 
              variant="contained"
              sx={{
                  backgroundColor:'#12A3CC', 
                  height: '4.5vh', 
                  width: '17vw', 
                  borderRadius: '10px',
                  fontSize: '1.4vw',
                  fontWeight: 600,
                  '&:hover': {backgroundColor: '#0F6983'}}}>
            이 동 하 기 {'>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sheet;