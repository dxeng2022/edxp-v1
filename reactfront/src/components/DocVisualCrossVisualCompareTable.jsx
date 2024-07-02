import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, styled, } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function DocVisualCrossVisualCompareTable() {
  
  const crossDocument = useSelector(state => state.crossDocument);
  const crossSTSentenceId = useSelector(state => state.crossSTSentenceId);
  const crossCPSentenceId = useSelector(state => state.crossCPSentenceId);
  const crossCompareCategory = useSelector(state => state.crossCompareCategory);

  const [validationTableData, setValidationTableData] = useState([]);

  useEffect(() => {
    const newTableData = [];
    if (crossSTSentenceId) {
      const matchedSentence = crossDocument.find(item => item.sentenceId === crossSTSentenceId);
      if (matchedSentence) {
        newTableData.push({
          STsentenceId: matchedSentence.sentenceId,
          STsentence: matchedSentence.sentence,
          STpart: matchedSentence.part,
          STproperty: matchedSentence.property,
          STvalue: matchedSentence.value,
        });
      }
    }
    if (crossCPSentenceId !== null) {
      newTableData.push({
        CPsentenceId: crossCPSentenceId.sentenceId,
        CPsentence: crossCPSentenceId.sentence,
        CPpart: crossCPSentenceId.part,
        CPproperty: crossCPSentenceId.property,
        CPvalue: crossCPSentenceId.value,
        CPsimilarity: crossCPSentenceId.similarity,
      });
    }
    setValidationTableData(newTableData);
  }, [crossSTSentenceId, crossCPSentenceId, crossDocument]);

  const SentenceTableRow = styled(TableRow)({
    height: 'calc(100vh - 620px)',
  });
  
  const explainTable = () => {
    if (crossCompareCategory === 'part') {
      if (validationTableData && validationTableData[1] && validationTableData[0]) {
        return `기준 문장의 '${validationTableData[0].STpart}'와(과) 선택한 비교 문장의 '${validationTableData[1].CPpart}' Part 유사도는 ${validationTableData[1].CPsimilarity}% 입니다.`;
      } else {
        return '정보를 불러올 수 없습니다.';
      }
    } else if (crossCompareCategory === 'property') {
      if (validationTableData && validationTableData[1] && validationTableData[0]) {
        return `기준 문장의 '${validationTableData[0].STproperty}'와(과) 선택한 비교 문장의 '${validationTableData[1].CPproperty}' Property 유사도는 ${validationTableData[1].CPsimilarity}% 입니다.`;
      } else {
        return '정보를 불러올 수 없습니다.';
      }
    } else if (crossCompareCategory === 'value') {
      if (validationTableData && validationTableData[1] && validationTableData[0]) {
        return `기준 문장의 '${validationTableData[0].STvalue}' 선택한 비교 문장의 '${validationTableData[1].CPvalue}' Value 유사도는 ${validationTableData[1].CPsimilarity}% 입니다.`;
      } else {
        return '정보를 불러올 수 없습니다.';
      }
    } else if (crossCompareCategory === 'similarity') {
      if (validationTableData && validationTableData[1] && validationTableData[1].CPsimilarity) {
        return `기준 문장과 선택한 비교 문장의 Sentence 유사도는 ${validationTableData[1].CPsimilarity}% 입니다.`;
      } else {
        return '유사도 정보를 불러올 수 없습니다.';
      }
    } else {
      return '문장을 선택해주세요';
    }
  };
  
  

  return (
    <TableContainer component={Paper} sx={{ height: 'calc(100vh - 227px)', }} >
      <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">문장 비교</TableCell>
              <TableCell align="center" sx={{ backgroundColor: '#F0F4C3' }}>기준 문장</TableCell>
              <TableCell align="center" sx={{ backgroundColor: '#FFECB3' }}>비교 문장</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center" sx={{ width:50, backgroundColor: '#F5F5F5' }}>Page</TableCell>
              <TableCell align="center" sx={{ width:300, borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }}>{validationTableData[0]?.STpage || 'ㅡ'}</TableCell>
              <TableCell align="center" sx={{ width:300 }}>{validationTableData[1]?.CPpage || 'ㅡ'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" sx={{ width:50, backgroundColor: '#F5F5F5' }}>Row ID</TableCell>
              <TableCell align="center" sx={{ width:300, borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }}>{validationTableData[0]?.STsentenceId || 'ㅡ'}</TableCell>
              <TableCell align="center" sx={{ width:300 }}>{validationTableData[1]?.CPsentenceId || 'ㅡ'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" sx={{ width:50, backgroundColor: '#F5F5F5' }}>Part</TableCell>
              <TableCell align="center" sx={{ width:300, borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc',
                  fontWeight: crossCompareCategory === 'part' ? 'bold' : 'normal', color: crossCompareCategory === 'part' ? 'blue' : 'inherit', }}>
                {validationTableData[0]?.STpart || 'ㅡ'}
              </TableCell>
              <TableCell align="center" sx={{ width:300, fontWeight: crossCompareCategory === 'part' ? 'bold' : 'normal', color: crossCompareCategory === 'part' ? 'blue' : 'inherit', }}>
                {validationTableData[1]?.CPpart || 'ㅡ'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" sx={{ width:50, backgroundColor: '#F5F5F5' }}>Property</TableCell>
              <TableCell align="center" sx={{ width:300, borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc',
                  fontWeight: crossCompareCategory === 'property' ? 'bold' : 'normal', color: crossCompareCategory === 'property' ? 'blue' : 'inherit', }}>
                {validationTableData[0]?.STproperty || 'ㅡ'}
              </TableCell>
              <TableCell align="center" sx={{ width:300, fontWeight: crossCompareCategory === 'property' ? 'bold' : 'normal', color: crossCompareCategory === 'property' ? 'blue' : 'inherit', }}>
                {validationTableData[1]?.CPproperty || 'ㅡ'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" sx={{ width:50, backgroundColor: '#F5F5F5' }}>Value</TableCell>
              <TableCell align="center" sx={{ width:300, borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc',
                  fontWeight: crossCompareCategory === 'value' ? 'bold' : 'normal', color: crossCompareCategory === 'value' ? 'blue' : 'inherit', }}>
                {validationTableData[0]?.STvalue || 'ㅡ'}
              </TableCell>
              <TableCell align="center" sx={{ width:300, fontWeight: crossCompareCategory === 'value' ? 'bold' : 'normal', color: crossCompareCategory === 'value' ? 'blue' : 'inherit', }}>
                {validationTableData[1]?.CPvalue || 'ㅡ'}
              </TableCell>
            </TableRow>
            <SentenceTableRow>
              <TableCell align="center" sx={{ width:50, backgroundColor: '#F5F5F5' }}>Sentence</TableCell>
              <TableCell sx={{ width:300, borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc',}}>
                {validationTableData[0]?.STsentence || ''}
              </TableCell>
              <TableCell sx={{ width:300, }}>
                {validationTableData[1]?.CPsentence || ''}
              </TableCell>
            </SentenceTableRow>
            <TableRow>
              <TableCell align="right" sx={{ pr:0.5, width:100, }}>Table Note : </TableCell>
              <TableCell colSpan={2} sx={{ pl:0.5, fontWeight: crossCompareCategory === 'similarity' ? 'bold' : 'normal', color: crossCompareCategory === 'similarity' ? 'blue' : 'inherit', }}>{explainTable()}</TableCell>
            </TableRow>
          </TableBody>
      </Table>
    </TableContainer>
  );
}
