import { AccordionDetails, Box, Button, Collapse, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordion from '@mui/material/Accordion';
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { setCrossCPSentenceId, setCrossCompareCategory, setCrossSTSentenceId, } from "../actions";

export default function DocVisualCrossVisualTable() {

  const dispatch = useDispatch();

  const crossValidationVisual = useSelector(state => state.crossValidationVisual);
  const crossDocument = useSelector(state => state.crossDocument);
  const crossCompareCategory = useSelector(state => state.crossCompareCategory);

  const [index, setIndex] = useState();
  const [openIndex, setOpenIndex] = useState(-1);
  const [selectedRow, setSelectedRow] = useState(null);

  const [partExpanded, setPartExpanded] = useState(false);
  const [propExpanded, setPropExpanded] = useState(false);
  const [valueExpanded, setValueExpanded] = useState(false);

  const [partSentenceIds, setPartSentenceIds] = useState([]);
  const [partSentenceSimilarity, setPartSentenceSimilarity] = useState([]);
  const [partTableData, setPartTableData] = useState([]);

  const [propSentenceIds, setPropSentenceIds] = useState([]);
  const [propSentenceSimilarity, setPropSentenceSimilarity] = useState([]);
  const [propTableData, setPropTableData] = useState([]);

  const [valueSentenceIds, setValueSentenceIds] = useState([]);
  const [valueSentenceSimilarity, setValueSentenceSimilarity] = useState([]);
  const [valueTableData, setValueTableData] = useState([]);

  const [finalSentenceIds, setFinalSentenceIds] = useState([]);
  const [finalSentenceSimilarity, setFinalSentenceSimilarity] = useState([]);
  const [finalTableData, setFinalTableData] = useState([]);
  

  const handleOpen = (index) => {
    if (index < 0 || index >= crossValidationVisual.length) {
      return;
    }

    dispatch(setCrossSTSentenceId(crossValidationVisual[index].sentenceId));
    dispatch(setCrossCPSentenceId(null));
    dispatch(setCrossCompareCategory(null));

    setPartExpanded(false);
    setPropExpanded(false);
    setValueExpanded(false);

    setSelectedRow(null);
    
    setIndex(index);
    setOpenIndex(index === openIndex ? -1 : index);

    const similarPartSentences = crossValidationVisual[index].similarPartSentences;
    if (Array.isArray(similarPartSentences)) {
      setPartSentenceIds(similarPartSentences.map(item => item.sentenceId));
      setPartSentenceSimilarity(similarPartSentences.map(item => Math.round(item.similarity * 100 * 10) / 10));

    } else if (typeof similarPartSentences === 'object' && similarPartSentences !== null) {
      setPartSentenceIds(Object.values(similarPartSentences).map(item => item.sentenceId));
      setPartSentenceSimilarity(Object.values(similarPartSentences).map(item => Math.round(item.similarity * 100 * 10) / 10));

    } else {
      setPartSentenceIds([]);
    }

    const similarPropSentences = crossValidationVisual[index].similarPropSentences;
    if (Array.isArray(similarPropSentences)) {
      setPropSentenceIds(similarPropSentences.map(item => item.sentenceId));
      setPropSentenceSimilarity(similarPropSentences.map(item => Math.round(item.similarity * 100 * 10) / 10));

    } else if (typeof similarPropSentences === 'object' && similarPropSentences !== null) {
      setPropSentenceIds(Object.values(similarPropSentences).map(item => item.sentenceId));
      setPropSentenceSimilarity(Object.values(similarPropSentences).map(item => Math.round(item.similarity * 100 * 10) / 10));

    } else {
      setPropSentenceIds([]);
    }

    if (crossValidationVisual[index].value) {
      const similarValueSentences = crossValidationVisual[index].similarValueSentences;
      if (Array.isArray(similarValueSentences)) {
        setValueSentenceIds(similarValueSentences.map(item => item.sentenceId));
        setValueSentenceSimilarity(similarValueSentences.map(item => Math.round(item.similarity * 100 * 10) / 10));
      } else if (typeof similarValueSentences === 'object' && similarValueSentences !== null) {
        setValueSentenceIds(Object.values(similarValueSentences).map(item => item.sentenceId));
        setValueSentenceSimilarity(Object.values(similarValueSentences).map(item => Math.round(item.similarity * 100 * 10) / 10));
      }
    } else {
      setValueSentenceIds([]);
    }
    

    const similarFinalSentences = crossValidationVisual[index].similarFinalSentences;
    if (Array.isArray(similarFinalSentences)) {
      setFinalSentenceIds(similarFinalSentences.map(item => item.sentenceId));
      setFinalSentenceSimilarity(similarFinalSentences.map(item => Math.round(item.similarity * 100 * 10) / 10));
    } else {
      setFinalSentenceIds(Object.values(similarFinalSentences).map(item => item.sentenceId));
      setFinalSentenceSimilarity(Object.values(similarFinalSentences).map(item => Math.round(item.similarity * 100 * 10) / 10));
    }
  };
  // console.log('crossValidationVisual', crossValidationVisual);
  // console.log('partSentenceIds', partSentenceIds);
  // console.log('propSentenceIds', propSentenceIds);
  // console.log('valueSentenceIds', valueSentenceIds);
  // console.log('finalSentenceIds',finalSentenceIds);
  // console.log('crossDocument', crossDocument);

  useEffect(() => {
    if (finalSentenceIds.length === 0) {
      setFinalTableData([]);
    } else {
      const newTableData = finalSentenceIds.map((id, index) => {
        const matchedSentence = crossDocument.find(item => item.sentenceId === id);
        return matchedSentence ? {
          sentenceId: matchedSentence.sentenceId,
          sentence: matchedSentence.sentence,
          part: matchedSentence.part,
          property: matchedSentence.property,
          value: matchedSentence.value,
          similarity: finalSentenceSimilarity[index],
        } : null;
      }).filter(item => item !== null);

      setFinalTableData(newTableData);
    }
    //eslint-disable-next-line
  }, [finalSentenceIds, crossDocument]);
  // console.log('FinalTableData', finalTableData);

  const partHandleAccordionChange = (panel) => (event, isExpanded) => {
    setPartExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      generatePartTableData(partSentenceIds);
    }
  };

  const generatePartTableData = (partSentenceIds) => {
    const newPartTableData = partSentenceIds.map((id, index) => {
      const matchedSentence = crossDocument.find(item => item.sentenceId === id);
      return matchedSentence ? {
        sentenceId: matchedSentence.sentenceId,
        sentence: matchedSentence.sentence,
        part: matchedSentence.part,
        property: matchedSentence.property,
        value: matchedSentence.value,
        similarity: partSentenceSimilarity[index],
      } : null;
    }).filter(item => item !== null);
  
    setPartTableData(newPartTableData);
  };
  
  // console.log('PartTableData', partTableData);

  const propHandleAccordionChange = (panel) => (event, isExpanded) => {
    setPropExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      generatePropTableData(propSentenceIds);
    }
  };

  const generatePropTableData = (propSentenceIds) => {
    const newPropTableData = propSentenceIds.map((id, index) => {
      const matchedSentence = crossDocument.find(item => item.sentenceId === id);
      return matchedSentence ? {
        sentenceId: matchedSentence.sentenceId,
        sentence: matchedSentence.sentence,
        part: matchedSentence.part,
        property: matchedSentence.property,
        value: matchedSentence.value,
        similarity: propSentenceSimilarity[index],
      } : null;
    }).filter(item => item !== null);
  
    setPropTableData(newPropTableData);
  };

  const valueHandleAccordionChange = (panel) => (event, isExpanded) => {
    setValueExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      generateValueTableData(valueSentenceIds);
    }
  };

  const generateValueTableData = (valueSentenceIds) => {
    const newValueTableData = valueSentenceIds.map((id, index) => {
      const matchedSentence = crossDocument.find(item => item.sentenceId === id);
      return matchedSentence ? {
        sentenceId: matchedSentence.sentenceId,
        sentence: matchedSentence.sentence,
        part: matchedSentence.part,
        property: matchedSentence.property,
        value: matchedSentence.value,
        similarity: valueSentenceSimilarity[index],
      } : null;
    }).filter(item => item !== null);
  
    setValueTableData(newValueTableData);
  };


  // function createTree(data, sentenceId, depth = 0) {
  //   if (depth > 3) {
  //     return null;
  //   }
  
  //   const node = data.find(item => item.sentenceId === sentenceId);
  //   if (!node) return null;
  
  //   const children = [];
  //   if (node.similarPartSentences) {
  //     node.similarPartSentences.forEach(({ sentenceId }) => {
  //       const childNode = createTree(data, sentenceId, depth + 1);
  //       if (childNode) children.push(childNode);
  //     });
  //   }
  //   if (node.similarPropSentences) {
  //     node.similarPropSentences.forEach(({ sentenceId }) => {
  //       const childNode = createTree(data, sentenceId, depth + 1);
  //       if (childNode) children.push(childNode);
  //     });
  //   }
  //   if (node.similarValueSentences) {
  //     node.similarValueSentences.forEach(({ sentenceId }) => {
  //       const childNode = createTree(data, sentenceId, depth + 1);
  //       if (childNode) children.push(childNode);
  //     });
  //   }
  
  //   const treeNode = {
  //     // id : "random num",
  //     sentenceId: node.sentenceId,
  //     children: children,
  //     part: node.part,
  //     property: node.property,
  //     value: node.value,
  //   };

  //   console.log(treeNode);
  //   return treeNode;
  // }
  

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

  const handleRowClick = (row) => {
    setSelectedRow(row.sentenceId);
  };
  
  const SelectedTableRow = styled(TableRow)(({ theme, isSelected }) => ({
    backgroundColor: isSelected ? '#F0F4C3' : 'inherit',
  }));

  return (
    <TableContainer component={Paper} sx={{ height: 'calc(100vh - 174px)' }}>
      <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ py: '4px', wordWrap: 'break-word', whiteSpace: 'normal' }}>Row ID</TableCell>
            <TableCell align="center" sx={{ py: '4px', wordWrap: 'break-word', whiteSpace: 'normal' }}>Similar</TableCell>
            <TableCell sx={{ py: '4px', wordWrap: 'break-word', whiteSpace: 'normal' }}>Part</TableCell>
            <TableCell sx={{ py: '4px', wordWrap: 'break-word', whiteSpace: 'normal' }}>Property</TableCell>
            <TableCell sx={{ py: '4px', wordWrap: 'break-word', whiteSpace: 'normal' }}>Value</TableCell>
            <TableCell sx={{ py: '4px' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {crossValidationVisual.map((row, index) => (
            <Fragment key={index}>
              <SelectedTableRow sx={{ '& > *': { borderBottom: 'unset', wordWrap: 'break-word', whiteSpace: 'normal' } }} isSelected={index === openIndex}>
                <TableCell align="center">{row.sentenceId}</TableCell>
                <TableCell align="center" sx={{ fontWeight: row.similarFinalSentences.length > 0 ? 'bold' : 'normal' }}>
                  {row.similarFinalSentences.length > 0 ? row.similarFinalSentences.length + '문장' : '-'}
                </TableCell>
                <TableCell>{row.part || 'ㅡ'}</TableCell>
                <TableCell>{row.property || 'ㅡ'}</TableCell>
                <TableCell>{row.value || 'ㅡ'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => {
                      handleOpen(index);
                      // createTree(data, data[index].sentenceId);
                    }}
                  >
                    {index === openIndex ? '접기' : '열기'}
                  </Button>
                </TableCell>
              </SelectedTableRow>
              <TableRow>
                <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={index === openIndex} timeout="auto" unmountOnExit>
                    <Box sx={{ my: 3 }}>
                      <Typography variant="h6" gutterBottom component="div">
                        문장 유사도가 높은 {finalSentenceIds.length}개 문장
                      </Typography>
                      {finalTableData.length === 0 ? (
                        <Box>문장 유사도가 높은 문장이 없습니다.</Box>
                      ) : (
                        <TableContainer sx={{ border: '1px solid #ccc', borderRadius: '10px' }}>
                          <Table size="small" sx={{ tableLayout: 'fixed' }}>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                                {/* <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Row ID</TableCell> */}
                                <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Sentence</TableCell>
                                <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Part</TableCell>
                                <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Property</TableCell>
                                <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Value</TableCell>
                                <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>similarity</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {finalTableData.map((row, index) => (
                                <TableRow
                                  key={index}
                                  onClick={() => { dispatch(setCrossCPSentenceId(row)); dispatch(setCrossCompareCategory('similarity')); handleRowClick(row); }}
                                  sx={{ backgroundColor: selectedRow === row.sentenceId && crossCompareCategory === 'similarity' ? '#FFECB3' : 'transparent', '&:hover': { cursor: 'pointer', } }}
                                >
                                  {/* <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.sentenceId}</TableCell> */}
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.sentence}</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.part || 'ㅡ'}</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.property || 'ㅡ'}</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.value || 'ㅡ'}</TableCell>
                                  <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.similarity}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                    <Box sx={{ my: 3 }}>
                      <Typography variant="h6" gutterBottom component="div">
                        Part / Property / Value 유사 문장
                      </Typography>
                      <Accordion expanded={partExpanded === `panel`} onChange={partHandleAccordionChange(`panel`)}>
                        <AccordionSummary>
                          <Typography sx={{ color: 'text.secondary' }}> Part {partSentenceIds.length}문장 </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  {/* <TableCell align="center" sx={{ py: '4px', wordWrap: 'break-word', whiteSpace: 'normal' }}>Row ID</TableCell> */}
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Sentence</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Part</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Property</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Value</TableCell>
                                  <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>similarity</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {partTableData.map((row, index) => (
                                  <TableRow
                                    key={index}
                                    onClick={() => {dispatch(setCrossCPSentenceId(row)); dispatch(setCrossCompareCategory('part')); handleRowClick(row);}}
                                    sx={{ backgroundColor: selectedRow === row.sentenceId && crossCompareCategory === 'part' ? '#FFECB3' : 'transparent', '&:hover': { cursor: 'pointer' } }}
                                  >
                                    {/* <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.sentenceId}</TableCell> */}
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.sentence}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.part || 'ㅡ'}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.property || 'ㅡ'}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.value || 'ㅡ'}</TableCell>
                                    <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.similarity}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion expanded={propExpanded === `panel`} onChange={propHandleAccordionChange(`panel`)}>
                        <AccordionSummary>
                          <Typography sx={{ color: 'text.secondary' }}> Property {propSentenceIds.length}문장 </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  {/* <TableCell align="center" sx={{ py: '4px', wordWrap: 'break-word', whiteSpace: 'normal' }}>Row ID</TableCell> */}
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Sentence</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Part</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Property</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Value</TableCell>
                                  <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>similarity</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {propTableData.map((row, index) => (
                                  <TableRow 
                                    key={index}
                                    onClick={() => {dispatch(setCrossCPSentenceId(row)); dispatch(setCrossCompareCategory('property')); handleRowClick(row);}}
                                    sx={{ backgroundColor: selectedRow === row.sentenceId && crossCompareCategory === 'property' ? '#FFECB3' : 'transparent', '&:hover': { cursor: 'pointer' } }}
                                  >
                                    {/* <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.sentenceId}</TableCell> */}
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.sentence}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.part || 'ㅡ'}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.property || 'ㅡ'}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.value || 'ㅡ'}</TableCell>
                                    <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.similarity}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion expanded={valueExpanded === `panel`} onChange={valueHandleAccordionChange(`panel`)}>
                        <AccordionSummary>
                          <Typography sx={{ color: 'text.secondary' }}> Value {valueSentenceIds.length}문장 </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  {/* <TableCell align="center" sx={{ py: '4px', wordWrap: 'break-word', whiteSpace: 'normal' }}>Row ID</TableCell> */}
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Sentence</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Part</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Property</TableCell>
                                  <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>Value</TableCell>
                                  <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>similarity</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {valueTableData.map((row, index) => (
                                  <TableRow
                                    key={index}
                                    onClick={() => {dispatch(setCrossCPSentenceId(row)); dispatch(setCrossCompareCategory('value')); handleRowClick(row);}}
                                    sx={{ backgroundColor: selectedRow === row.sentenceId && crossCompareCategory === 'value' ? '#FFECB3' : 'transparent', '&:hover': { cursor: 'pointer' } }}
                                  >
                                    {/* <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.sentenceId}</TableCell> */}
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.sentence}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.part || 'ㅡ'}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.property || 'ㅡ'}</TableCell>
                                    <TableCell sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.value || 'ㅡ'}</TableCell>
                                    <TableCell align="center" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{row.similarity}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};