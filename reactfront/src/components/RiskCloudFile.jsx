import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Box, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider, Typography, createTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath, setRiskCloudAlert, setRiskFile } from '../actions';
import { useState } from 'react';
import RiskAPI from '../services/RiskAPI';
import CloudListAPI from '../services/CloudListAPI';


export default function RiskCloudFile() {

  const dispatch = useDispatch();

  const { riskCloudAPI } = RiskAPI({});

  const fileList = useSelector(state => state.fileList);
  const currentPath = useSelector(state => state.currentPath);
  const processedPath = currentPath.path.replace(/\/[^/]+\/?$/, '/');
  const pathSegments = currentPath.path.split('/').filter(segment => segment !== '');
  const riskCloudAlert = useSelector(state => state.riskCloudAlert);

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#F5F5F5',
            },
          },
        },
      },
    },
  });

  const rows = fileList
    .filter(file => ['pdf', '폴더' ].includes(file.extension.toLowerCase()))
    .map((file, index) => ({
      id: index,
      fileName: file.fileName,
      extension: file.extension,
      fileSize: file.fileSize,
      registeredAt: file.registeredAt,
      filePath : file.filePath,
  }));

  const columns = [
    { 
      field: 'fileName', 
      headerName: '이름', 
      width: 300, 
      renderCell: (params) => {
        const isFolder = params.row.extension === '폴더';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isFolder ? <FolderIcon style={{ marginRight: '10px', color: '#666666' }} /> : <InsertDriveFileOutlinedIcon style={{ marginRight: '10px' }} />}
            {params.value}
          </div>
        );
      }
    },
    { field: 'registeredAt', headerName: '생성 날짜', width: 300, },
    { field: 'fileSize', headerName: '파일 크기', width: 150, },
  ];

  const handleBreadCrumb = (key) => {
    if (key === 0) {
      dispatch(setCurrentPath(processedPath));
    } else if (key >= 1) {
      const newPath = processedPath + pathSegments[(key)] + '/';
      dispatch(setCurrentPath(newPath));
    }
  };

  const handleDoubleClick = (param) => {
    const doubleClickFolder = param.row.extension;
    if (doubleClickFolder === '폴더') {
      dispatch(setCurrentPath(param.row.filePath));
    }
  };

  const [selectCheckbox, setSelectCheckbox] = useState([]);

  const handleSelectCheckbox = (newSelectionModel, rows) => {
    if (newSelectionModel.length > 1) {
      alert("1개 파일만 선택해 주세요");
      setSelectCheckbox(newSelectionModel.slice(0,1));
      return;
    }
    setSelectCheckbox(newSelectionModel);

    const filePath = newSelectionModel.map(id => rows[id].filePath);
    dispatch(setRiskFile(filePath[0]));
  };


  return (
    <>
      <CloudListAPI />

      <Box sx={{ py:1, pl: 2, display: 'flex', justifyContent: 'space-between', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ whiteSpace: 'nowrap' }}>
            클라우드 경로 :
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ pl: 2, whiteSpace: 'nowrap', minWidth: 200 }}>
            {pathSegments.map((segment, index) => (
              <Box 
                sx={{ '&:hover': { cursor: 'pointer' }, display: 'flex', alignItems: 'center' }}
                key={index} 
                onClick={() => handleBreadCrumb(index)}
              >
                <FolderIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                {segment}
              </Box>
            ))}
          </Breadcrumbs>
        </Box>
        <Button size="small" variant="contained" endIcon={<SendIcon />} sx={{ px:2, mr: 2, whiteSpace: 'nowrap' }} onClick={riskCloudAPI}>
          PDF Parsing
        </Button>
      </Box>

      <ThemeProvider theme={theme}>
        <DataGrid
          sx={{height:'calc(100vh - 220px)', '&:hover': {cursor: 'default'}}}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableColumnMenu
          disableAutoFocus
          disableVirtualization
          disableRowSelectionOnClick
          hideFooter
          onCellDoubleClick={handleDoubleClick}
          onRowSelectionModelChange={(newSelectionModel) => handleSelectCheckbox(newSelectionModel, rows)}
          rowSelectionModel={selectCheckbox}
        />
      </ThemeProvider>

      <Dialog
          open={riskCloudAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setRiskCloudAlert(false));
            }
          }}
        >
          <DialogTitle>독조소항 추출 오류</DialogTitle>
          <DialogContent>
            <DialogContentText>
              pdf 파일을 선택해주세요.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(setRiskCloudAlert(false))}>닫기</Button>
          </DialogActions>
        </Dialog>

    </>
  );
}