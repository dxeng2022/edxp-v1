import { SET_VISUAL_DRAW_FILE, SET_VISUAL_DRAW_JSON, SET_VISUAL_DRAW_LINE_DATA, SET_VISUAL_DRAW_SYMBOL_DATA, SET_VISUAL_DRAW_CIRCLEPACKING_DATA,
  SET_VISUAL_DRAW_IMG, SET_VISUAL_DRAW_TAG, SET_VISUAL_DRAW_TAGX, SET_VISUAL_DRAW_TAGY,
  SET_VISUAL_BACKDROP, SET_VISUAL_BACKDROP_TEXT, SET_VISUAL_DRAW_CLOUD_ALERT } from '../actions';

function visualDrawFile(state = '', action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_FILE:
      return action.visualDrawFile;
    default:
      return state;
  }
}

function visualDrawJson(state = {}, action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_JSON:
      return action.visualDrawJson;
    default:
      return state;
  }
}

function visualDrawLineData(state = [], action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_LINE_DATA:
      return action.visualDrawLineData;
    default:
      return state;
  }
}

function visualDrawSymbolData(state = [], action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_SYMBOL_DATA:
      return action.visualDrawSymbolData;
    default:
      return state;
  }
}

function visualDrawCirclepackingData(state = {}, action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_CIRCLEPACKING_DATA:
      return action.visualDrawCirclepackingData;
    default:
      return state;
  }
}

function visualDrawImg(state = null, action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_IMG:
      return action.visualDrawImg;
    default:
      return state;
  }
}

function visualDrawTag(state = false, action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_TAG:
      return action.visualDrawTag;
    default:
      return state;
  }
}

function visualDrawTagX(state = null, action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_TAGX:
      return action.visualDrawTagX;
    default:
      return state;
  }
}

function visualDrawTagY(state = null, action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_TAGY:
      return action.visualDrawTagY;
    default:
      return state;
  }
}

function visualBackdrop(state = false, action) {
  switch (action.type) {
    case SET_VISUAL_BACKDROP:
      return action.visualBackdrop;
    default:
      return state;
  }
}

function visualBackdropText(state = '', action) {
  switch (action.type) {
    case SET_VISUAL_BACKDROP_TEXT:
      return action.visualBackdropText;
    default:
      return state;
  }
}

function visualDrawCloudAlert(state = false, action) {
  switch (action.type) {
    case SET_VISUAL_DRAW_CLOUD_ALERT:
      return action.visualDrawCloudAlert;
    default:
      return state;
  }
}

const visualReducers = {
  visualDrawFile,
  visualDrawJson,
  visualDrawLineData,
  visualDrawSymbolData,
  visualDrawCirclepackingData,
  visualDrawImg,
  visualDrawTag,
  visualDrawTagX,
  visualDrawTagY,
  visualBackdrop,
  visualBackdropText,
  visualDrawCloudAlert,
};

export default visualReducers;