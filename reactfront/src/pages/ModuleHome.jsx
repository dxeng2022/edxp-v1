import './ModuleHome.css';
import React, { useEffect, useState }  from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ModuleHome() {

  const navigate = useNavigate();

  return (
    <div className='modulehome_box'>

      <div className="modulehome_modulebox">
        <img src="/img/draw.png" alt="img" className="modulehome_img" />
        <div className='modulehome_name'>도 면</div>
          <div className="modulehome_list">
            <li className="modulehome_explain"> 도면 내 객체를 인식하여 디지털 도면으로 변환하는 기술입니다. </li>
            <li className="modulehome_explain"> 데이터를 업로드 및 관리 합니다. </li>
            <li className="modulehome_explain"> 도면 모듈을 다운로드합니다. </li>
          </div>
        <div className="modulehome_buttons">
          <Button
              onClick={()=>{ navigate('/module/draw') }} 
              type="submit" 
              variant="contained"
              sx={{
                height: '4.5vh', 
                width: '17vw', 
                borderRadius: '10px',
                fontSize: '1.4vw',
                fontWeight: '600',
                backgroundColor:'#12A3CC', 
                '&:hover': {backgroundColor: '#0F6983'}}}>
          이 동 하 기 >
          </Button>
        </div>
      </div>


      <div className="modulehome_modulebox">
        <img src="/img/sheet.png" alt="img" className="modulehome_img" />
        <div className='modulehome_name'>시 트</div>
        <div className="modulehome_list">
          <li className="modulehome_explain"> 시트 내 객체를 인식하여 디지털 시트으로 변환하는 기술입니다. </li>
          <li className="modulehome_explain"> 데이터를 업로드 및 관리 합니다. </li>
          <li className="modulehome_explain"> 시트 모듈을 다운로드합니다. </li>
        </div>
        <div className="modulehome_buttons">
          <Button
              onClick={()=>{ navigate('/module/sheet') }} 
              type="submit" 
              variant="contained"
              sx={{
                height: '4.5vh', 
                width: '17vw', 
                borderRadius: '10px',
                fontSize: '1.4vw',
                fontWeight: '600',
                backgroundColor:'#12A3CC', 
                '&:hover': {backgroundColor: '#0F6983'}}}>
          이 동 하 기 >
          </Button>
        </div>
      </div>


      <div className="modulehome_modulebox">
        <img src="/img/doc.png" alt="img" className="modulehome_img" />
        <div className='modulehome_name'>문 서</div>
        <div className="modulehome_list">
          <li className="modulehome_explain"> 문서 내 객체를 인식하여 디지털 문서으로 변환하는 기술입니다. </li>
          <li className="modulehome_explain"> 데이터를 업로드 및 관리 합니다. </li>
          <li className="modulehome_explain"> 문서 모듈을 다운로드합니다. </li>
        </div>
        <div className="modulehome_buttons">
          <Button
              onClick={()=>{ navigate('/module/doc') }} 
              type="submit" 
              variant="contained"
              sx={{
                height: '4.5vh', 
                width: '17vw', 
                borderRadius: '10px',
                fontSize: '1.4vw',
                fontWeight: '600',
                backgroundColor:'#12A3CC', 
                '&:hover': {backgroundColor: '#0F6983'}}}>
          이 동 하 기 >
          </Button>
        </div>
      </div>


    </div>
  )
}

export default ModuleHome;