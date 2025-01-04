import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';


export default function TransitionAlerts({ message }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (message!=null) {
      setOpen(true);
    }
  }, [message]);
  // Create a unique key for each Alert component
 

  return (
    <div style={{ display: 'inline-block' }}>
      <Collapse in={open}>
        <div>
          <Alert
            // Use unique key for each Alert component
            style={{ backgroundColor: '#b84248', color: 'white' }}  
            severity="error"
            variant="filled"
            // action={
            //   <IconButton
            //     aria-label="close"
            //     color='red'
            //     size="small"
            //     onClick={() => {
            //       setOpen(false);
            //     }}
            //   >
            //     <AiIcons.AiOutlineCloseCircle />
            //   </IconButton>
            // }
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        </div>
      </Collapse>
    </div>
  );
}
