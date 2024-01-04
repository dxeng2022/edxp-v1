import { Collapse, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShapeLineOutlinedIcon from '@mui/icons-material/ShapeLineOutlined';
import GridOnIcon from '@mui/icons-material/GridOn';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useState } from 'react';
import AdministratorListAPI from '../services/AdministratorListAPI';



export default function AdministratorList() {

  const { administratorInfo } = AdministratorListAPI({});

  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  return (

    <Grid item xs={12} sm={2} md={2} sx={{ height: 'calc(100vh - 160px)' }}>
      <Paper elevation={6} sx={{height: '100%', p:2, overflow: 'auto', display: 'flex', flexDirection: 'column'}}>

        <Typography variant="h5" sx={{mb:1, whiteSpace: 'nowrap', fontSize: "clamp(1rem, 4vw, 1.5rem)"}} align="center">
          회원 관리
        </Typography>
        <Divider />

        <List dense={true}>
          <ListItemButton onClick={() => { administratorInfo(); }}>
            <ListItemIcon>
              <SupervisedUserCircleIcon />
            </ListItemIcon>
            <ListItemText primary="회원 정보" sx={{
              '.MuiListItemText-primary': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }
            }} />
          </ListItemButton>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <FilterDramaIcon />
            </ListItemIcon>
            <ListItemText primary="데이터 관리" sx={{
              '.MuiListItemText-primary': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }
            }} />
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense={true}>
              <ListItemButton sx={{ pl: 5 }}>
                <ListItemIcon>
                  <ShapeLineOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="도면" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 5 }}>
                <ListItemIcon>
                  <GridOnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="시트" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 5 }}>
                <ListItemIcon>
                  <DescriptionOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="문서" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>

      </Paper>
    </Grid>

  )
}