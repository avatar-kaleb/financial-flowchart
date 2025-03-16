import React, { useState, useEffect } from 'react';
import { 
  saveHistoryToLocalStorage, 
  loadHistoryFromLocalStorage,
  saveCurrentNodeToLocalStorage,
  loadCurrentNodeFromLocalStorage,
  clearFlowchartFromLocalStorage
} from '../utils/localStorage';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Tabs, 
  Tab,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { Flowchart as FlowchartType } from '../types/flowchart';
import FlowchartNode from './FlowchartNode';
import FlowchartTreeView from './FlowchartTreeView';
import JourneyHistory from './JourneyHistory';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HistoryIcon from '@mui/icons-material/History';

interface FlowchartProps {
  flowchart: FlowchartType;
  initialNodeId?: string;
  initialHistory?: string[];
  onProgressUpdate?: (nodeId: string, history: string[]) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`flowchart-tabpanel-${index}`}
      aria-labelledby={`flowchart-tab-${index}`}
      style={{ height: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Flowchart: React.FC<FlowchartProps> = ({ 
  flowchart, 
  initialNodeId,
  initialHistory,
  onProgressUpdate 
}) => {
  const [currentNodeId, setCurrentNodeId] = useState(
    initialNodeId && flowchart.nodes[initialNodeId] ? initialNodeId : 'budgetIncome'
  );
  const [history, setHistory] = useState<string[]>(
    initialHistory && initialHistory.length > 0 ? initialHistory : ['budgetIncome']
  );
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  
  // Skip localStorage loading if initialNodeId and initialHistory are provided
  useEffect(() => {
    if (initialNodeId || initialHistory) return;
    
    // Otherwise, load from localStorage as before
    const savedHistory = loadHistoryFromLocalStorage();
    const savedCurrentNode = loadCurrentNodeFromLocalStorage();
    
    if (savedHistory && savedHistory.length > 0) {
      setHistory(savedHistory);
    }
    
    if (savedCurrentNode && flowchart.nodes[savedCurrentNode]) {
      setCurrentNodeId(savedCurrentNode);
    }
  }, [flowchart.nodes, initialNodeId, initialHistory]);

  // Save to localStorage when history or currentNodeId changes
  useEffect(() => {
    saveHistoryToLocalStorage(history);
    saveCurrentNodeToLocalStorage(currentNodeId);
  }, [history, currentNodeId]);

  // Call the onProgressUpdate callback if provided, but only when values actually change
  // and with some protection against excessive updates
  useEffect(() => {
    // Use a short delay to prevent too many rapid updates
    const timerId = setTimeout(() => {
      if (onProgressUpdate && history.length > 0) {
        onProgressUpdate(currentNodeId, history);
      }
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [history, currentNodeId, onProgressUpdate]);

  const handleNodeClick = (nodeId: string) => {
    setCurrentNodeId(nodeId);
    if (!history.includes(nodeId)) {
      setHistory(prev => [...prev, nodeId]);
    }
  };

  const handleReset = () => {
    setCurrentNodeId('budgetIncome');
    setHistory(['budgetIncome']);
    clearFlowchartFromLocalStorage();
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current node
      setHistory(newHistory);
      setCurrentNodeId(newHistory[newHistory.length - 1]);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Find the current node
  const currentNode = flowchart.nodes[currentNodeId];
  
  // Find related nodes (next nodes or decision nodes)
  const relatedNodeIds = currentNode.nextNodes || [];
  const relatedNodes = relatedNodeIds.map(id => flowchart.nodes[id]);

  // Find the current phase
  const currentPhase = flowchart.phases.find(phase => 
    phase.steps.includes(currentNodeId)
  );

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      {/* Notification snackbar for completion status changes */}
      <Snackbar 
        open={!!snackbarMessage} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarMessage(null)} 
          severity="success" 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ 
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        maxWidth: '100vw',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            startIcon={<HomeIcon />} 
            variant="contained" 
            onClick={handleReset}
            sx={{ mr: 1 }}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            onClick={handleBack}
            disabled={history.length <= 1}
            color="secondary"
          >
            Back
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Main Flowchart Content */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={5} 
              sx={{ 
                p: 3, 
                mb: { xs: 3, lg: 0 },
                borderRadius: 2,
                height: '100%',
                minWidth: { xs: '300px', sm: '450px', md: '550px' }
              }}
            >
              {currentPhase && (
                <Box sx={{ mb: 3 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      bgcolor: theme.palette.primary.light, 
                      color: 'white',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Current Phase: {currentPhase.title}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ pl: 1 }}>
                  Current Step:
                </Typography>
                <FlowchartNode 
                  node={currentNode} 
                  onClick={handleNodeClick} 
                  active={true}
                  flowchartNodes={flowchart.nodes}
                  showDetails={true}
                  onNodeChange={(nodeId, updates) => {
                    // Update the flowchart data when a node is changed
                    if (flowchart.nodes[nodeId]) {
                      flowchart.nodes[nodeId] = {
                        ...flowchart.nodes[nodeId],
                        ...updates
                      };
                      
                      // Show a notification when a node is marked as completed or uncompleted
                      if (typeof updates.completed !== 'undefined') {
                        setSnackbarMessage(
                          updates.completed 
                            ? `${flowchart.nodes[nodeId].title} marked as completed` 
                            : `${flowchart.nodes[nodeId].title} marked as not completed`
                        );
                      }
                      
                      // Force a re-render by updating state
                      setCurrentNodeId(nodeId => nodeId);
                    }
                  }}
                />
              </Box>

              {relatedNodes.length > 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pl: 1 }}>
                    <Typography variant="h6" sx={{ mr: 1 }}>
                      Next Steps:
                    </Typography>
                    <ArrowForwardIcon color="primary" />
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {relatedNodes.map(node => (
                      <FlowchartNode 
                        key={node.id} 
                        node={node} 
                        onClick={handleNodeClick} 
                        active={false}
                        flowchartNodes={flowchart.nodes}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Tree View & Journey Tabs */}
          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={5} 
              sx={{ 
                p: 0, 
                mb: 0, 
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  bgcolor: theme.palette.grey[100],
                }}
              >
                <Tab 
                  icon={<AccountTreeIcon />} 
                  label="Tree View" 
                  id="flowchart-tab-0"
                  sx={{ 
                    fontWeight: tabValue === 0 ? 'bold' : 'normal',
                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                  }}
                />
                <Tab 
                  icon={<HistoryIcon />} 
                  label="Journey" 
                  id="flowchart-tab-1"
                  sx={{ 
                    fontWeight: tabValue === 1 ? 'bold' : 'normal',
                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                  }}
                />
              </Tabs>
              
              <Box sx={{ p: 0, height: 'calc(100% - 48px)' }}>
                <TabPanel value={tabValue} index={0}>
                  <FlowchartTreeView 
                    flowchart={flowchart} 
                    currentNodeId={currentNodeId} 
                    onNodeSelect={handleNodeClick}
                    history={history}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <JourneyHistory 
                    flowchart={flowchart} 
                    history={history}
                    currentNodeId={currentNodeId}
                    onNodeSelect={handleNodeClick}
                  />
                </TabPanel>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Flowchart;
