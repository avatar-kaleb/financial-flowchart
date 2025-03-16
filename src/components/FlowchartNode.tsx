import React from 'react';
import { FlowchartNode as FlowchartNodeType } from '../types/flowchart';
import { NodeCard } from './flowchart-node';

interface FlowchartNodeProps {
  node: FlowchartNodeType;
  onClick: (nodeId: string) => void;
  active: boolean;
  showDetails?: boolean;
  flowchartNodes?: Record<string, FlowchartNodeType>;
  onNodeChange?: (nodeId: string, updates: Partial<FlowchartNodeType>) => void;
}

/**
 * FlowchartNode is a wrapper around the modular NodeCard component.
 * This component is kept for backwards compatibility with the rest of the application.
 */
const FlowchartNode: React.FC<FlowchartNodeProps> = ({ 
  node, 
  onClick, 
  active, 
  showDetails = false,
  flowchartNodes = {},
  onNodeChange
}) => {
  return (
    <NodeCard
      node={node}
      onClick={onClick}
      active={active}
      showDetails={showDetails}
      flowchartNodes={flowchartNodes}
      onNodeChange={onNodeChange}
    />
  );
};

export default FlowchartNode;
