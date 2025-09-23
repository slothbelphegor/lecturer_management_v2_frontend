import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '80vh',
   overflowY: 'auto', // Enable vertical scrolling
  '&::-webkit-scrollbar': {  // Customize scrollbar
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555'
  },
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function MyModal({open, handleClose, title, content}) {
  return (
    <div>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box sx={style}>
          <Typography 
            id="modal-modal-title" 
            variant="h6" 
            component="h2"
            sx={{ mb: 2 }}
            >
            {title}
          </Typography>

            {content}
         
        </Box>
      </Modal>
    </div>
  );
}
