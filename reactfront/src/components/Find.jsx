import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Box, Grid, Tab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SearchIcon from '@mui/icons-material/Search';
import useValidation from '../hooks/useValidation';
import FindAPI from '../services/FindAPI';


export default function Find() {


  
  // Dialog 상태 관리
  const [findEmailAlert, setFindEmailAlert] = useState(false);
  const [findPwAlert, setFindPwAlert] = useState(false);
  const handleClose = () => {setFindEmailAlert(false); setFindPwAlert(false)}
  // Dialog 상태 관리

  // findEmail/Pw button 상태관리
  const [findEmailButtonStatus, setFindEmailButtonStatus] = useState(true);
  const [findPwButtonStatus, setFindPwButtonStatus] = useState(true);
  // findEmail/Pw button 상태관리


  const { email, name, phone, birth,
    emailError, nameError, phoneError,
    handleEmailValidation, handleNameValidation,
    handlePhoneValidation, handleDateChange,
    findTabReset,
  } = useValidation({ setFindEmailButtonStatus, setFindPwButtonStatus });

  const { findEmailResult, findPwResult,
    onClickFindEmailButton, onClickFindPwButton
  } = FindAPI({ email, name, phone, birth, setFindEmailAlert, setFindPwAlert });


  // tab 이동
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    findTabReset();
    setValue(newValue);
  };
  // tab 이동
  

  return (
    <Grid item>
      <CssBaseline />
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <SearchIcon />
        </Avatar>

        <Box>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="이메일 찾기" value="1" sx={{ flexGrow: 1 }} />
                <Tab label="비밀번호 찾기" value="2" sx={{ flexGrow: 1 }} />
              </TabList>
            </Box>

            <TabPanel value="1">
              <Box component="form" noValidate sx={{ maxWidth: '50ch' }}>
                <TextField
                  error={nameError}
                  helperText={nameError ? "올바른 이름을 입력해주세요." : ""}
                  onChange={handleNameValidation}
                  margin="normal"
                  fullWidth
                  label="이름"
                />
                <TextField
                  error={phoneError}
                  helperText={phoneError ? " - 없이 입력해주세요." : ""}
                  onChange={handlePhoneValidation}
                  margin="normal"
                  fullWidth
                  label="전화번호"
                />
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label = "생년월일"
                          onChange={handleDateChange}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={onClickFindEmailButton}
                        disabled={findEmailButtonStatus}
                      >
                        찾기
                      </Button>
                    </Box>
                  </Grid>

                  <Dialog
                    open={findEmailAlert}
                    onClose={(event, reason) => {
                      if (reason !== 'backdropClick') {
                        handleClose();
                      }
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"이메일 찾기"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        {findEmailResult}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>닫기</Button>
                    </DialogActions>
                  </Dialog>

                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Link href="/" variant="body2">
                      되돌아가기
                    </Link>
                  </Box>
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value="2">
              <Box component="form" noValidate sx={{ maxWidth: '50ch' }}>
                <TextField
                  error={emailError}
                  helperText={emailError ? "올바른 이메일 주소를 입력해주세요." : ""}
                  onChange={handleEmailValidation}
                  margin="normal"
                  fullWidth
                  label="이메일"
                />
                <TextField
                  error={nameError}
                  helperText={nameError ? "올바른 이름을 입력해주세요." : ""}
                  onChange={handleNameValidation}
                  margin="normal"
                  fullWidth
                  label="이름"
                />
                <TextField
                  error={phoneError}
                  helperText={phoneError ? " - 없이 입력해주세요." : ""}
                  onChange={handlePhoneValidation}
                  margin="normal"
                  fullWidth
                  label="전화번호"
                />


                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label = "생년월일"
                          onChange={handleDateChange}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={onClickFindPwButton}
                        disabled={findPwButtonStatus}
                      >
                        찾기
                      </Button>
                    </Box>
                  </Grid>

                  <Dialog
                    open={findPwAlert}
                    onClose={(event, reason) => {
                      if (reason !== 'backdropClick') {
                        handleClose();
                      }
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"비밀번호 찾기"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        {findPwResult}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>닫기</Button>
                    </DialogActions>
                  </Dialog>

                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Link href="/" variant="body2">
                      되돌아가기
                    </Link>
                  </Box>
                </Grid>
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Grid>
  );
}