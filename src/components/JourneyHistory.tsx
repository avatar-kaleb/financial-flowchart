import React from 'react';
import {
  Paper,
  Typography,
  Divider,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { Flowchart } from '../types/flowchart';

interface JourneyHistoryProps {
  flowchart: Flowchart;
  history: string[];
  currentNodeId: string;
  onNodeSelect: (nodeId: string) => void;
}

const JourneyHistory: React.FC<JourneyHistoryProps> = ({
  flowchart,
  history,
  currentNodeId,
  onNodeSelect,
}) => {
  // Filter out any undefined nodes from history
  const validHistory = history.filter(id => flowchart.nodes[id]);

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Your Financial Journey
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
        {validHistory.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No steps taken yet. Start by navigating through the flowchart.
          </Typography>
        ) : (
          <Stepper orientation="vertical" nonLinear>
            {validHistory.map((nodeId, index) => {
              const node = flowchart.nodes[nodeId];
              const isCurrentNode = nodeId === currentNodeId;

              return (
                <Step key={nodeId} active={isCurrentNode} completed={index < validHistory.length - 1}>
                  <StepLabel 
                    StepIconProps={{ 
                      sx: { 
                        color: isCurrentNode ? 'primary.main' : undefined 
                      } 
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: isCurrentNode ? 'bold' : 'normal',
                        color: isCurrentNode ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {node.title}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Card variant="outlined" sx={{ mb: 2, bgcolor: node.color ? `${node.color}40` : undefined }}>
                      <CardContent>
                        <Typography variant="body2" paragraph>
                          {node.description}
                        </Typography>
                        
                        {node.isDecision && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              Decision Point: {node.decisionQuestion}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              {node.decisionYesNode && (
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="primary"
                                  onClick={() => onNodeSelect(node.decisionYesNode!)}
                                >
                                  Yes: {flowchart.nodes[node.decisionYesNode]?.title.substring(0, 20)}...
                                </Button>
                              )}
                              {node.decisionNoNode && (
                                <Button 
                                  size="small" 
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => onNodeSelect(node.decisionNoNode!)}
                                >
                                  No: {flowchart.nodes[node.decisionNoNode]?.title.substring(0, 20)}...
                                </Button>
                              )}
                            </Box>
                          </Box>
                        )}
                        
                        {!node.isDecision && node.nextNodes && node.nextNodes.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              Next Steps:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {node.nextNodes.map(nextNodeId => (
                                <Button 
                                  key={nextNodeId}
                                  size="small" 
                                  variant="outlined"
                                  onClick={() => onNodeSelect(nextNodeId)}
                                >
                                  {flowchart.nodes[nextNodeId]?.title.substring(0, 20)}...
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Button
                      variant={isCurrentNode ? "contained" : "outlined"}
                      onClick={() => onNodeSelect(nodeId)}
                      size="small"
                    >
                      {isCurrentNode ? "Current Step" : "Go to This Step"}
                    </Button>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        )}
      </Box>
    </Paper>
  );
};

export default JourneyHistory;
