import { SET_DOC_VISUAL_RISK_TEM_CLOUD, SET_DOC_VISUAL_RISK_TEM_PATH,
    SET_DOC_VISUAL_RISK_TEM_NAME, SET_DOC_VISUAL_RISK_TEM_FILE_NAME, SET_DOC_VISUAL_RISK_TEM_PDF_NAME,
    SET_DOC_VISUAL_RISK_PDF, SET_DOC_VISUAL_RISK_LABEL_UPDATE, SET_DOC_VISUAL_RISK_BACKDROP,
    SET_DOC_VISUAL_RISK_REFRESH} from "../actions";

function docVisualRiskTemCloud(state = [], action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_TEM_CLOUD:
      return action.docVisualRiskTemCloud;
    default:
      return state;
  }
}

function docVisualRiskTemPath(state = '', action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_TEM_PATH:
      return action.docVisualRiskTemPath;
    default:
      return state;
  }
}

function docVisualRiskTemName(state = '', action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_TEM_NAME:
      return action.docVisualRiskTemName;
    default:
      return state;
  }
}

function docVisualRiskTemFileName(state = '', action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_TEM_FILE_NAME:
      return action.docVisualRiskTemFileName;
    default:
      return state;
  }
}

function docVisualRiskTemPdfName(state = '', action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_TEM_PDF_NAME:
      return action.docVisualRiskTemPdfName;
    default:
      return state;
  }
}

function docVisualRiskPDF(state = false, action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_PDF:
      return action.docVisualRiskPDF;
    default:
      return state;
  }
}

function docVisualRiskLabelUpdate(state = false, action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_LABEL_UPDATE:
      return action.docVisualRiskLabelUpdate;
    default:
      return state;
  }
}

function docVisualRiskBackdrop(state = false, action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_BACKDROP:
      return action.docVisualRiskBackdrop;
    default:
      return state;
  }
}

function docVisualRiskRefresh(state = false, action) {
  switch (action.type) {
    case SET_DOC_VISUAL_RISK_REFRESH:
      return action.docVisualRiskRefresh;
    default:
      return state;
  }
}


const docVisualReducers = {
  docVisualRiskTemCloud,
  docVisualRiskTemPath,
  docVisualRiskTemName,
  docVisualRiskTemFileName,
  docVisualRiskTemPdfName,
  docVisualRiskPDF,
  docVisualRiskLabelUpdate,
  docVisualRiskBackdrop,
  docVisualRiskRefresh,
};
  
export default docVisualReducers;