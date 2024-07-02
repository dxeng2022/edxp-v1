import { SET_CROSS_FILE_NAME, SET_CROSS_DOCUMENT, SET_CROSS_VALIDATION_VISUAL,
  SET_CROSS_ST_SENTENCE_ID, SET_CROSS_CP_SENTENCE_ID, SET_CROSS_COMPARE_CATEGORY } from '../actions';

function crossFileName(state = '', action) {
  switch (action.type) {
    case SET_CROSS_FILE_NAME:
      return action.crossFileName;
    default:
      return state;
  }
}

function crossDocument(state = [], action) {
  switch (action.type) {
    case SET_CROSS_DOCUMENT:
      return action.crossDocument;
    default:
      return state;
  }
}

function crossValidationVisual(state = [], action) {
  switch (action.type) {
    case SET_CROSS_VALIDATION_VISUAL:
      return action.crossValidationVisual;
    default:
      return state;
  }
}

function crossSTSentenceId(state = [], action) {
  switch (action.type) {
    case SET_CROSS_ST_SENTENCE_ID:
      return action.crossSTSentenceId;
    default:
      return state;
  }
}

function crossCPSentenceId(state = [], action) {
  switch (action.type) {
    case SET_CROSS_CP_SENTENCE_ID:
      return action.crossCPSentenceId;
    default:
      return state;
  }
}

function crossCompareCategory(state = '', action) {
  switch (action.type) {
    case SET_CROSS_COMPARE_CATEGORY:
      return action.crossCompareCategory;
    default:
      return state;
  }
}

const crossReducers = {
  crossFileName,
  crossDocument,
  crossValidationVisual,
  crossSTSentenceId,
  crossCPSentenceId,
  crossCompareCategory,
}

export default crossReducers;