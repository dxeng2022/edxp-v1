import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import "./LoginBgImage.css"

export default function LoginBgImage() {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText1(true), 500);
    const timer2 = setTimeout(() => setShowText2(true), 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <Grid item xs={false} sm={4} md={7}
      sx={{
        position: 'relative',
        backgroundImage: 'url(/main.png)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: t => t.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CSSTransition
        in={showText1}
        timeout={500}
        classNames="text"
        unmountOnExit
      >
        <img src="/main_text_1.png" alt="Text 1" className="text1" />
      </CSSTransition>

      <CSSTransition
        in={showText2}
        timeout={500}
        classNames="text"
        unmountOnExit
      >
        <img src="/main_text_2.png" alt="Text 2" className="text2" />
      </CSSTransition>

    </Grid>
  );
}
