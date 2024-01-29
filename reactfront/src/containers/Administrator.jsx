import { Box, Container, Grid } from '@mui/material';
import AdministratorContent from '../components/AdministratorContent';
import AdministratorList from '../components/AdministratorList';

export default function Administrator() {

  return (
    <Box sx={{my: 3}}>
      <Container maxWidth="false">
        <Grid container spacing={2}>

          <AdministratorList />

          <AdministratorContent />

        </Grid>
      </Container>
    </Box>
  );
};