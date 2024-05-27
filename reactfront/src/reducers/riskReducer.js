import { SET_RISK_PAGE, SET_RISK_VISUAL_PAGE, SET_RISK_FILE, SET_RISK_PDF_PREVIEW, SET_PARSER_DOC, SET_RISK_DOC, SET_RISK_PDF_BACKDROP,
  SET_RISK_BACKDROP, SET_RISK_BACKDROP_TEXT, SET_RISK_CLOUD_ALERT,
  SET_RISK_FILE_NAME, SET_RISK_DATA, SET_PARSER_CHANGE_BUTTON, } from '../actions';

  function riskPage(state = false, action) {
    switch (action.type) {
      case SET_RISK_PAGE:
        return action.riskPage;
      default:
        return state;
    }
  }

  function riskVisualPage(state = false, action) {
    switch (action.type) {
      case SET_RISK_VISUAL_PAGE:
        return action.riskVisualPage;
      default:
        return state;
    }
  }

  function riskFile(state = '', action) {
  switch (action.type) {
    case SET_RISK_FILE:
      return action.riskFile;
    default:
      return state;
  }
}

function riskPDFPreview(state = [], action) {
  switch (action.type) {
    case SET_RISK_PDF_PREVIEW:
      return action.riskPDFPreview;
    default:
      return state;
  }
}

function parserDoc(state = [], action) {
  switch (action.type) {
    case SET_PARSER_DOC:
      return action.parserDoc;
    default:
      return state;
  }
}

function riskDoc(state = [], action) {
  switch (action.type) {
    case SET_RISK_DOC:
      return action.riskDoc;
    default:
      return state;
  }
}

function riskPDFBackdrop(state = false, action) {
  switch (action.type) {
    case SET_RISK_PDF_BACKDROP:
      return action.riskPDFBackdrop;
    default:
      return state;
  }
}

function riskBackdrop(state = false, action) {
  switch (action.type) {
    case SET_RISK_BACKDROP:
      return action.riskBackdrop;
    default:
      return state;
  }
}

function riskBackdropText(state = '', action) {
  switch (action.type) {
    case SET_RISK_BACKDROP_TEXT:
      return action.riskBackdropText;
    default:
      return state;
  }
}

function riskCloudAlert(state = false, action) {
  switch (action.type) {
    case SET_RISK_CLOUD_ALERT:
      return action.riskCloudAlert;
    default:
      return state;
  }
}

function riskFileName(state = '', action) {
  switch (action.type) {
    case SET_RISK_FILE_NAME:
      return action.riskFileName;
    default:
      return state;
  }
}

function riskData(state = [], action) {
  switch (action.type) {
    case SET_RISK_DATA:
      return action.riskData;
    default:
      return state;
  }
}

function parserChangeButton(state = false, action) {
  switch (action.type) {
    case SET_PARSER_CHANGE_BUTTON:
      return action.parserChangeButton;
    default:
      return state;
  }
}


const riskReducers = {
  riskPage,
  riskVisualPage,
  riskFile,
  riskPDFPreview,
  parserDoc,
  riskDoc,
  riskPDFBackdrop,
  riskBackdrop,
  riskBackdropText,
  riskCloudAlert,
  riskFileName,
  riskData,
  parserChangeButton,
};

export default riskReducers;