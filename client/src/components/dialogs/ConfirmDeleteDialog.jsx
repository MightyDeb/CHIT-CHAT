import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

//DIALOG FOR DELETING THE GROUP

const ConfirmDeleteDialog = ({open,handleClose,deleteHandler}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <h5 className='nes-text is-error' style={{
            textDecoration: 'underline'
          }}>
            Confirm Delete
        </h5>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span className='nes-text' style={{fontSize: '0.5rem', color: 'black'}}>Are you sure you want to delete this group?</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions >
        <Button onClick={handleClose}>NO</Button>
        <Button color='error' onClick={deleteHandler}>YES</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog