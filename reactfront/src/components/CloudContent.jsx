import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';

import { Box, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Snackbar, SpeedDial, SpeedDialAction, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import HandleCloudHook from '../hooks/HandleCloudHook';
import CloudFuncAPI from '../services/CloudFuncAPI';

import { setCurrentPath, setDownloadFileAlert, setCloudSnackbar, setDeleteFileAlert, setFolderAlert,
  setAddFolderAlert, setFolderName, setUploadFileAlert, setCompleteDeleteFileAlert,
  setChangeNameAlert, setChangeNameInputAlert, setChangeName } from '../actions';


export default function CloudContent() {

  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const currentPath = useSelector(state => state.currentPath);
  const processedPath = currentPath.path.replace(/\/[^/]+\/?$/, '/');
  const pathSegments = currentPath.path.split('/').filter(segment => segment !== '');
  const fileList = useSelector(state => state.fileList);

  const selectCheckbox = useSelector(state => state.selectCheckbox); //체크된 row index 배열
  const selectFilePath = useSelector(state => state.selectFilePath);
  const folderAlert = useSelector(state => state.folderAlert);
  const addFolderResult = useSelector(state => state.addFolderResult);
  const addFolderAlert = useSelector(state => state.addFolderAlert);
  const uploadFileAlert = useSelector(state => state.uploadFileAlert);
  const uploadFileResult = useSelector(state => state.uploadFileResult);
  const downloadFileAlert = useSelector(state => state.downloadFileAlert);
  const cloudSnackbar = useSelector(state => state.cloudSnackbar);
  const deleteFileAlert = useSelector(state => state.deleteFileAlert);
  const completeDeleteFileAlert = useSelector(state => state.completeDeleteFileAlert);
  const changeNameAlert = useSelector(state => state.changeNameAlert);
  const changeNameInputAlert = useSelector(state => state.changeNameInputAlert);
  const changeNameResult = useSelector(state => state.changeNameResult);

  const { handleValidationFolder, handleAddFolder, handleValidationFile, handleSelectCheckbox, handleValidationFileName, handleChangeName } = HandleCloudHook({});
  const { downloadFileAPI, deleteFileAPI } = CloudFuncAPI({});

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

  const rows = fileList.map((file, index) => ({
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
    { field: 'extension', headerName: '유형', width: 200, },
    { field: 'fileSize', headerName: '파일 크기', width: 200, },
    { field: 'registeredAt', headerName: '생성 날짜', width: 300, },
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
    // else {
    //   downloadFileAPI(currentPath, [param.row.filePath]);
    // }
  };

  //speedDial 상태
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(selectFilePath.length >= 1);
  }, [selectFilePath.length, selectFilePath]);
  
  const handleMouseOver = () => {
    if (!open) {
      setOpen(true);
    }
  };
    
  const handleMouseLeave = () => {
    if (open && selectFilePath.length < 1) {
      setOpen(false);
    }
  };
  
  const handleClick = () => {
    setOpen(!open);
  };
  //speedDial 상태

  const actions = [
    { icon: <CreateNewFolderOutlinedIcon />, name: '폴더 추가', onClick: handleValidationFolder, condition: () => (currentPath.path.split('/').length - 1) >= 2 },
    { icon: <CloudUploadOutlinedIcon />, name: '파일 업로드', onClick: () => fileInputRef.current.click(), condition: () => false },
    { icon: <FileDownloadOutlinedIcon />, name: '다운로드', onClick: () => dispatch(setDownloadFileAlert(true)), condition: () => selectFilePath.length < 1 },
    { icon: <RemoveCircleOutlineOutlinedIcon style={{ color: '#FF3B30' }} />, name: '삭제', onClick: () => dispatch(setDeleteFileAlert(true)), condition: () => selectFilePath.length < 1 },
    { icon: <DriveFileRenameOutlineOutlinedIcon />, name: '이름 변경', onClick: handleValidationFileName, condition: () => selectFilePath.length !== 1 || selectFilePath[0].endsWith('/')},
  ];

  return (

    <Grid item xs={12} sm={10} md={10} sx={{ height: 'calc(100vh - 160px)' }}>
      <Paper elevation={6} sx={{height: '100%', position: 'relative'}}>

        <Box sx={{ pl:2, py:1, display:'flex', alignItems:'center'}}>
          <Typography>
            현재 폴더 경로 :
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ pl:2 }}>
            {pathSegments.map((segment, index) => (
              <Box sx={{'&:hover': {cursor: 'pointer'}, display: 'flex', alignItems: 'center' }} key={index} onClick={() => handleBreadCrumb(index)}>
                <FolderIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                {segment}
              </Box>
            ))}
          </Breadcrumbs>
        </Box>

        <ThemeProvider theme={theme}>
          <DataGrid
            sx={{height:'calc(100vh - 210px)', '&:hover': {cursor: 'default'}}}
            rows={rows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            onCellDoubleClick={handleDoubleClick}
            disableColumnMenu
            disableAutoFocus
            disableVirtualization
            onRowSelectionModelChange={(newSelectionModel) => handleSelectCheckbox(newSelectionModel, rows)} // 선택한 filePath 관리
            rowSelectionModel={selectCheckbox}  //체크박스 상태 관리
          />
        </ThemeProvider>

        <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(event) => handleValidationFile(event.target.files)}
            multiple
          />
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 70, right: 30 }}
            icon={<SpeedDialIcon />}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            open={open}
          >
            {actions.filter(action => !action.condition()).map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </SpeedDial>
        </Box>


        <Dialog
          open={folderAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setFolderAlert(false));
            }
          }}
        >
          <DialogTitle>폴더 추가 결과</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {addFolderResult}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(setFolderAlert(false))}>닫기</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={addFolderAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setAddFolderAlert(false));
            }
          }}
        >
          <DialogTitle>새폴더 이름</DialogTitle>
          <DialogContent>
            <DialogContentText>
              최대 100자까지 입력 가능합니다.
            </DialogContentText>
            <DialogContentText>
              공백, #, %, /, \, *, ?,  &lt;, &gt;, |, :, . 같은 특수 문자는 사용할 수 없습니다.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="새폴더 이름 입력"
              type="name"
              fullWidth
              variant="standard"
              onChange={e => dispatch(setFolderName(e.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(setAddFolderAlert(false))}>취소</Button>
            <Button onClick={ handleAddFolder }>추가</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={uploadFileAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setUploadFileAlert(false));
            }
          }}
        >
          <DialogTitle>파일 업로드 결과</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {uploadFileResult}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(setUploadFileAlert(false))}>닫기</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={downloadFileAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setDownloadFileAlert(false));
            }
          }}
        >
          <DialogTitle>파일 다운로드</DialogTitle>
          <DialogContent>
            <DialogContentText>
              선택한 {selectFilePath.length}개 파일을 다운로드하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { downloadFileAPI(); dispatch(setDownloadFileAlert(false)); }}>다운로드</Button>
            <Button onClick={() => dispatch(setDownloadFileAlert(false))}>취소</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={cloudSnackbar}
          autoHideDuration={6000}
          onClose={() => dispatch(setCloudSnackbar(false))}
          message="클라우드에서 다운로드 요청 중입니다."
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => dispatch(setCloudSnackbar(false))}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />



        <Dialog
          open={deleteFileAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setDeleteFileAlert(false));
            }
          }}
        >
          <DialogTitle>파일/폴더 삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>
              선택한 {selectFilePath.length}개 파일을 삭제하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { deleteFileAPI(); dispatch(setDeleteFileAlert(false));  }}>삭제</Button>
            <Button onClick={() => dispatch(setDeleteFileAlert(false))}>취소</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={completeDeleteFileAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setCompleteDeleteFileAlert(false));
            }
          }}
        >
          <DialogTitle>파일/폴더 삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>
              파일/폴더를 삭제하였습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(setCompleteDeleteFileAlert(false))}>확인</Button>
          </DialogActions>
        </Dialog>




        <Dialog
          open={changeNameAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setChangeNameAlert(false));
            }
          }}
        >
          <DialogTitle>파일 이름 변경</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {changeNameResult}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(setChangeNameAlert(false))}>닫기</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={changeNameInputAlert}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              dispatch(setChangeNameInputAlert(false));
            }
          }}
        >
          <DialogTitle>이름 변경 입력</DialogTitle>
          <DialogContent>
            <DialogContentText>
              최대 100자까지 입력 가능합니다.
            </DialogContentText>
            <DialogContentText>
              공백, #, %, /, \, *, ?,  &lt;, &gt;, |, :, . 같은 특수 문자는 사용할 수 없습니다.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="changeName"
              label="파일 이름 입력"
              type="name"
              fullWidth
              variant="standard"
              onChange={e => dispatch(setChangeName(e.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(setChangeNameInputAlert(false))}>취소</Button>
            <Button onClick={ handleChangeName }>변경</Button>
          </DialogActions>
        </Dialog>







      </Paper>
    </Grid>

  );
}