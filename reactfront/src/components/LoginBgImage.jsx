import React from 'react';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';

export default function LoginBgImage() {

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

      <motion.img
        src="/main_text_1.png"
        alt="Text 1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute',
          top: '8vh',
          left: '2vw',
          minWidth: '500px',
          width: '40vw',
          height: 'auto',
          zIndex: 0
        }}
      />

      <motion.img
        src="/main_text_2.png"
        alt="Text 2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        style={{
          position: 'absolute',
          top: '15vh',
          left: '8vw', 
          minWidth: '600px',
          width: '50vw',
          height: 'auto',
          zIndex: 0
        }}
      />

    </Grid>
  );
}
