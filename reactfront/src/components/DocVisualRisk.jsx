import { Backdrop, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Grid, IconButton, Paper, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import AllInboxIcon from '@mui/icons-material/AllInbox';
import SendIcon from '@mui/icons-material/Send';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import CloseIcon from '@mui/icons-material/Close';
import DocVisualRiskLocalFile from "./DocVisualRiskLocalFile";
import DocVisualRiskCloudFile from "./DocVisualRiskCloudFile";
import { useEffect, useState } from "react";
import DocVisualAPI from "../services/DocVisualAPI";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { setDocVisualRiskTemFileName, setDocVisualRiskTemName, setDocVisualRiskTemPath, setDocVisualRiskTemPdfName, setParserChangeButton, setRiskCloudAlert, setRiskFile } from "../actions";

export default function DocVisualRisk() {

  const dispatch = useDispatch();

  const docVisualRiskTemCloud = useSelector(state => state.docVisualRiskTemCloud);
  const docVisualRiskTemName = useSelector(state => state.docVisualRiskTemName);
  const docVisualRiskBackdrop = useSelector(state => state.docVisualRiskBackdrop);
  const riskCloudAlert = useSelector(state => state.riskCloudAlert);
  // const docVisualRiskTemFileName = useSelector(state => state.docVisualRiskTemFileName);
  
  
  const { riskTemCloudJsonAPI, riskTemVisualAPI, TemCloudSaveAPI }= DocVisualAPI({});

  const [temCloudDialog, setTemCloudDialog] = useState(false);

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

  const rows = docVisualRiskTemCloud.map((file, index) => ({
    id: index,
    extractedDate: file.extractedDate,
    originalFilename: file.originalFilename,
    originalFilePath: file.originalFilePath,
    fileName: file.fileName,
    fileSize: file.fileSize,
    filePath : file.filePath,
  }));

  const columns = [
    { field: 'originalFilename', headerName: '원본 PDF', width: 300, },
    { field: 'fileName', headerName: '임시 이름', width: 300, },
    { field: 'extractedDate', headerName: '분석 날짜', width: 200, },
    { field: 'fileSize', headerName: '파일 크기', width: 150, },
  ];

  const [selectCheckbox, setSelectCheckbox] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [originalFileName, setOriginalFileName] = useState('');
  const [originalFilePath, setOriginalFilePath] = useState('');
  const [temFileName, setTemFileName] = useState([]);
  const [temPdfName, setTemPdfName] = useState([]);

  const handleSelectCheckbox = (newSelectionModel, rows) => {
    if (newSelectionModel.length > 1) {
      alert("1개 파일만 선택해 주세요");
      setSelectCheckbox(newSelectionModel.slice(0,1));
      return;
    }
    setSelectCheckbox(newSelectionModel);
    setFileName(newSelectionModel.map(id => rows[id].fileName));
    setOriginalFileName(newSelectionModel.map(id => rows[id].originalFilename));

    setTemPdfName(newSelectionModel.map(id => rows[id].originalFilename));

    const temOriginalFilePath = newSelectionModel.map(id => rows[id].originalFilePath);
    if (temOriginalFilePath.length > 0 && !temOriginalFilePath.every(path => path === '')) {
      setOriginalFilePath(temOriginalFilePath.map(path => path + '/').join(''));
    } else {
      setOriginalFilePath('');
    }

    const TemFileName = newSelectionModel.map(id => rows[id].fileName);
    if (TemFileName.length > 0) {
      setTemFileName(TemFileName[0]);
    } else {
      setTemFileName('');
    }
    
  };

  useEffect(() => {
    if (fileName[0]) {
      dispatch(setRiskFile(fileName[0]));
      dispatch(setDocVisualRiskTemPdfName(temPdfName[0]));
      const temPDFName = (originalFilePath + originalFileName);
      dispatch(setDocVisualRiskTemPath(temPDFName));
      dispatch(setDocVisualRiskTemFileName(temFileName));
    }
  //eslint-disable-next-line
  }, [fileName]);

  const handleTemClickOpen = () => {
    setSelectCheckbox([]);
    setFileName([]);
    setOriginalFileName([]);
    setTemPdfName([]);
    setOriginalFilePath('');
    setTemFileName('');
    dispatch(setRiskFile(''));
    dispatch(setDocVisualRiskTemPdfName(''));
    dispatch(setDocVisualRiskTemPath(''));
    dispatch(setDocVisualRiskTemFileName(''));
    setTemCloudDialog(true);
  };

  const handleTemClose = () => {
    setSelectCheckbox([]);
    setFileName([]);
    setOriginalFileName([]);
    setTemPdfName([]);
    setOriginalFilePath('');
    setTemFileName('');
    dispatch(setDocVisualRiskTemPdfName(''));
    dispatch(setDocVisualRiskTemPath(''));
    dispatch(setDocVisualRiskTemFileName(''));
    setTemCloudDialog(false);
  };

  const handleRiskTemVisualAPI = () => {
    if (selectCheckbox.length === 0) {
      dispatch(setRiskCloudAlert(true));
      return;
    }
    dispatch(setParserChangeButton(false));
    riskTemVisualAPI();
    handleTemClose();
  };

  const [temNameDialog, setTemNameDialog] = useState(false);

  const handleTemNameClickOpen = () => {
    if (selectCheckbox.length === 0) {
      alert("1개 파일을 선택해주세요.");
    } else {
      setTemNameDialog(true);
    }
  };

  const handleTemNameClose = () => {
    setTemNameDialog(false);
  };

  const validateName = (temName) => {
    if (temName.length > 100) {
      return false;
    }
    
    const regex = /[ #%/\\*?<>|:.]/;
    if (regex.test(temName)) {
      return false;
    }
  
    return true;
  };

  const handleTemName = async () => {
    if (docVisualRiskTemName && docVisualRiskTemName.trim()) {
      if (validateName(docVisualRiskTemName)) {
        await TemCloudSaveAPI();
        handleTemClose();
        handleTemNameClose();
      } else {
        alert("올바른 파일 이름을 입력해주세요.");
      }
    }
  }

  return (
    <Box sx={{my: 3}}>
        <Container maxWidth="false">
          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} md={6} sx={{ height: 'calc(100vh - 160px)' }}>
              <Paper elevation={6} sx={{height: '100%'}}>
                <DocVisualRiskLocalFile />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6} sx={{ height: 'calc(100vh - 160px)', position:'relative' }}>
              <Paper elevation={6} sx={{height: '100%'}}>
                <DocVisualRiskCloudFile />
              </Paper>
              <Box sx={{ position: 'absolute', right: 20, bottom: 20 }}>
                <Fab variant="extended" color="primary" onClick={()=>{handleTemClickOpen(); riskTemCloudJsonAPI();}}>
                  <AllInboxIcon sx={{ mr: 1 }}/>
                  임시 문서
                </Fab>
              </Box>
            </Grid>

          </Grid>
        </Container>

        <Dialog
          open={temCloudDialog}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleTemClose();
            }
          }}
          maxWidth='lg'
        >
          <DialogTitle sx={{pb: 1, display:'flex', justifyContent:'space-between'}}>
            {"독소조항 추출 임시 문서함"}
            <Box>
              <IconButton onClick={handleTemClose}> <CloseIcon /> </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ height: 400, width: '100%' }}>
              <ThemeProvider theme={theme}>
                <DataGrid
                  sx={{'&:hover': {cursor: 'default'}, '& .MuiDataGrid-cell': { whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',}}}
                  disableColumnMenu
                  disableColumnFiltering
                  disableRowSelectionOnClick
                  disableTooltip
                  disableAutoFocus
                  disableVirtualization
                  showCellVerticalBorder
                  getRowHeight={() => 'auto'}
                  getEstimatedRowHeight={() => 500}
                  columnHeaderHeight={40}
                  rows={rows}
                  columns={columns}
                  checkboxSelection
                  disableSelectionOnClick
                  hideFooter
                  onRowSelectionModelChange={(newSelectionModel) => handleSelectCheckbox(newSelectionModel, rows)}
                  rowSelectionModel={selectCheckbox}
                />
              </ThemeProvider>
            </Box>
          </DialogContent>
          <DialogTitle sx={{ pt:0, pb: 1, display:'flex', justifyContent:'flex-end'}}>
            <Button variant="outlined" startIcon={<MoveToInboxIcon />} onClick={handleTemNameClickOpen}> 클라우드 저장</Button>
            <Button size="small" variant="contained" endIcon={<SendIcon />} sx={{ml:2}} onClick={handleRiskTemVisualAPI}>시각화</Button>
          </DialogTitle>
        </Dialog>

        <Dialog
          open={temNameDialog}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleTemNameClose();
            }
          }}
          maxWidth='lg'
        >
          <DialogTitle>분석파일 이름 입력</DialogTitle>
          <DialogContent>
            <DialogContentText>
            클라우드에 저장할 이름을 작성해주세요.
            </DialogContentText>
            <DialogContentText>
              공백, #, %, /, \, *, ?,  &lt;, &gt;, |, :, . 같은 특수 문자는 사용할 수 없습니다.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="changeName"
              label="분석파일 이름 입력"
              type="name"
              fullWidth
              variant="standard"
              onChange={e => dispatch(setDocVisualRiskTemName(e.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleTemNameClose}>취소</Button>
            <Button onClick={handleTemName}>내보내기</Button>
          </DialogActions>
        </Dialog>

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

        <Backdrop
          open={docVisualRiskBackdrop}
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress color="inherit" sx={{ mb: 2 }}/>
          <Typography>시각화 데이터를 불러오고 있습니다.</Typography>
        </Backdrop>
    </Box>
  );
}
