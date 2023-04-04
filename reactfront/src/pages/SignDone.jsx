import './SignDone.css';
import React  from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SignDone() {
  
  const navigate = useNavigate();

  return (
    <div className='signdone_box'>

      <div className="signdone_imgbox">
        <img src="/img/done.png" alt="img" className="signdone_img" />
      </div>

      <div className="signdone_con">
        가입이 완료되었습니다.
      </div>

      <div className="signdone_home">
        다음 화면에서 로그인을 진행해주세요.
      </div>

      <div className="signdone_buttons">
        <Button
            onClick={()=>{ navigate('/') }} 
            type="submit" 
            variant="contained"
            sx={{
                backgroundColor:'#7ccc46', 
                height: '4.5vh', 
                width: '9vw', 
                borderRadius: '10px',
                fontSize: '1.6vw',
                fontWeight: '600',
                '&:hover': {backgroundColor: '#7c9a67'}}}>
        확 인
        </Button>
      </div>

    </div>
  )
}

export default SignDone;