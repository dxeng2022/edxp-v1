import './Doc.css';
import React from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Doc() {

  const navigate = useNavigate();

  return (
    <div className="doc_box">
      <img src="/img/back.png" alt="img" className="doc_back" onClick={()=>{ navigate(-1) }} />
      <div className="doc_imgbox">
        <img src="/img/doc.png" alt="img" className="doc_img" />
        <div className="doc_name">문 서</div>
      </div>
      <div className="doc_move">
        <div className="doc_down">
          <div className="doc_title">타공정 모듈</div>
          <div className="doc_explainbox">
            <li className="doc_explain">타공정 모듈을 실행합니다.</li>
            <li className="doc_explain">타공정 문서를 비교 할 수 있습니다.</li>
          </div>
          <div className="doc_buttons">
            <Button
              onClick={()=>{ navigate('/module/doc/visual') }} 
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
        <div className="doc_data">
          <div className="doc_title">독소조항 모듈</div>
          <div className="doc_explainbox">
            <li className="doc_explain">독소조항 모듈을 실행합니다.</li>
            <li className="doc_explain">ITB 문서의 독소조항을 찾을 수 있습니다.</li>
          </div>
          <div className="doc_buttons">
            <Button
              onClick={()=>{ navigate('/module/doc/poison') }} 
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

export default Doc;