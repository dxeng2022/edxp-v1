import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { SET_FILE_LIST, SET_CURRENT_PATH, SET_CURRENT_VOLUME, 
  SET_ORIGINAL_VOLUME, SET_FOLDER_LIST, SET_FOLDER_NAME, SET_FOLDER_NAME_COMPLETE, SET_UPLOAD_FILE,
  SET_SELECT_FILE_PATH, SET_SELECT_CHECKBOX, SET_DELETE_FILE_PATH, SET_CHANGE_NAME,
  SET_CHANGE_NAME_COMPLETE, SET_CLOUD_SNACKBAR } from '../actions';


const fileList = (state = [], action) => {
  switch (action.type) {
    case SET_FILE_LIST:
      return action.fileList;
      default:
        return state;
  }
};

const currentVolume = (state = '', action) => {
  switch (action.type) {
    case SET_CURRENT_VOLUME:
      return action.currentVolume;
      default:
        return state;
  }
}

const originalVolume = (state = 0, action) => {
  switch (action.type) {
    case SET_ORIGINAL_VOLUME:
      return action.originalVolume;
      default:
        return state;
  }
}

const folderList = (state = [], action) => {
  switch (action.type) {
    case SET_FOLDER_LIST:
      return action.folderList;
      default:
        return state;
  }
}

const folderName = (state = '', action) => {
  switch (action.type) {
    case SET_FOLDER_NAME:
      return action.folderName;
      default:
        return state;
  }
}

function folderNameComplete(state = '', action) {
  switch (action.type) {
    case SET_FOLDER_NAME_COMPLETE:
      return action.folderNameComplete;
    default:
      return state;
  }
}

const uploadFile = (state = [], action) => {
  switch (action.type) {
    case SET_UPLOAD_FILE:
      return action.uploadFile;
      default:
        return state;
  }
}


const selectFilePath = (state = [], action) => {
  switch (action.type) {
    case SET_SELECT_FILE_PATH:
      return action.selectFilePath;
      default:
        return state;
  }
}

const selectCheckbox = (state = [], action) => {
  switch (action.type) {
    case SET_SELECT_CHECKBOX:
      return action.selectCheckbox;
      default:
        return state;
  }
}

const deleteFilePath = (state = [], action) => {
  switch (action.type) {
    case SET_DELETE_FILE_PATH:
      return action.deleteFilePath;
      default:
        return state;
  }
}

const changeName = (state = '', action) => {
  switch (action.type) {
    case SET_CHANGE_NAME:
      return action.changeName;
      default:
        return state;
  }
}

const changeNameComplete = (state = '', action) => {
  switch (action.type) {
    case SET_CHANGE_NAME_COMPLETE:
      return action.changeNameComplete;
      default:
        return state;
  }
}

function cloudSnackbar(state = false, action) {
  switch (action.type) {
    case SET_CLOUD_SNACKBAR:
      return action.cloudSnackbar;
    default:
      return state;
  }
}

const currentPathPersistConfig = {
  key: 'currentPath',
  storage: sessionStorage,
};


const currentPath = (state = { path: '' }, action) => {
  switch (action.type) {
    case SET_CURRENT_PATH:
      return { path: action.currentPath };
    default:
      return state;
  }
};


const cloudReducers = {
  fileList,
  currentVolume,
  originalVolume,
  folderList,
  folderName,
  folderNameComplete,
  uploadFile,
  selectFilePath,
  deleteFilePath,
  selectCheckbox,
  changeName,
  changeNameComplete,
  cloudSnackbar,
  currentPath: persistReducer(currentPathPersistConfig, currentPath),
};

export default cloudReducers;