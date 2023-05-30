import './DrawDownload.css';
import React  from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function DrawDownload() {

  const navigate = useNavigate();

  const downloadButton = () => {
    if (window.confirm("도면 모듈 다운로드를 진행할까요?") === true){
      console.log("완료되었습니다.");
    } else {
      return false;      
    }
  }


  return (
    <div className="drawdownload_box">


      <img src="/img/back.png" alt="img" className="drawdownload_back" onClick={()=>{ navigate(-1) }} />
      <div className='drawdownload_title'>도면 모듈 다운로드</div>


      <div className="drawdownload_guidebox">


        <div className="drawdownload_subtitle">최소/권장 사양</div>
        <div className="drawdownload_specbox">
          <div className="drawdownload_userinfobox">
            <div className="drawdownload_userinfo1">
              <table className='drawdownload_table'>
                <thead>
                  <tr>
                    <th>항 목</th><th>최소사양</th><th>권장사양</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>OS</td><td>WINDOW 10</td><td>WINDOW 10</td>
                  </tr>
                  <tr>
                    <td>CPU</td><td>INTEL I5 9세대</td><td>INTEL I7 8세대</td>
                  </tr>
                  <tr>
                    <td>RAM</td><td>4G</td><td>8G</td>
                  </tr>
                  <tr>
                    <td>DISK</td><td>10GB</td><td>15GB</td>
                  </tr>
                  <tr>
                    <td>GRAPHIC</td><td>GT450</td><td>GTX1050</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="drawdownload_buttons">
              <Button
                  onClick={downloadButton} 
                  type="submit" 
                  variant="contained"
                  sx={{
                      backgroundColor:'#12A3CC', 
                      height: '11vh', 
                      width: '20vw', 
                      borderRadius: '10px',
                      fontSize: '1.4vw',
                      fontWeight: 600,
                      '&:hover': {backgroundColor: '#0F6983'}}}>
              다 운 로 드 {'>'}
              </Button>
            </div>
          </div>
        </div>


        <div className="drawdownload_subtitle">이용 가이드</div>
        <div className="drawdownload_letterbox">
          <div className="drawdownload_letter">1. 첫 번째 이용 가이드입니다.</div>
          <div className="drawdownload_letter">2. 두 번째 이용 가이드입니다.</div>
          <div className="drawdownload_letter">3. 세 번째 이용 가이드입니다.</div>
          <div className="drawdownload_letter">4. 네 번째 이용 가이드입니다.</div>
          <div className="drawdownload_letter">5. 다섯 번째 이용 가이드입니다.</div>
        </div>
        

        <div className="drawdownload_subtitle">가이드 영상</div>
        <div className="drawdownload_videobox">
          <iframe
            className='drawdownload_video'
            src="https://www.youtube.com/embed/E_QpC7qieCU"
            title="WiseMeta-Play!로 메타버스 사용하기!" />
        </div>


      </div>


    </div>
  )
}

export default DrawDownload;