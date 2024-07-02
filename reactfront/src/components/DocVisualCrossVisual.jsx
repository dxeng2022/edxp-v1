import { Box, Button, Container, Grid, Paper, Typography, } from "@mui/material";
import DocVisualCrossVisualTable from "./DocVisualCrossVisualTable";
import DocVisualCrossVisualCompareTable from "./DocVisualCrossVisualCompareTable";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function DocVisualCrossVisual() {

  const navigate = useNavigate();

  const crossDocument = useSelector(state => state.crossDocument);
  const crossFileName = useSelector(state => state.crossFileName);

  const handleButtonClick = () => {
    navigate('/module/docvisual/cross');
  };

  return (
    <Box sx={{ my: 3 }}>
      <Container maxWidth="false">

        <Grid container spacing={2}>

          <Grid item xs={12} sm={6} md={6} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{ height: '100%', position: 'relative' }}>
              <DocVisualCrossVisualTable/>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={6} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{ height: '100%', position: 'relative' }}>
              <Box sx={{ zIndex:1, px:2, pt:0.5, pb:2, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'sticky', top: 0, backgroundColor:'#FFFFFF' }}>
                <Box sx={{ display:'flex', alignItems:'end', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  <Typography variant='h5' sx={{ pr:1 }}> {crossFileName} 시각화 </Typography>
                  <Typography variant='caption'> ( n pages / {crossDocument.length} Sentences ) </Typography>
                </Box>
                <Box sx={{ display:'flex' }}>
                  <Button sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={handleButtonClick}> 홈으로 </Button>
                </Box>
              </Box>
              <DocVisualCrossVisualCompareTable/>
            </Paper>
          </Grid>

        </Grid>

      </Container>
    </Box>
  );
}
