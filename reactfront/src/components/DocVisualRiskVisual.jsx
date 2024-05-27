import { Box, Container, Grid, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import RiskPreview from "./RiskPreview";
import RiskVisualLabel from './RiskVisualLabel';
import RiskVisualChart from "./RiskVisualChart";
import DocVisualRiskNonePDF from "./DocVisualRiskNonePDF";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function DocVisualRiskVisual() {

  const navigate = useNavigate();

  const riskVisualPage = useSelector(state => state.riskVisualPage);
  const riskData = useSelector(state => state.riskData);
  const docVisualRiskPDF = useSelector(state => state.docVisualRiskPDF);

  const handleBeforeUnload = useRef((e) => {
    e.preventDefault();
    e.returnValue = '/module';
  });

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload.current);
    
    if (!riskData || !riskData.allCounts) {
      navigate('/module');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload.current);
    };
    //eslint-disable-next-line
  }, [riskData]);

  return (
    <Box sx={{my: 3}}>
      <Container maxWidth="false">
        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={5} md={5} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{height: '100%', position: 'relative'}}>
              {docVisualRiskPDF ? <DocVisualRiskNonePDF /> : <RiskPreview />}
            </Paper>
          </Grid>

            
          <Grid item xs={12} sm={7} md={7} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{height: '100%', position: 'relative'}}>
              { riskVisualPage ? ( <RiskVisualChart/> ) : ( <RiskVisualLabel /> ) }
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
