import React, { useState } from 'react';
import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Toolbar, IconButton, Tooltip } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Home as HomeIcon, ShapeLineOutlined as ShapeLineOutlinedIcon, BrowserUpdatedOutlined as BrowserUpdatedOutlinedIcon, FilterDrama as FilterDramaIcon, InsertChartOutlinedRounded as InsertChartOutlinedRoundedIcon, GridOn as GridOnIcon, DescriptionOutlined as DescriptionOutlinedIcon, CompareArrowsOutlined as CompareArrowsOutlinedIcon, SimCardAlertOutlined as SimCardAlertOutlinedIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function DrawerContent({ anchor, toggleDrawer }) {

  const navigate = useNavigate();

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
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
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
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{ navigate('/module/draw/download')}}>
              <ListItemIcon>
                <BrowserUpdatedOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="모듈 설치" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/module/draw/cloud') }}>
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
        <ListItemButton onClick={handleClickMenu('시트')}>
          <ListItemIcon>
            <GridOnIcon />
          </ListItemIcon>
          <ListItemText primary="시트" />
          {openMenu.시트 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.시트} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/module/sheet/download') }}>
              <ListItemIcon>
                <BrowserUpdatedOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="모듈 설치" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/module/sheet/cloud') }}>
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
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{ navigate('/module/doc/visual') }}>
              <ListItemIcon>
                <CompareArrowsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="타공정 검증" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>{ navigate('/module/doc/poison') }}>
              <ListItemIcon>
                <SimCardAlertOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="독소조항 추출" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/module/doc/cloud') }}>
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
