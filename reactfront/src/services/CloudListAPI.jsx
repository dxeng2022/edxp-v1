import axios from 'axios';
import createAxiosConfig from './AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setFileList, setCurrentVolume, setOriginalVolume, setFolderList,
  setSelectCheckbox, setSelectFilePath } from '../actions';
import { useEffect, useState } from 'react';

export default function CloudListAPI() {

  const dispatch = useDispatch();
  const axiosConfig = createAxiosConfig(dispatch);

  const currentPath = useSelector(state => state.currentPath);
  const processedPath = currentPath.path.replace(/\/[^/]+\/?$/, '/');
  const uploadFile = useSelector(state => state.uploadFile);
  const deleteFilePath = useSelector(state => state.deleteFilePath);
  const changeNameComplete = useSelector(state => state.changeNameComplete);
  const folderNameComplete = useSelector(state => state.folderNameComplete);

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
          dispatch(setFileList(response.data.result));
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
        const response = await axios.get(`/api/v1/file/get-folder?currentPath=${encodeURIComponent(processedPath)}`);

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
        const response = await axios.get(`/api/v1/file/get-volume?currentPath=${encodeURIComponent(processedPath)}`);

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
  }, [currentPath, processedPath, folderNameComplete, uploadFile, deleteFilePath, changeNameComplete, dispatch]);

  return null;
}