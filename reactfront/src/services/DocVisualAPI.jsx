import { useDispatch, useSelector } from "react-redux";
import createAxiosConfig from './AxiosConfig';
import { setDocVisualRiskBackdrop, setDocVisualRiskLabelUpdate, setDocVisualRiskTemCloud, setRiskData, setRiskDoc, setRiskFile, setRiskFileName, setRiskPDFPreview, setRiskPage, setDocVisualRiskPDF, setRiskCloudAlert, setDocVisualRiskRefresh, setRiskVisualPage } from "../actions";
import { useNavigate } from 'react-router-dom';

export default function DocVisualAPI() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosConfig = createAxiosConfig(dispatch);

  const riskFile = useSelector(state => state.riskFile);
  const docVisualRiskTemPath = useSelector(state => state.docVisualRiskTemPath);
  const docVisualRiskTemName = useSelector(state => state.docVisualRiskTemName);
  const docVisualRiskTemFileName = useSelector(state => state.docVisualRiskTemFileName);
  const docVisualRiskTemPdfName = useSelector(state => state.docVisualRiskTemPdfName);
  

  // 로컬 JSON 파일 전송하여 시각화
  const riskVisualLocalAPI = async (file) => {

    const formData = new FormData();
    formData.append('file', file);

    dispatch(setDocVisualRiskBackdrop(true));

      try {
        const riskVisualLocalResponse = await axiosConfig.post("/api/v1/doc/visual-loc", formData, );

        if (riskVisualLocalResponse.status === 200) {
          dispatch(setRiskVisualPage(false));
          dispatch(setRiskFileName(riskFile));
          const extractedData = riskVisualLocalResponse.data.result.documents.map(doc => ({
            INDEX: doc.INDEX,
            LABEL: doc.LABEL,
            PAGE: doc.PAGE,
            SECTION: doc.SECTION,
            SENTENCE: doc.SENTENCE,
            WORDLIST: doc.WORDLIST,
          }));
          dispatch(setRiskDoc(extractedData));

          let content = (riskVisualLocalResponse.headers['content-disposition']);
          let fileName = content.split("filename=")[1];
          
          dispatch(setRiskFile(fileName));

          const riskData = {
            allCounts: riskVisualLocalResponse.data.result.allCounts,
            riskCounts: riskVisualLocalResponse.data.result.riskCounts,
            onlyRisks: riskVisualLocalResponse.data.result.onlyRisks
          };
          dispatch(setRiskData(riskData));
          //riskFileName 저장
          
          dispatch(setDocVisualRiskPDF(true));
          dispatch(setDocVisualRiskLabelUpdate(true));
          dispatch(setDocVisualRiskBackdrop(false));

          navigate('/module/docvisual/riskvisual');
        }
      } catch (error) {
        console.error('Error during riskVisualLocalResponse API call:', error);
        // eslint-disable-next-line
        alert('json 파일 확인 요망');
        window.location.reload();
      }
  }

  const processRiskFile = (fileString) => {
    const modifiedString = fileString.replace(/(\$.*?)-result\.json$/, '-result.json');
  
    return modifiedString;
  };

  // 클라우드 시각화
  const riskCloudVisualAPI = async () => {

    if (!riskFile.includes('.')) {
      dispatch(setRiskCloudAlert(true));
      return;
    }

    const docVisualCloudPath = {
      // 'fileName': '0bc1c6af-9b28-445d-8386-398ad67051cc-result.json'
      'fileName': docVisualRiskTemPath 
    }

    dispatch(setDocVisualRiskBackdrop(true));

    try {
      const riskCloudPDFResponse = await axiosConfig.post("/api/v1/doc/visual-pdf", docVisualCloudPath, {
        responseType: 'blob' 
      });

      if (riskCloudPDFResponse.status === 200) {
        dispatch(setRiskVisualPage(false));
        dispatch(setRiskPage(true));
        const blob = new Blob([riskCloudPDFResponse.data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        dispatch(setRiskPDFPreview(url));
        dispatch(setDocVisualRiskPDF(false));

        try {
          const analysisResponse = await axiosConfig.post("/api/v1/doc/visual",
            { 'fileName': riskFile,
              'fileLocation': 'doc',
            },
          );

          if (analysisResponse.status === 200) {
            const newRiskFile = processRiskFile(riskFile);
            dispatch(setRiskFile(newRiskFile));
            dispatch(setRiskFileName(riskFile));
            const extractedData = analysisResponse.data.result.documents.map(doc => ({
              INDEX: doc.INDEX,
              LABEL: doc.LABEL,
              PAGE: doc.PAGE,
              SECTION: doc.SECTION,
              SENTENCE: doc.SENTENCE,
              WORDLIST: doc.WORDLIST,
            }));
            dispatch(setRiskDoc(extractedData));

            const riskData = {
              allCounts: analysisResponse.data.result.allCounts,
              riskCounts: analysisResponse.data.result.riskCounts,
              onlyRisks: analysisResponse.data.result.onlyRisks
            };
            dispatch(setRiskData(riskData));
            //riskFileName 저장

    
            dispatch(setDocVisualRiskLabelUpdate(false));
            dispatch(setDocVisualRiskBackdrop(false));

            navigate('/module/docvisual/riskvisual');
          }
        } catch (error) {
          console.error('Error during analysisResponse API call:', error);
          // eslint-disable-next-line
          alert('json 파일 확인 요망');
          window.location.reload();
        }
      }
    } catch (error) {
      if(error.response && error.response.status === 404) {
        try {
          const analysisResponse = await axiosConfig.post("/api/v1/doc/visual",
            { 'fileName': riskFile },
          );
    
          if (analysisResponse.status === 200) {
            dispatch(setRiskVisualPage(false));
            const newRiskFile = processRiskFile(riskFile);
            dispatch(setRiskFile(newRiskFile));
            dispatch(setRiskFileName(riskFile));
            const extractedData = analysisResponse.data.result.documents.map(doc => ({
              INDEX: doc.INDEX,
              LABEL: doc.LABEL,
              PAGE: doc.PAGE,
              SECTION: doc.SECTION,
              SENTENCE: doc.SENTENCE,
              WORDLIST: doc.WORDLIST,
            }));
            dispatch(setRiskDoc(extractedData));
            
            const riskData = {
              allCounts: analysisResponse.data.result.allCounts,
              riskCounts: analysisResponse.data.result.riskCounts,
              onlyRisks: analysisResponse.data.result.onlyRisks
            };
            dispatch(setRiskData(riskData));
            //riskFileName 저장

            dispatch(setDocVisualRiskPDF(true));
            dispatch(setDocVisualRiskLabelUpdate(false));
            dispatch(setDocVisualRiskBackdrop(false));
    
            navigate('/module/docvisual/riskvisual');
          }
        } catch (error) {
          console.error('Error during analysisResponse API call:', error);
          // eslint-disable-next-line
          alert('json 파일 확인 요망');
          window.location.reload();
        }
      }
    }
  }

  // const riskCloudPDFAPI = async () => {

  //   const temDocVisualCloudPath = {
  //     'fileName': '0bc1c6af-9b28-445d-8386-398ad67051cc-result.json'
  //   }

  //   try {
  //     const riskCloudPDFResponse = await axiosConfig.post("/api/v1/doc/visual-pdf", temDocVisualCloudPath, {
  //       responseType: 'blob' 
  //     });

  //     if (riskCloudPDFResponse.status === 200) {
  //       console.log(riskCloudPDFResponse);
  //       // dispatch(setRiskPage(true));
  //       // const blob = new Blob([riskCloudPDFResponse.data], {type: 'application/pdf'});
  //       // const url = window.URL.createObjectURL(blob);
  //       // dispatch(setRiskPDFPreview(url));
  //     }
  //   } catch (error) {
  //     console.error('Error during analysisResponse API call:', error);
  //     // eslint-disable-next-line
  //     alert('json 파일 확인 요망');
  //     window.location.reload();
  //   }
  // }


  
  //임시 문서 JSON 리스트 불러오기
  const riskTemCloudJsonAPI = async () => {
    try {
      const riskTemCloudJsonResponse = await axiosConfig.get("/api/v1/doc/visual-list");

      if (riskTemCloudJsonResponse.status === 200) {
        dispatch(setDocVisualRiskTemCloud(riskTemCloudJsonResponse.data.result));
        // const deleteResponse = await axiosConfig.delete("/api/v1/doc/parser-delete");
      }
    } catch (error) {
      // if(error.response && error.response.status === 404) { PDF 파일 없음
      console.error('Error during parserResponse API call:', error);
      // const deleteResponse = await axiosConfig.delete("/api/v1/doc/parser-delete");
    }
  }


  // '임시 문서' 독소조항 시각화 화면에 요청 시 API
  const riskTemVisualAPI = async () => {

    const temDocVisualCloudPath = {
      'filePath': docVisualRiskTemPath,
    }

    dispatch(setDocVisualRiskBackdrop(true));

    try {
      const pdfResponse = await axiosConfig.post("/api/v1/doc/parser-pdf", temDocVisualCloudPath, {
        responseType: 'blob' 
      });

      if (pdfResponse.status === 200) {
        dispatch(setRiskVisualPage(false));
        dispatch(setRiskPage(true));
        const blob = new Blob([pdfResponse.data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        dispatch(setRiskPDFPreview(url));
        dispatch(setDocVisualRiskPDF(false));

        try {
          const analysisResponse = await axiosConfig.post("/api/v1/doc/visual",
            { 'fileName': riskFile,
              'fileLocation': 'doc_risk'
            },
          );
    
          if (analysisResponse.status === 200) {
            dispatch(setRiskFileName(riskFile));
            const extractedData = analysisResponse.data.result.documents.map(doc => ({
              INDEX: doc.INDEX,
              LABEL: doc.LABEL,
              PAGE: doc.PAGE,
              SECTION: doc.SECTION,
              SENTENCE: doc.SENTENCE,
              WORDLIST: doc.WORDLIST,
            }));
            dispatch(setRiskDoc(extractedData));

            const riskData = {
              allCounts: analysisResponse.data.result.allCounts,
              riskCounts: analysisResponse.data.result.riskCounts,
              onlyRisks: analysisResponse.data.result.onlyRisks
            };
            dispatch(setRiskData(riskData));
            //riskFileName 저장

            dispatch(setDocVisualRiskLabelUpdate(false));
            dispatch(setDocVisualRiskBackdrop(false));

            dispatch(setRiskFile(docVisualRiskTemPdfName+' 임시파일'));
    
            navigate('/module/riskvisual');
          }
        } catch (error) {
          console.error('Error during analysisResponse API call:', error);
          // eslint-disable-next-line
          alert('json 파일 확인 요망');
          window.location.reload();
        }
      }
    } catch (error) {
      if(error.response && error.response.status === 404) {
        try {
          const analysisResponse = await axiosConfig.post("/api/v1/doc/visual",
            { 'fileName': riskFile },
          );
    
          if (analysisResponse.status === 200) {
            dispatch(setRiskVisualPage(false));
            dispatch(setRiskFile(docVisualRiskTemPdfName));
            dispatch(setRiskFileName(riskFile));
            const extractedData = analysisResponse.data.result.documents.map(doc => ({
              INDEX: doc.INDEX,
              LABEL: doc.LABEL,
              PAGE: doc.PAGE,
              SECTION: doc.SECTION,
              SENTENCE: doc.SENTENCE,
              WORDLIST: doc.WORDLIST,
            }));
            dispatch(setRiskDoc(extractedData));
            
            const riskData = {
              allCounts: analysisResponse.data.result.allCounts,
              riskCounts: analysisResponse.data.result.riskCounts,
              onlyRisks: analysisResponse.data.result.onlyRisks
            };
            dispatch(setRiskData(riskData));
            //riskFileName 저장

            dispatch(setDocVisualRiskPDF(true));
            dispatch(setDocVisualRiskLabelUpdate(false));
            dispatch(setDocVisualRiskBackdrop(false));
    
            navigate('/module/docvisual/riskvisual');
          }
        } catch (error) {
          console.error('Error during analysisResponse API call:', error);
          // eslint-disable-next-line
          alert('json 파일 확인 요망');
          window.location.reload();
        }
      }
    }
  }

  // 임시 문서에서 클라우드 저장
  const TemCloudSaveAPI = async () => {
    const TemCloudSaveName = {
      "saveFileName": docVisualRiskTemName,
      "fileName": docVisualRiskTemFileName,
    }

    try {
      const TemCloudSaveResponse = await axiosConfig.put("/api/v1/doc/visual-save", TemCloudSaveName,);

      if (TemCloudSaveResponse.status === 200) {
        console.log(TemCloudSaveResponse);
        alert('클라우드 저장 완료');
        dispatch(setDocVisualRiskRefresh(Date.now()));
        // window.location.reload();
      }
    } catch (error) {
      // if(error.response && error.response.status === 500) { 용량 넘치면
      console.error('Error during parserResponse API call:', error);
    }
  }

  return { riskVisualLocalAPI, riskCloudVisualAPI, riskTemCloudJsonAPI, riskTemVisualAPI, TemCloudSaveAPI };
}