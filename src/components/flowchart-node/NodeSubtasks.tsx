import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Alert
} from '@mui/material';
import { SubTask } from '../../types/flowchart';

interface NodeSubtasksProps {
  subtasks: SubTask[];
  onSubtaskChange: (subtaskId: string, completed: boolean) => void;
}

const NodeSubtasks: React.FC<NodeSubtasksProps> = ({ subtasks, onSubtaskChange }) => {
  // Calculate subtask completion percentage
  const subtaskCompletionPercentage = subtasks.length > 0 
    ? (subtasks.filter(st => st.completed).length / subtasks.length) * 100 
    : 0;

  const allCompleted = subtasks.length > 0 && subtasks.every(st => st.completed);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        Subtasks:
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={subtaskCompletionPercentage} 
        sx={{ mb: 1.5, borderRadius: 1 }}
      />
      <List dense disablePadding>
        {subtasks.map((subtask) => (
          <ListItem key={subtask.id} sx={{ py: 0.5, px: 0 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={subtask.completed} 
                  onChange={(e) => onSubtaskChange(subtask.id, e.target.checked)}
                  size="small"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: subtask.completed ? 'normal' : 'medium' }}>
                    {subtask.title}
                  </Typography>
                  {subtask.description && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {subtask.description}
                    </Typography>
                  )}
                </Box>
              }
              sx={{ 
                mx: 0, 
                width: '100%', 
                '& .MuiTypography-root': { 
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  color: subtask.completed ? 'text.secondary' : 'text.primary'
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Show alert when all subtasks are completed */}
      {allCompleted && (
        <Alert severity="success" sx={{ mt: 1 }}>
          All subtasks completed!
        </Alert>
      )}
    </Box>
  );
};

export default NodeSubtasks;
