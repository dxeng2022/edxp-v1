import createAxiosConfig from './AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setCrossDocument, setCrossFileName, setCrossValidationVisual, setVisualBackdrop, setVisualDrawCloudAlert } from '../actions';
import { useNavigate } from 'react-router-dom';


export default function DocVisualCrossAPI() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosConfig = createAxiosConfig(dispatch);

  const visualDrawFile = useSelector(state => state.visualDrawFile);


  const docVisualCrossLocalAPI = async (file) => {

    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);

    const uploadedFile = formData.get('file');
    dispatch(setCrossFileName(uploadedFile.name));

    dispatch(setVisualBackdrop(true));

    try {
      const csvResponse = await axiosConfig.post("/api/v1/doc-cross/valid-loc", formData);
      if (csvResponse.status === 200) {
        dispatch(setCrossDocument(csvResponse.data.result.document));
        dispatch(setCrossValidationVisual(csvResponse.data.result.crossValidationVisualizations));
        dispatch(setVisualBackdrop(false));

        navigate('/module/docvisual/crossvisual');
      }

    } catch (error) {
      console.error('Error during csvResponse API call:', error);
      // eslint-disable-next-line
      // const deleteResponse = await axiosConfig.delete("/api/v1/draw/result-delete");
      alert('csv 파일 확인 요망');
      window.location.reload();
    }
  }


  const docVisualCrossCloudAPI = async () => {
    if (!visualDrawFile.includes('.')) {
      dispatch(setVisualDrawCloudAlert(true));
      return;
    }

    let filename = visualDrawFile.split('/').pop()
    let filePath = visualDrawFile.slice(0, visualDrawFile.lastIndexOf('/'));

  
    const docVisualCrossCloudInfo = {
      'filename': filename,
      'filePath': filePath
    }
  
    dispatch(setVisualBackdrop(true));
    dispatch(setCrossFileName(filename));

    try {
      const csvResponse = await axiosConfig.post("/api/v1/doc-cross/valid", docVisualCrossCloudInfo );
      if (csvResponse.status === 200) {
        dispatch(setCrossDocument(csvResponse.data.result.document));
        dispatch(setCrossValidationVisual(csvResponse.data.result.crossValidationVisualizations));
        dispatch(setVisualBackdrop(false));

        navigate('/module/docvisual/crossvisual');
      }
    } catch (error) {
      console.error('Error during jsonResponse API call:', error);
      // eslint-disable-next-line
      // const deleteResponse = await axiosConfig.delete("/api/v1/draw/result-delete");
      alert('csv 파일 확인 요망');
      window.location.reload();
    }
  }
  

  return { docVisualCrossLocalAPI, docVisualCrossCloudAPI };
}