import './Draw.css';
import React from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Draw() {

  const navigate = useNavigate();

  return (
    <div className="draw_box">
      <img src="/img/back.png" alt="img" className="draw_back" onClick={() => { navigate(-1) }} />
      <div className="draw_imgbox">
        <img src="/img/draw.png" alt="img" className="draw_img" />
        <div className="draw_name">도 면</div>
      </div>
      <div className="draw_move">
        <div className="draw_down">
          <div className="draw_title">모듈 다운로드</div>
          <div className="draw_explainbox">
            <li className="draw_explain">도면 모듈을 다운로드합니다.</li>
            <li className="draw_explain">모듈의 기본 사용 방법을 알려드립니다.</li>
          </div>
          <div className="draw_buttons">
            <Button
              onClick={() => { navigate('/module/draw/download') }}
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#12A3CC',
                height: '4.5vh',
                width: '17vw',
                borderRadius: '10px',
                fontSize: '1.4vw',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#0F6983' }
              }}>
              이 동 하 기 {'>'}
            </Button>
          </div>
        </div>
        <div className="draw_data">
          <div className="draw_title">클라우드 데이터 관리</div>
          <div className="draw_explainbox">
            <li className="draw_explain">파일을 업로드 및 삭제할 수 있습니다.</li>
            <li className="draw_explain">업로드된 파일의 현황을 확인할 수 있습니다.</li>
          </div>
          <div className="draw_buttons">
            <Button
              onClick={() => { navigate('/module/draw/cloud') }}
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#12A3CC',
                height: '4.5vh',
                width: '17vw',
                borderRadius: '10px',
                fontSize: '1.4vw',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#0F6983' }
              }}>
              이 동 하 기 {'>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Draw;