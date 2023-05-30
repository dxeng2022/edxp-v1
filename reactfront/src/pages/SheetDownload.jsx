import './SheetDownload.css';
import React  from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SheetDownload() {

  const navigate = useNavigate();

  const downloadButton = () => {
    if (window.confirm("시트 모듈 다운로드를 진행할까요?") === true){
      console.log("완료되었습니다.");
    } else {
      return false;      
    }
  }


  return (
    <div className="sheetdownload_box">


      <img src="/img/back.png" alt="img" className="sheetdownload_back" onClick={()=>{ navigate(-1) }} />
      <div className='sheetdownload_title'>시트 모듈 다운로드</div>


      <div className="sheetdownload_guidebox">


        <div className="sheetdownload_subtitle">최소/권장 사양</div>
        <div className="sheetdownload_specbox">
          <div className="sheetdownload_userinfobox">
            <div className="sheetdownload_userinfo1">
              <table className='sheetdownload_table'>
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

            <div className="sheetdownload_buttons">
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


        <div className="sheetdownload_subtitle">이용 가이드</div>
        <div className="sheetdownload_letterbox">
          <div className="sheetdownload_letter">1. 첫 번째 이용 가이드입니다.</div>
          <div className="sheetdownload_letter">2. 두 번째 이용 가이드입니다.</div>
          <div className="sheetdownload_letter">3. 세 번째 이용 가이드입니다.</div>
          <div className="sheetdownload_letter">4. 네 번째 이용 가이드입니다.</div>
          <div className="sheetdownload_letter">5. 다섯 번째 이용 가이드입니다.</div>
        </div>
        

        <div className="sheetdownload_subtitle">가이드 영상</div>
        <div className="sheetdownload_videobox">
          <iframe
            className='sheetdownload_video'
            src="https://www.youtube.com/embed/E_QpC7qieCU"
            title="WiseMeta-Play!로 메타버스 사용하기!" />
        </div>


      </div>


    </div>
  )
}

export default SheetDownload;