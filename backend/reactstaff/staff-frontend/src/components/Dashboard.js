import React, { useState } from 'react';
import Button from '@mui/material/Button';

import { createRoot } from 'react-dom/client'

export default function Dashboard() {
  const [isFree, setIsFree] = useState(true);

  function changeFree(){
    setIsFree( status => !status)
  }

  return(
    <div style={{display: 'flex', justifyItems:'center', flexDirection: 'column', marginTop: '300px'}}>
      {isFree && (
        <div align="center" id="wait-container">
          <h1 align="center" sx={{mt: 2}}> Waiting for Orders ...</h1>
            <Button variant="contained" color="success" onClick={changeFree}>Start Order</Button>
        </div>
      )}

      {!isFree && (
        <div align="center" id="wait-container">
          <h1 align="center" sx={{mt: 2}}> You are making the order #101 </h1>
            <Button variant="outlined" color="success" onClick={changeFree}>Complete Order</Button>
        </div>
      )}
        
    </div>
  );
}