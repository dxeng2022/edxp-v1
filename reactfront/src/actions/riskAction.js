export const SET_RISK_PAGE = 'SET_RISK_PAGE';
export const SET_RISK_VISUAL_PAGE = 'SET_RISK_VISUAL_PAGE';
export const SET_RISK_FILE = 'SET_RISK_FILE';
export const SET_RISK_PDF_PREVIEW = 'SET_RISK_PDF_PREVIEW';
export const SET_PARSER_DOC = 'SET_PARSER_DOC';
export const SET_RISK_DOC = 'SET_RISK_DOC';
export const SET_RISK_PDF_BACKDROP = 'SET_RISK_PDF_BACKDROP';
export const SET_RISK_BACKDROP = 'SET_RISK_BACKDROP';
export const SET_RISK_BACKDROP_TEXT = 'SET_RISK_BACKDROP_TEXT';
export const SET_RISK_CLOUD_ALERT = 'SET_RISK_CLOUD_ALERT';
export const SET_RISK_FILE_NAME = 'SET_RISK_FILE_NAME';
export const SET_RISK_DATA = 'SET_RISK_DATA';
export const SET_PARSER_CHANGE_BUTTON = 'SET_PARSER_CHANGE_BUTTON';

export function setRiskPage(riskPage) {
  return {
    type: SET_RISK_PAGE,
    riskPage,
  }
}

export function setRiskVisualPage(riskVisualPage) {
  return {
    type: SET_RISK_VISUAL_PAGE,
    riskVisualPage,
  }
}

export function setRiskFile(riskFile = '') {
  return {
    type: SET_RISK_FILE,
    riskFile,
  }
}

export function setRiskPDFPreview(riskPDFPreview) {
  return {
    type: SET_RISK_PDF_PREVIEW,
    riskPDFPreview,
  }
}

export function setParserDoc(parserDoc) {
  return {
    type: SET_PARSER_DOC,
    parserDoc,
  }
}

export function setRiskDoc(riskDoc) {
  return {
    type: SET_RISK_DOC,
    riskDoc,
  }
}

export function setRiskPDFBackdrop(riskPDFBackdrop) {
  return {
    type: SET_RISK_PDF_BACKDROP,
    riskPDFBackdrop,
  }
}

export function setRiskBackdrop(riskBackdrop) {
  return {
    type: SET_RISK_BACKDROP,
    riskBackdrop,
  }
}

export function setRiskBackdropText(riskBackdropText) {
  return {
    type: SET_RISK_BACKDROP_TEXT,
    riskBackdropText,
  }
}

export function setRiskCloudAlert(riskCloudAlert) {
  return {
    type: SET_RISK_CLOUD_ALERT,
    riskCloudAlert,
  }
}

export function setRiskFileName(riskFileName) {
  return {
    type: SET_RISK_FILE_NAME,
    riskFileName,
  }
}

export function setRiskData(riskData) {
  return {
    type: SET_RISK_DATA,
    riskData,
  }
}

export function setParserChangeButton(parserChangeButton) {
  return {
    type: SET_PARSER_CHANGE_BUTTON,
    parserChangeButton,
  }
}