export const SET_VISUAL_DRAW_FILE = 'SET_VISUAL_DRAW_FILE';
export const SET_VISUAL_DRAW_JSON = 'SET_VISUAL_DRAW_JSON';
export const SET_VISUAL_DRAW_LINE_DATA = 'SET_VISUAL_DRAW_LINE_DATA';
export const SET_VISUAL_DRAW_SYMBOL_DATA = 'SET_VISUAL_DRAW_SYMBOL_DATA';
export const SET_VISUAL_DRAW_CIRCLEPACKING_DATA = 'SET_VISUAL_DRAW_CIRCLEPACKING_DATA';
export const SET_VISUAL_DRAW_IMG = 'SET_VISUAL_DRAW_IMG';
export const SET_VISUAL_DRAW_TAG = 'SET_VISUAL_DRAW_TAG';
export const SET_VISUAL_DRAW_TAGX = 'SET_VISUAL_DRAW_TAGX';
export const SET_VISUAL_DRAW_TAGY = 'SET_VISUAL_DRAW_TAGY';
export const SET_VISUAL_BACKDROP = 'SET_VISUAL_BACKDROP';
export const SET_VISUAL_BACKDROP_TEXT = 'SET_VISUAL_BACKDROP_TEXT';

export function setVisualDrawFile(visualDrawFile = '') {
  return {
    type: SET_VISUAL_DRAW_FILE,
    visualDrawFile,
  }
}

export function setVisualDrawJson(visualDrawJson) {
  return {
    type: SET_VISUAL_DRAW_JSON,
    visualDrawJson,
  }
}

export function setVisualDrawLineData(visualDrawLineData) {
  return {
    type: SET_VISUAL_DRAW_LINE_DATA,
    visualDrawLineData,
  }
}

export function setVisualDrawSymbolData(visualDrawSymbolData) {
  return {
    type: SET_VISUAL_DRAW_SYMBOL_DATA,
    visualDrawSymbolData,
  }
}

export function setVisualDrawCirclepackingData(visualDrawCirclepackingData) {
  return {
    type: SET_VISUAL_DRAW_CIRCLEPACKING_DATA,
    visualDrawCirclepackingData,
  }
}

export function setVisualDrawImg(visualDrawImg) {
  return {
    type: SET_VISUAL_DRAW_IMG,
    visualDrawImg,
  }
}

export function setVisualDrawTag(visualDrawTag) {
  return {
    type: SET_VISUAL_DRAW_TAG,
    visualDrawTag,
  }
}

export function setVisualDrawTagX(visualDrawTagX) {
  return {
    type: SET_VISUAL_DRAW_TAGX,
    visualDrawTagX,
  }
}

export function setVisualDrawTagY(visualDrawTagY) {
  return {
    type: SET_VISUAL_DRAW_TAGY,
    visualDrawTagY,
  }
}

export function setVisualBackdrop(visualBackdrop) {
  return {
    type: SET_VISUAL_BACKDROP,
    visualBackdrop,
  }
}

export function setVisualBackdropText(visualBackdropText) {
  return {
    type: SET_VISUAL_BACKDROP_TEXT,
    visualBackdropText,
  }
}