import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, Grid, Box, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import useValidation from '../hooks/useValidation';
import SignUpAPI from '../services/SignUpAPI';


export default function SignUp() {


  const [emailCheckButtonStatus, setEmailCheckButtonStatus] = useState(true);
  const [emailCheckAlert, setEmailCheckAlert] = useState(false);
  const [emailReadOnlyStatus, setEmailReadOnlyStatus] = useState(false);

  const [sendAuthCodButtonStatus, setSendAuthCodButtonStatus] = useState(true);
  const [checkAuthCodeButtonStatus, setCheckAuthCodeButtonStatus] = useState(true);
  const [authCodeAlert, setAuthCodeAlert] = useState(false);
  const [authCodeReadOnlyStatus, setAuthCodeReadOnlyStatus] = useState(true);

  const [signUpButtonStatus, setSignUpButtonStatus] = useState(true);
  const [signUpAlert, setSignUpAlert] = useState(false);
  const [signUpCompleteAlert, setSignUpCompleteAlert] = useState(false);
  const onClickSignUpButton = () => { setSignUpAlert(true); }
  const handleAlertClose = () => {setEmailCheckAlert(false); setAuthCodeAlert(false); setSignUpAlert(false);}
  const onClickGoLogin = () => { window.location.href = '/'; };

  const {email, pw, name, phone, birth, authCode, gender, org, job,
    emailError, pwError, nameError, phoneError, pwConfirmError, orgError, jobError,
    handleEmailValidation, handlePwValidation, handleNameValidation,
    handlePhoneValidation, handleDateChange, handleAuthCode, handlePwConfirm,
    handleOrgValidation, handleJobValidation, handleGender,
  } = useValidation({ setEmailCheckButtonStatus, setSignUpButtonStatus, 
    emailReadOnlyStatus, sendAuthCodButtonStatus, checkAuthCodeButtonStatus,
  });
  
  const { emailCheckResult, authCodeResult, sendAuthCodeLoading, signUpResult,
    onClickEmailCheckButton, onClickSendAuthCodeButton,
    onClickCheckAuthCodeButton, onClickSignUp,
  } = SignUpAPI({ email, pw, name, phone, birth, authCode, gender, org, job,
    setEmailCheckAlert, setAuthCodeAlert,
    setEmailReadOnlyStatus, setEmailCheckButtonStatus,
    setSendAuthCodButtonStatus, setCheckAuthCodeButtonStatus,
    setAuthCodeReadOnlyStatus, setSignUpAlert, setSignUpCompleteAlert,
  });
  
  





  return (
    <Grid item>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
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
                error={emailError}
                helperText={emailError ? "올바른 이메일 주소를 입력해주세요." : ""}
                onChange={handleEmailValidation}
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
                handleAlertClose();
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
              <Button onClick={handleAlertClose}>닫기</Button>
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
                handleAlertClose();
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
              <Button onClick={handleAlertClose}>닫기</Button>
            </DialogActions>
          </Dialog>


          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                error={pwError}
                helperText={pwError ? "영문, 숫자, 특수문자 포함 8자 이상" : ""}
                onChange={handlePwValidation}
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
                helperText={pwConfirmError ? "비밀번호를 한번 더 입력해주세요." : ""}
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
                error={nameError}
                helperText={nameError ? "올바른 이름을 입력해주세요." : ""}
                onChange={handleNameValidation}
                fullWidth
                label="이름"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={phoneError}
                helperText={phoneError ? " - 없이 입력해주세요." : ""}
                onChange={handlePhoneValidation}
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
                    onChange={handleDateChange}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                error={orgError}
                helperText={orgError ? "2~10자 입력해주세요." : ""}
                onChange={handleOrgValidation}
                fullWidth
                label="소속"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={jobError}
                helperText={jobError ? "2~10자 입력해주세요." : ""}
                onChange={handleJobValidation}
                fullWidth
                label="직책"
              />
            </Grid>
          </Grid>

          <Button
            disabled={signUpButtonStatus}
            onClick={onClickSignUpButton}
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
                handleAlertClose();
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
              <Button onClick={handleAlertClose}> 아니오 </Button>
              <Button onClick={onClickSignUp}> 네 </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={signUpCompleteAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                handleAlertClose();
              }
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick
          >
            <DialogTitle id="alert-dialog-title">
              {"회원가입 결과"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {signUpResult}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClickGoLogin}> 닫기 </Button>
            </DialogActions>
          </Dialog>

          <Grid item>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Link href="/" variant="body2">
                되돌아가기
              </Link>
            </Box>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};