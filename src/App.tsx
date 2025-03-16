import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import Flowchart from './components/Flowchart';
import ShareProgress from './components/ShareProgress';
import { financialFlowchartData } from './data/financialFlowchartData';
import './App.css';
import { loadHistoryFromLocalStorage, loadCurrentNodeFromLocalStorage } from './utils/localStorage';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  // Keep track of flowchart progress
  const [progress, setProgress] = useState({
    currentNodeId: 'budgetIncome', 
    history: ['budgetIncome'] as string[] 
  });

  // Load saved progress from URL parameter or localStorage only once on mount
  useEffect(() => {
    let initialProgress = { 
      currentNodeId: 'budgetIncome', 
      history: ['budgetIncome'] as string[] 
    };

    try {
      // Check URL query parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const progressParam = urlParams.get('progress');
      
      if (progressParam) {
        const decodedData = JSON.parse(atob(decodeURIComponent(progressParam)));
        if (decodedData.history && decodedData.currentNodeId) {
          initialProgress = {
            currentNodeId: decodedData.currentNodeId,
            history: decodedData.history
          };
        }
      } else {
        // Fall back to localStorage
        const savedHistory = loadHistoryFromLocalStorage();
        const savedCurrentNode = loadCurrentNodeFromLocalStorage();
        
        if (savedHistory && savedHistory.length > 0) {
          initialProgress.history = savedHistory;
        }
        
        if (savedCurrentNode && financialFlowchartData.nodes[savedCurrentNode]) {
          initialProgress.currentNodeId = savedCurrentNode;
        }
      }
    } catch (error) {
      console.error('Failed to load progress data:', error);
    }

    // Only set state once with all updates
    setProgress(initialProgress);
  }, []);

  // Handler for updating progress from the Flowchart component
  const handleProgress = (nodeId: string, updatedHistory: string[]) => {
    setProgress({
      currentNodeId: nodeId,
      history: updatedHistory
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Finance Flowchart
          </Typography>
          <ShareProgress 
            history={progress.history} 
            currentNodeId={progress.currentNodeId} 
          />
        </Toolbar>
      </AppBar>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        overflow: 'auto', // Enable scrolling
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Flowchart 
          flowchart={financialFlowchartData} 
          initialNodeId={progress.currentNodeId}
          initialHistory={progress.history}
          onProgressUpdate={handleProgress}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
