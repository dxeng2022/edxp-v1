export const SET_FILE_LIST = 'SET_FILE_LIST';
export const SET_CURRENT_PATH = 'SET_CURRENT_PATH';
export const SET_CURRENT_VOLUME = 'SET_CURRENT_VOLUME';
export const SET_ORIGINAL_VOLUME = 'SET_ORIGINAL_VOLUME';
export const SET_FOLDER_LIST = 'SET_FOLDER_LIST';
export const SET_FOLDER_NAME = 'SET_FOLDER_NAME';
export const SET_FOLDER_NAME_COMPLETE = 'SET_FOLDER_NAME_COMPLETE';
export const SET_UPLOAD_FILE = 'SET_UPLOAD_FILE';
export const SET_SELECT_FILE_PATH = 'SET_SELECT_FILE_PATH';
export const SET_SELECT_CHECKBOX = 'SET_SELECT_CHECKBOX';
export const SET_DELETE_FILE_PATH = 'SET_DELETE_FILE_PATH';
export const SET_CHANGE_NAME = 'SET_CHANGE_NAME';
export const SET_CHANGE_NAME_COMPLETE = 'SET_CHANGE_NAME_COMPLETE';
export const SET_CLOUD_SNACKBAR = 'SET_CLOUD_SNACKBAR';

export function setFileList(fileList) {
  return {
    type: SET_FILE_LIST,
    fileList,
  }
}

export function setCurrentPath(currentPath) {
  return {
    type: SET_CURRENT_PATH,
    currentPath,
  }
}

export function setCurrentVolume(currentVolume) {
  return {
    type: SET_CURRENT_VOLUME,
    currentVolume,
  }
}

export function setOriginalVolume(originalVolume) {
  return {
    type: SET_ORIGINAL_VOLUME,
    originalVolume,
  }
}

export function setFolderList(folderList) {
  return {
    type: SET_FOLDER_LIST,
    folderList,
  }
}

export function setFolderName(folderName) {
  return {
    type: SET_FOLDER_NAME,
    folderName,
  }
}

export function setFolderNameComplete(folderNameComplete) {
  return {
    type: SET_FOLDER_NAME_COMPLETE,
    folderNameComplete,
  }
}

export function setUploadFile(uploadFile) {
  return {
    type: SET_UPLOAD_FILE,
    uploadFile,
  }
}

export function setSelectFilePath(selectFilePath) {
  return {
    type: SET_SELECT_FILE_PATH,
    selectFilePath,
  }
}

export function setSelectCheckbox(selectCheckbox) {
  return {
    type: SET_SELECT_CHECKBOX,
    selectCheckbox,
  }
}

export function setDeleteFilePath(deleteFilePath) {
  return {
    type: SET_DELETE_FILE_PATH,
    deleteFilePath,
  }
}

export function setChangeName(changeName) {
  return {
    type: SET_CHANGE_NAME,
    changeName,
  }
}

export function setChangeNameComplete(changeNameComplete) {
  return {
    type: SET_CHANGE_NAME_COMPLETE,
    changeNameComplete,
  }
}

export function setCloudSnackbar(cloudSnackbar) {
  return {
    type: SET_CLOUD_SNACKBAR,
    cloudSnackbar,
  }
}




