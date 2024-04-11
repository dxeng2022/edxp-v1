// import { useEffect } from 'react';
import { setParserChangeButton, setParserDoc, setRiskBackdrop, setRiskBackdropText, setRiskCloudAlert, setRiskFile, setRiskFileName, setRiskPDFBackdrop, setRiskPDFPreview } from '../actions';
import createAxiosConfig from './AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export default function RiskAPI() {
  
  const dispatch = useDispatch();
  const axiosConfig = createAxiosConfig(dispatch);

  const riskFile = useSelector(state => state.riskFile);
  const parserDoc = useSelector(state => state.parserDoc);
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
        const extractedData = parserResponse.data.documents.map(doc => ({
          INDEX: doc.INDEX,
          LABEL: doc.LABEL,
          PAGE:doc.PAGE,
          SECTION:doc.SECTION,
          SENTENCE: doc.SENTENCE,
          WORDLIST: doc.WORDLIST,
        }));
        dispatch(setParserDoc(extractedData));

        let content = (parserResponse.headers['content-disposition']);
        let fileName = content.split("filename=")[1];
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
        const blob = new Blob([pdfResponse.data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        dispatch(setRiskPDFPreview(url));
        dispatch(setRiskPDFBackdrop(false));

        try {
          dispatch(setRiskBackdropText('PDF를 Parsing하고 있습니다.'));
          const parserResponse = await axiosConfig.post("/api/v1/doc/parser", riskCloudInfo );

          if (parserResponse.status === 200) {
            const extractedData = parserResponse.data.documents.map(doc => ({
              INDEX: doc.INDEX,
              LABEL: doc.LABEL,
              PAGE:doc.PAGE,
              SECTION:doc.SECTION,
              SENTENCE: doc.SENTENCE,
              WORDLIST: doc.WORDLIST,
            }));
            dispatch(setParserDoc(extractedData));

            let content = (parserResponse.headers['content-disposition']);
            let fileName = content.split("filename=")[1];
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


  const parserUpdateAPI = async () => {
    try {
      const parserUpdateResponse = await axiosConfig.put("/api/v1/doc",
        { 'fileName': riskFileName,
          'documents': parserDoc},
      );
      if (parserUpdateResponse.status === 200) {
        let content = (parserUpdateResponse.headers['content-disposition']);
        let fileName = content.split("filename=")[1];
        dispatch(setRiskFileName(fileName));

        dispatch(setParserChangeButton(false));
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
        console.log(analysisResponse);
        const extractedData = analysisResponse.data.result.documents.map(doc => ({
          INDEX: doc.INDEX,
          LABEL: doc.LABEL,
          PAGE:doc.PAGE,
          SECTION:doc.SECTION,
          SENTENCE: doc.SENTENCE,
          WORDLIST: doc.WORDLIST,
        }));
        dispatch(setParserDoc(extractedData));
        dispatch(setRiskBackdrop(false));
        navigate('/module/riskvisual');
      }
    } catch (error) {
      console.error('Error during analysisResponse API call:', error);
      // eslint-disable-next-line
      const deleteResponse = await axiosConfig.delete("/api/v1/doc/parser-delete");
      alert('json 파일 확인 요망');
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