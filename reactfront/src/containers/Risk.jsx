import { Backdrop, Box, CircularProgress, Container, Grid, Paper, Typography } from "@mui/material";
import RiskLocalFile from "../components/RiskLocalFile";
import RiskCloudFile from "../components/RiskCloudFile";
import RiskPreview from "../components/RiskPreview";
import RiskParserDoc from "../components/RiskParserDoc";
import { useSelector } from "react-redux";


export default function Risk() {

  const riskPDFPreview = useSelector(state => state.riskPDFPreview);
  const riskPDFBackdrop = useSelector(state => state.riskPDFBackdrop);
  const riskBackdrop = useSelector(state => state.riskBackdrop);
  const riskBackdropText = useSelector(state => state.riskBackdropText);

  return (
    <Box sx={{my: 3}}>
      
      <Container maxWidth="false">
        <Grid container spacing={2}>

          <Grid item xs={12} sm={5} md={5} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{height: '100%', position: 'relative'}}>
              { riskPDFPreview ? ( <RiskPreview/> ) : ( <RiskLocalFile /> ) }
              <Backdrop
                open={riskPDFBackdrop}
                sx={{ 
                  color: '#fff', 
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress color="inherit" sx={{ mb: 2 }}/>
                <Typography>클라우드에서 PDF를 불러오고 있습니다.</Typography>
              </Backdrop>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={7} md={7} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{height: '100%', position: 'relative'}}>
              { riskPDFPreview ? ( <RiskParserDoc/> ) : ( < RiskCloudFile /> ) } 
              <Backdrop
                open={riskBackdrop}
                sx={{ 
                  color: '#fff', 
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress color="inherit" sx={{ mb: 2 }}/>
                <Typography>{riskBackdropText}</Typography>
              </Backdrop>
            </Paper>
          </Grid>

        </Grid>
      </Container>

    </Box>
  );
}