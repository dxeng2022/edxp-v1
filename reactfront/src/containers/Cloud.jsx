import { Box, Container, Grid } from '@mui/material';

import CloudListAPI from '../services/CloudListAPI';
import CloudList from '../components/CloudList';
import CloudContent from '../components/CloudContent';

export default function Cloud() {

  return (
    <Box sx={{my: 3}}>

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