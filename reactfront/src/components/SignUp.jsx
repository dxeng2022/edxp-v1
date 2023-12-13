import React from 'react';
import { Avatar, Button, CssBaseline, Grid, Box, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import HandleValidationHook from '../hooks/HandleValidationHook';
import ButtonStatusHook from '../hooks/ButtonStatusHook';
import SignUpAPI from '../services/SignUpAPI';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setEmailCheckAlert, setAuthCodeAlert, setSignUpAlert, setSignUpCompleteAlert } from '../actions';


export default function SignUp() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUpEmailError = useSelector(state => state.signUpEmailError);
  const signUpNameError = useSelector(state => state.signUpNameError);
  const signUpPhoneError = useSelector(state => state.signUpPhoneError);
  const signUpPwError = useSelector(state => state.signUpPwError);

  const pwConfirmError = useSelector(state => state.pwConfirmError);
  const orgError = useSelector(state => state.orgError);
  const jobError = useSelector(state => state.jobError);

  

  const emailCheckButtonStatus = useSelector(state => state.emailCheckButtonStatus);
  const sendAuthCodButtonStatus = useSelector(state => state.sendAuthCodButtonStatus);
  const checkAuthCodeButtonStatus = useSelector(state => state.checkAuthCodeButtonStatus);
  const signUpButtonStatus = useSelector(state => state.signUpButtonStatus);

  const emailCheckAlert = useSelector(state => state.emailCheckAlert);
  const authCodeAlert = useSelector(state => state.authCodeAlert);
  const signUpAlert = useSelector(state => state.signUpAlert);
  const signUpCompleteAlert = useSelector(state => state.signUpCompleteAlert);

  const emailReadOnlyStatus = useSelector(state => state.emailReadOnlyStatus);
  const authCodeReadOnlyStatus = useSelector(state => state.authCodeReadOnlyStatus);

  const emailCheckResult = useSelector(state => state.emailCheckResult);
  const authCodeResult = useSelector(state => state.authCodeResult);
  const signUpResult = useSelector(state => state.signUpResult);


  const { handleSignUpEmailValidation, handleSignUpPwValidation, handleSignUpNameValidation,
    handleSignUpPhoneValidation, handleSignUpDateChange, handleAuthCode, handlePwConfirm,
    handleOrgValidation, handleJobValidation, handleGender,
  } = HandleValidationHook({});
  
  const { sendAuthCodeLoading,
    onClickEmailCheckButton, onClickSendAuthCodeButton,
    onClickCheckAuthCodeButton, onClickSignUp,
  } = SignUpAPI({});
  
  





  return (
    <Grid item>
      <ButtonStatusHook />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddAlt1Icon />
        </Avatar>

        <Typography component="h1" variant="h5">
          회원가입
        </Typography>

        <Box component="form" noValidate sx={{ mt: 1, maxWidth: '60ch'  }}>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={9}>
              <TextField
                error={signUpEmailError}
                placeholder="example@wise.co.kr"
                // helperText={emailError ? "올바른 이메일 주소를 입력해주세요." : ""}
                onChange={handleSignUpEmailValidation}
                InputProps={{
                  readOnly: emailReadOnlyStatus,
                }}
                margin="normal"
                fullWidth
                label="이메일"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                onClick={onClickEmailCheckButton}
                disabled={emailCheckButtonStatus}
                fullWidth
                variant="contained"
                color="primary"
              >
                중복확인
              </Button>
            </Grid>
          </Grid>

          <Dialog
            open={emailCheckAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setEmailCheckAlert(false));
              }
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"중복확인 결과"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {emailCheckResult}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(setEmailCheckAlert(false))}>닫기</Button>
            </DialogActions>
          </Dialog>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField 
                onChange={handleAuthCode}
                InputProps={{
                  readOnly: authCodeReadOnlyStatus,
                }}
                margin="normal"
                fullWidth
                label="인증번호"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                onClick={onClickSendAuthCodeButton}
                disabled={sendAuthCodButtonStatus || sendAuthCodeLoading}
                fullWidth
                variant="contained"
                color="primary"
              >
                {sendAuthCodeLoading ? <CircularProgress size={24} /> : '번호발송'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                onClick={onClickCheckAuthCodeButton}
                disabled={checkAuthCodeButtonStatus}
                fullWidth
                variant="contained"
                color="primary"
              >
                확인
              </Button>
            </Grid>
          </Grid>

          <Dialog
            open={authCodeAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setAuthCodeAlert(false));
              }
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"인증 번호"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {authCodeResult}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(setAuthCodeAlert(false))}>닫기</Button>
            </DialogActions>
          </Dialog>


          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                error={signUpPwError}
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                // helperText={pwError ? "영문, 숫자, 특수문자 포함 8자 이상" : ""}
                onChange={handleSignUpPwValidation}
                margin="normal"
                variant="outlined"
                fullWidth
                id="password"
                label="비밀번호"
                type="password"
                name="password"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={pwConfirmError}
                placeholder="비밀번호를 한번 더 입력해주세요."
                // helperText={pwConfirmError ? "비밀번호를 한번 더 입력해주세요." : ""}
                onChange={handlePwConfirm}
                margin="normal"
                variant="outlined"
                type="password"
                fullWidth
                label="비밀번호 확인"
                autoComplete="off"
              />
            </Grid>

            
            <Grid item xs={12} sm={6}>
              <TextField
                error={signUpNameError}
                placeholder="2~20 글자 입력"
                // helperText={nameError ? "올바른 이름을 입력해주세요." : ""}
                onChange={handleSignUpNameValidation}
                fullWidth
                label="이름"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={signUpPhoneError}
                placeholder=" -(하이픈) 없이 입력"
                // helperText={phoneError ? " - 없이 입력해주세요." : ""}
                onChange={handleSignUpPhoneValidation}
                fullWidth
                label="전화번호"
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <Box sx={{ mt: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>성별</InputLabel>
                  <Select
                    defaultValue=""
                    onChange={handleGender}
                  >
                    <MenuItem value='M'>남성</MenuItem>
                    <MenuItem value='F'>여성</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label = "생년월일"
                    onChange={handleSignUpDateChange}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                error={orgError}
                placeholder="2~20 글자 입력"
                // helperText={orgError ? "2~10자 입력해주세요." : ""}
                onChange={handleOrgValidation}
                fullWidth
                label="소속"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={jobError}
                placeholder="2~20 글자 입력"
                // helperText={jobError ? "2~10자 입력해주세요." : ""}
                onChange={handleJobValidation}
                fullWidth
                label="직책"
              />
            </Grid>
          </Grid>

          <Button
            disabled={signUpButtonStatus}
            onClick={() => dispatch(setSignUpAlert(true))}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            다음
          </Button>

          <Dialog
            open={signUpAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setSignUpAlert(false));
              }
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick
          >
            <DialogTitle id="alert-dialog-title">
              {"회원가입 진행"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                입력하신 정보로 회원가입을 진행하시겠습니까?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(setSignUpAlert(false))}> 아니오 </Button>
              <Button onClick={onClickSignUp}> 네 </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={signUpCompleteAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setSignUpCompleteAlert(false));
              }
            }}
          >
            <DialogTitle>
              {"회원가입 결과"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {signUpResult}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={signUpResult === '완료되었습니다. 로그인 화면으로 이동합니다.' ? ()=>{ window.location.href = '/'; dispatch(setSignUpCompleteAlert(false)); } : ()=>{ dispatch(setSignUpCompleteAlert(false)) }}
              > 닫기 
              </Button>
            </DialogActions>
          </Dialog>

          <Grid item>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={()=>{ navigate('/'); }} size="small">
                되돌아가기
              </Button>
            </Box>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};