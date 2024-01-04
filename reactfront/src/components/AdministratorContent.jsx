import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, ThemeProvider, createTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { green } from '@mui/material/colors';
import AdministratorListAPI from '../services/AdministratorListAPI';
import { setPasswordResetAlert, setUserDeleteAlert } from '../actions';
import { useState } from 'react';


export default function AdministratorContent() {

  const dispatch = useDispatch();

  const administratorInfo = useSelector(state => state.administratorInfo);
  const passwordResetAlert = useSelector(state => state.passwordResetAlert);
  const userDeleteAlert = useSelector(state => state.userDeleteAlert);
  
  
  const { passwordReset, userDelete } = AdministratorListAPI({});

  const [selectedId, setSelectedId] = useState(null);
  
  const classInfo = (params) => {
    if (params.row.role === "ROLE_USER") {
      return <Avatar sx={{ bgcolor: green[300], width: 30, height: 30 }}>D</Avatar>;
    } else {
      return <Avatar sx={{ width: 30, height: 30 }}>A</Avatar>;
    }
  };

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#F5F5F5',
            },
          },
        },
      },
    },
  });

  const rows = administratorInfo.map((info, index) => ({
    index: index+1,
    name: info.name,
    email: info.username,
    registeredAt: info.registeredAtFormed,
    role: info.role,
    id: info.id,
  }));

  const columns = [
    { field: 'index', headerName: '번호', width: 100, },
    {
      field: 'class', 
      headerName: '등급',
      width: 130,
      renderCell: classInfo,
    },
    { field: 'name', headerName: '이름', width: 200, },
    { field: 'email', headerName: '이메일', width: 200, },
    { field: 'registeredAt', headerName: '가입 날짜', width: 200, },
    { 
      field: 'passWord', 
      headerName: '비밀번호 초기화', 
      width: 180, 
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => {
            setSelectedId(params.row.id);
            dispatch(setPasswordResetAlert(true));
          }}
        >
          초기화
        </Button>
      ),
    },
    { 
      field: 'out', 
      headerName: '회원 탈퇴', 
      width: 130, 
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setSelectedId(params.row.id);
            dispatch(setUserDeleteAlert(true));
          }}
        >
          탈퇴
        </Button>
      ),
    },
  ];

  return (
    <Grid item xs={12} sm={10} md={10} sx={{ height: 'calc(100vh - 160px)' }}>
      <Paper elevation={6} sx={{height: '100%', position: 'relative'}}>

        <ThemeProvider theme={theme}>
          <DataGrid
            sx={{height:'calc(100vh - 170px)', '&:hover': {cursor: 'default'}}}
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            disableAutoFocus
            disableVirtualization
          />
        </ThemeProvider>


        <Dialog
            open={passwordResetAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setPasswordResetAlert(false));
              }
            }}
          >
            <DialogTitle>
              {"비밀번호 초기화"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                해당 회원의 비밀번호를 초기화하시겠습니까?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {dispatch(setPasswordResetAlert(false)); setSelectedId(null); }}> 아니오 </Button>
              <Button color='error' onClick={ () => {passwordReset(selectedId)}}> 네 </Button>
            </DialogActions>
          </Dialog>


          <Dialog
            open={userDeleteAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setUserDeleteAlert(false));
              }
            }}
          >
            <DialogTitle>
              {"회원 탈퇴"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                해당 회원을 탈퇴시키겠습니까?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {dispatch(setUserDeleteAlert(false)); setSelectedId(null); }}> 아니오 </Button>
              <Button color='error' onClick={ () => {userDelete(selectedId)}}> 네 </Button>
            </DialogActions>
          </Dialog>


      </Paper>
    </Grid>
  );
}