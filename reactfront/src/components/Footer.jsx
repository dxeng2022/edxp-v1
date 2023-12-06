import { Box, Grid, Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Footer() {
  return (
    <Box
      sx={{
        py: 1,
        px: 1,
        mt: 'auto',
        backgroundColor: '#263a4e',
      }}
    >

      <Grid container justifyContent="center">
        <Typography component="div">
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6} sm={6}>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <InfoOutlinedIcon fontSize="small" style={{ color: '#bdbdbd' }}/> 
                <Typography variant="body2" color='#bdbdbd'>Contact Us</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <EmailOutlinedIcon fontSize="small" style={{ color: '#bdbdbd' }}/>
                <Typography variant="body2" color='#bdbdbd'>dxeng@wise.co.kr</Typography>
              </Box>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneOutlinedIcon fontSize="small" style={{ color: '#bdbdbd' }}/>
                <Typography variant="body2" color='#bdbdbd'>02-6246-1400</Typography>
              </Box>
            </Grid>
          </Grid>
        </Typography>
      </Grid>

    </Box>
  );
}
