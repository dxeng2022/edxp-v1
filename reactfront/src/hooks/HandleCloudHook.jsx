import { useDispatch, useSelector } from 'react-redux';
import CloudFuncAPI from '../services/CloudFuncAPI.jsx';
import { setFolderAlert, setAddFolderAlert, setAddFolderResult,
  setUploadFileResult, setUploadFileAlert, setSelectFilePath, 
  setChangeNameResult, setChangeNameAlert, setChangeNameInputAlert, setSelectCheckbox } from '../actions';


export default function HandleCloud() {

  const dispatch = useDispatch();

  const currentPath = useSelector(state => state.currentPath);
  const folderList = useSelector(state => state.folderList);
  const folderName = useSelector(state => state.folderName);
  const originalVolume = useSelector(state => state.originalVolume);
  const selectFilePath = useSelector(state => state.selectFilePath);
  const changeName = useSelector(state => state.changeName);
  
  const { addFolderAPI, uploadFileAPI, changeNameAPI } = CloudFuncAPI();

  // 폴더 현황 검증
  const handleValidationFolder = async () => {
    const folderDepth = currentPath.path.split('/').length - 1;
    const numberOfFolders = folderList.length;
  
    if (folderDepth >= 2) {
      dispatch(setAddFolderResult("하위 폴더를 생성할 수 없습니다."));
      dispatch(setFolderAlert(true));
      return;
    }
  
    if (numberOfFolders >= 20) {
      dispatch(setAddFolderResult('총 20개 이상의 폴더 생성이 불가능합니다.'));
      dispatch(setFolderAlert(true));
      return;
    }

    dispatch(setAddFolderAlert(true));
  };
  // 폴더 현황 검증
  
  // 폴더 이름 검증 및 API 요청
  const validateName = (folderName) => {
    if (folderName.length > 100) {
      return false;
    }
    
    const regex = /[ #%/\\*?<>|:.]/;
    if (regex.test(folderName)) {
      return false;
    }
  
    return true;
  };

  const handleAddFolder = async () => {
    if (folderName && folderName.trim()) {
      if (validateName(folderName)) {
        await addFolderAPI();
      } else {
        dispatch(setAddFolderResult("올바른 폴더 이름을 입력해주세요."));
        dispatch(setAddFolderAlert(false));
        dispatch(setFolderAlert(true));
      }
    }
  };
  // 폴더 이름 검증 및 API 요청


  // 파일 이름 변경 검증
  const handleValidationFileName = async () => {

    const currentFilePath = selectFilePath[0];

    if (currentFilePath.endsWith('/')) {
      dispatch(setChangeNameResult("폴더 이름 변경은 지원하지 않습니다."))
      dispatch(setChangeNameAlert(true));
      return;
    }

    dispatch(setChangeNameInputAlert(true));

  }

  const handleChangeName = async () => {
    if (changeName && changeName.trim()) {
      if (validateName(changeName)) {
        await changeNameAPI();
      } else {
        dispatch(setChangeNameResult("올바른 폴더 이름을 입력해주세요."));
        dispatch(setChangeNameInputAlert(false));
        dispatch(setChangeNameAlert(true));
      }
    }
  };
  // 파일 이름 변경 검증


  // 업로드 파일 검증 함수
  const isFileSizeValid = (file) => {
    const limit = 10 * 1024 * 1024; // 10MB
    if (file.size > limit) {
      dispatch(setUploadFileResult(`${file.name} 파일의 용량이 10MB를 초과했습니다. 업로드되지 않습니다.`));
      dispatch(setUploadFileAlert(true));
      return false;
    }
    return true;
  };
  
  const isFileCountValid = (files) => {
    if (files.length > 5) {
      dispatch(setUploadFileResult("최대 5개의 파일까지 업로드 가능합니다."));
      dispatch(setUploadFileAlert(true));
      return false;
    }
    return true;
  };
  
  const isTotalSizeValid = (filesToUpload, originalVolume) => {
    const totalSize = filesToUpload.reduce((total, file) => {
      return total + file.size;
    }, 0);
  
    const totalSizeMB = totalSize / (1024 * 1024); // MB 단위로 변환
  
    if (totalSizeMB + (originalVolume / (1024 * 1024)) > 30) {
      dispatch(setUploadFileResult("총 용량 30MB를 초과하였습니다. 파일을 정리해주세요."));
      dispatch(setUploadFileAlert(true));
      return false;
    }
    return true;
  };
  
  const handleValidationFile = async (files) => {
    let filesToUpload = Array.from(files);
  
    if (!isFileCountValid(filesToUpload)) {
      return;
    }
  
    filesToUpload = filesToUpload.filter(isFileSizeValid);
  
    if (!isTotalSizeValid(filesToUpload, originalVolume)) {
      return;
    }
  
    await uploadFileAPI(filesToUpload);
  
    return;
  };
  // 업로드 파일 검증 함수

  // 체크박스 선택 시 filePath 저장
  const handleSelectCheckbox = (newSelectionModel, rows) => {
    // if (newSelectionModel.length > 5) {
    //   alert("최대 5개까지만 선택 가능합니다.");
    //   dispatch(setSelectCheckbox(newSelectionModel.slice(0, 5)));
    //   return;
    // }
    dispatch(setSelectCheckbox(newSelectionModel));

    const filePaths = newSelectionModel.map(id => rows[id].filePath);
    dispatch(setSelectFilePath(filePaths));
  };
  // 체크박스 선택 시 filePath 저장



  return { handleValidationFolder, handleAddFolder, handleValidationFile, handleSelectCheckbox, handleValidationFileName, handleChangeName };
}