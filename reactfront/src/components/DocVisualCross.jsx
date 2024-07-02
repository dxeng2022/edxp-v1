import { Backdrop, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Typography, } from "@mui/material";
import DocVisualCrossLocalFile from "./DocVisualCrossLocalFile";
import DocVisualCrossCloudFile from "./DocVisualCrossCloudFile";
import { useDispatch, useSelector } from "react-redux";
import { setRiskCloudAlert } from "../actions";

export default function DocVisualCross() {

  const dispatch = useDispatch();

  const visualBackdrop = useSelector(state => state.visualBackdrop);
  const riskCloudAlert = useSelector(state => state.riskCloudAlert);
  
  return (
    <Box sx={{my: 3}}>
        <Container maxWidth="false">
          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} md={6} sx={{ height: 'calc(100vh - 160px)' }}>
              <Paper elevation={6} sx={{height: '100%'}}>
                <DocVisualCrossLocalFile />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6} sx={{ height: 'calc(100vh - 160px)', position:'relative' }}>
              <Paper elevation={6} sx={{height: '100%'}}>
                <DocVisualCrossCloudFile />
              </Paper>
            </Grid>

          </Grid>
        </Container>

        <Dialog
          open={riskCloudAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setRiskCloudAlert(false));
            }
          }}
        >
          <DialogTitle>시각화 오류</DialogTitle>
          <DialogContent>
            <DialogContentText>
              json 파일을 선택해주세요.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(setRiskCloudAlert(false))}>닫기</Button>
          </DialogActions>
        </Dialog>

        <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={visualBackdrop}
      >
        <CircularProgress color="inherit" sx={{ mb: 2 }}/>
        <Typography>{'서버 요청 중입니다.'}</Typography>
      </Backdrop>
    </Box>
  );
}
