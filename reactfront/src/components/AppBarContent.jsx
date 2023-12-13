import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Tooltip } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
// import { green } from '@mui/material/colors';
import UserAPI from '../services/UserAPI.jsx'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AppBarContent = ({ toggleDrawer }) => {

  const navigate = useNavigate();

  const userInfo = useSelector(state => state.userInfo);
  
  const { logOutButton } = UserAPI({});

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="absolute">
      <Toolbar>
        <Tooltip title="모아보기">
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, '&:hover': {cursor: 'pointer'}  }} onClick={()=>{ navigate('/module') }}>
          Digital Transformation Platform
        </Typography>
        
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography color="white" size="large" >안녕하세요.</Typography>
              <Tooltip title="더보기">
                <IconButton onClick={handleClick}>
                  <Typography color="white" size="large" > {userInfo && userInfo.name ? userInfo.name : 'Guest'} 님</Typography>
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
            <MenuItem onClick={()=>{navigate('/module/mypage'); }}>마이페이지</MenuItem>
            <MenuItem onClick={logOutButton}>로그아웃</MenuItem>
            </Menu>
          </Box>

      </Toolbar>
    </AppBar>
  );
};

export default AppBarContent;
