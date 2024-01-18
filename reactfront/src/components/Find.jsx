import React, { useEffect, useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Grid, Tab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SearchIcon from '@mui/icons-material/Search';
import HandleValidationHook from '../hooks/HandleValidationHook';
import ButtonStatusHook from '../hooks/ButtonStatusHook';
import FindAPI from '../services/FindAPI';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setFindEmailAlert, setFindPwAlert } from '../actions';



export default function Find() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  
  const findPwEmailError = useSelector(state => state.findPwEmailError);
  const findEmailNameError = useSelector(state => state.findEmailNameError);
  const findPwNameError = useSelector(state => state.findPwNameError);
  const findEmailPhoneError = useSelector(state => state.findEmailPhoneError);
  const findPwPhoneError = useSelector(state => state.findPwPhoneError);

  const findEmailButtonStatus = useSelector(state => state.findEmailButtonStatus);
  const findPwButtonStatus = useSelector(state => state.findPwButtonStatus);

  const findEmailAlert = useSelector(state => state.findEmailAlert);
  const findPwAlert = useSelector(state => state.findPwAlert);

  const findEmailResult = useSelector(state => state.findEmailResult);
  const findPwResult = useSelector(state => state.findPwResult);

  
  const { handleFindPwEmailValidation,
    handleFindEmailNameValidation, handleFindPwNameValidation,
    handleFindEmailPhoneValidation, handleFindPwPhoneValidation, 
    handleFindEmailDateChange, handleFindPwDateChange, findTabReset } = HandleValidationHook({});
  const { findPwLoading, onClickFindEmailButton, onClickFindPwButton } = FindAPI({});
  

  // tab 이동
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    findTabReset();
    setValue(newValue);
  };
  // tab 이동

  useEffect(() => {
    return () => {
      findTabReset();
    };
  // eslint-disable-next-line
  }, [location.pathname]);

  
  return (
    <Grid item>
      <ButtonStatusHook />
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
                  error={findEmailNameError}
                  placeholder="한/영 2~20자"
                  // helperText={nameError ? "올바른 이름을 입력해주세요." : ""}
                  onChange={handleFindEmailNameValidation}
                  margin="normal"
                  fullWidth
                  label="이름"
                />
                <TextField
                  error={findEmailPhoneError}
                  placeholder=" -(하이픈) 없이 입력"
                  // helperText={phoneError ? " - 없이 입력해주세요." : ""}
                  onChange={handleFindEmailPhoneValidation}
                  margin="normal"
                  fullWidth
                  label="전화번호"
                />
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                        <DesktopDatePicker
                          label = "생년월일"
                          views={['year', 'month', 'day']}
                          format="YYYY/MM/DD"
                          onChange={handleFindEmailDateChange}
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
                        dispatch(setFindEmailAlert(false));
                      }
                    }}
                  >
                    <DialogTitle>{"이메일 찾기"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {findEmailResult}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => dispatch(setFindEmailAlert(false))}>닫기</Button>
                    </DialogActions>
                  </Dialog>

                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={()=>{ findTabReset(); navigate('/'); }} size="small">
                      되돌아가기
                    </Button>
                  </Box>
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value="2">
              <Box component="form" noValidate sx={{ maxWidth: '50ch' }}>
                <TextField
                  error={findPwEmailError}
                  placeholder="example@wise.co.kr"
                  // helperText={findPwEmailError ? "올바른 이메일 주소를 입력해주세요." : ""}
                  onChange={handleFindPwEmailValidation}
                  margin="normal"
                  fullWidth
                  label="이메일"
                />
                <TextField
                  error={findPwNameError}
                  placeholder="한/영 2~20자"
                  // helperText={nameError ? "올바른 이름을 입력해주세요." : ""}
                  onChange={handleFindPwNameValidation}
                  margin="normal"
                  fullWidth
                  label="이름"
                />
                <TextField
                  error={findPwPhoneError}
                  placeholder=" -(하이픈) 없이 입력"
                  // helperText={phoneError ? " - 없이 입력해주세요." : ""}
                  onChange={handleFindPwPhoneValidation}
                  margin="normal"
                  fullWidth
                  label="전화번호"
                />


                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                        <DesktopDatePicker
                          views={['year', 'month', 'day']}
                          format="YYYY/MM/DD"
                          label = "생년월일"
                          onChange={handleFindPwDateChange}
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
                        disabled={findPwButtonStatus  || findPwLoading}
                      >
                        {findPwLoading ? <CircularProgress size={24} /> : '찾기'}
                      </Button>
                    </Box>
                  </Grid>

                  <Dialog
                    open={findPwAlert}
                    onClose={(event, reason) => {
                      if (reason !== 'backdropClick') {
                        dispatch(setFindPwAlert(false));
                      }
                    }}
                  >
                    <DialogTitle>{"비밀번호 찾기"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {findPwResult}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => dispatch(setFindPwAlert(false))}>닫기</Button>
                    </DialogActions>
                  </Dialog>

                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={()=>{ navigate('/') }} size="small">
                      되돌아가기
                    </Button>
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