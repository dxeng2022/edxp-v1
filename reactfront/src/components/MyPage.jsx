import HandleValidationHook from '../hooks/HandleValidationHook';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setChangePhoneAlert, setDeactivateUserAlert, setCompleteDeactivateUserAlert, setChangePwAlert, setCompleteChangePwAlert } from '../actions';
import UserAPI from '../services/UserAPI.jsx'
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CakeIcon from '@mui/icons-material/Cake';
import Man4Icon from '@mui/icons-material/Man4';
import ApartmentIcon from '@mui/icons-material/Apartment';
import WorkIcon from '@mui/icons-material/Work';
import ButtonStatusHook from '../hooks/ButtonStatusHook';
import { useNavigate } from 'react-router-dom';
import AdministratorListAPI from '../services/AdministratorListAPI'


export default function MyPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector(state => state.userInfo);  
  const changePhoneError = useSelector(state => state.changePhoneError);
  const changePhoneButtonStatus = useSelector(state => state.changePhoneButtonStatus);
  const changePhoneAlert = useSelector(state => state.changePhoneAlert);
  const changePhoneResult = useSelector(state => state.changePhoneResult);
  const changeCurrentPwError = useSelector(state => state.changeCurrentPwError);
  const changePwError = useSelector(state => state.changePwError);
  const changePwConfirmError = useSelector(state => state.changePwConfirmError);
  const changePwAlert = useSelector(state => state.changePwAlert);
  const completeChangePwAlert = useSelector(state => state.completeChangePwAlert);
  const completeChangePwResult = useSelector(state => state.completeChangePwResult);
  const changePwButtonStatus = useSelector(state => state.changePwButtonStatus);
  const deactivateUserAlert = useSelector(state => state.deactivateUserAlert);
  const completeDeactivateUserAlert = useSelector(state => state.completeDeactivateUserAlert);
  const completeDeactivateUserResult = useSelector(state => state.completeDeactivateUserResult);
  
  const { handleChangePhoneValidation, handleChangeCurrentPwValidation, handleChangePwValidation, handleChangePwConfirm } = HandleValidationHook({});
  const { onClickChangePhoneButton, onClickChangePwButton, onClickDeactivateUser } = UserAPI({});
  const { administratorInfo } = AdministratorListAPI({});

  const userInfoArray = [
    { label: '이름', value: userInfo && userInfo.name ? userInfo.name : null },
    { label: <EmailIcon fontSize='large'/>, value: userInfo && userInfo.username ? userInfo.username : null },
    { label: <CakeIcon fontSize='large'/>, value: userInfo && userInfo.birth ? userInfo.birth?.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3") : null },
    { label: <ApartmentIcon fontSize='large'/>, value: userInfo && userInfo.organization ? userInfo.organization : null },
    { label: <LocalPhoneIcon fontSize='large'/>, value: userInfo && userInfo.phone ? userInfo.phone?.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3") : null },
    { label: <Man4Icon fontSize='large'/>, value: userInfo && userInfo.gender ? (userInfo.gender === 'M' ? '남성' : (userInfo.gender === 'F' ? '여성' : null )) : null },
    { label: <WorkIcon fontSize='large'/>, value: userInfo && userInfo.job ? userInfo.job : null },
  ];

  
  return (
    <Grid>
      <ButtonStatusHook />
      <Grid
        item
        md={12}
        sx={{
          position: 'relative',
          height: '35vh',
          backgroundImage: 'url(/module.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', whitespace: 'nowrap' }}>
          마이페이지
        </Typography>
      </Grid>


      <Container maxWidth="lg">
        <Grid container sx={{ mt: 5, justifyContent: 'center' }}>
          <Grid item xs={12} sm={12} md={12}>
            <Paper elevation={6} sx={{ p: 4, maxWidth: '100%', borderRadius: '20px' }}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography variant="h4">
                    {userInfoArray[0].value} 님
                  </Typography>
                </Grid>
                {userInfoArray.filter((_, index) => index !== 0).map((info, index) => (
                  <Grid item xs={4} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="div" color="text.secondary" sx={{ mb: 1 }}>
                      {info.label}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {info.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>



      <Container maxWidth="lg">
        <Grid container spacing={2} sx={{ mt: 5, mb: 3 }}>
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ ml: '3%'}}>
              전화번호 변경
            </Typography>
            <Box sx={{ mb: 3, ml: '7%', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 500 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={9}>
                  <TextField
                    type='phone'
                    error={changePhoneError}
                    placeholder=" -(하이픈) 없이 입력"
                    onChange={handleChangePhoneValidation}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    onClick={onClickChangePhoneButton}
                    disabled={changePhoneButtonStatus}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    변경
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Dialog
            open={changePhoneAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setChangePhoneAlert(false));
              }
            }}
          >
            <DialogTitle>{"전화번호 변경 결과"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {changePhoneResult}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { dispatch(setChangePhoneAlert(false));} }>닫기</Button>
            </DialogActions>
          </Dialog>

          <Grid item xs={12} sm={12} md={6}>
            <ButtonStatusHook />
            <Typography variant="h5" gutterBottom sx={{ ml: '3%'}}>
              비밀번호 변경
            </Typography>
            <Box sx={{ ml: '7%', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 500 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={9}>
                  <TextField
                    type="password"
                    error={changeCurrentPwError}
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    onChange={handleChangeCurrentPwValidation}
                    margin="normal"
                    fullWidth
                    label="현재 비밀번호 입력"
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <TextField
                    type="password"
                    error={changePwError}
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    onChange={handleChangePwValidation}
                    margin="normal"
                    fullWidth
                    label="변경할 비밀번호 입력"
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <TextField
                    type="password"
                    error={changePwConfirmError}
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    onChange={handleChangePwConfirm}
                    margin="normal"
                    fullWidth
                    label="변경할 비밀번호 한번 더 입력"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    onClick={() => dispatch(setChangePwAlert(true))}
                    disabled={changePwButtonStatus}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    변경
                  </Button>

                  <Dialog
                    open={changePwAlert}
                    onClose={(event, reason) => {
                      if (reason !== 'backdropClick') {
                        dispatch(setChangePwAlert(false));
                      }
                    }}
                  >
                    <DialogTitle>
                      {"비밀번호 변경 진행"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        입력하신 정보로 비밀번호 변경을 진행하시겠습니까?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => dispatch(setChangePwAlert(false))}> 아니오 </Button>
                      <Button onClick={onClickChangePwButton}> 네 </Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    open={completeChangePwAlert}
                    onClose={(event, reason) => {
                      if (reason !== 'backdropClick') {
                        dispatch(setCompleteChangePwAlert(false));
                      }
                    }}
                  >
                    <DialogTitle>
                      {"비밀번호 변경 결과"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {completeChangePwResult}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={completeChangePwResult === '비밀번호가 변경되었습니다. 다시 로그인해주세요.' ? ()=>{ window.location.href = '/'; dispatch(setCompleteChangePwAlert(false)); } : ()=>{ dispatch(setCompleteChangePwAlert(false)) }}
                      > 닫기
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>
            </Box>
          </Grid>


        </Grid>
        <Divider/>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {userInfo.role === "ROLE_ADMIN" ? <Button onClick={() => {navigate('/module/admin'); administratorInfo(); }}>관리자 모드</Button> : <Box /> }
          <Button onClick={() => dispatch(setDeactivateUserAlert(true))} sx={{my: 2, color: '#bdbdbd'}}>
            회원탈퇴
          </Button>

          <Dialog
            open={deactivateUserAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setDeactivateUserAlert(false));
              }
            }}
          >
            <DialogTitle>
              {"회원 탈퇴 진행"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                정말로 회원탈퇴를 진행하시겠습니까?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(setDeactivateUserAlert(false))}> 아니오 </Button>
              <Button color='error' onClick={onClickDeactivateUser}> 네 </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={completeDeactivateUserAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setCompleteDeactivateUserAlert(false));
              }
            }}
          >
            <DialogTitle>
              {"회원 탈퇴 결과"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {completeDeactivateUserResult}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={completeDeactivateUserResult === "저희 서비스를 사용해주셔서 감사합니다." ? ()=>{ window.location.href = '/'; dispatch(setCompleteDeactivateUserAlert(false)); } : ()=>{ dispatch(setCompleteDeactivateUserAlert(false)) }}
              > 닫기
              </Button>
            </DialogActions>
          </Dialog>

        </Box>
      </Container>

    </Grid>
  );
}