import { Backdrop, Box, CircularProgress, Container, Grid, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import VisualLocalFile from '../components/VisualLocalFile';
import VisualCloudFile from '../components/VisualCloudFile';
import VisualDrawPreview from '../components/VisualDrawPreview';
import VisualDraw from '../components/VisualDraw';


export default function Visual() {

  const visualBackdrop = useSelector(state => state.visualBackdrop);
  const visualDrawImg = useSelector(state => state.visualDrawImg);
  const visualBackdropText = useSelector(state => state.visualBackdropText);
  
  return (
    <Box sx={{my: 3}}>
      
      <Container maxWidth="false">
        <Grid container spacing={2}>

          <Grid item xs={12} sm={6} md={6} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{height: '100%'}}>
              { visualDrawImg ? ( <VisualDrawPreview /> ) : ( <VisualLocalFile /> ) }
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={6} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{height: '100%'}}>
              { visualDrawImg ? ( <VisualDraw /> ) : ( < VisualCloudFile /> ) } 
            </Paper>
          </Grid>

        </Grid>
      </Container>

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
        <Typography>{visualBackdropText}</Typography>
      </Backdrop>

    </Box>
  );
}