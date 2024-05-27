import createAxiosConfig from './AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setFileList, setSelectCheckbox, setSelectFilePath, setCurrentVolume, setOriginalVolume, setFolderList, } from '../actions';
import { useEffect, useState } from 'react';

export default function DocVisualCloudListAPI() {

  const dispatch = useDispatch();
  const axiosConfig = createAxiosConfig(dispatch);

  const currentPath = useSelector(state => state.currentPath);
  const processedPath = currentPath.path.replace(/\/[^/]+\/?$/, '/');
  const uploadFile = useSelector(state => state.uploadFile);
  const deleteFilePath = useSelector(state => state.deleteFilePath);
  const changeNameComplete = useSelector(state => state.changeNameComplete);
  const folderNameComplete = useSelector(state => state.folderNameComplete);
  const docVisualRiskRefresh = useSelector(state => state.docVisualRiskRefresh);

  const [filesListErrorCount, setFilesListErrorCount] = useState(0);
  const [foldersListErrorCount, setFoldersListErrorCount] = useState(0);
  const [cloudVolumeErrorCount, setCloudVolumeErrorCount] = useState(0);

  const maxRetryCount = 2;

  useEffect(() => {
    const filesList = async () => {
      if (filesListErrorCount >= maxRetryCount) return;
      try {
        const response = await axiosConfig.get(`/api/v1/file?currentPath=${encodeURIComponent(currentPath.path)}`);

        if  (response.status === 200) {
          const responseData = response.data.result.map(doc => {
            let fileName = doc.fileName;
            let pdfName = null;
            const fullFileName = doc.fileName;
          
            if (doc.extension === 'json') {
              const colonIndex = doc.fileName.indexOf('$');
              if (colonIndex !== -1) {
                // '$'이 존재하는 경우
                fileName = `${doc.fileName.substring(0, colonIndex)}-result.json`;
                pdfName = doc.fileName.substring(colonIndex + 1);
              }
              // '$'이 없는 경우는 fileName이 그대로 유지되고, pdfName은 null로 이미 설정됨
            }
            // extension이 json이 아닌 경우는 fileName이 그대로 유지되고, pdfName은 null로 이미 설정됨
          
            return {
              fileName: fileName,
              pdfName: pdfName,
              fullFileName: fullFileName,
              fileSize: doc.fileSize,
              filePath: doc.filePath,
              extension: doc.extension,
              registeredAt: doc.registeredAt,
              originalFileSize: doc.originalFileSize,
              originalRegisteredAt: doc.originalRegisteredAt,
            };
          });
          dispatch(setFileList(responseData));
          dispatch(setSelectCheckbox([]));
          dispatch(setSelectFilePath([]));
        }
      } catch (error) {
        setFilesListErrorCount(count => count + 1);
        // console.error("Error fetching files:", error);
      }
    };

    const foldersList = async () => {
      if (foldersListErrorCount >= maxRetryCount) return;
      try {
        const response = await axiosConfig.get(`/api/v1/file/get-folder?currentPath=${encodeURIComponent(processedPath)}`);

        if  (response.status === 200) {
          dispatch(setFolderList(response.data.result));
        }
      } catch (error) {
        setFoldersListErrorCount(count => count + 1);
        // console.error("Error fetching files:", error);
      }
    }

    const cloudVolume = async () => {
      if (cloudVolumeErrorCount >= maxRetryCount) return;
      try {
        const response = await axiosConfig.get(`/api/v1/file/get-volume?currentPath=${encodeURIComponent(processedPath)}`);

        if  (response.status === 200) {
          dispatch(setCurrentVolume(response.data.result.volume));
          dispatch(setOriginalVolume(response.data.result.originalVolume));
        }
      } catch (error) {
        setCloudVolumeErrorCount(count => count + 1);
        // console.error("Error fetching files:", error);
      }
    }

    filesList();
    foldersList();
    cloudVolume();
    // eslint-disable-next-line
  }, [currentPath, processedPath, folderNameComplete, uploadFile, deleteFilePath, changeNameComplete, dispatch, docVisualRiskRefresh]);

  return null;
}