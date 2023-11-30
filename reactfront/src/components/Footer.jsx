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
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >

      <Grid container justifyContent="center">
        <Typography component="div">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <InfoOutlinedIcon/> Contact Us
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <EmailOutlinedIcon/> dxeng@wise.co.kr
              </Box>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneOutlinedIcon/> 02-6246-1400
              </Box>
            </Grid>
          </Grid>
        </Typography>
      </Grid>

    </Box>
  );
}
