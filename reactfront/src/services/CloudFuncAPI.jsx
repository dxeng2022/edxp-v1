import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAddFolderResult, setAddFolderAlert, setFolderAlert,
  setUploadFileResult, setUploadFileAlert, setCompleteDeleteFileAlert, setDeleteFilePath, setSelectCheckbox, setChangeNameResult, setChangeNameInputAlert, setChangeNameAlert, setChangeNameComplete, setCloudSnackbar, setFolderNameComplete, setSelectFilePath, setUploadFile } from '../actions';
  
  
export default function CloudFuncAPI() {

  const dispatch = useDispatch();

  const currentPath = useSelector(state => state.currentPath);
  const folderName = useSelector(state => state.folderName);
  const selectFilePath = useSelector(state => state.selectFilePath);
  const changeName = useSelector(state => state.changeName);
  

  
  //폴더 추가
  const addFolderAPI = async () => {

    const addFolderInfo = {
      'currentPath': currentPath.path,
      'folderName': folderName,
    };

    try {
      const response = await axios.post('/api/v1/file/add-folder', addFolderInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        dispatch(setAddFolderResult('폴더가 추가되었습니다.'));
        dispatch(setAddFolderAlert(false));
        dispatch(setFolderAlert(true));
        dispatch(setFolderNameComplete(folderName));
      }
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setAddFolderResult('폴더 추가에 실패하였습니다. 중복된 폴더명이 있는지 확인해주세요. 지속될 시 관리자 문의바랍니다.'));
        dispatch(setAddFolderAlert(false));
        dispatch(setFolderAlert(true));
      } else {
        console.log(error.response);
      }
    }
  };
  //폴더 추가

  //파일 업로드
  const uploadFileAPI = async (filesToUpload) => {

    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });
  
    formData.append("data", new Blob([JSON.stringify({ currentPath: currentPath.path })], { type: 'application/json' }));
  
    try {
      const response = await axios.post('/api/v1/file/upload', formData);
  
      if (response.status === 200) {
        dispatch(setUploadFileResult('업로드가 완료되었습니다!'));
        dispatch(setUploadFileAlert(true));
        dispatch(setUploadFile(filesToUpload));
      } 
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        dispatch(setUploadFileResult("파일 이름이 중복되었습니다."));
        dispatch(setUploadFileAlert(true));
      } else {
        dispatch(setUploadFileResult("업로드에 실패하였습니다."));
        dispatch(setUploadFileAlert(true));
      }
    }
  };
  //파일 업로드

  //파일 다운로드
  function customEscape(str) {
    return Array.from(str)
      .map(char => {
        const charCode = char.charCodeAt(0);
  
        if (
          charCode === 0x2D ||          // "-"
          charCode === 0x5F ||          // "_"
          charCode === 0x2E ||          // "."
          charCode === 0x7E ||          // "~"
          (charCode >= 0x30 && charCode <= 0x39) ||  // 숫자 0-9
          (charCode >= 0x41 && charCode <= 0x5A) ||  // 대문자 A-Z
          (charCode >= 0x61 && charCode <= 0x7A)     // 소문자 a-z
        ) {
          return char;
        } else {
          return "%" + charCode.toString(16).toUpperCase();
        }
      })
      .join('');
  }

  const downloadFileAPI = async () => {
    
    dispatch(setCloudSnackbar(true));
  
    try {
      const response = await axios.post("/api/v1/file/download", 
        { currentPath: currentPath.path, filePaths: selectFilePath },
        { responseType: 'blob' } // blob 형태의 데이터를 받기 위해 responseType을 지정
      );

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        let fileName = decodeURIComponent(customEscape(contentDisposition.split("filename=")[1]));
        fileName = fileName.replace(/['"]/g, "").replace(/^\//, ""); // 따옴표 제거
        fileName = fileName.endsWith("1") ? fileName.slice(0, -1) : fileName; //파일 확장자 뒤 '1' 제거
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        dispatch(setSelectFilePath([]));
        dispatch(setSelectCheckbox([]));
      }
    } catch (error) {
      alert("다운로드 실패! 서버에서 오류가 발생했습니다.");
    }
  }
  //파일 다운로드

  //삭제
  const deleteFileAPI = async () => {

    try {
      const response = await axios.delete('/api/v1/file', {
        data: { filePaths: selectFilePath },
      });

      if (response.status === 200) {
        dispatch(setCompleteDeleteFileAlert(true));
        dispatch(setDeleteFilePath(selectFilePath));
        dispatch(setSelectCheckbox([]));
      }
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        alert('삭제 중 문제가 발생했습니다. 관리자에게 문의바랍니다.');
      } else {
        console.log(error.response);
      }
    }
  };
  //삭제

  //파일 이름 변경
  const changeNameAPI = async () => {

    const currentFilePath = selectFilePath[0];
    const currentName = currentFilePath.split("/").pop();
    const extension = currentName.split('.').pop();

    const changeNameInfo = {
      'currentPath': currentPath.path,
      'currentName': currentName,
      'updateName': changeName,
      'extension': extension,
    };

    try {
      const response = await axios.put('/api/v1/file', changeNameInfo, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });

      if (response.status === 200) {
        dispatch(setChangeNameResult('파일 이름이 변경되었습니다.'));
        dispatch(setChangeNameInputAlert(false));
        dispatch(setChangeNameAlert(true));
        dispatch(setChangeNameComplete(changeName));
        dispatch(setSelectCheckbox([]));
      }
    } catch(error) {
      if (error.response && error.response.status !== 200) {
        dispatch(setChangeNameResult('이름 변경을 실패하였습니다. 중복된 파일명이 있는지 확인해주세요. 지속될 시 관리자 문의바랍니다.'));
        dispatch(setChangeNameInputAlert(false));
        dispatch(setChangeNameAlert(true));
      } else {
        console.log(error.response);
      }
    }

  };
  //파일 이름 변경


  return { addFolderAPI, uploadFileAPI, downloadFileAPI, deleteFileAPI, changeNameAPI };
};