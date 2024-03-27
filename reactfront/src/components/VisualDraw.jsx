import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import { Box, Button, Tab, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath, setVisualDrawTag, setVisualDrawTagX } from '../actions';
import { useEffect, useRef, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import VisualDrawChart from './VisualDrawChart'
import VisualDrawComponent from './VisualDrawComponent';


export default function VisualDraw() {

  const dispatch = useDispatch();

  const visualDrawFile = useSelector(state => state.visualDrawFile);  

  const handleBeforeUnload = useRef((e) => {
    e.preventDefault();
    e.returnValue = '';
  });

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload.current);
    return () => {
      // eslint-disable-next-line
      window.removeEventListener('beforeunload', handleBeforeUnload.current);
    };
  }, []);

  const handleButtonClick = () => {
    window.removeEventListener('beforeunload', handleBeforeUnload.current);
    dispatch(setCurrentPath('draw/'));
    window.location.reload();
  };

  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    dispatch(setVisualDrawTagX(null));
    dispatch(setVisualDrawTag(true));
    setValue(newValue);
  };


  return (
    <>
      <TabContext value={value}>
        <Box>
          <Box sx={{ zIndex:1, px:2, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'sticky', top: 0, backgroundColor:'#FFFFFF' }}>
            <Typography variant='h5' sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> {visualDrawFile.split('/').pop()} 시각화 </Typography>
            <Button sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={handleButtonClick}> <RestorePageOutlinedIcon fontSize='small' /> 되돌아가기 </Button>
          </Box>
          <TabList onChange={handleChange} sx={{ px:2 }} centered>
            <Tab label="Chart" value="1" sx={{ flexGrow: 1 }} />
            <Tab label="Component" value="2" sx={{ flexGrow: 1 }} />
          </TabList>
        </Box>

        <TabPanel value="1" sx={{ p:0 }}> <VisualDrawChart /> </TabPanel>

        <TabPanel value="2" sx={{ p:0 }}> <VisualDrawComponent /> </TabPanel>

      </TabContext>
    </>
  );
}