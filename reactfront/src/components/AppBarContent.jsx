import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Tooltip } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
// import { green } from '@mui/material/colors';
import UserAPI from '../services/UserAPI.jsx'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AppBarContent = ({ toggleDrawer }) => {

  const navigate = useNavigate();

  const userNameInfo = useSelector(state => state.userNameInfo);
  
  const { mypageUserInfo, logOutButton } = UserAPI({});

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("");

  useEffect(() => {
    // sessionStorage에서 첫 방문 여부를 확인합니다.
    const isFirstVisit = sessionStorage.getItem('isFirstVisit') === null;
  
    if (isFirstVisit) {
      // 첫 방문인 경우, 환영 메시지를 보여주고 툴팁을 자동으로 닫습니다.
      setTooltipTitle("모아보기를 이용하여 빠르게 이동할 수 있습니다.");
      sessionStorage.setItem('isFirstVisit', 'false');
      setTooltipOpen(true);
  
      const timer = setTimeout(() => {
        setTooltipOpen(false);
        // 툴팁이 닫힌 후 메시지를 '모아보기'로 설정합니다.
        setTooltipTitle("모아보기");
      }, 4000);
  
      return () => clearTimeout(timer);
    } else {
      // 첫 방문이 아니면 기본 메시지를 '모아보기'로 설정합니다.
      setTooltipTitle("모아보기");
    }
  }, []);

  const handleMouseOver = () => {
    setTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Tooltip title={tooltipTitle} open={tooltipOpen} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} TransitionProps={{ timeout: 400 }} arrow slotProps={{ popper: { modifiers: [{name: 'offset', options: { offset: [0, -15]}}]}}}>
          <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', '&:hover': {cursor: 'pointer'}  }} onClick={()=>{ navigate('/module') }}>
          DXENG Platform
        </Typography>
        <Box sx={{ flexGrow: 1 }}>

        </Box>
        
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography color="white" size="large" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >안녕하세요.</Typography>
              <Tooltip title="더보기">
                <IconButton onClick={handleClick}>
                  <Typography color="white" size="large" > {userNameInfo.name} 님</Typography>
                </IconButton>
              </Tooltip>
              {/* <Avatar sx={{ bgcolor: green[300], width: 30, height: 30 }}> D </Avatar> */}
            </Box>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={()=>{ mypageUserInfo(); handleClose(); navigate('/module/mypage'); window.scrollTo(0, 0); }}>마이페이지</MenuItem>
            <MenuItem onClick={logOutButton}>로그아웃</MenuItem>
            </Menu>
          </Box>

      </Toolbar>
    </AppBar>
  );
};

export default AppBarContent;
