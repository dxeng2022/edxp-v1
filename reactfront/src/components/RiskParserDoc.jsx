import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { setCurrentPath, setParserChangeButton, setParserDoc } from '../actions';
import RiskAPI from '../services/RiskAPI';

export default function RiskParserDoc() {


  // 페이지 이동 시
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

  const dispatch = useDispatch();

  const handleButtonClick = () => {
    // window.removeEventListener('beforeunload', handleBeforeUnload.current);
    dispatch(setCurrentPath('doc/'));
    window.location.reload();
  };
  // 페이지 이동 시

  const { parserUpdateAPI, riskAnalysisAPI } = RiskAPI({});

  const parserDoc = useSelector((state) => state.parserDoc);
  const riskFile = useSelector(state => state.riskFile);
  const parserChangeButton = useSelector(state => state.parserChangeButton);


  const [currentPage, setCurrentPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(null);
  const [lastIndex, setLastIndex] = useState(null);
  const [selectSentence, setSelectSentence] = useState({});
  const [rowPerIndex, setRowPerIndex] = useState(null);

  const totalIndex = parserDoc.length;
  const lastPage = parserDoc.length > 0 ? parserDoc[parserDoc.length - 1].PAGE : 0;

  const currentData = parserDoc.filter((data) => data.PAGE === currentPage);


  const handleDeleteSentence = (INDEX) => {
    let newParserDoc = [...parserDoc];
    newParserDoc = newParserDoc.filter((parser) => parser.INDEX!== INDEX);
    dispatch(setParserDoc(newParserDoc));
    dispatch(setParserChangeButton(true));
  };

  useEffect(() => {
    setRowPerIndex(lastIndex - firstIndex + 1)
  }, [firstIndex, lastIndex]);


  const columns = [
    { field: 'PAGE', headerName: '페이지', width: 65, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'SECTION', headerName: '섹션', width: 70, headerAlign: 'center', align: 'center', sortable: false },
    {
      field: 'SENTENCE',
      headerName: '문장',
      width: 400,
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <div 
            style={{ 
              height: '130%',
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(event) => {
              // 아이콘 버튼들을 보여줍니다.
              const iconButtons = event.currentTarget.querySelectorAll('.cell-action-icon');
              iconButtons.forEach(button => button.style.visibility = 'visible');
            }}
            onMouseLeave={(event) => {
              // 아이콘 버튼들을 숨깁니다.
              const iconButtons = event.currentTarget.querySelectorAll('.cell-action-icon');
              iconButtons.forEach(button => button.style.visibility = 'hidden');
            }}
          >
            {params.value}
            <div style={{ position: 'absolute', right: -11, top: '90%', transform: 'translateY(-50%)', display: 'flex' }}>
              <IconButton
                className="cell-action-icon"
                size="small"
                style={{ visibility: 'hidden' }}
                color="primary"
                onClick={() => {
                  // 수정 아이콘 클릭 이벤트
                  setSelectSentence(params.row);
                  handleChangeOpen()
                }}
              >
                <ModeEditOutlinedIcon />
              </IconButton>
              <IconButton
                className="cell-action-icon"
                size="small"
                style={{ visibility: 'hidden' }}
                color="error"
                onClick={() => {
                  setSelectSentence(params.row);
                  handleDeleteOpen();
                }}
              >
                <DeleteForeverOutlinedIcon />
              </IconButton>
              <IconButton
                className="cell-action-icon"
                size="small"
                style={{ visibility: 'hidden', fontSize: 5 }}
                onClick={() => {
                  setSelectSentence(params.row);
                  handleAddOpen();
                }}
              >
                <PlaylistAddIcon />
              </IconButton>
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (currentData.length > 0) {
      setFirstIndex(currentData[0].INDEX);
      setLastIndex(currentData[currentData.length - 1].INDEX);
    }
  }, [currentData]);


  function CustomPagination({ setCurrentPage, currentPage, lastPage }) {

    const handlePreviousPageChange = () => {
      setCurrentPage((prevCurrentPage) => (prevCurrentPage > 1 ? prevCurrentPage - 1 : 1));
    };
  
    const handleNextPageChange = () => {
      setCurrentPage((prevCurrentPage) => (prevCurrentPage < lastPage ? prevCurrentPage + 1 : lastPage));
    };
  
    const [pageNumber, setPageNumber] = useState(currentPage);

    const handleInputPageChange = (event) => {
      const inputText = event.target.value;
      const newPageNumber = inputText !== '' && !isNaN(inputText) ? parseInt(inputText) : '';
      setPageNumber(newPageNumber);
    };
    
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= lastPage) {
          setCurrentPage(pageNumber);
        } else {
          setPageNumber(currentPage);
        }
      }
    };
  
    return (
      <GridToolbarContainer sx={{ px:2, flexGrow:1, display:'flex', justifyContent: 'space-between', flexWrap: 'nowrap', overflow:'hidden' }}>
        <Box sx={{width:'70px'}}>
          <Typography variant='caption' noWrap > {rowPerIndex} 문장 </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
          <IconButton sx={{ px: 0 }} onClick={() => setCurrentPage(1)}> <KeyboardDoubleArrowLeftIcon /> </IconButton>
          <IconButton sx={{ px: 0 }} onClick={handlePreviousPageChange}> <KeyboardArrowLeftIcon /> </IconButton>
          <input style={{ width: '35px' }} value={pageNumber} onChange={handleInputPageChange} onKeyDown={handleKeyDown} />
          <Typography variant='caption'> &nbsp; / {lastPage} 페이지 </Typography>
          <IconButton sx={{ px: 0 }} onClick={handleNextPageChange}> <KeyboardArrowRightIcon /> </IconButton>
          <IconButton sx={{ px: 0 }} onClick={() => setCurrentPage(lastPage)}> <KeyboardDoubleArrowRightIcon /> </IconButton>
        </Box>
        <Box>
          {parserChangeButton ? <Button variant="contained" sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={parserUpdateAPI}> 변경 내용 저장 </Button>
          : <Button color="success" endIcon={<SendIcon />} sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={riskAnalysisAPI}> 독소조항 분석 </Button>}
        </Box>
      </GridToolbarContainer>
    );
  };

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

  const [changeOpen, setChangeOpen] = useState(false);

  const handleChangeOpen = () => {
    setChangeOpen(true);
  };

  const handleChangeClose = () => {
    setChangeOpen(false);
  };

  const handleInputChange = (event, field) => {
    setSelectSentence(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleChange = () => {
    if (!selectSentence.SENTENCE.trim()) {
      alert('문장을 입력해주세요.');
      return;
    }
  
    const newParserDoc = [...parserDoc];
    newParserDoc.forEach(parser => {
      if (parser.INDEX === selectSentence.INDEX) {
        parser.SECTION = selectSentence.SECTION;
        parser.SENTENCE = selectSentence.SENTENCE;
      }
    })
    dispatch(setParserDoc(newParserDoc));
    dispatch(setParserChangeButton(true));
    handleChangeClose();
  };

  const [addOpen, setAddOpen] = useState(false);

  const handleAddOpen = () => {
    setAddOpen(true);
  };

  const handleAddClose = () => {
    setAddOpen(false);
  };

  const [addIndex, setAddIndex] = useState();

  const handleAddUp = () => {
    let index = parserDoc.findIndex(item => item.INDEX === selectSentence.INDEX);
    setAddIndex(index);
  };

  const handleAddDown = () => {
    let index = parserDoc.findIndex(item => item.INDEX === selectSentence.INDEX);
    index = index + 1;
    setAddIndex(index);
  };

  const handleAddSentence = () => {
    if (!selectSentence.SENTENCE.trim()) {
      alert('문장을 입력해주세요.');
      return;
    }
  
    const newSentenceObj = {
      INDEX: Math.max(0, ...parserDoc.map(s => s.INDEX)) + 1,
      LABEL: null,
      PAGE: selectSentence.PAGE,
      SECTION: selectSentence.SECTION,
      SENTENCE: selectSentence.SENTENCE,
    };
  
    const newParserDoc = [...parserDoc];
    newParserDoc.splice(addIndex, 0, newSentenceObj);
  
    const sortedParserDoc = newParserDoc
      .map((sentence, idx) => ({ ...sentence, INDEX: idx + 1 }));
  
    dispatch(setParserDoc(sortedParserDoc));
    handleAddSentenceClose();
    dispatch(setParserChangeButton(true));
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const [addSentenceOpen, setAddSentenceOpen] = useState(false);

  const handleAddSentenceOpen = () => {
    setSelectSentence({ ...selectSentence, SENTENCE: '' });
    setAddSentenceOpen(true);
  };

  const handleAddSentenceClose = () => {
    setAddSentenceOpen(false);
  };


  return (
    <Box sx={{ height: 'calc(100vh - 215px)', width: '100%' }}>
      <Box sx={{ zIndex:1, px:2, py:0.5, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'sticky', top: 0, backgroundColor:'#FFFFFF' }}>
        <Box sx={{ display:'flex', alignItems:'end', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          <Typography variant='h5' sx={{ pr:1 }}> {riskFile.split('/').pop()} </Typography>
          <Typography variant='caption'> (총 {lastPage} 페이지 / </Typography>
          <Typography variant='caption' sx={{pl:'4px'}}> 총 {totalIndex} 문장 ) </Typography>
        </Box>
        <Box sx={{ display:'flex' }}>
          <Button sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={handleButtonClick}> <RestorePageOutlinedIcon fontSize='small' /> 되돌아가기 </Button>
        </Box>
      </Box>
      <ThemeProvider theme={theme}>
        <DataGrid
          sx={{
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
              py: '10px',
            },
          }}
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
          rows={currentData}
          columns={columns}
          pagination
          getRowId={(row) => row.INDEX}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          page={currentPage - 1}
          components={{
            Pagination: () => <CustomPagination 
              setCurrentPage={setCurrentPage}
              firstIndex={firstIndex}
              lastIndex={lastIndex}
              totalIndex={totalIndex}
              currentPage={currentPage}
              lastPage={lastPage}
            />
          }}
        />
      </ThemeProvider>

      

      <Dialog
        open={changeOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleChangeClose();
          }
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> {currentPage}페이지의 문장 수정</DialogTitle>
        <DialogContent>
          <DialogContentText>
            선택한 문장의 섹션, 문장을 수정할 수 있습니다.
          </DialogContentText>
          <TextField
            margin="normal"
            label="섹션"
            fullWidth
            variant="standard"
            value={selectSentence.SECTION || ''}
            onChange={(e) => handleInputChange(e, 'SECTION')}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            label="문장"
            fullWidth
            variant="standard"
            multiline
            value={selectSentence.SENTENCE || ''}
            onChange={(e) => handleInputChange(e, 'SENTENCE')}
          />
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleChangeClose}>취소</Button>
          <Button type="submit" onClick={handleChange}>수정</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={deleteOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleDeleteClose();
          }
        }}
      >
        <DialogTitle>
          해당 문장 삭제
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            선택 문장 :
          </DialogContentText>
          <DialogContentText>
            {selectSentence.SENTENCE || ''}
          </DialogContentText>
          <DialogContentText>
            &nbsp;
          </DialogContentText>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>취소</Button>
          <Button color='error' onClick={() => {handleDeleteSentence(selectSentence.INDEX); handleDeleteClose();}}>삭제</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={addOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleAddClose();
          }
        }}
      >
        <DialogTitle>
          새로운 문장 추가 위치 선택
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            <Chip variant="outlined" color="info" icon={<ArrowUpwardIcon />} onClick={() => {handleAddUp(); handleAddClose(); handleAddSentenceOpen();}} label='문장 위'/>
          </Box>
          <DialogContentText>
            &nbsp;
          </DialogContentText>
          <DialogContentText>
            선택 문장 :
          </DialogContentText>
          <DialogContentText>
            {selectSentence.SENTENCE || ''}
          </DialogContentText>
          <DialogContentText>
            &nbsp;
          </DialogContentText>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            <Chip variant="outlined" color="info" icon={<ArrowDownwardIcon />} onClick={() => {handleAddDown(); handleAddClose(); handleAddSentenceOpen();}} label='문장 아래'/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleAddClose}>취소</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addSentenceOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleAddSentenceClose();
          }
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> {currentPage}페이지의 문장 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            섹션, 문장을 추가할 수 있습니다.
          </DialogContentText>
          <TextField
            margin="normal"
            label="섹션"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, 'SECTION')}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            label="문장"
            fullWidth
            variant="standard"
            multiline
            onChange={(e) => handleInputChange(e, 'SENTENCE')}
          />
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleAddSentenceClose}>취소</Button>
          <Button type="submit" onClick={handleAddSentence}>추가</Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
}