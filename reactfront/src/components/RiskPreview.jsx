import React from 'react';
import { useSelector } from 'react-redux';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Box } from '@mui/material';

export default function RiskPreview() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
  const pdfBlobUrl = useSelector(state => state.riskPDFPreview);

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
          div[aria-describedby="rpv-core__tooltip-body-open"],
          div[aria-describedby="rpv-core__tooltip-body-get-file"],
          div[aria-describedby="rpv-core__tooltip-body-print"] {
            display: none !important;
          }
        `}
      </style>
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfBlobUrl}
          plugins={[
            defaultLayoutPluginInstance,
          ]}
        />
      </Worker>
    </Box>
  );
};