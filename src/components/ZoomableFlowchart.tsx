import React, { useState, ReactNode } from 'react';
import { Box, Paper, IconButton, Tooltip, Slider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface ZoomableFlowchartProps {
  children: ReactNode;
}

const ZoomableFlowchart: React.FC<ZoomableFlowchartProps> = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [transformRef, setTransformRef] = useState<ReactZoomPanPinchRef | null>(null);

  const handleZoomChange = (_event: Event, newValue: number | number[]) => {
    if (transformRef && typeof newValue === 'number') {
      transformRef.setTransform(0, 0, newValue);
      setScale(newValue);
    }
  };

  const handleReset = () => {
    if (transformRef) {
      transformRef.resetTransform();
      setScale(1);
    }
  };

  const handleZoomIn = () => {
    if (transformRef) {
      transformRef.zoomIn();
      setScale(prev => Math.min(prev + 0.1, 3));
    }
  };

  const handleZoomOut = () => {
    if (transformRef) {
      transformRef.zoomOut();
      setScale(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  const handleFitView = () => {
    if (transformRef) {
      transformRef.centerView();
      setScale(1);
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 100,
          p: 1,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn} size="small" color="primary">
              <AddIcon />
            </IconButton>
          </Tooltip>
          
          <Box sx={{ mx: 1, width: 80 }}>
            <Slider
              min={0.5}
              max={3}
              step={0.1}
              value={scale}
              onChange={handleZoomChange}
              aria-labelledby="zoom-slider"
              size="small"
              sx={{ '& .MuiSlider-thumb': { width: 12, height: 12 } }}
            />
          </Box>
          
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut} size="small" color="primary">
              <RemoveIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Fit View">
            <IconButton onClick={handleFitView} size="small" color="primary" sx={{ ml: 0.5 }}>
              <ZoomOutMapIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reset View">
            <IconButton onClick={handleReset} size="small" color="primary">
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.5}
        maxScale={3}
        centerOnInit
        panning={{ activationKeys: ['Space'] }}
        ref={(ref: ReactZoomPanPinchRef) => setTransformRef(ref)}
        onZoomStop={(ref) => {
          // Use onZoomStop instead of onZoom to prevent constant updates
          setScale(ref.state.scale);
        }}
      >
        {() => (
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
            }}
          >
            <div style={{ minWidth: '100%', minHeight: '100%' }}>
              {children}
            </div>
          </TransformComponent>
        )}
      </TransformWrapper>
    </Box>
  );
};

export default ZoomableFlowchart;
