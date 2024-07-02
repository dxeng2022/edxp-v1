import { Box, Container } from "@mui/material";
import React, { useEffect } from "react";
import "./SheetVisualPage.css";
import visualize_image from "../helpers/selectObject";
import { SheetInfoManager } from "../helpers/sheetInfoLoader";

const SheetVisualPage = () => {
  let PAGE = 4;
  let imgSrc =
    "http://localhost:8080/proxy-image/?imageKey=sheetimg/4_rebuilt_img.png";
  let projectFolder =
    "http://localhost:8080/proxy-image/v2?jsonKey=sheetjson/sheet_info.json";

  useEffect(() => {
    const initialize = async () => {
      let sheet_info_manager = new SheetInfoManager(projectFolder);
      await sheet_info_manager.load_sheet_info();
      sheet_info_manager.make_obj_map();
      visualize_image(sheet_info_manager, PAGE, imgSrc);
    };

    initialize();
  }, []);

  return (
    <Box sx={{ my: 3 }}>
      <Container maxWidth="false">
        <label>
          <input type="radio" name="object" value="table" />
          table
        </label>
        <br />
        <label>
          <input type="radio" name="object" value="cell" checked />
          cell
        </label>
        <br />
        <label>
          <input type="radio" name="object" value="text" />
          text
        </label>
        <br />
        <label>
          <input type="radio" name="object" value="semantic text" />
          semantic text
        </label>
        <br />
        <div id="grid-container" className="grid-container">
          <div className="grid-item">이미지에서 객체 선택</div>
          <div className="grid-item">선택된 객체 정보</div>
          <div id="grid-item1" className="grid-item"></div>
          <div id="grid-item2" className="grid-item"></div>
        </div>

        {/* <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={5}
            md={5}
            sx={{ height: "calc(100vh - 160px)" }}
          >
            <Paper
              elevation={6}
              sx={{ height: "100%", position: "relative" }}
            ></Paper>
          </Grid>

          <Grid
            item
            xs={12}
            sm={7}
            md={7}
            sx={{ height: "calc(100vh - 160px)" }}
          >
            <Paper
              elevation={6}
              sx={{ height: "100%", position: "relative" }}
            ></Paper>
          </Grid>
        </Grid> */}
      </Container>
    </Box>
  );
};

export default SheetVisualPage;
