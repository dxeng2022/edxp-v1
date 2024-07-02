import { Box, Container, Grid, Paper } from "@mui/material";
import SheetLocalFile from "../components/sheet/SheetLocalFile";
import SheetCloudFile from "../components/sheet/SheetCloudFile";

export default function SheetVisual() {
  return (
    <Box sx={{ my: 3 }}>
      <Container maxWidth="false">
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={5}
            md={5}
            sx={{ height: "calc(100vh - 160px)" }}
          >
            <Paper elevation={6} sx={{ height: "100%", position: "relative" }}>
              <SheetLocalFile />
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            sm={7}
            md={7}
            sx={{ height: "calc(100vh - 160px)" }}
          >
            <Paper elevation={6} sx={{ height: "100%", position: "relative" }}>
              <SheetCloudFile />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
