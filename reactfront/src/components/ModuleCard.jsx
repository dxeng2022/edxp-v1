import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Container, Grid, Tooltip } from '@mui/material';
import { BrowserUpdatedOutlined as BrowserUpdatedOutlinedIcon, FilterDrama as FilterDramaIcon, InsertChartOutlinedRounded as InsertChartOutlinedRoundedIcon, CompareArrowsOutlined as CompareArrowsOutlinedIcon, SimCardAlertOutlined as SimCardAlertOutlinedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPath, setVisualDrawImg } from '../actions';
import UserAPI from '../services/UserAPI';
import MouduleCardBanner from './ModuleCardBanner';

import { motion } from 'framer-motion';


export default function ModuleCard() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { onClickKist } = UserAPI({});

  const ScrollToTop = () => {
    window.scrollTo(0, 0);
    return null;
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <Box>
      <ScrollToTop />
      <Grid item xs={12} sm={12} md={12}>
        <MouduleCardBanner/>
      </Grid>

      <Grid item xs={12} sm={12} md={12}>
        <Container maxWidth="xl" sx={{ my: '3%' }}>
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <Grid container spacing={3}>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <Card elevation={12}>
                    <CardMedia
                      component="div"
                      sx={{
                        pt: '56.25%',
                      }}
                      image={`${process.env.PUBLIC_URL}/draw.png`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        도면
                      </Typography>
                      <Typography>
                        AI 기술을 적용하여 이미지 형식 도면에서 객체를 인식하고, 도면의 위상을 재구성하여 구조화된 디지털 도면으로 설계 정보를 추출합니다.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="모듈 설치">
                        <Button size="small" onClick={()=>{navigate('/module/drawdownload'); window.scrollTo(0, 0); }}> <BrowserUpdatedOutlinedIcon /> </Button>
                      </Tooltip>
                      <Tooltip title="데이터 관리">
                        <Button size="small" onClick={()=>{ dispatch(setCurrentPath('draw/')); navigate('/module/drawcloud'); }}> <FilterDramaIcon /> </Button>
                      </Tooltip>
                      <Tooltip title="시각화">
                        <Button size="small" onClick={()=>{ dispatch(setCurrentPath('draw/')); dispatch(setVisualDrawImg(null)); navigate('/module/drawvisual'); }}> <InsertChartOutlinedRoundedIcon /> </Button>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <Card elevation={12}>
                    <CardMedia
                      component="div"
                      sx={{
                        pt: '56.25%',
                      }}
                      image={`${process.env.PUBLIC_URL}/sheet.png`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        시트
                      </Typography>
                      <Typography>
                        설계 시트 내의 기자재 정보를 인식 및 추출하여 구조화된 형태로 변환하고, 인식된 텍스트를 셀 단위로 구분하는 시멘틱 정보를 추출합니다.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="모듈 설치">
                        <Button size="small" onClick={()=>{navigate('/module/sheetdownload'); window.scrollTo(0, 0); }}> <BrowserUpdatedOutlinedIcon /> </Button>
                      </Tooltip>
                      <Tooltip title="데이터 관리">
                        <Button size="small" onClick={()=>{ dispatch(setCurrentPath('sheet/')); navigate('/module/sheetcloud'); }}> <FilterDramaIcon /> </Button>
                      </Tooltip>
                      <Tooltip title="시각화(준비중)">
                        <Button size="small"> <InsertChartOutlinedRoundedIcon /> </Button>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={itemVariants}>
                  <Card elevation={12}>
                    <CardMedia
                      component="div"
                      sx={{
                        pt: '56.25%',
                      }}
                      image={`${process.env.PUBLIC_URL}/doc.jpg`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        문서
                      </Typography>
                      <Typography>
                        딥러닝 기술을 적용하여 문서 내의 엔티티를 인식하고, 추출된 포맷에 따라 구조화된 디지털 문서로 타공정 검증 및 독조소항을 추출합니다.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="타공종 검증">
                        <Button size="small" onClick={onClickKist}> <CompareArrowsOutlinedIcon /> </Button>
                      </Tooltip>
                      <Tooltip title="독소조항 추출(준비중)">
                        <Button size="small"> <SimCardAlertOutlinedIcon /> </Button>
                      </Tooltip>
                      <Tooltip title="데이터 관리">
                        <Button size="small" onClick={()=>{ dispatch(setCurrentPath('doc/')); navigate('/module/doccloud'); }}> <FilterDramaIcon /> </Button>
                      </Tooltip>
                      <Tooltip title="시각화(준비중)">
                        <Button size="small"> <InsertChartOutlinedRoundedIcon /> </Button>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </ motion.div>
              </Grid>

            </Grid>
          </motion.div>
        </Container>
      </Grid>
    </Box>
  );
};