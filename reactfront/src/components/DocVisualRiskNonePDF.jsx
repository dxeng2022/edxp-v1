import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Box, Snackbar } from '@mui/material';

export default function DocVisualRiskNonePDF() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [open, setOpen] = useState(true);


  const handleClose = (event, reason) => {
    setOpen(false);
  };

  return (
    <Box
      sx={{ 
        height:'100%', 
        width:'100%', 
        overflow: 'hidden', 
      }}
    >
      <style>
        {`
          div[aria-describedby="rpv-core__tooltip-body-get-file"],
          div[aria-describedby="rpv-core__tooltip-body-print"] {
            display: none !important;
          }
        `}
      </style>
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
        <Viewer
          fileUrl="/nonepdf.pdf"
          plugins={[
            defaultLayoutPluginInstance,
          ]}
        />
      </Worker>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={open}
        onClose={handleClose}
        message="'Open file'을 통해 PDF를 불러올 수 있습니다."
      />
    </Box>
  );
};