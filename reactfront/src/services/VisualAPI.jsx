import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setVisualDrawJson, setVisualDrawLineData, setVisualDrawSymbolData, setVisualDrawImg, setVisualBackdrop, setVisualBackdropText, setVisualDrawCirclepackingData, setVisualDrawPostAlert, setVisualDrawFile } from '../actions';
import { useEffect } from 'react';


export default function VisualAPI() {


  const dispatch = useDispatch();

  const visualDrawFile = useSelector(state => state.visualDrawFile);
  const visualDrawImg = useSelector(state => state.visualDrawImg);


  const visualDrawLocalAPI = async (file) => {

    const formData = new FormData();
    formData.append('file', file);

    const uploadedFile = formData.get('file');
    dispatch(setVisualDrawFile(uploadedFile.name));
    const visualDrawCloudInfo = {
      'filePath': uploadedFile.name,
    }
  
    dispatch(setVisualBackdropText('서버 요청 중입니다.'));
    dispatch(setVisualBackdrop(true));

    try {
      const jsonResponse = await axios.post("/api/v1/visual/result-loc", formData);
      dispatch(setVisualBackdropText('데이터를 분석 중입니다.'));
      if (jsonResponse.status === 200) {
        dispatch(setVisualDrawJson(jsonResponse.data.result));

        const { lines, symbols } = jsonResponse.data.result;
  
        const circlePackingLineData = Object.entries(lines).map(([name, loc]) => ({ name, loc })); 
        const circlePackingSymbolData = Object.entries(symbols).map(([name, loc]) => ({ name, loc }));
        const circlePackingData = {
          name: uploadedFile.name,
          children: [
            {
              name: "symbols",
              children: circlePackingSymbolData
            },
            {
              name: "lines",
              children: circlePackingLineData
            }
          ]
        };
        dispatch(setVisualDrawCirclepackingData(circlePackingData));
  
        const lineData = Object.entries(lines)
          .map(([label, value]) => ({ id: label, value, label }))
          // .sort((a, b) => b.value - a.value);
        dispatch(setVisualDrawLineData(lineData));
  
        const symbolData = Object.entries(symbols)
          .map(([label, value]) => ({ id: label, value, label }))
          // .sort((a, b) => b.value - a.value);
        dispatch(setVisualDrawSymbolData(symbolData));

        try {
          const imgResponse = await axios.post("/api/v1/visual/result-img", visualDrawCloudInfo, {
            responseType: 'blob' 
          });
          dispatch(setVisualBackdropText('데이터 이미지를 요청 중입니다.'));
  
          if (imgResponse.status === 200) {
            const blob = new Blob([imgResponse.data], { type: 'image/png' });
            const url = window.URL.createObjectURL(blob);
            dispatch(setVisualDrawImg(url));
  
            const deleteResponse = await axios.delete("/api/v1/visual/result-delete");
  
            if (deleteResponse.status === 200) {
              dispatch(setVisualBackdrop(false));
            }
          }
        } catch (error) {
          console.error('Error during imgResponse API call:', error);
          // eslint-disable-next-line
          const deleteResponse = await axios.delete("/api/v1/visual/result-delete");
          alert('ipid 내 img 파일 확인 요망');
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error during jsonResponse API call:', error);
      // eslint-disable-next-line
      const deleteResponse = await axios.delete("/api/v1/visual/result-delete");
      alert('ipid 내 xml 파일 확인 요망');
      window.location.reload();
    }
  }


  const visualDrawCloudAPI = async () => {
    if (!visualDrawFile.includes('.')) {
      dispatch(setVisualDrawPostAlert(true));
      return;
    }
  
    const visualDrawCloudInfo = {
      'filePath': visualDrawFile.slice(5),
    }
  
    dispatch(setVisualBackdropText('서버 요청 중입니다.'));
    dispatch(setVisualBackdrop(true));
  
    try {
      const jsonResponse = await axios.post("/api/v1/visual/result-draw", visualDrawCloudInfo );
      dispatch(setVisualBackdropText('데이터를 분석 중입니다.'));
      if (jsonResponse.status === 200) {
        dispatch(setVisualDrawJson(jsonResponse.data.result));
  
        const { lines, symbols } = jsonResponse.data.result;
  
        const circlePackingLineData = Object.entries(lines).map(([name, loc]) => ({ name, loc })); 
        const circlePackingSymbolData = Object.entries(symbols).map(([name, loc]) => ({ name, loc }));
        const circlePackingData = {
          name: visualDrawFile.split('/').pop(),
          children: [
            {
              name: "symbols",
              children: circlePackingSymbolData
            },
            {
              name: "lines",
              children: circlePackingLineData
            }
          ]
        };
        dispatch(setVisualDrawCirclepackingData(circlePackingData));
  
        const lineData = Object.entries(lines)
          .map(([label, value]) => ({ id: label, value, label }))
          .sort((a, b) => b.value - a.value);
        dispatch(setVisualDrawLineData(lineData));
  
        const symbolData = Object.entries(symbols)
          .map(([label, value]) => ({ id: label, value, label }))
          .sort((a, b) => b.value - a.value);
        dispatch(setVisualDrawSymbolData(symbolData));
  
        try {
          const imgResponse = await axios.post("/api/v1/visual/result-img", visualDrawCloudInfo, {
            responseType: 'blob' 
          });
          dispatch(setVisualBackdropText('데이터 이미지를 요청 중입니다.'));
  
          if (imgResponse.status === 200) {
            const blob = new Blob([imgResponse.data], { type: 'image/png' });
            const url = window.URL.createObjectURL(blob);
            dispatch(setVisualDrawImg(url));
  
            const deleteResponse = await axios.delete("/api/v1/visual/result-delete");
  
            if (deleteResponse.status === 200) {
              dispatch(setVisualBackdrop(false));
            }
          }
        } catch (error) {
          console.error('Error during imgResponse API call:', error);
          // eslint-disable-next-line
          const deleteResponse = await axios.delete("/api/v1/visual/result-delete");
          alert('ipid 내 img 파일 확인 요망');
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error during jsonResponse API call:', error);
      // eslint-disable-next-line
      const deleteResponse = await axios.delete("/api/v1/visual/result-delete");
      alert('ipid 내 xml 파일 확인 요망');
      window.location.reload();
    }
  }
  

  useEffect(() => {
    return () => {
      if (visualDrawImg) {
        window.URL.revokeObjectURL(visualDrawImg);
      }
    };
  }, [visualDrawImg]);

  return { visualDrawLocalAPI, visualDrawCloudAPI };
}