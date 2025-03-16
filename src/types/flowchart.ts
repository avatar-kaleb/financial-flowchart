export interface FlowchartNode {
  id: string;
  title: string;
  description: string;
  color?: string;
  nextNodes?: string[];
  isDecision?: boolean;
  decisionQuestion?: string;
  decisionYesNode?: string;
  decisionNoNode?: string;
  subtasks?: SubTask[];
  completionDeadline?: string; // ISO date string for deadline
  completed?: boolean;
}

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

export interface FlowchartPhase {
  id: string;
  title: string;
  steps: string[];
  color?: string;
}

export interface Flowchart {
  phases: FlowchartPhase[];
  nodes: Record<string, FlowchartNode>;
}
