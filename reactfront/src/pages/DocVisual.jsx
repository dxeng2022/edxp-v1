import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box, Typography, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Doughnut, Pie } from 'react-chartjs-2'
import { Chart, ArcElement } from 'chart.js/auto'
Chart.register(ArcElement);

const DocVisual = () => {

  const [fileUploaded, setFileUploaded] = useState(false);

  const [tablePlantItem, setTablePlantItem] = useState([]);
  const [tablePlantLine, setTablePlantLine] = useState([]);











  const handleFileUpload = (event) => {
    const parseXmlData = (xmlData) => {
      const parser = new DOMParser();
      return parser.parseFromString(xmlData, 'application/xml');
    };

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const xmlData = e.target.result; // 파일 내용을 변수에 저장
      const parsedData = parseXmlData(xmlData);  //xml 파일 parsing

      const tablePlantItem = Array.from(parsedData.querySelectorAll('PlantItem')).map(item => ({
        symbolType: item.querySelector('SymbolType').textContent,
        ComponentClass: item.querySelector('ComponentClass').textContent
      }));
      setTablePlantItem(tablePlantItem); //PlantItem 객체 저장

      const tablePlantLine = Array.from(parsedData.querySelectorAll('PlantLine')).map(item => ({
        lineType: item.querySelector('LineType').textContent,
        lineStyle: item.querySelector('LineStyle').textContent
      }));
      setTablePlantLine(tablePlantLine); //PlantIne 객체 저장
    };
    reader.readAsText(file);
    setFileUploaded(true);
  };





















  // symbol에 대한 차트
  const [clickedSymbolType, setClickedSymbolType] = useState(null);
  
  // Doughnut 차트 데이터 - symbolType에 대한 데이터
  const countBySymbolType = tablePlantItem.reduce((acc, item) => {
    const { symbolType } = item;
    if (acc[symbolType]) {
      acc[symbolType] += 1;
    } else {
      acc[symbolType] = 1;
    }
    return acc;
  }, {});
  
  const symbolChartData = {
    labels: Object.keys(countBySymbolType),
    datasets: [
      {
        data: Object.values(countBySymbolType),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          // Add more colors if needed
        ],
      },
    ],
  };
  
  // 클릭 이벤트 핸들러
  const handleSymbolChartClick = (event, elements) => {
    if (elements && elements.length > 0 && !clickedSymbolType) {
      const clickedData = symbolChartData.labels[elements[0].index];
      setClickedSymbolType(clickedData);
    }
  };

  // 데이터 변환 - symbolType에 따른 각 ComponentClass의 갯수
  const countByComponentClass = tablePlantItem.reduce((acc, item) => {
    const { symbolType, ComponentClass } = item;
    if (symbolType === clickedSymbolType) {
      if (!acc[ComponentClass]) {
        acc[ComponentClass] = 0;
      }
      acc[ComponentClass]++;
    }
    return acc;
  }, {});

  // Doughnut 차트 데이터 - 클릭한 symbolType에 대한 ComponentClass 데이터
  const componentChartData = {
    labels: Object.keys(countByComponentClass),
    datasets: [
      {
        data: Object.values(countByComponentClass),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          // Add more colors if needed
        ],
      },
    ],
  };
  // symbol에 대한 차트



















  // line에 대한 차트
  const [clickedLineType, setClickedLineType] = useState(null);

  const countByLineType = tablePlantLine.reduce((acc, item) => {
    const { lineType } = item;
    if (acc[lineType]) {
      acc[lineType] += 1;
    } else {
      acc[lineType] = 1;
    }
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(countByLineType),
    datasets: [
      {
        data: Object.values(countByLineType),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const handleLineChartClick = (event, elements) => {
    if (elements && elements.length > 0 && !clickedSymbolType) {
      const clickedData = lineChartData.labels[elements[0].index];
      setClickedLineType(clickedData);
    }
  };

    // 데이터 변환 - symbolType에 따른 각 ComponentClass의 갯수
    const countByLineStyle = tablePlantLine.reduce((acc, item) => {
      const { lineType, lineStyle } = item;
      if (lineType === clickedLineType) {
        if (!acc[lineStyle]) {
          acc[lineStyle] = 0;
        }
        acc[lineStyle]++;
      }
      return acc;
    }, {});

    const lineStyleChartData = {
      labels: Object.keys(countByLineStyle),
      datasets: [
        {
          data: Object.values(countByLineStyle),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            // Add more colors if needed
          ],
        },
      ],
    };
    // line에 대한 차트
















  // symbol에 대한 표
  const symbolTypeCounts = tablePlantItem.reduce((counts, item) => {
    const { symbolType, ComponentClass } = item;
    if (!counts[symbolType]) {
      counts[symbolType] = {};
    }
    counts[symbolType][ComponentClass] = (counts[symbolType][ComponentClass] || 0) + 1;
    return counts;
  }, {});

  const symbolTypeData = Object.entries(symbolTypeCounts).map(([symbolType, componentClasses]) => ({
    symbolType,
    componentClasses,
    count: Object.values(componentClasses).reduce((a, b) => a + b, 0),
  }));

  const TableSymbol = ({ row }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.symbolType}</TableCell>
          <TableCell>{row.count}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/* <Typography variant="h6" gutterBottom component="div">
                  ComponentClass
                </Typography> */}
                <Table size="small" aria-label="component-class">
                  <TableHead>
                    <TableRow>
                      <TableCell>ComponentClass</TableCell>
                      <TableCell>Counts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(row.componentClasses).map(([componentClass, count]) => (
                      <TableRow key={componentClass}>
                        <TableCell style={{ width: '400px'}}>{componentClass}</TableCell>
                        <TableCell>{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };
  // symbol에 대한 표















  // line에 대한 표
  const lineTypeCounts = tablePlantLine.reduce((counts, item) => {
    const { lineType, lineStyle } = item;
    if (!counts[lineType]) {
      counts[lineType] = {};
    }
    counts[lineType][lineStyle] = (counts[lineType][lineStyle] || 0) + 1;
    return counts;
  }, {});

  const lineTypeData = Object.entries(lineTypeCounts).map(([lineType, lineStyles]) => ({
    lineType,
    lineStyles,
    count: Object.values(lineStyles).reduce((a, b) => a + b, 0),
  }));

  const TableLine = ({ row }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.lineType}</TableCell>
          <TableCell>{row.count}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/* <Typography variant="h6" gutterBottom component="div">
                  LineStyle
                </Typography> */}
                <Table size="small" aria-label="component-class">
                  <TableHead>
                    <TableRow>
                      <TableCell>LineStyle</TableCell>
                      <TableCell>Counts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(row.lineStyles).map(([lineStyle, count]) => (
                      <TableRow key={lineStyle}>
                        <TableCell>{lineStyle}</TableCell>
                        <TableCell>{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  };
  // line에 대한 표



























  //렌더링
  return (

    <div className='docpoison_box' style={{ display: 'flex', flexDirection: 'column', height: '600px', overflow: 'auto' }}>
      {!fileUploaded && (
        <input type='file' accept='.xml' onChange={handleFileUpload} />
      )}
  
      {tablePlantItem.length > 0 && (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <div id="chart-container" style={{ width: '50%' }}>
            {clickedSymbolType ? (
              <Doughnut data={componentChartData} />
            ) : (
              <Pie data={symbolChartData} options={(!clickedSymbolType) ? { onClick: handleSymbolChartClick } : {}} />
            )}
            <Button variant='text' size="small" onClick={() => setClickedSymbolType(null)}>Symbol Chart Reset</Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>SymbolType</TableCell>
                  <TableCell>Counts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {symbolTypeData.map((row, index) => (
                  <TableSymbol key={index} row={row} />
                ))}
              </TableBody>
            </Table>
          </div>
          <div id="chart-line" style={{ width: '50%' }}>
            {clickedLineType ? (
              <Doughnut data={lineStyleChartData} />
            ) : (
              <Pie data={lineChartData} options={(!clickedLineType) ? { onClick: handleLineChartClick } : {}} />
            )}
            <Button variant='text' size="small" onClick={() => setClickedLineType(null)}>Line Chart Reset</Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>LineType</TableCell>
                  <TableCell>Counts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lineTypeData.map((row, index) => (
                  <TableLine key={index} row={row} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}


    </div>
  );
};

export default DocVisual;