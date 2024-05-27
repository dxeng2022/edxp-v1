import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, IconButton, Radio, RadioGroup, ThemeProvider, Typography, createTheme } from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setParserChangeButton, setRiskDoc, setRiskVisualPage } from '../actions';
import RiskAPI from '../services/RiskAPI';
import { useNavigate } from 'react-router-dom';


export default function RiskVisualLabel() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { parserUpdateAPI } = RiskAPI({});

  const riskDoc = useSelector((state) => state.riskDoc);
  const parserChangeButton = useSelector(state => state.parserChangeButton);
  const riskFile = useSelector(state => state.riskFile);
  const riskData = useSelector(state => state.riskData);
  const docVisualRiskLabelUpdate = useSelector(state => state.docVisualRiskLabelUpdate);

  const [currentPage, setCurrentPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(null);
  const [lastIndex, setLastIndex] = useState(null);
  const [selectSentence, setSelectSentence] = useState({});
  const [selectRisk, setSelectRisk] = useState();
  const [totalRiskCount, setTotalRiskCount] = useState(riskData.riskCounts);

  const currentData = riskDoc.filter((data) => data.PAGE === currentPage);

  const totalIndex = riskDoc.length;
  const lastPage = riskDoc.length > 0 ? riskDoc[riskDoc.length - 1].PAGE : 0;

  const riskCount = currentData.filter(item => item.LABEL === 'Risk').length;

  useEffect(() => {
    if (currentData.length > 0) {
      setFirstIndex(currentData[0].INDEX);
      setLastIndex(currentData[currentData.length - 1].INDEX);
    }
  }, [currentData]);

  const [changeOpen, setChangeOpen] = useState(false);

  const handleChangeOpen = () => {
    setChangeOpen(true);
  };

  const handleChangeClose = () => {
    setChangeOpen(false);
  };

  const handleChangeRisk = () => {
    const newRiskDoc = [...riskDoc];
    newRiskDoc.forEach(parser => {
      if (parser.INDEX === selectSentence.INDEX) {
        parser.LABEL = selectRisk;
      }
    })
    dispatch(setRiskDoc(newRiskDoc));

    if (selectRisk === "Risk") {
      setTotalRiskCount(totalRiskCount + 1);
    } else if (selectRisk === "No Risk" && totalRiskCount > 0) {
      setTotalRiskCount(totalRiskCount - 1);
    };
    
    dispatch(setParserChangeButton(true));
    handleChangeClose();
  };

  const columns = [
    { field: 'PAGE', headerName: '페이지', width: 65, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'SECTION', headerName: '섹션', width: 70, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'SENTENCE', headerName: '문장', width: 400, headerAlign: 'center', sortable: false, flex:1},
    { field: 'LABEL',
      headerName: '분석결과',
      width: 85,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        const icon = params.value === 'Risk' ? <WarningAmberIcon sx={{ color: '#F44336' }} /> : <CheckCircleOutlineIcon color="success"/>;
        return (
          <div 
            style={{ 
              height: '130%',
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
            {icon}
            <div style={{ position: 'absolute', right: -11, top: '80%', transform: 'translateY(-50%)', display: docVisualRiskLabelUpdate ? 'none' : 'flex', }}>
              <IconButton
                className="cell-action-icon"
                size="small"
                style={{ visibility: 'hidden' }}
                color="primary"
                onClick={() => {
                  // 수정 아이콘 클릭 이벤트
                  setSelectSentence(params.row);
                  setSelectRisk(params.row.LABEL);
                  handleChangeOpen()
                }}
              >
                <ModeEditOutlinedIcon />
              </IconButton>
            </div>
          </div>
        );
      },
    },
  ];

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

    const handleRiskVisualPage = () => {
      dispatch(setRiskVisualPage(true));
      
    };
    
  
    return (
      <GridToolbarContainer sx={{ px:2, flexGrow:1, display:'flex', justifyContent: 'space-between', flexWrap: 'nowrap', overflow:'hidden' }}>
        <Box sx={{width:'70px'}}>
          <Typography variant='caption' noWrap > 위험 {riskCount} 문장 </Typography>
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
        <Box>
          {parserChangeButton ? <Button variant="contained" sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={parserUpdateAPI}> 변경내용 저장 </Button>
          : <Button variant="contained" color="success" sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={handleRiskVisualPage} > 시각화 </Button>}
        </Box>
        </Box>
      </GridToolbarContainer>
    );
  };


  const rowMouseEnter = document.querySelectorAll('& .MuiDataGrid-row');
  rowMouseEnter.forEach((row, i) => {row.addEventListener('mouseover', () =>{
    const iconButton = row.querySelector('.cell-action-icon');
    iconButton.style.visibility = 'visible';
  })});

  const rowMouseLeave = document.querySelectorAll('& .MuiDataGrid-row');
  rowMouseLeave.forEach((row, i) => {row.addEventListener('mouseout', () =>{
    const iconButton = row.querySelector('.cell-action-icon');
    iconButton.style.visibility = 'hidden';
  })});

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
          row: {
            '&.risk-row': {
              backgroundColor: '#FFECB3',
            },
          },
        },
      },
    },
  });

  const getRowClassName = (params) => {
    return params.row.LABEL === 'Risk' ? 'risk-row' : '';
  };

  const handleRadioChange = (event) => {
    setSelectRisk(event.target.value);
  };

  const handleButtonClick = () => {
    navigate('/module');
  };

  return (
    <Box sx={{height: 'calc(100vh - 215px)', position: 'relative'}}>
      <Box sx={{ zIndex:1, px:2, py:0.5, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'sticky', top: 0, backgroundColor:'#FFFFFF' }}>
        <Box sx={{ display:'flex', alignItems:'end', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          <Typography variant='h5' sx={{ pr:1 }}> {riskFile.split('/').pop()} 시각화 </Typography>
          <Typography variant='caption'> (총 {totalIndex} 문장 / </Typography>
          <Typography variant='caption' sx={{pl:'4px'}}> 총 위험 {totalRiskCount} 문장 ) </Typography>
        </Box>
        <Box sx={{ display:'flex' }}>
          <Button sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={handleButtonClick}> 홈으로 </Button>
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
          getRowClassName={getRowClassName}
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
        maxWidth="md"
      >
        <DialogTitle> 선택 문장 분석결과 수정</DialogTitle>
        <DialogContent>
          <DialogContentText>
            사용자가 임의 수정한 분석결과는 분석 모델과 상관 없음을 알려드립니다.
          </DialogContentText>
        </DialogContent>
        <DialogContent sx={{pt:0}}>
          <Typography> 선택 문장 : {selectSentence.SENTENCE || ''} </Typography>
        </DialogContent>
        <DialogContent sx={{display:'flex', justifyContent:'center', py:0}}>
          <FormControl>
            <RadioGroup row value={selectRisk} onChange={handleRadioChange}>
              <FormControlLabel
                labelPlacement="bottom"
                value="No Risk"
                control={<Radio />}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleOutlineIcon color="success" /> No Risk
                  </div>
                }
              />
              <FormControlLabel
                labelPlacement="bottom"
                value="Risk"
                control={<Radio />}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <WarningAmberIcon sx={{ color: '#F44336' }} /> Risk
                  </div>
                }
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleChangeClose}>취소</Button>
          <Button type="submit" onClick={handleChangeRisk}>반영</Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
}