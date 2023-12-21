import { Box, Container, Grid } from '@mui/material';

import CloudListAPI from '../services/CloudListAPI';
import CloudList from '../components/CloudList';
import CloudContent from '../components/CloudContent';

export default function Cloud() {

  return (
    <Box sx={{mt: 12, mb: 3}}>

      <CloudListAPI />

      <Container maxWidth="false">
        <Grid container spacing={2}>

          <CloudList />
          <CloudContent />

        </Grid>
      </Container>
    </Box>
  );
};