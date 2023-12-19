import { Box, Button, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserUpdatedOutlined as BrowserUpdatedOutlinedIcon } from '@mui/icons-material';
import { setModuleDownloadAlert } from '../actions';
import { useMatch } from 'react-router-dom';


export default function Download() {
  
  const matchDrawDownloadPage = useMatch('/module/drawdownload');
  const moduleDownloadAlert = useSelector(state => state.moduleDownloadAlert);
  const dispatch = useDispatch();

  return (
    <Grid>
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
          모듈 다운로드 및 설치
        </Typography>
      </Grid>

      <Container maxWidth="lg">
        <Grid container spacing={1} sx={{ mt: 5 }}>

          <Grid item sm={12} md={8} >
            <Typography variant="h4" gutterBottom>
              {matchDrawDownloadPage ? '도면 모듈 v1.0' : '시트 모듈 v1.0'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 3, mb: 2 }}>
              {matchDrawDownloadPage ? 
                'AI 기술을 적용하여 이미지 형식 도면에서 객체를 인식하고, 도면의 위상을 재구성하여 구조화된 디지털 도면으로 설계 정보를 추출합니다.'
                : 
                '설계 시트 내의 기자재 정보를 인식 및 추출하여 구조화된 형태로 변환하고, 인식된 텍스트를 셀 단위로 구분하는 시멘틱 정보를 추출합니다.'}
            </Typography>
            <Button variant="contained" sx={{ my: 3 }} onClick={() => dispatch(setModuleDownloadAlert(true))}>
              <BrowserUpdatedOutlinedIcon />&nbsp;지금 다운로드
            </Button>
            <Divider/>
          </Grid>

          <Dialog
            open={moduleDownloadAlert}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                dispatch(setModuleDownloadAlert(false));
              }
            }}
          >
            <DialogTitle>{"모듈 다운로드"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {matchDrawDownloadPage ? '도면 모듈을 다운로드 하시겠습니까?' : '시트 모듈을 다운로드 하시겠습니까?'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                // onClick={matchDrawDownloadPage ? onClickDrawModuleDownload : onClickSheetModuleDownload}
                onClick={() => dispatch(setModuleDownloadAlert(false))}
              >
                다운로드
              </Button>
              <Button onClick={() => dispatch(setModuleDownloadAlert(false))}>닫기</Button>
            </DialogActions>
          </Dialog>

          <Grid item sm={6} md={4}>
            <CardMedia
              component="img"
              image={`${process.env.PUBLIC_URL}/${matchDrawDownloadPage ? 'drawdownload.png' : 'sheetdownload.png'}`}
              alt="description"
              sx={{
                pt: '5%',
                height: '90%',
                objectFit: 'contain',
              }}
            />
          </Grid>

        </Grid>
      </Container>


      <Container maxWidth="lg" sx={{ mb: 5 }}>
        <Grid container spacing={1} sx={{ my: 2 }}>


          <Grid item sm={12} md={6}>
            <Typography variant="h5" gutterBottom>
              도면 모듈 프로그램 사양
            </Typography>

            <Box sx={{ ml: '3%', maxWidth: '95%' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">구분</TableCell>
                      <TableCell align="center">최소</TableCell>
                      <TableCell align="center">권장</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">OS</TableCell>
                      <TableCell align="center">Window 10/11</TableCell>
                      <TableCell align="center">Window 10/11</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">CPU</TableCell>
                      <TableCell align="center">{matchDrawDownloadPage ? 'Intel I5' : 'Intel I3 12100'}</TableCell>
                      <TableCell align="center">{matchDrawDownloadPage ? 'AMD Ryzen 7 5700X' : 'Intel I5 13600'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">RAM</TableCell>
                      <TableCell align="center">8Gb</TableCell>
                      <TableCell align="center">16Gb 이상</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">GPU</TableCell>
                      <TableCell align="center">-</TableCell>
                      <TableCell align="center">{matchDrawDownloadPage ? 'NVIDIA GeForce RTX 3060 이상' : '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">DISK</TableCell>
                      <TableCell align="center">{matchDrawDownloadPage ? '250Gb' : '-'}</TableCell>
                      <TableCell align="center">{matchDrawDownloadPage ? '250Gb 이상' : '100Gb 이상'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">필수 설치 프로그램*</TableCell>
                      <TableCell align="center" colSpan={2}>
                        {matchDrawDownloadPage ? '.Net 7.0 이상' : '-'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>


          <Grid item sm={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ ml: '3%'}}>
              이용 가이드
            </Typography>
            <Box sx={{ ml: '7%', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 500 }}>
              <List>
                <ListItem disableGutters>
                  <ListItemText 
                    primary={matchDrawDownloadPage ? 
                    "1. 도면 첫번째 이용 가이드입니다. 아직 가이드가 완성되지 않아 임시 내용입니다."
                    : 
                    '1. 시트 첫번째 이용 가이드입니다. 아직 가이드가 완성되지 않아 임시 내용입니다.'}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText 
                    primary={matchDrawDownloadPage ? 
                    "2. 아직 가이드가 완성되지 않아 임시 내용입니다."
                    : 
                    '2. 아직 가이드가 완성되지 않아 임시 내용입니다.'}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText 
                    primary={matchDrawDownloadPage ? 
                    "3. 아직 가이드가 완성되지 않아 임시 내용입니다."
                    : 
                    '3. 아직 가이드가 완성되지 않아 임시 내용입니다.'}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText 
                    primary={matchDrawDownloadPage ? 
                    "4. 아직 가이드가 완성되지 않아 임시 내용입니다."
                    : 
                    '4. 아직 가이드가 완성되지 않아 임시 내용입니다.'}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText 
                    primary={matchDrawDownloadPage ? 
                    "5. 아직 가이드가 완성되지 않아 임시 내용입니다."
                    : 
                    '5. 아직 가이드가 완성되지 않아 임시 내용입니다.'}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>



        </Grid>
        <Divider/>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 5 }}>
        <Grid item md={12} sx={{ height: '60vh', display: 'flex', flexDirection: 'column',  }}>
          <Typography variant="h5" gutterBottom>
            가이드 영상
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mb: 2 }}>
            <iframe 
              width="90%"
              height= "100%"
              src={matchDrawDownloadPage ? 'https://www.youtube.com/embed/-ShNr_wLSOY?si=tep1H5hSWu2eeE5Y' : 'https://www.youtube.com/embed/X7DTozzvJJs?si=cyWUG2oYrVO2uxAE'}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            >
            </iframe>
          </Box>
        <Divider/>
        </Grid>
      </Container>


      <Container maxWidth="lg">
        <Typography variant="h5">
          참여 기관
        </Typography>
        <Grid container sx={{ mt: 2, mb: 3 }}>
          <Grid item sm={6} md={6} >
            <CardMedia
              component="img"
              image={`${process.env.PUBLIC_URL}/${matchDrawDownloadPage ? 'koreauniversity.gif' : 'iae.jpg'}`}
              alt="description"
              sx={{
                height: '60px',
                objectFit: 'contain',
              }}
            />
          </Grid>

          <Grid item sm={6} md={6}>
            {matchDrawDownloadPage ? (
              <CardMedia
                component="img"
                image={`${process.env.PUBLIC_URL}/koreatechuniversity.jpg`}
                alt="description"
                sx={{
                  height: '60px',
                  objectFit: 'contain',
                }}
              />
            ) : null}
          </Grid>
        </Grid>
      </Container>



    </Grid>
  );
};