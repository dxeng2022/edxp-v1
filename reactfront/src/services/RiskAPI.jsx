// import { useEffect } from 'react';
import { useEffect, useState } from 'react';
import { setParserChangeButton, setParserDoc, setRiskBackdrop, setRiskBackdropText, setRiskCloudAlert, setRiskData, setRiskDoc, setRiskFile, setRiskFileName, setRiskPDFBackdrop, setRiskPDFPreview, setRiskPage, setRiskVisualPage } from '../actions';
import createAxiosConfig from './AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';


export default function RiskAPI() {
  
  const dispatch = useDispatch();
  const axiosConfig = createAxiosConfig(dispatch);

  const riskFile = useSelector(state => state.riskFile);
  const parserDoc = useSelector(state => state.parserDoc);
  const riskDoc = useSelector(state => state.riskDoc);
  // const riskPDFPreview = useSelector(state => state.riskPDFPreview);
  const riskFileName = useSelector(state => state.riskFileName);

  
  
  const riskLocalAPI = async (file) => {

    const formData = new FormData();
    formData.append('file', file);

    const uploadedFile = formData.get('file');
    dispatch(setRiskFile(uploadedFile.name));

    dispatch(setRiskBackdropText('서버 요청 중입니다.'));
    dispatch(setRiskBackdrop(true));

    try {
      dispatch(setRiskBackdropText('PDF를 Parsing하고 있습니다.'));
      const parserResponse = await axiosConfig.post("/api/v1/doc/parser-loc", formData);

      if (parserResponse.status === 200) {
        console.log(parserResponse);
        dispatch(setRiskPage(true));
        const extractedData = parserResponse.data.result.documents.map(doc => ({
          INDEX: doc.INDEX,
          LABEL: doc.LABEL,
          PAGE: doc.PAGE,
          SECTION: doc.SECTION,
          SENTENCE: doc.SENTENCE,
          WORDLIST: doc.WORDLIST,
        }));
        dispatch(setParserDoc(extractedData));

        let fileName = (parserResponse.data.result.filename);
        dispatch(setRiskFileName(fileName));

        dispatch(setRiskBackdrop(false));
      }
    } catch (error) {
      console.error('Error during pdfResponse API call:', error);
      // eslint-disable-next-line
      const deleteResponse = await axiosConfig.delete("/api/v1/doc/parser-delete");
      alert('pdf 파일 확인 요망');
      window.location.reload();
    }
  }


  const riskCloudAPI = async () => {
    if (!riskFile.includes('.')) {
      dispatch(setRiskCloudAlert(true));
      return;
    }

    const riskCloudInfo = {
      'filePath': riskFile.slice(4),
    }

    dispatch(setRiskBackdrop(true));
    dispatch(setRiskBackdropText('서버 요청 중입니다.'));
    dispatch(setRiskPDFBackdrop(true));

    try {
      const pdfResponse = await axiosConfig.post("/api/v1/doc/parser-pdf", riskCloudInfo, {
        responseType: 'blob' 
      });

      if (pdfResponse.status === 200) {
        dispatch(setRiskPage(true));
        const blob = new Blob([pdfResponse.data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        dispatch(setRiskPDFPreview(url));
        dispatch(setRiskPDFBackdrop(false));

        try {
          dispatch(setRiskBackdropText('PDF를 Parsing하고 있습니다.'));
          const parserResponse = await axiosConfig.post("/api/v1/doc/parser", riskCloudInfo );

          if (parserResponse.status === 200) {
            const extractedData = parserResponse.data.result.documents.map(doc => ({
              INDEX: doc.INDEX,
              LABEL: doc.LABEL,
              PAGE: doc.PAGE,
              SECTION: doc.SECTION,
              SENTENCE: doc.SENTENCE,
              WORDLIST: doc.WORDLIST,
            }));
            dispatch(setParserDoc(extractedData));

            let fileName = (parserResponse.data.result.filename);
            dispatch(setRiskFileName(fileName));

            dispatch(setRiskBackdrop(false));
          }
        } catch (error) {
          console.error('Error during parserResponse API call:', error);
          // eslint-disable-next-line
          const deleteResponse = await axiosConfig.delete("/api/v1/doc/parser-delete");
          alert('pdf 파일 확인 요망');
          window.location.reload();
        }

      }
    } catch (error) {
      console.error('Error during pdfResponse API call:', error);
      // eslint-disable-next-line
      const deleteResponse = await axiosConfig.delete("/api/v1/doc/parser-delete");
      alert('pdf 파일 확인 요망');
      window.location.reload();
    }

  }

  const location = useLocation();
  const [updateDocument, setUpdateDocument] = useState();

  const documents = Object.keys(parserDoc).length === 0 ? riskDoc : parserDoc;

  useEffect(() => {
    console.log(riskFileName);
  }, [parserDoc, riskDoc, riskFileName]);

  const docVisualRiskVisual = {
    'fileName': riskFileName,
    'documents': documents,
    'fileLocation': 'doc',
  }
  const moduleRiskVisual = {
    'fileName': riskFileName,
    'documents': documents,
    'fileLocation': 'doc_risk',
  }
  
  useEffect(() => {
    if (location.pathname === '/module/docvisual/riskvisual') {
      setUpdateDocument(docVisualRiskVisual);
    } else if (location.pathname === '/module/riskvisual' || '/module/risk') {
      setUpdateDocument(moduleRiskVisual);
    }
    //eslint-disable-next-line
  }, [parserDoc, riskFileName]);
  




  // function getFileNameFromContentDisposition(contentDisposition) {
  //   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  //   const matches = filenameRegex.exec(contentDisposition);
  //   if (matches != null && matches[1]) {
  //     return matches[1].replace(/['"]/g, ''); // 인용 부호 제거
  //   }
  //   return null;
  // }
  
  const parserUpdateAPI = async () => {
    try {
      console.log(updateDocument);
      const parserUpdateResponse = await axiosConfig.put("/api/v1/doc", updateDocument,);
      if (parserUpdateResponse.status === 200) {

        let fileName = (parserUpdateResponse.data.result.filename);
        dispatch(setRiskFileName(fileName));
        dispatch(setParserChangeButton(false));
        
        const riskData = {
          allCounts: parserUpdateResponse.data.result.allCounts,
          riskCounts: parserUpdateResponse.data.result.riskCounts,
          onlyRisks: parserUpdateResponse.data.result.onlyRisks
        };
        dispatch(setRiskData(riskData));
        
      }
    } catch (error) {
      console.error('Error during Update API call:', error);
    }
  }


  const navigate = useNavigate();

  const riskAnalysisAPI = async () => {
    dispatch(setRiskBackdropText('독소조항 분석 중입니다.'));
    dispatch(setRiskBackdrop(true));
    try {
      const analysisResponse = await axiosConfig.post("/api/v1/doc/analysis",
        { 'fileName': riskFileName },
      );
      
      if (analysisResponse.status === 200) {
        dispatch(setRiskVisualPage(false));
        dispatch(setRiskPage(true));
        const extractedData = analysisResponse.data.result.documents.map(doc => ({
          INDEX: doc.INDEX,
          LABEL: doc.LABEL,
          PAGE: doc.PAGE,
          SECTION: doc.SECTION,
          SENTENCE: doc.SENTENCE,
          WORDLIST: doc.WORDLIST,
        }));
        dispatch(setRiskDoc(extractedData));

        let fileName = (analysisResponse.data.result.filename);
        dispatch(setRiskFileName(fileName));
        
        const riskData = {
          allCounts: analysisResponse.data.result.allCounts,
          riskCounts: analysisResponse.data.result.riskCounts,
          onlyRisks: analysisResponse.data.result.onlyRisks
        };
        dispatch(setRiskData(riskData));

        dispatch(setRiskBackdrop(false));
        navigate('/module/riskvisual');
        dispatch(setParserDoc([]));
        dispatch(setRiskPage(false));
      }
    } catch (error) {
      console.error('Error during analysisResponse API call:', error);
      // eslint-disable-next-line
      const deleteResponse = await axiosConfig.delete("/api/v1/doc/parser-delete");
      alert('json 파일 확인 요망');
      dispatch(setRiskPage(false));
      window.location.reload();
    }
  }

  // 주소 변경 시 PDF 파일 없애기
  // useEffect(() => {
  //   return () => {
  //     if (riskPDFPreview) {
  //       window.URL.revokeObjectURL(riskPDFPreview);
  //     }
  //   };
  // }, [riskPDFPreview]);




  return { riskLocalAPI, riskCloudAPI, parserUpdateAPI, riskAnalysisAPI };
};