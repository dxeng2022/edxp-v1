import React, { useEffect, useState } from 'react';
import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Toolbar, IconButton, Tooltip, Typography, CssBaseline } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Home as HomeIcon, ShapeLineOutlined as ShapeLineOutlinedIcon, BrowserUpdatedOutlined as BrowserUpdatedOutlinedIcon, FilterDrama as FilterDramaIcon, InsertChartOutlinedRounded as InsertChartOutlinedRoundedIcon, GridOn as GridOnIcon, DescriptionOutlined as DescriptionOutlinedIcon, CompareArrowsOutlined as CompareArrowsOutlinedIcon, SimCardAlertOutlined as SimCardAlertOutlinedIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPath, setVisualDrawImg } from '../actions';
import UserAPI from '../services/UserAPI';

export default function DrawerContent({ anchor, toggleDrawer }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { onClickKist } = UserAPI({});

  const [openMenu, setOpenMenu] = useState({
    도면: sessionStorage.getItem('openMenu_도면') !== null ? sessionStorage.getItem('openMenu_도면') === 'true' : true,
    시트: sessionStorage.getItem('openMenu_시트') !== null ? sessionStorage.getItem('openMenu_시트') === 'true' : true,
    문서: sessionStorage.getItem('openMenu_문서') !== null ? sessionStorage.getItem('openMenu_문서') === 'true' : true,
  });

  useEffect(() => {
    sessionStorage.setItem('openMenu_도면', openMenu.도면);
    sessionStorage.setItem('openMenu_시트', openMenu.시트);
    sessionStorage.setItem('openMenu_문서', openMenu.문서);
  }, [openMenu]);

  const handleClickMenu = (menu) => () => {
    setOpenMenu((prevOpen) => {
      const newState = {
        ...prevOpen,
        [menu]: !prevOpen[menu],
      };
      sessionStorage.setItem(`openMenu_${menu}`, newState[menu]);
      return newState;
    });
  };

  return (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
    >
      <CssBaseline/>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: [1],
        }}
      >
        <Typography sx={{ml:1}}>DXENG Platform</Typography>
        <Tooltip title='숨기기'>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Divider />      
      <List onClick={toggleDrawer(false)}>
          <ListItem disablePadding>
            <ListItemButton onClick={()=>{ navigate('/module') }}>
              <ListItemIcon>
                <HomeIcon fontSize='large'/>
              </ListItemIcon>
              <ListItemText primary="홈으로 이동" />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <List sx={{ py: 0 }}>
        <ListItemButton sx={{ pl: 2.5, py: 1.5, backgroundColor:'#EEEEEE' }} onClick={handleClickMenu('도면')}>
          <ListItemIcon>
            <ShapeLineOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="도면" />
          {openMenu.도면 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.도면} timeout="auto" unmountOnExit>
          <List component="div" disablePadding onClick={toggleDrawer(false)}>
            <ListItemButton sx={{ pl: 5 }} onClick={()=>{navigate('/module/drawdownload'); window.scrollTo(0, 0); }}>
              <ListItemIcon>
                <BrowserUpdatedOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="모듈 설치" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }} onClick={()=>{ dispatch(setCurrentPath('draw/')); navigate('/module/drawcloud'); }}>
              <ListItemIcon>
                <FilterDramaIcon />
              </ListItemIcon>
              <ListItemText primary="데이터 관리" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }} onClick={()=>{ dispatch(setCurrentPath('draw/')); dispatch(setVisualDrawImg(null)); navigate('/module/drawvisual'); }}>
              <ListItemIcon>
                <InsertChartOutlinedRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="시각화" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List sx={{ py: 0 }}>
        <ListItemButton sx={{ pl: 2.5, py: 1.5, backgroundColor:'#EEEEEE' }} onClick={handleClickMenu('시트')}>
          <ListItemIcon>
            <GridOnIcon />
          </ListItemIcon>
          <ListItemText primary="시트" />
          {openMenu.시트 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.시트} timeout="auto" unmountOnExit>
          <List component="div" disablePadding onClick={toggleDrawer(false)}>
            <ListItemButton sx={{ pl: 5 }} onClick={()=>{navigate('/module/sheetdownload'); window.scrollTo(0, 0); }}>
              <ListItemIcon>
                <BrowserUpdatedOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="모듈 설치" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }} onClick={()=>{ dispatch(setCurrentPath('sheet/')); navigate('/module/sheetcloud'); }}>
              <ListItemIcon>
                <FilterDramaIcon />
              </ListItemIcon>
              <ListItemText primary="데이터 관리" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }}>
              <ListItemIcon>
                <InsertChartOutlinedRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="시각화(준비중)" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List sx={{ py: 0 }}>
        <ListItemButton sx={{ pl: 2.5, py: 1.5, backgroundColor:'#EEEEEE' }} onClick={handleClickMenu('문서')}>
          <ListItemIcon>
            <DescriptionOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="문서" />
          {openMenu.문서 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.문서} timeout="auto" unmountOnExit>
          <List component="div" disablePadding onClick={toggleDrawer(false)}>
            <ListItemButton sx={{ pl: 5 }} onClick={onClickKist}>
              <ListItemIcon>
                <CompareArrowsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="타공종 검증" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }}>
              <ListItemIcon>
                <SimCardAlertOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="독소조항(준비중)" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }} onClick={()=>{ dispatch(setCurrentPath('doc/')); navigate('/module/doccloud'); }}>
              <ListItemIcon>
                <FilterDramaIcon />
              </ListItemIcon>
              <ListItemText primary="데이터 관리" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }}>
              <ListItemIcon>
                <InsertChartOutlinedRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="시각화(준비중)" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
}
