import BarChartIcon from '@mui/icons-material/BarChart';
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import { Box, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { useSelector } from 'react-redux';
import { cheerfulFiestaPaletteLight } from '@mui/x-charts/colorPalettes';


export default function VisualDrawChart() {

  const visualDrawJson = useSelector(state => state.visualDrawJson);
  const visualDrawLineData = useSelector(state => state.visualDrawLineData);
  const visualDrawSymbolData = useSelector(state => state.visualDrawSymbolData);
  const visualDrawCirclepackingData = useSelector(state => state.visualDrawCirclepackingData);
  
  const sum = visualDrawLineData.reduce((total, item) => total + item.value, 0);

  const getArcLabel = (params) => {
    const percent = params / sum;
    return `${(percent * 100).toFixed(1)}%`;
  };

  const data = [
    { 
      name: 'Count',
      Symbol: visualDrawJson.countSymbol,
      Line: visualDrawJson.countLine,
      SymbolColor: "#FF9966", // Symbol의 색상
      LineColor: "#8DA0CB",   // Line의 색상
    },
  ];

  const CenterMetric = ({ centerX, centerY, dataWithArc }) => {
    let text = ''; 
  
    dataWithArc.forEach(datum => {
      if (datum.data.id.includes('Line')) {
        text = 'Line';
      } else if (datum.data.id.includes('valve')) {
        text = 'Symbol';
      }
    });
  
    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '22px',
          fontWeight: '600',
        }}
      >
        {text}
      </text>
    );
  };

  const calculateTotal = (data) => {
    return data.children.reduce((total, parent) => {
      return total + parent.children.reduce((parentTotal, child) => parentTotal + child.loc, 0);
    }, 0);
  };
  
  const createLabel = (name, value, total) => {
    const maxLength = 10; // 최대 문자열 길이 설정
    // 이름이 최대 길이를 초과하면 잘라내고 "..."를 추가
    const trimmedName = name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
    const percentage = ((value / total) * 100).toFixed(1);
  
    return `${trimmedName} (${percentage}%)`;
  };
  
  // 전체 합계 계산
  const totalValue = calculateTotal(visualDrawCirclepackingData);

  const getParentLabelWithPercentage = (parentNode, total) => {
    // parentNode.value는 해당 부모 노드의 자식 노드들의 'loc' 값을 모두 더한 값입니다.
    const percentage = ((parentNode.value / total) * 100).toFixed(1);
    const maxLength = 50; // 최대 문자열 길이 설정
    const trimmedName = parentNode.id.length > maxLength 
      ? parentNode.id.substring(0, maxLength) + '...' 
      : parentNode.id;
  
    return `${trimmedName} (${percentage}%)`;
  };
  
  const labels = visualDrawCirclepackingData.children.map(parent => ({
    id: parent.name,
    label: createLabel(parent.name, parent.children.reduce((acc, child) => acc + child.loc, 0), totalValue)
  })).concat(
    visualDrawCirclepackingData.children.flatMap(parent => 
      parent.children.map(child => ({
        id: child.name,
        label: createLabel(child.name, child.loc, totalValue)
      }))
    )
  );

  return (
    <Container sx={{ width: '100%', height: 'calc(100vh - 257px)', overflow:'auto' }}>
            
      <Box sx={{ width: '100%', pb: 1 }}>

        <Grid container spacing={1} sx={{ mb: 3 }}>

          <Grid item xs={12} sm={12} md={12} >

            <Box sx={{width: '100%', height: 350, mt:3}}>
              <Box>
                <Typography sx={{ ml:1, display: 'flex', alignItems:'center'}} variant="body1"> <BarChartIcon color="disabled" /> Component 분포도 </Typography>
              </Box>
              <ResponsiveTreeMap
                data={visualDrawCirclepackingData}
                identity="name"
                value="loc"
                innerPadding={3}
                outerPadding={3}
                tile="binary"
                colors={{ scheme: 'set2' }}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                label={node => {
                  const nodeLabel = labels.find(labelInfo => labelInfo.id === node.data.name);
                  return nodeLabel ? nodeLabel.label : '';
                }}
                parentLabel={parentNode => {
                  return getParentLabelWithPercentage(parentNode, totalValue);
                }}
                labelSkipSize={30}
                orientLabel={false}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1
                        ]
                    ]
                }}
                parentLabelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            3
                        ]
                    ]
                }}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.1
                        ]
                    ]
                }}
                motionConfig="slow"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={12} >

            <Box sx={{width: '100%', height: 300, mt:6}}>
              <Box>
                <Typography sx={{ ml:1, display: 'flex', alignItems:'center'}} variant="body1" > <BarChartIcon color="disabled" /> Symbol & Line Component 갯수 </Typography>
              </Box>
              <ResponsiveBar
                data={data}
                keys={[ 'Symbol', 'Line' ]}
                indexBy="name"
                margin={{ top: 10, right: 30, bottom: 70, left: 50 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                axisTop={null}
                axisRight={null}
                labelSkipWidth={12}
                labelSkipHeight={12}
                layout="horizontal"
                enableGridX={true}
                enableGridY={false}
                innerPadding={3}
                colors={({ id, data }) => id === 'Symbol' ? data.SymbolColor : data.LineColor}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 10,
                    translateY: 50,
                    itemWidth: 80,
                    itemHeight: 20,
                    itemsSpacing: 1,
                    symbolSize: 15,
                    itemDirection: 'left-to-right'
                  }
                ]}
                role="application"
              />
            </Box>
          </Grid>

        </Grid>

      </Box>
      
      <Grid container sx={{ mb: 3 }}>
        
        <Grid item xs={12} sm={12} md={12} >
          <Box sx={{ width:'100%', height: 350, mt:4 }}>
            <Box>
              <Typography sx={{ ml:1, display: 'flex', alignItems:'center'}} variant="body1"> <BarChartIcon color="disabled" /> Symbol Component 상세정보 </Typography>
            </Box>
            <ResponsivePie
              data={visualDrawSymbolData}
              margin={{ top: 30, right: 30, bottom: 40, left: 30 }}
              sortByValue={true}
              innerRadius={0.5}
              activeOuterRadiusOffset={10}
              arcLinkLabelsSkipAngle={20}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsStraightLength={10}
              arcLinkLabelsThickness={3}
              arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
              arcLabelsSkipAngle={20}
              arcLabelsTextColor="#ffffff"
              transitionMode="endAngle"
              layers={['arcs', 'arcLabels', 'arcLinkLabels', CenterMetric]}
              colors={cheerfulFiestaPaletteLight}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Box>
            <TableContainer sx={{ overflow: 'auto', maxHeight: '230px', width: '100%', mt:3 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" width="10%">Color</TableCell>
                    <TableCell align="left" width="50%">Name</TableCell>
                    <TableCell align="right" width="20%">Value</TableCell>
                    <TableCell align="right" width="20%">Ratio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visualDrawSymbolData.map((data, index) => (
                    <TableRow key={data.id} >
                      <TableCell align="center" width="10%">
                        <SquareRoundedIcon sx={{ color: cheerfulFiestaPaletteLight[index % cheerfulFiestaPaletteLight.length], fontSize: 15 }} />
                      </TableCell>
                      <TableCell 
                        align="left"
                        width="50%"
                        sx={{ 
                          maxWidth: '5vh',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {data.label}
                      </TableCell>
                      <TableCell align="right" width="20%">
                        {data.value}
                      </TableCell>
                      <TableCell align="right" width="20%">
                        {getArcLabel(data.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>


      <Grid container sx={{ mb: 3 }}>

        <Grid item xs={12} sm={12} md={12} >
          <Box sx={{ width:'100%', height: 350, mt:4 }}>
            <Box>
              <Typography sx={{ ml:1, display: 'flex', alignItems:'center'}} variant="body1"> <BarChartIcon color="disabled" /> Line Component 상세정보 </Typography>
            </Box>
            <ResponsivePie
              data={visualDrawLineData}
              margin={{ top: 30, right: 30, bottom: 40, left: 30 }}
              sortByValue={true}
              innerRadius={0.5}
              activeOuterRadiusOffset={10}
              arcLinkLabelsSkipAngle={20}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsStraightLength={10}
              arcLinkLabelsThickness={3}
              arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
              arcLabelsSkipAngle={20}
              arcLabelsTextColor="#ffffff"
              transitionMode="endAngle"
              layers={['arcs', 'arcLabels', 'arcLinkLabels', CenterMetric]}
              colors={cheerfulFiestaPaletteLight}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Box>
            <TableContainer sx={{ overflow: 'auto', maxHeight: '230px', width: '100%', mt:3 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" width="10%">Color</TableCell>
                    <TableCell align="left" width="50%">Name</TableCell>
                    <TableCell align="right" width="20%">Value</TableCell>
                    <TableCell align="right" width="20%">Ratio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visualDrawLineData.map((data, index) => (
                    <TableRow key={data.id} >
                      <TableCell align="center" width="10%">
                        <SquareRoundedIcon sx={{ color: cheerfulFiestaPaletteLight[index % cheerfulFiestaPaletteLight.length], fontSize: 15 }} />
                      </TableCell>
                      <TableCell 
                        align="left"
                        width="50%"
                        sx={{ 
                          maxWidth: '5vh',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {data.label}
                      </TableCell>
                      <TableCell align="right" width="20%">
                        {data.value}
                      </TableCell>
                      <TableCell align="right" width="20%">
                        {getArcLabel(data.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

      </Grid>


    </Container>
  )
}