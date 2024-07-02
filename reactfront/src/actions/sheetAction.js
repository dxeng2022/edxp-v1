export const SET_VISUAL_SHEET_FILE = "SET_VISUAL_SHEET_FILE";
export const SET_VISUAL_SHEET_CLOUD_ALERT = "SET_VISUAL_SHEET_CLOUD_ALERT";

export function setVisualSHEETFile(visualSheetFile = "") {
  return {
    type: SET_VISUAL_SHEET_FILE,
    visualSheetFile,
  };
}

export function setVisualSheetCloudAlert(visualSheetCloudAlert) {
  return {
    type: SET_VISUAL_SHEET_CLOUD_ALERT,
    visualSheetCloudAlert,
  };
}
