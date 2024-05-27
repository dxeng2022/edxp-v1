import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Box, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider, Typography, createTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath, setDocVisualRiskTemFileName, setDocVisualRiskTemPath, setParserChangeButton, setRiskCloudAlert, setRiskFile } from '../actions';
import { useEffect, useState } from 'react';
import DocVisualCloudListAPI from '../services/DocVisualCloudListAPI';
import DocVisualAPI from '../services/DocVisualAPI';


export default function RiskCloudFile() {

  const dispatch = useDispatch();

  const { riskCloudVisualAPI } = DocVisualAPI({});

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
    .filter(file => ['json', '폴더' ].includes(file.extension.toLowerCase()))
    .map((file, index) => ({
      id: index,
      fileName: file.fileName,
      pdfName: file.pdfName,
      fullFileName: file.fullFileName,
      fileSize: file.fileSize,
      filePath: file.filePath,
      extension: file.extension,
      registeredAt: file.registeredAt,
      originalFileSize: file.originalFileSize,
      originalRegisteredAt: file.originalRegisteredAt,
  }));

  const columns = [
    { 
      field: 'fileName', 
      headerName: '이름', 
      width: 300, 
      renderCell: (params) => {
        const isFolder = params.row.extension === '폴더';
        return (
          <Box sx={{ display:'flex' }}>
            <Box>
              {isFolder ? <FolderIcon style={{ marginRight: '10px', color: '#666666' }} /> : <InsertDriveFileOutlinedIcon style={{ marginRight: '10px' }} />}
            </Box>
            <Box sx={{ width: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {params.value}
            </Box>
          </Box>
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
  const [fileName, setFileName] = useState([]);
  const [temFileName, setTemFileName] = useState([]);

  const handleSelectCheckbox = (newSelectionModel, rows) => {
    if (newSelectionModel.length > 1) {
      alert("1개 파일만 선택해 주세요");
      setSelectCheckbox(newSelectionModel.slice(0,1));
      return;
    }
    setSelectCheckbox(newSelectionModel);
    setFileName(newSelectionModel.map(id => rows[id].fullFileName));

    const TemFileName = newSelectionModel.map(id => rows[id].pdfName);
    if (TemFileName.length > 0) {
      setTemFileName(TemFileName[0]);
    } else {
      setTemFileName('');
    };
    
  };

  useEffect(() => {
    if (fileName[0]) {
      dispatch(setRiskFile(fileName[0]));
      const safeTemFileName = temFileName || ''; 
      dispatch(setDocVisualRiskTemPath(safeTemFileName));
      dispatch(setDocVisualRiskTemFileName(safeTemFileName));
    }
  //eslint-disable-next-line
  }, [fileName, temFileName]); // temFileName도 의존성 배열에 추가합니다.

  const handleRiskCloudVisualAPI = () => {
    if (selectCheckbox.length === 0) {
      dispatch(setRiskCloudAlert(true));
      return;
    }
    dispatch(setParserChangeButton(false));
    riskCloudVisualAPI();
  };


  return (
    <Box>
      <DocVisualCloudListAPI />

      <Box sx={{ py:1, pl: 2, display: 'flex', justifyContent: 'space-between' }}>
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
        <Button size="small" variant="contained" endIcon={<SendIcon />} sx={{ px:2, mr: 2, whiteSpace: 'nowrap' }} onClick={handleRiskCloudVisualAPI}>
          시각화
        </Button>
      </Box>

      <Box>
        <ThemeProvider theme={theme}>
          <DataGrid
            sx={{ height:'calc(100vh - 220px)', '&:hover': {cursor: 'default'}, '& .MuiDataGrid-cell': { whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',}}}
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
      </Box>

      <Dialog
        open={riskCloudAlert}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            dispatch(setRiskCloudAlert(false));
          }
        }}
      >
        <DialogTitle>시각화 오류</DialogTitle>
        <DialogContent>
          <DialogContentText>
            json 파일을 선택해주세요.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(setRiskCloudAlert(false))}>닫기</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}