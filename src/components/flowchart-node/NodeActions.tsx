import React from 'react';
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

interface NodeActionsProps {
  isDecision: boolean;
  decisionQuestion?: string;
  decisionYesNode?: string;
  decisionNoNode?: string;
  nextNodes?: string[];
  canProceed: boolean;
  onDecision: (isYes: boolean) => void;
  onNavigate: (nextNodeId: string) => void;
}

const NodeActions: React.FC<NodeActionsProps> = ({
  isDecision,
  decisionQuestion,
  decisionYesNode,
  decisionNoNode,
  nextNodes,
  canProceed,
  onDecision,
  onNavigate
}) => {
  const hasNextNodes = nextNodes && nextNodes.length > 0;

  // Decision node handling
  if (isDecision) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          <HelpOutlineIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
          Decision Required:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 'medium' }}>
          {decisionQuestion || 'Make a decision to continue'}
        </Typography>
        <ButtonGroup size="small" fullWidth>
          {decisionYesNode && (
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => onDecision(true)}
              startIcon={<NavigateNextIcon />}
              disabled={!canProceed}
            >
              Yes
            </Button>
          )}
          {decisionNoNode && (
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => onDecision(false)}
              startIcon={<NavigateNextIcon />}
              disabled={!canProceed}
            >
              No
            </Button>
          )}
        </ButtonGroup>
        
        {!canProceed && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            You must complete all subtasks before proceeding
          </Alert>
        )}
      </Box>
    );
  }

  // Next steps node handling
  if (hasNextNodes) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          <CheckCircleOutlineIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
          Complete this step by:
        </Typography>
        
        {!canProceed && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Complete all subtasks before proceeding
          </Alert>
        )}
        
        <List dense disablePadding>
          {nextNodes.map((nextNodeId, index) => (
            <ListItem disablePadding key={nextNodeId} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <SubdirectoryArrowRightIcon color="action" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => onNavigate(nextNodeId)}
                    endIcon={<NavigateNextIcon />}
                    disabled={!canProceed}
                    sx={{ 
                      justifyContent: 'flex-start', 
                      textTransform: 'none',
                      pl: 0
                    }}
                  >
                    {index === 0 ? "Continue to next step" : `Option ${index + 1}`}
                  </Button>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }

  return null;
};

export default NodeActions;
