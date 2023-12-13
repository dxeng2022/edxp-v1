import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Grid, Paper, CssBaseline } from '@mui/material';

import Login from "../components/Login.jsx";
import Find from "../components/Find.jsx";
import SignPolicy from "../components/SignPolicy.jsx";
import SignUp from "../components/SignUp.jsx";
import Footer from "../components/Footer.jsx"



export default function Main() {

  return (
    <Grid container sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(/main.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: t => t.palette.grey[50],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ display: 'flex', flexDirection: 'column' }}>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/find" element={<Find />} />
          <Route path="/signpolicy" element={<SignPolicy />} />
          <Route path="/signpolicy/signup" element={<SignUp />} />
        </Routes>

        <Footer/>

      </Grid>
    </Grid>
  );
}