import CloseIcon from '@mui/icons-material/Close';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Box, Chip, Grid, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';

export default function VisualDrawComponentInfo({ handleInfoClose, componentPath, componentName, getCount, matchedData, ratio, xy, page, rowsPerPage, handleCellClick, setPage }) {

  return (
    <Grid item component={Paper} elevation={12} xs={6} sm={6} md={6} sx={{ mt:'32px', pb:'10px', pt: 0, height: 'calc(100vh - 330px)', overflow:'auto',  borderRadius: '20px'  }} >
      <Box sx={{ pr:2, display:'flex', justifyContent:'flex-End', position:'sticky', top:0 }}>
        <CloseIcon sx={{'&:hover': {cursor: 'pointer'}}} onClick={() => handleInfoClose()} />
      </Box>

      <Box sx={{ pr:2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img
          // src={process.env.PUBLIC_URL + componentPath + componentName + '.png'}
          src={'https://dxeng.s3.ap-northeast-2.amazonaws.com/drawimg' + componentPath + componentName + '.png'}
          alt='미리보기 이미지 없음'
          loading="lazy"
          style={{ maxWidth: '90%', height: 'auto', border: '1px solid grey' }}
          />
        <Typography variant="h6" sx={{py:3, whiteSpace: 'normal', wordBreak: 'break-all', fontWeight: 'bold' }}> {componentName} </Typography>

        <TableContainer>
          <Table sx={{ maxWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>전체 Component</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>해당 Component</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>비율</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                  <TableCell align="center">{getCount()+'개'}</TableCell>
                  <TableCell align="center">{matchedData ? matchedData.value+'개' : 'N/A'}</TableCell>
                  <TableCell align="center">{ratio.toFixed(1)+'%'}</TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer sx={{pt:3}}>
          <Table sx={{ maxWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}> No. </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}> 고유 ID </TableCell>
                <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold' }}> 위치 </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(xy)
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map(([key, location], index) => (
                <TableRow key={key}>
                  <TableCell
                    align="center"
                    sx={{ 
                      minWidth: '50px',
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {(page * rowsPerPage) + index + 1}
                  </TableCell>
                  <Tooltip title={key} placement="top" arrow slotProps={{ popper: { modifiers: [{name: 'offset', options: { offset: [0, -15]}}]}}}>
                    <TableCell
                      align="center"
                      sx={{ 
                        minWidth: '30px',
                        maxWidth: '130px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {key}
                    </TableCell>
                  </Tooltip>
                  <TableCell
                    align="center"
                    sx={{ 
                      minWidth: '30px',
                      maxWidth: '130px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {
                      'start' in location
                      ? `${Math.floor(location.start.x)}, ${Math.floor(location.start.y)}`
                      : `${Math.floor(location.x)}, ${Math.floor(location.y)}`
                    }
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ 
                      minWidth: '100px',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Chip
                      label="보기"
                      variant="outlined"
                      color="warning"
                      size="small"
                      icon={<FmdGoodIcon />}
                      onClick={() => handleCellClick(location)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          size="small"
          sx={{py:1}}
          count={Math.ceil(Object.keys(xy).length / rowsPerPage)}
          page={page + 1}
          onChange={(event, newPage) => setPage(newPage - 1)}
        />

      </Box>

    </Grid>
  );
}