import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonGroup,
  Button,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { FlowchartNode } from '../../types/flowchart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { NodeSubtasks } from './';
import { NodeActions } from './';
import { NodeInfoDialog } from './';

interface NodeCardProps {
  node: FlowchartNode;
  onClick: (nodeId: string) => void;
  active: boolean;
  showDetails?: boolean;
  flowchartNodes?: Record<string, FlowchartNode>;
  onNodeChange?: (nodeId: string, updates: Partial<FlowchartNode>) => void;
}

const NodeCard: React.FC<NodeCardProps> = ({
  node,
  onClick,
  active,
  showDetails = false,
  flowchartNodes = {},
  onNodeChange
}) => {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(active);
  const [localSubtasks, setLocalSubtasks] = useState(node.subtasks || []);
  // Track if this node is completed
  const [nodeCompleted, setNodeCompleted] = useState(node.completed || false);
  
  // Check if all subtasks are completed
  const allSubtasksCompleted = node.subtasks && node.subtasks.length > 0 ? 
    node.subtasks.every(subtask => subtask.completed) : true;

  // Update local state when node changes
  useEffect(() => {
    setLocalSubtasks(node.subtasks || []);
    setNodeCompleted(node.completed || false);
  }, [node]);

  // Determine if node is a "main" step (part of a phase)
  const isMainStep = node.id === node.title.split(':')[0].trim().toLowerCase() || 
                     node.title.toLowerCase().includes('step');

  // Get child/subtask nodes if any
  const hasNextNodes = node.nextNodes && node.nextNodes.length > 0;
  const hasDecision = node.isDecision && (node.decisionYesNode || node.decisionNoNode);
  const hasSubtasks = hasNextNodes || hasDecision;

  const borderStyle = active 
    ? '2px solid #1976d2' 
    : isMainStep 
      ? '1px solid #9c27b0' 
      : '1px solid #e0e0e0';
  
  const backgroundColor = node.color || (active ? '#f5f5f5' : '#ffffff');

  // Handle subtask checkbox change
  const handleSubtaskChange = (subtaskId: string, completed: boolean) => {
    const updatedSubtasks = localSubtasks.map(st => 
      st.id === subtaskId ? { ...st, completed } : st
    );
    
    setLocalSubtasks(updatedSubtasks);
    
    // Auto-mark the node as completed only if all subtasks are completed
    const allCompleted = updatedSubtasks.every(st => st.completed);
    
    // Notify parent component of the change
    if (onNodeChange && node.subtasks) {
      onNodeChange(node.id, { 
        subtasks: updatedSubtasks,
        // Only auto-mark as completed if all are completed
        ...(allCompleted ? { completed: true } : {})
      });
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInfoDialogOpen(true);
  };

  const handleInfoClose = () => {
    setInfoDialogOpen(false);
  };

  const handleNavigate = (nextNodeId: string) => {
    onClick(nextNodeId);
  };

  const handleDecision = (isYes: boolean) => {
    if (isYes && node.decisionYesNode) {
      onClick(node.decisionYesNode);
    } else if (!isYes && node.decisionNoNode) {
      onClick(node.decisionNoNode);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Handle validated navigation with subtask validation
  const handleValidatedNavigate = (nextNodeId: string) => {
    // Check if all subtasks need to be completed first
    const hasIncompleteSubtasks = node.subtasks && node.subtasks.length > 0 && 
      !node.subtasks.every(st => st.completed);
    
    if (hasIncompleteSubtasks) {
      return; // Prevent navigation
    }
    
    // If all subtasks are complete or there are no subtasks, proceed
    handleNavigate(nextNodeId);
  };

  return (
    <>
      <Card 
        sx={{ 
          width: '100%',
          height: '100%',
          m: 1, 
          border: borderStyle,
          backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: 3,
            borderColor: '#1976d2',
          },
          position: 'relative',
          // Add subtle completion indicator
          opacity: nodeCompleted ? 0.9 : 1,
          '&::after': nodeCompleted ? {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 30px 30px 0',
            borderColor: 'transparent #4caf50 transparent transparent',
            zIndex: 2
          } : {}
        }}
      >
        <CardContent sx={{ 
          flex: '1 0 auto', 
          p: 2,
          pt: isMainStep ? 1 : 2,
          pb: hasSubtasks ? 0 : 2
        }}>
          {isMainStep && (
            <Chip 
              size="small"
              label={node.title.split(':')[0].trim()}
              color="secondary"
              sx={{ mb: 1 }}
            />
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Typography 
              variant="h6" 
              component="div" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                lineHeight: 1.2,
                mb: 1,
                flex: 1
              }}
            >
              {isMainStep ? node.title.split(':')[1]?.trim() : node.title}
            </Typography>
            
            <Tooltip title="More information">
              <IconButton 
                size="small" 
                onClick={handleInfoClick}
                sx={{ ml: 1, mt: -0.5 }}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {!showDetails && node.description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mb: 1
              }}
            >
              {node.description}
            </Typography>
          )}
          
          {showDetails && node.description && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 1.5, 
                mb: 2, 
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: 1
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {node.description}
              </Typography>
            </Paper>
          )}
          
          {/* Removed completion deadline display */}
          
          {/* Display subtasks if available */}
          {active && node.subtasks && node.subtasks.length > 0 && (
            <NodeSubtasks 
              subtasks={localSubtasks}
              onSubtaskChange={handleSubtaskChange}
            />
          )}
          
          {/* Add mark as completed button for active step */}
          {active && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => {
                  const newCompletedState = !nodeCompleted;
                  setNodeCompleted(newCompletedState);
                  // Notify parent component of the change
                  if (onNodeChange) {
                    onNodeChange(node.id, { 
                      completed: newCompletedState,
                      // Also update subtasks completion if we have them
                      ...(node.subtasks ? {
                        subtasks: node.subtasks.map(st => ({
                          ...st,
                          completed: newCompletedState
                        }))
                      } : {})
                    });
                  }
                }}
              >
                {nodeCompleted ? 'Mark as incomplete' : 'Mark as completed'}
              </Button>
            </Box>
          )}
          
          {/* Show action buttons directly on the card if active */}
          {active && (
            <NodeActions 
              isDecision={!!node.isDecision}
              decisionQuestion={node.decisionQuestion}
              decisionYesNode={node.decisionYesNode}
              decisionNoNode={node.decisionNoNode}
              nextNodes={node.nextNodes}
              canProceed={allSubtasksCompleted}
              onDecision={handleDecision}
              onNavigate={handleValidatedNavigate}
              nodeCompleted={nodeCompleted}
            />
          )}
          
          {/* Show subtasks if they exist */}
          {hasSubtasks && !active && (
            <Box>
              <Divider sx={{ mt: 1, mb: 0 }} />
              <Accordion 
                expanded={expanded} 
                onChange={handleExpandClick}
                disableGutters
                elevation={0}
                sx={{ 
                  '&:before': { display: 'none' },
                  bgcolor: 'transparent'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    minHeight: 36,
                    px: 1,
                    '& .MuiAccordionSummary-content': { my: 0 } 
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {node.isDecision ? 'Decision Required' : 'Subtasks'}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, px: 1, pb: 1 }}>
                  {node.isDecision && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                        {node.decisionQuestion}
                      </Typography>
                      <ButtonGroup size="small" fullWidth>
                        {node.decisionYesNode && (
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => handleDecision(true)}
                            size="small"
                          >
                            Yes
                          </Button>
                        )}
                        {node.decisionNoNode && (
                          <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={() => handleDecision(false)}
                            size="small"
                          >
                            No
                          </Button>
                        )}
                      </ButtonGroup>
                    </Box>
                  )}
                  
                  {hasNextNodes && (
                    <Box sx={{ mt: 1 }}>
                      {node.nextNodes && node.nextNodes.map((nextNodeId) => (
                        <Button
                          key={nextNodeId}
                          size="small"
                          variant="text"
                          onClick={() => handleNavigate(nextNodeId)}
                          endIcon={<ArrowForwardIcon fontSize="small" />}
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            px: 0,
                            mb: 0.5
                          }}
                        >
                          Continue
                        </Button>
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Information Dialog */}
      <NodeInfoDialog
        node={node}
        open={infoDialogOpen}
        onClose={handleInfoClose}
        onNavigate={handleNavigate}
        onDecision={handleDecision}
        flowchartNodes={flowchartNodes}
      />
    </>
  );
};

export default NodeCard;
