import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Grid, Typography, AccordionDetails, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordion from '@mui/material/Accordion';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRiskVisualPage } from "../actions";
import { ResponsivePie } from '@nivo/pie';
import { memo, useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { styled } from '@mui/material/styles';

export default function RiskVisualChart() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const riskFile = useSelector(state => state.riskFile);
  const riskData = useSelector(state => state.riskData);
  const [riskPie, setRiskPie] = useState([]);
  const [riskWord, setRiskWord] = useState([]);
  
  useEffect(() =>{
    setRiskPie([{"id": "No Risk", "label": "No Risk", "value": riskData.allCounts - riskData.riskCounts},
      {"id": "Risk", "label": "Risk", "value": riskData.riskCounts}]);

    const sentences = riskData.onlyRisks.map(item => item.SENTENCE);
    setRiskWord(sentences);
  }, [riskData])

  function calculateWordFrequency(sentences, stopwords) {
    // sentences가 null 또는 undefined인 경우 빈 객체 반환
    if (!sentences) {
      return {};
    }
  
    const wordCounts = {};
    const wordRegex = /\b[a-zA-Z]+\b/g; // 단어를 찾기 위한 정규 표현식
  
    sentences.forEach(sentence => {
      // 모두 소문자로 변환하여 대소문자 구분 없이 처리
      const words = sentence.toLowerCase().match(wordRegex);
  
      // words가 null인 경우 처리
      if (words) {
        words.forEach(word => {
          // 불용어 리스트에 없는 단어들만 카운트
          if (!stopwords.includes(word) && !wordCounts[word]) {
            wordCounts[word] = 0;
          }
          if (!stopwords.includes(word)) {
            wordCounts[word] += 1; // 단어의 빈도수 증가
          }
        });
      }
    });
  
    return wordCounts;
  }
  
  
  // 예시 불용어 리스트
  const stopwords = [
    'a', 'an', 'the', 
    'at', 'by', 'for', 'in', 'of', 'on', 'to', 'with',
    'I', 'me', 'my', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 
    'we', 'us', 'our', 'they', 'them', 'their',
    'and', 'but', 'or', 'nor', 'so', 'yet',
    'very', 'really', 'quite', 'too', 'also',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 
    'have', 'has', 'had', 'do', 'does', 'did', 
    'not', 'no', 'yes', 'some', 'can', 'will', 
    'just', 'now', 'then', 'there', 'here', 
    'how', 'when', 'where', 'why'
  ];
  
  // 단어 빈도수 객체
  const wordFrequency = calculateWordFrequency(riskWord, stopwords);
  
  // 빈도수 객체를 배열로 변환하고, 빈도수에 따라 정렬
  const wordFrequencyArray = Object.keys(wordFrequency).map(word => ({
    text: word,
    value: wordFrequency[word]
  })).sort((a, b) => b.value - a.value);
  
  
  const CustomTooltip = ({ id, value }) => {
    const percentage = ((value / riskData.allCounts) * 100).toFixed(2);
  
    return (
      <div style={{ background: 'white', padding: '5px', border: '1px solid #ccc' }}>
        {id}: {percentage}%
      </div>
    );
  };

  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0;
    dataWithArc.forEach(datum => {
      total += datum.value;
    });

    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
            fontSize: '20px', // 텍스트 크기 설정
            fontWeight: '600', // 폰트 두께
        }}
      >
        {`총 ${total} 문장`}
      </text>
    );
};

  const handleButtonClick = () => {
    navigate('/module');
    dispatch(setRiskVisualPage(false));
  };

  const handleRiskVisualPage = () => {
    dispatch(setRiskVisualPage(false));
  };

  const groupedRisks = riskData.onlyRisks.reduce((acc, risk) => {
    // 현재 risk의 페이지 번호가 acc에 없으면, 새 배열로 초기화합니다.
    if (!acc[risk.PAGE]) {
      acc[risk.PAGE] = [];
    }
    // 현재 risk를 해당 페이지 번호의 배열에 추가합니다.
    acc[risk.PAGE].push(risk);
    return acc;
  }, {});

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={4} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));

  const MemoizedWordcloud = memo(ReactWordcloud, (prevProps, nextProps) => {
    // 단어 데이터(wordFrequencyArray)가 변경되지 않으면 렌더링을 피함
    return prevProps.words === nextProps.words;
  });

  return (
    <Box sx={{height: 'calc(100vh - 175px)', position: 'relative', overflow:'auto'}}>
      <Box sx={{ zIndex:1, px:2, py:0.5, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'sticky', top: 0, backgroundColor:'#FFFFFF' }}>
        <Box sx={{ display:'flex', alignItems:'end', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          <Typography variant='h5' sx={{ pr:1 }}> {riskFile.split('/').pop()} 시각화 </Typography>
        </Box>

        <Box sx={{ display:'flex' }}>
          <Button sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={handleButtonClick}> 홈으로 </Button>
        </Box>
      </Box>

      <Box sx={{ px:3 }}>
        <Grid container>
          <Grid item xs={12} sm={6} md={6} sx={{width: '100%', height: 350, mt:2}}>
            <Typography sx={{ ml:1, display: 'flex', alignItems:'center'}} variant="body1"> <BarChartIcon color="disabled" /> 문서 내 Risk 문장 비율 </Typography>
            <ResponsivePie
              data={riskPie}
              margin={{ top: 30, right: 30, bottom: 40, left: 30 }}
              sortByValue={true}
              innerRadius={0.5}
              padAngle={2}
              cornerRadius={7}
              enableArcLinkLabels={false}
              activeOuterRadiusOffset={10}
              arcLabelsSkipAngle={0}
              arcLabel={e=>e.id+ " ("+e.value+")"}
              colors={{ scheme: 'set2' }}
              tooltip={({ datum: { id, value } }) => (
                <CustomTooltip
                  id={id}
                  value={value}
                />)}
              theme={{
                labels: {
                  text: {
                    fontSize: 15,
                  }
                }
              }}
              layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} sx={{width: '100%', height: 350, mt:2}}>
            <Typography sx={{ ml:1, display: 'flex', alignItems:'center'}} variant="body1"> <BarChartIcon color="disabled" /> Risk 문장의 단어 빈도수 </Typography>
            <Box sx={{mt:3, mr:1}}>
              <MemoizedWordcloud words={wordFrequencyArray} options={{spiral: 'rectangular', padding: 1, fontSizes: [20, 70], rotations: 2, rotationAngles: [0],}} />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{width: '100%', my:3}}>
          <Box sx={{ display:'flex', alignItems:'end', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', pb:1, justifyContent:'space-between'}}>
            <Typography sx={{ mb:0.5, mx:1, display: 'flex', alignItems:'center'}} variant="body1"> ITB 문서 내 Risk {riskData.riskCounts}문장이 발견되었습니다. </Typography>
            <Button variant='contained' color="success" sx={{display:'flex', alignItems:'center', px:1, whiteSpace: 'nowrap' }} size="small" onClick={handleRiskVisualPage}> 분석결과 수정 </Button>
          </Box>
          <Box>
            {Object.keys(groupedRisks).map((page, index) => (
              <Accordion key={index} defaultExpanded={index === 0}>
                <AccordionSummary
                  aria-controls={`panel${index}a-content`}
                  id={`panel${index}a-header`}
                >
                  <Typography sx={{ ml: 2, width: '20%', flexShrink: 0 }}>{`${page} 페이지`}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}> {`Risk ${groupedRisks[page].length}문장 발견`} </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{width:70, py:1}} align="center">섹션</TableCell>
                          <TableCell sx={{flex:1, py:1}} >문장</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupedRisks[page].map((risk, riskIndex) => (
                          <TableRow key={riskIndex}>
                            <TableCell sx={{width:70}} align="center">{risk.SECTION}</TableCell>
                            <TableCell sx={{flex:1}}>{risk.SENTENCE}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Box>

    </Box>
  );
}