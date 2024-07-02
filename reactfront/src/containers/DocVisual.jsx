import { Box, Card, CardActions, CardContent, CardMedia, Divider, Fab, Typography } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setCurrentPath } from "../actions";

export default function DocVisual() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Box sx={{ height: 'calc(100vh - 160px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-evenly'}}>
          
      <Box sx={{ width: '55%' }}>
        <Card elevation={12} sx={{ display: 'flex', height: '30vh', position: 'relative' }}>
          <CardMedia
            component="div"
            sx={{
              width: '60%',
            }}
            image={`${process.env.PUBLIC_URL}/docVal.jpg`}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              타공종 교차검증 시각화
            </Typography>
            <Divider/>
            <Typography sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
            }}>
              딥러닝 기술을 적용하여 문서 내의 엔티티를 인식하고, 추출된 포맷에 따라 구조화된 디지털 문서로 타공정 검증 및 독조소항을 추출합니다.
            </Typography>
            <Typography>
              csv 파일을 요구합니다.
            </Typography>
          </CardContent>
          <CardActions sx={{ position: 'absolute', right: 5, bottom: 5 }}>
            <Fab color="primary" onClick={()=>{ dispatch(setCurrentPath('doc/')); navigate("/module/docvisual/cross");}}>
              <ArrowForwardIcon />
            </Fab>
          </CardActions>
        </Card>
      </Box>
      

      <Box sx={{ width: '55%' }}>
        <Card elevation={12} sx={{ display: 'flex', height: '30vh', position: 'relative' }}>
          <CardMedia
            component="div"
            sx={{
              width: '60%',
            }}
            image={`${process.env.PUBLIC_URL}/doc.jpg`}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              독소조항 시각화
            </Typography>
            <Divider/>
            <Typography sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
            }}>
              딥러닝 기술을 적용하여 문서 내의 엔티티를 인식하고, 추출된 포맷에 따라 구조화된 디지털 문서로 타공정 검증 및 독조소항을 추출합니다.
            </Typography>
            <Typography>
              json 파일을 요구합니다.
            </Typography>
            <CardActions sx={{ position: 'absolute', right: 5, bottom: 5 }}>
              <Fab color="primary" onClick={()=>{ dispatch(setCurrentPath('doc/')); navigate('/module/docvisual/risk');}}>
                <ArrowForwardIcon/>
              </Fab>
            </CardActions>
          </CardContent>
        </Card>
      </Box>

    </Box>
  );
}
