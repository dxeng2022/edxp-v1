export const SET_CROSS_FILE_NAME = 'SET_CROSS_FILE_NAME';
export const SET_CROSS_DOCUMENT = 'SET_CROSS_DOCUMENT';
export const SET_CROSS_VALIDATION_VISUAL = 'SET_CROSS_VALIDATION_VISUAL';
export const SET_CROSS_ST_SENTENCE_ID = 'SET_CROSS_ST_SENTENCE_ID';
export const SET_CROSS_CP_SENTENCE_ID = 'SET_CROSS_CP_SENTENCE_ID';
export const SET_CROSS_COMPARE_CATEGORY = 'SET_CROSS_COMPARE_CATEGORY';

export function setCrossFileName(crossFileName) {
  return {
      type: SET_CROSS_FILE_NAME,
      crossFileName,
  }
}

export function setCrossDocument(crossDocument) {
  return {
      type: SET_CROSS_DOCUMENT,
      crossDocument,
  }
}

export function setCrossValidationVisual(crossValidationVisual) {
  return {
      type: SET_CROSS_VALIDATION_VISUAL,
      crossValidationVisual,
  }
}

export function setCrossSTSentenceId(crossSTSentenceId) {
  return {
      type: SET_CROSS_ST_SENTENCE_ID,
      crossSTSentenceId,
  }
}

export function setCrossCPSentenceId(crossCPSentenceId) {
  return {
      type: SET_CROSS_CP_SENTENCE_ID,
      crossCPSentenceId,
  }
}

export function setCrossCompareCategory(crossCompareCategory) {
  return {
      type: SET_CROSS_COMPARE_CATEGORY,
      crossCompareCategory,
  }
}