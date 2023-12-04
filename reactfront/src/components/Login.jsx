import React from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HandleValidationHook from '../hooks/HandleValidationHook';
import ButtonStatusHook from '../hooks/ButtonStatusHook'
import loginAPI from '../services/LoginAPI';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginAlert } from '../actions';


export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailError = useSelector(state => state.emailError);
  const pwError = useSelector(state => state.pwError);
  const loginButtonStatus = useSelector(state => state.loginButtonStatus);
  const loginAlert = useSelector(state => state.loginAlert);

  

  const { handleEmailValidation, handlePwValidation } = HandleValidationHook({});
  
  const { onClickLoginButton } = loginAPI({ setLoginAlert });


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
                dispatch(setLoginAlert(false));
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
              <Button onClick={() => dispatch(setLoginAlert(false))}>닫기</Button>
            </DialogActions>
          </Dialog>

          <Grid container>
            <Grid item xs>
              <Button onClick={()=>{ navigate('/find') }} size="small">
                  이메일/비밀번호 찾기
                </Button>
            </Grid>
            <Grid item>
              <Button onClick={()=>{ navigate('/signpolicy') }} size="small">
                회원가입
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
}