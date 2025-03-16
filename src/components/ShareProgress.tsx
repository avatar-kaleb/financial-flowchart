import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  IconButton, 
  Tooltip, 
  Box,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

interface ShareProgressProps {
  history: string[];
  currentNodeId: string;
}

const ShareProgress: React.FC<ShareProgressProps> = ({ history, currentNodeId }) => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Generate URL with encoded progress data
  const generateShareableLink = () => {
    const progressData = {
      history,
      currentNodeId
    };
    
    const encodedData = encodeURIComponent(btoa(JSON.stringify(progressData)));
    return `${window.location.origin}${window.location.pathname}?progress=${encodedData}`;
  };

  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Generate progress summary text
  const generateProgressSummary = () => {
    return `My Financial Progress:\n\n• I've completed ${history.length} steps\n• Currently at: ${currentNodeId}\n\nCheck out this financial flowchart tool to track your own progress!`;
  };

  const shareableLink = generateShareableLink();
  const progressSummary = generateProgressSummary();

  return (
    <>
      <Tooltip title="Share your progress">
        <IconButton 
          color="inherit" 
          onClick={handleOpen}
          size="large"
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>

      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pb: 1 }}>
          Share Your Progress
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Shareable Link
          </Typography>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={shareableLink}
              size="small"
              InputProps={{
                readOnly: true,
              }}
            />
            <Tooltip title="Copy link">
              <IconButton 
                onClick={() => handleCopy(shareableLink)}
                color="primary"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Progress Summary
          </Typography>
          <Box sx={{ display: 'flex', mb: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={progressSummary}
              multiline
              rows={4}
              InputProps={{
                readOnly: true,
              }}
            />
            <Tooltip title="Copy summary">
              <IconButton 
                onClick={() => handleCopy(progressSummary)}
                color="primary"
                sx={{ alignSelf: 'flex-start' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareProgress;
