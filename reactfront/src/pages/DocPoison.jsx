import './DocPoison.css';
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import DocPoisonUpload from "./DocPoisonUpload.jsx";
import DocPoisonParser from "./DocPoisonParser.jsx";
import DocPoisonLabel from "./DocPoisonLabel.jsx";
import { Button } from '@mui/material';

function DocPoison() {

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState('');
  const [parserJson, setParserJson] = useState('');
  const [labelJson, setLabelJson] = useState('');

  // console.log('selectedFile:', selectedFile);
  // console.log('fileName:', fileName);
  // console.log('parserJson:', parserJson);

  return (
    <>
      <Button
        className='docpoison_back'
        onClick={() => { navigate('/module/doc') }}
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: '#cc3712',
          height: '45px',
          width: '120px',
          borderRadius: '10px',
          fontSize: '25px',
          fontWeight: 600,
          '&:hover': { backgroundColor: '#85240c' }
        }}>
        나가기
      </Button>

      <div className="docpoison_box">
        <Routes>
            <Route path="/" element={<DocPoisonUpload updateSelectedFile={setSelectedFile} updateFileName={setFileName} updateParserJson={setParserJson} />} />
            <Route path="/parser" element={<DocPoisonParser selectedFile={selectedFile} fileName={fileName} parserJson={parserJson} updateLabelJson={setLabelJson} />} />
            <Route path="/label" element={<DocPoisonLabel labelJson={labelJson}/>} />
        </Routes>

      </div>
    </>
  )
}

export default DocPoison;