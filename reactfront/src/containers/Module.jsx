import React, { useState } from 'react';
import { Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, Grid } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import DrawerContent from '../components/DrawerContent.jsx';
import AppBarContent from '../components/AppBarContent.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import MyPage from  '../components/MyPage.jsx';
import Download from '../components/Download.jsx';
import Cloud  from './Cloud.jsx';
import Visual  from './Visual.jsx';
import Risk  from './Risk.jsx';
import RiskVisual from '../components/RiskVisual.jsx';
import Administrator from './Administrator.jsx';
import Footer from "../components/Footer.jsx";
import { useDispatch, useSelector } from 'react-redux';
import UserAuthCheckAPI from '../services/UserAuthCheckAPI.jsx'
import { setUserDialog, setUserLoginAuth } from '../actions';


export default function Module() {

  const dispatch = useDispatch();

  const userInfo = useSelector(state => state.userInfo);
  const userDialog = useSelector(state => state.userDialog);

  const RedirectToHomeIfNotAdmin = ({ children }) => { return userInfo.role === "ROLE_ADMIN" ? children : <Navigate to="/module" />; };

  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = (open) => (event) => { setDrawer({ ...drawer, left: open }); };

  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <UserAuthCheckAPI/>
      <CssBaseline/>
      <AppBarContent toggleDrawer={toggleDrawer} />
      <Drawer
        anchor="left"
        open={drawer["left"]}
        onClose={toggleDrawer(false)}
        transitionDuration={{ enter: 400, exit: 800}}
      >
        <DrawerContent anchor="left" toggleDrawer={toggleDrawer} />
      </Drawer>

      <Routes>
        <Route path="/" element={<ModuleCard />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/drawdownload" element={<Download />} />
        <Route path="/sheetdownload" element={<Download />} />
        <Route path="/drawcloud" element={<Cloud />} />
        <Route path="/sheetcloud" element={<Cloud />} />
        <Route path="/doccloud" element={<Cloud />} />
        <Route path="/drawvisual" element={<Visual />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/riskvisual" element={<RiskVisual />} />
        <Route path="/admin" element={
          <RedirectToHomeIfNotAdmin>
            <Administrator />
          </RedirectToHomeIfNotAdmin>
        } />
      </Routes>

      <Footer />

      <Dialog
        open={userDialog}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            dispatch(setUserDialog(false));
          }
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
          },
        }}
      >
        <DialogTitle>회원 정보 만료</DialogTitle>
        <DialogContent>
          <DialogContentText>
            다시 로그인 해주세요.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { dispatch(setUserLoginAuth(false)); dispatch(setUserDialog(false)); window.location.reload();}}>닫기</Button>
        </DialogActions>
      </Dialog>

    </Grid>
  );
}
