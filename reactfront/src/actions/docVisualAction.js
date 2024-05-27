export const SET_DOC_VISUAL_RISK_TEM_CLOUD = 'SET_DOC_VISUAL_RISK_TEM_CLOUD';
export const SET_DOC_VISUAL_RISK_TEM_PATH = 'SET_DOC_VISUAL_RISK_TEM_PATH';
export const SET_DOC_VISUAL_RISK_TEM_NAME = 'SET_DOC_VISUAL_RISK_TEM_NAME';
export const SET_DOC_VISUAL_RISK_TEM_FILE_NAME = 'SET_DOC_VISUAL_RISK_TEM_FILE_NAME';
export const SET_DOC_VISUAL_RISK_TEM_PDF_NAME = 'SET_DOC_VISUAL_RISK_TEM_PDF_NAME';
export const SET_DOC_VISUAL_RISK_PDF = 'SET_DOC_VISUAL_RISK_PDF';
export const SET_DOC_VISUAL_RISK_LABEL_UPDATE = 'SET_DOC_VISUAL_RISK_LABEL_UPDATE';
export const SET_DOC_VISUAL_RISK_BACKDROP = 'SET_DOC_VISUAL_RISK_BACKDROP';
export const SET_DOC_VISUAL_RISK_REFRESH = 'SET_DOC_VISUAL_RISK_REFRESH';

export function setDocVisualRiskTemCloud(docVisualRiskTemCloud) {
  return {
    type: SET_DOC_VISUAL_RISK_TEM_CLOUD,
    docVisualRiskTemCloud,
  }
}

export function setDocVisualRiskTemPath(docVisualRiskTemPath) {
  return {
    type: SET_DOC_VISUAL_RISK_TEM_PATH,
    docVisualRiskTemPath,
  }
}

export function setDocVisualRiskTemName(docVisualRiskTemName) {
  return {
    type: SET_DOC_VISUAL_RISK_TEM_NAME,
    docVisualRiskTemName,
  }
}

export function setDocVisualRiskTemFileName(docVisualRiskTemFileName) {
  return {
    type: SET_DOC_VISUAL_RISK_TEM_FILE_NAME,
    docVisualRiskTemFileName,
  }
}

export function setDocVisualRiskTemPdfName(docVisualRiskTemPdfName) {
  return {
    type: SET_DOC_VISUAL_RISK_TEM_PDF_NAME,
    docVisualRiskTemPdfName,
  }
}

export function setDocVisualRiskPDF(docVisualRiskPDF) {
  return {
    type: SET_DOC_VISUAL_RISK_PDF,
    docVisualRiskPDF,
  }
}

export function setDocVisualRiskLabelUpdate(docVisualRiskLabelUpdate) {
  return {
    type: SET_DOC_VISUAL_RISK_LABEL_UPDATE,
    docVisualRiskLabelUpdate,
  }
}

export function setDocVisualRiskBackdrop(docVisualRiskBackdrop) {
  return {
    type: SET_DOC_VISUAL_RISK_BACKDROP,
    docVisualRiskBackdrop,
  }
}

export function setDocVisualRiskRefresh(docVisualRiskRefresh) {
  return {
    type: SET_DOC_VISUAL_RISK_REFRESH,
    docVisualRiskRefresh,
  }
}