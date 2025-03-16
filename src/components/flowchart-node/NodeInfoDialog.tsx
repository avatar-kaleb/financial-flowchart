import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { FlowchartNode } from '../../types/flowchart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface NodeInfoDialogProps {
  node: FlowchartNode;
  open: boolean;
  onClose: () => void;
  onNavigate: (nextNodeId: string) => void;
  onDecision: (isYes: boolean) => void;
  flowchartNodes: Record<string, FlowchartNode>;
}

const NodeInfoDialog: React.FC<NodeInfoDialogProps> = ({
  node,
  open,
  onClose,
  onNavigate,
  onDecision,
  flowchartNodes
}) => {
  const isMainStep = node.id === node.title.split(':')[0].trim().toLowerCase() || 
                    node.title.toLowerCase().includes('step');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="node-dialog-title"
      aria-describedby="node-dialog-description"
      maxWidth="md"
    >
      <DialogTitle id="node-dialog-title">
        {node.title}
        {isMainStep && (
          <Chip 
            size="small"
            label={node.title.split(':')[0].trim()}
            color="secondary"
            sx={{ ml: 1, verticalAlign: 'middle' }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="node-dialog-description">
          {node.description}
        </DialogContentText>
        
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            How to complete this step:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
            {node.isDecision ? (
              <>
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Make a decision: {node.decisionQuestion}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {node.decisionYesNode && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        If YES:
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                        {flowchartNodes[node.decisionYesNode]?.title || "Next step"}
                      </Typography>
                    </Box>
                  )}
                  {node.decisionNoNode && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        If NO:
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {flowchartNodes[node.decisionNoNode]?.title || "Next step"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            ) : node.nextNodes && node.nextNodes.length > 0 ? (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Follow these steps in order:
                </Typography>
                <List>
                  {node.nextNodes.map((nextNodeId) => (
                    <ListItem key={nextNodeId} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={flowchartNodes[nextNodeId]?.title || "Next step"} 
                        secondary={flowchartNodes[nextNodeId]?.description 
                          ? (flowchartNodes[nextNodeId].description.substring(0, 60) + '...') 
                          : "Continue to next step"}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Typography variant="body1">
                This is a terminal step. Once completed, you can continue to another part of the flowchart.
              </Typography>
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        {node.isDecision ? (
          <>
            {node.decisionYesNode && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                  onDecision(true);
                  onClose();
                }}
              >
                Yes
              </Button>
            )}
            {node.decisionNoNode && (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => {
                  onDecision(false);
                  onClose();
                }}
              >
                No
              </Button>
            )}
          </>
        ) : node.nextNodes && node.nextNodes.length > 0 ? (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onNavigate(node.nextNodes![0]);
                onClose();
              }}
            >
              Continue
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NodeInfoDialog;
