import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Box, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useValidation from '../hooks/useValidation';
import loginAPI from '../services/LoginAPI';


export default function Login() {

  //Dialog 상태 관리
  const [loginAlert, setLoginAlert] = useState(false);
  const handleClose = () => setLoginAlert(false);
  //Dialog 상태 관리
  
  // 로그인 버튼 상태관리
  const [loginButtonStatus, setLoginButtonStatus] = useState(true);
  // 로그인 버튼 상태관리

  const { email,pw, emailError, pwError,
    handleEmailValidation, handlePwValidation
  } = useValidation({ setLoginButtonStatus });
  
  const { onClickLoginButton } = loginAPI({ email, pw, setLoginAlert });


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
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          로그인
        </Typography>

        <Box sx={{ mt: 1, maxWidth: '50ch' }}>
          <TextField
            error={emailError}
            helperText={emailError ? "올바른 이메일 주소를 입력해주세요." : ""}
            onChange={handleEmailValidation}
            margin="normal"
            fullWidth
            id="email"
            label="이메일"
            name="email"
            autoComplete="Email"
            autoFocus
          />
          <TextField
            error={pwError}
            helperText={pwError ? "영문, 숫자, 특수문자 포함 8자 이상 입력해주세요." : ""}
            onChange={handlePwValidation}
            margin="normal"
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
          />
          <Button
            onClick={onClickLoginButton}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loginButtonStatus}
          >
            로그인
          </Button>

          <Dialog
            open={loginAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                handleClose();
              }
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"로그인 실패"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                일치하는 정보가 없습니다.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>닫기</Button>
            </DialogActions>
          </Dialog>

          <Grid container>
            <Grid item xs>
              <Link href="/find" variant="body2">
                이메일/비밀번호 찾기
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signpolicy" variant="body2">
                회원가입
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
}