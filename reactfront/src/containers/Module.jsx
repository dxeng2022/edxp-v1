import React, { useState } from 'react';
import { CssBaseline, Drawer, Grid } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import DrawerContent from '../components/DrawerContent.jsx';
import AppBarContent from '../components/AppBarContent.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import MyPage from  '../components/MyPage.jsx';
import Download from '../components/Download.jsx';
import Footer from "../components/Footer.jsx";

import Administer from "../pages/Administer";
import DrawCloud from "../pages/DrawCloud.jsx";
import SheetCloud from "../pages/SheetCloud.jsx";
import DocCloud from "../pages/DocCloud.jsx";
// import DocPoison from "../pages/DocPoison.jsx";
// import DocVisual from "../pages/DocVisual.jsx";


export default function Module() {

  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setDrawer({ ...drawer, left: open });
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline/>
      <AppBarContent toggleDrawer={toggleDrawer} />
      <Drawer
        anchor="left"
        open={drawer["left"]}
        onClose={toggleDrawer(false)}
      >
        <DrawerContent anchor="left" toggleDrawer={toggleDrawer} />
      </Drawer>

      <Routes>
        <Route path="/" element={<ModuleCard />} />
        <Route path="/draw/cloud" element={<DrawCloud />} />
        <Route path="/sheet/cloud" element={<SheetCloud />} />
        <Route path="/doc/cloud" element={<DocCloud />} />
        {/* <Route path="/doc/poison/*" element={<DocPoison />} /> */}
        {/* <Route path="/doc/visual" element={<DocVisual />} /> */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/drawdownload" element={<Download />} />
        <Route path="/sheetdownload" element={<Download />} />
        <Route path="/admin" element={<Administer />} />
      </Routes>



      <Footer />
    </Grid>
  );
}
