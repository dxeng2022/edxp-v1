import React, { useState } from 'react';
import { CssBaseline, Drawer, Grid } from '@mui/material';
import DrawerContent from '../components/DrawerContent.jsx';
import AppBarContent from '../components/AppBarContent.jsx';
import Footer from "../components/Footer.jsx"
import ModuleCard from '../components/ModuleCard.jsx';
import { Route, Routes } from 'react-router-dom';

import Draw from "../pages/Draw.jsx";
import DrawDownload from "../pages/DrawDownload.jsx";
import DrawCloud from "../pages/DrawCloud.jsx";
import Sheet from "../pages/Sheet.jsx";
import SheetDownload from "../pages/SheetDownload.jsx";
import SheetCloud from "../pages/SheetCloud.jsx";
import Doc from "../pages/Doc.jsx";
import DocChoice from "../pages/DocChoice.jsx";
// import DocPoison from "../pages/DocPoison.jsx";
import DocCloud from "../pages/DocCloud.jsx";
// import DocVisual from "../pages/DocVisual.jsx";
import MyPage from "../pages/MyPage.jsx";
import Administer from "../pages/Administer";


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
        <Route path="/draw" element={<Draw />} />
        <Route path="/draw/download" element={<DrawDownload />} />
        <Route path="/draw/cloud" element={<DrawCloud />} />
        <Route path="/sheet" element={<Sheet />} />
        <Route path="/sheet/download" element={<SheetDownload />} />
        <Route path="/sheet/cloud" element={<SheetCloud />} />
        <Route path="/doc" element={<Doc />} />
        <Route path="/doc/choice" element={<DocChoice />} />
        {/* <Route path="/doc/poison/*" element={<DocPoison />} /> */}
        <Route path="/doc/cloud" element={<DocCloud />} />
        {/* <Route path="/doc/visual" element={<DocVisual />} /> */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/admin" element={<Administer />} />
      </Routes>



      <Footer />
    </Grid>
  );
}
