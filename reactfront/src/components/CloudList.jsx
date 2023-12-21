import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';

import { Box, Divider, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../actions';


export default function CloudList() {

  const dispatch = useDispatch();

  const currentPath = useSelector(state => state.currentPath);
  const processedPath = currentPath.path.replace(/\/[^/]+\/?$/, '/');
  const folderList = useSelector(state => state.folderList);
  const currentVolume = useSelector(state => state.currentVolume);
  const originalVolume = useSelector(state => state.originalVolume);
  const maxVolume = 30
  const volumePercentage = (originalVolume / 1048576 / maxVolume) * 100;
  
  const pathMapping = {
    'draw/': '도면',
    'sheet/': '시트',
    'doc/': '문서',
  };

  const folderMapping = {
    'draw/': 'draw',
    'sheet/': 'sheet',
    'doc/': 'doc',
  };

  return (
    <Grid item xs={12} sm={2} md={2} sx={{ height: 'calc(100vh - 160px)' }}>
      <Paper elevation={6} sx={{height: '100%', p:2, overflow: 'auto', display: 'flex', flexDirection: 'column'}}>

        <Typography variant="h5" sx={{mb:1, whiteSpace: 'nowrap', fontSize: "clamp(1rem, 4vw, 1.5rem)"}} align="center">
          {pathMapping[processedPath] || 'null' } 데이터 관리
        </Typography>
        <Divider />

        <Box sx={{ flexGrow: 1, maxWidth: 300, mt:2 }}>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={['1']}
          >
            <TreeItem
              nodeId="1"
              label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <FolderIcon sx={{ fontSize: 'small', mr: 0.5, color: '#666666' }} />
                  <span style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {folderMapping[processedPath] || '새로고침'}
                  </span>
              </span>
              }
            >
              {folderList.map((folder, index) => (
                <TreeItem
                  onClick={() => {
                    const clickedFolderPath = folder.folderPath || '';
                    dispatch(setCurrentPath(clickedFolderPath));
                  }}
                  key={index}
                  nodeId={`sub${index + 2}`}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <FolderIcon sx={{ fontSize: 'small', mr: 0.5, color: '#666666' }} />
                      <span style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {folder.folderName}
                      </span>
                    </span>
                  }
                />
              ))}
            </TreeItem>
          </TreeView>
        </Box>

        <Box sx={{mt: 'auto',}}>
          <Typography variant="body1" sx={{whiteSpace: 'nowrap', mt:1}}>
            {currentVolume} / {maxVolume} MB
          </Typography>
          <LinearProgress
            color="primary"
            variant="determinate"
            value={volumePercentage}
          />
        </Box>
        
      </Paper>
    </Grid>
  );
}