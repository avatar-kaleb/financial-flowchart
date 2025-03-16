import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import { Flowchart } from '../types/flowchart';

interface FlowchartTreeViewProps {
  flowchart: Flowchart;
  currentNodeId: string;
  onNodeSelect: (nodeId: string) => void;
  history: string[];
}

const FlowchartTreeView: React.FC<FlowchartTreeViewProps> = ({ 
  flowchart, 
  currentNodeId, 
  onNodeSelect,
  history
}) => {
  // Keep track of expanded nodes
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    budgetIncome: true
  });

  // Toggle node expansion
  const toggleExpand = (nodeId: string) => {
    setExpanded(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Render a tree structure for a main step and its child nodes
  const renderStepTree = (stepId: string) => {
    const node = flowchart.nodes[stepId];
    if (!node) return null;

    const visited = history.includes(stepId);
    const isCompleted = node.completed || false;
    const isCurrent = currentNodeId === stepId;
    
    const borderLeft = isCurrent 
      ? '3px solid #1976d2' 
      : isCompleted
        ? '3px solid #4caf50'
        : visited
          ? '3px solid #90caf9'
          : 'none';

    // Get direct children
    const childNodes: string[] = [];
    if (node.nextNodes) {
      childNodes.push(...node.nextNodes);
    }
    
    if (node.isDecision) {
      if (node.decisionYesNode) childNodes.push(node.decisionYesNode);
      if (node.decisionNoNode) childNodes.push(node.decisionNoNode);
    }

    const hasChildren = childNodes.length > 0;
    const isExpanded = expanded[stepId] || false;

    return (
      <React.Fragment key={stepId}>
        <ListItem 
          disablePadding 
          sx={{ 
            borderLeft,
            bgcolor: node.color ? `${node.color}40` : 'inherit',
            borderRadius: 1,
            mb: 0.5
          }}
        >
          <ListItemButton 
            onClick={() => onNodeSelect(stepId)}
            dense
          >
            {hasChildren && (
              <ListItemIcon 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleExpand(stepId); 
                }}
                sx={{ minWidth: 32 }}
              >
                {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </ListItemIcon>
            )}
            <ListItemIcon sx={{ minWidth: 32 }}>
              {isCompleted ? (
                <CheckCircleIcon color="success" />
              ) : visited ? (
                <CheckCircleIcon color="info" />
              ) : (
                <CircleIcon color="disabled" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={node.title}
              primaryTypographyProps={{
                fontWeight: isCurrent ? 'bold' : 'normal',
                color: isCurrent 
                  ? 'primary' 
                  : isCompleted 
                    ? 'success.main' 
                    : visited 
                      ? 'text.primary' 
                      : 'text.secondary',
                variant: 'body2'
              }}
            />
          </ListItemButton>
        </ListItem>
        
        {hasChildren && isExpanded && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {childNodes.map(childId => renderChildNode(childId, 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  // Render a child node (non-main step)
  const renderChildNode = (nodeId: string, depth: number) => {
    const node = flowchart.nodes[nodeId];
    if (!node) return null;

    const visited = history.includes(nodeId);
    const isCompleted = node.completed || false;
    const isCurrent = currentNodeId === nodeId;
    
    const borderLeft = isCurrent 
      ? '3px solid #1976d2' 
      : isCompleted
        ? '3px solid #4caf50'
        : visited
          ? '3px solid #90caf9'
          : 'none';

    // Get child nodes to enable recursive tree display
    const childNodes: string[] = [];
    if (node.nextNodes) {
      childNodes.push(...node.nextNodes);
    }
    
    if (node.isDecision) {
      if (node.decisionYesNode) childNodes.push(node.decisionYesNode);
      if (node.decisionNoNode) childNodes.push(node.decisionNoNode);
    }

    const hasChildren = childNodes.length > 0;
    const isExpanded = expanded[nodeId] || false;

    return (
      <React.Fragment key={nodeId}>
        <ListItem 
          disablePadding 
          sx={{ 
            pl: depth * 2,
            borderLeft,
            bgcolor: node.color ? `${node.color}40` : 'inherit',
            borderRadius: 1,
            mb: 0.5
          }}
        >
          <ListItemButton 
            onClick={() => onNodeSelect(nodeId)}
            dense
          >
            {hasChildren && (
              <ListItemIcon 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleExpand(nodeId); 
                }}
                sx={{ minWidth: 32 }}
              >
                {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </ListItemIcon>
            )}
            <ListItemIcon sx={{ minWidth: 32 }}>
              {isCompleted ? (
                <CheckCircleIcon color="success" />
              ) : visited ? (
                <CheckCircleIcon color="info" />
              ) : (
                <CircleIcon color="disabled" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={node.title}
              primaryTypographyProps={{
                fontWeight: isCurrent ? 'bold' : 'normal',
                color: isCurrent 
                  ? 'primary' 
                  : isCompleted 
                    ? 'success.main' 
                    : visited 
                      ? 'text.primary' 
                      : 'text.secondary',
                variant: 'body2'
              }}
            />
          </ListItemButton>
        </ListItem>
        
        {hasChildren && isExpanded && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {childNodes.map(childId => renderChildNode(childId, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  // Get main steps from phases
  const mainSteps = flowchart.phases.flatMap(phase => phase.steps);

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Financial Flowchart Structure
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ 
        maxHeight: 'calc(100vh - 250px)',
        overflow: 'auto',
        p: 1
      }}>
        <List component="nav" aria-label="financial flowchart">
          {mainSteps.map(stepId => renderStepTree(stepId))}
        </List>
      </Box>
    </Paper>
  );
};

export default FlowchartTreeView;
