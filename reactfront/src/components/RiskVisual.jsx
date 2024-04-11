import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Box, Button, Container, Grid, IconButton, Paper, ThemeProvider, Typography, createTheme } from "@mui/material";
import RiskPreview from "./RiskPreview";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function RiskVisual() {

  const parserDoc = useSelector((state) => state.parserDoc);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerIndex, setRowPerIndex] = useState(null);
  const [firstIndex, setFirstIndex] = useState(null);
  const [lastIndex, setLastIndex] = useState(null);

  const currentData = parserDoc.filter((data) => data.PAGE === currentPage);

  const totalIndex = parserDoc.length;
  const lastPage = parserDoc.length > 0 ? parserDoc[parserDoc.length - 1].PAGE : 0;

  useEffect(() => {
    setRowPerIndex(lastIndex - firstIndex + 1)
  }, [firstIndex, lastIndex]);

  useEffect(() => {
    if (currentData.length > 0) {
      setFirstIndex(currentData[0].INDEX);
      setLastIndex(currentData[currentData.length - 1].INDEX);
    }
  }, [currentData]);

  useEffect(() => {
    console.log(currentData);
  }, [currentData]);



  const columns = [
    { field: 'LABEL', headerName: '라벨', width: 85, headerAlign: 'center', align: 'center', sortable: false},
    { field: 'PAGE', headerName: '페이지', width: 65, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'SECTION', headerName: '섹션', width: 70, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'SENTENCE', headerName: '문장', width: 400, headerAlign: 'center', sortable: false, flex:1},
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
          <Button sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small"> 시각화 </Button>
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

  return (
    <Box sx={{my: 3}}>
      <Container maxWidth="false">
        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={5} md={5} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{height: '100%', position: 'relative'}}>
              <RiskPreview/>
            </Paper>
          </Grid>

            
          <Grid item xs={12} sm={7} md={7} sx={{ height: 'calc(100vh - 160px)' }}>
            <Paper elevation={6} sx={{height: '100%', position: 'relative'}}>
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
              </Paper>
            </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
