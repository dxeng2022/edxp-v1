import React, { useState } from 'react';
import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Toolbar, IconButton, Tooltip, Typography } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Home as HomeIcon, ShapeLineOutlined as ShapeLineOutlinedIcon, BrowserUpdatedOutlined as BrowserUpdatedOutlinedIcon, FilterDrama as FilterDramaIcon, InsertChartOutlinedRounded as InsertChartOutlinedRoundedIcon, GridOn as GridOnIcon, DescriptionOutlined as DescriptionOutlinedIcon, CompareArrowsOutlined as CompareArrowsOutlinedIcon, SimCardAlertOutlined as SimCardAlertOutlinedIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPath, setVisualDrawImg } from '../actions';

export default function DrawerContent({ anchor, toggleDrawer }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState({
    도면: false,
    시트: false,
    문서: false,
  });

  const handleClickMenu = (menu) => () => {
    setOpenMenu((prevOpen) => ({
      ...prevOpen,
      [menu]: !prevOpen[menu],
    }));
  };

  return (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: [1],
        }}
      >
        <Typography sx={{ml:1}}>DX Platform</Typography>
        <Tooltip title='숨기기'>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Divider />      
      <List>
          <ListItem disablePadding>
            <ListItemButton onClick={()=>{ navigate('/module') }}>
              <ListItemIcon>
                <HomeIcon fontSize='large'/>
              </ListItemIcon>
              <ListItemText primary="홈으로" />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleClickMenu('도면')}>
          <ListItemIcon>
            <ShapeLineOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="도면" />
          {openMenu.도면 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.도면} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{navigate('/module/drawdownload'); }}>
              <ListItemIcon>
                <BrowserUpdatedOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="모듈 설치" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{ dispatch(setCurrentPath('draw/')); navigate('/module/drawcloud'); }}>
              <ListItemIcon>
                <FilterDramaIcon />
              </ListItemIcon>
              <ListItemText primary="데이터 관리" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{ dispatch(setCurrentPath('draw/')); dispatch(setVisualDrawImg(null)); navigate('/module/drawvisual'); }}>
              <ListItemIcon>
                <InsertChartOutlinedRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="시각화" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleClickMenu('시트')}>
          <ListItemIcon>
            <GridOnIcon />
          </ListItemIcon>
          <ListItemText primary="시트" />
          {openMenu.시트 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.시트} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{navigate('/module/sheetdownload'); }}>
              <ListItemIcon>
                <BrowserUpdatedOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="모듈 설치" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{ dispatch(setCurrentPath('sheet/')); navigate('/module/sheetcloud'); }}>
              <ListItemIcon>
                <FilterDramaIcon />
              </ListItemIcon>
              <ListItemText primary="데이터 관리" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <InsertChartOutlinedRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="시각화" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleClickMenu('문서')}>
          <ListItemIcon>
            <DescriptionOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="문서" />
          {openMenu.문서 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.문서} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <CompareArrowsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="타공정 검증" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <SimCardAlertOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="독소조항 추출" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{ dispatch(setCurrentPath('doc/')); navigate('/module/doccloud'); }}>
              <ListItemIcon>
                <FilterDramaIcon />
              </ListItemIcon>
              <ListItemText primary="데이터 관리" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <InsertChartOutlinedRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="시각화" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
}
