import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setFileList, setCurrentVolume, setOriginalVolume, setFolderList,
  setSelectCheckbox, setSelectFilePath } from '../actions';
import { useEffect } from 'react';

export default function CloudListAPI() {

  const dispatch = useDispatch();
  const currentPath = useSelector(state => state.currentPath);
  const processedPath = currentPath.path.replace(/\/[^/]+\/?$/, '/');
  const uploadFile = useSelector(state => state.uploadFile);
  const deleteFilePath = useSelector(state => state.deleteFilePath);
  const changeNameComplete = useSelector(state => state.changeNameComplete);
  const folderNameComplete = useSelector(state => state.folderNameComplete);

  useEffect(() => {
    const filesList = async () => {
      try {
        const response = await axios.get(`/api/v1/file?currentPath=${encodeURIComponent(currentPath.path)}`);

        if  (response.status === 200) {
          dispatch(setFileList(response.data.result));
          dispatch(setSelectCheckbox([]));
          dispatch(setSelectFilePath([]));
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    const foldersList = async () => {
      try {
        const response = await axios.get(`/api/v1/file/get-folder?currentPath=${encodeURIComponent(processedPath)}`);

        if  (response.status === 200) {
          dispatch(setFolderList(response.data.result));
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }

    const cloudVolume = async () => {
      try {
        const response = await axios.get(`/api/v1/file/get-volume?currentPath=${encodeURIComponent(processedPath)}`);

        if  (response.status === 200) {
          dispatch(setCurrentVolume(response.data.result.volume));
          dispatch(setOriginalVolume(response.data.result.originalVolume));
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }

    filesList();
    foldersList();
    cloudVolume();
    // eslint-disable-next-line
  }, [currentPath, processedPath, folderNameComplete, uploadFile, deleteFilePath, changeNameComplete, dispatch]);

  return null;
}