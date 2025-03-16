import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FlowchartNode from "../FlowchartNode";
import { FlowchartNode as FlowchartNodeType } from "../../types/flowchart";
import { NodeCard } from "../flowchart-node";

// Mock the NodeCard component to verify props are passed correctly
vi.mock("../flowchart-node", () => ({
  NodeCard: vi.fn(() => (
    <div data-testid="mocked-node-card">Mocked NodeCard</div>
  )),
}));

// Helper function to check object equality without considering extra parameters
const expectPropsToMatch = (
  actualCall: unknown[],
  expectedProps: Record<string, unknown>,
): void => {
  const actualProps = actualCall[0] as Record<string, unknown>;
  for (const key in expectedProps) {
    expect(actualProps[key]).toEqual(expectedProps[key]);
  }
};

// Type assertion to access mock properties
const NodeCardMock = NodeCard as unknown as ReturnType<typeof vi.fn>;

describe("FlowchartNode Component", () => {
  // Mock data
  const mockNode: FlowchartNodeType = {
    id: "testNode",
    title: "Test Node",
    description: "This is a test node description",
    nextNodes: ["nextNode1"],
    subtasks: [{ id: "sub1", title: "Subtask 1", completed: false }],
  };

  const mockFlowchartNodes: Record<string, FlowchartNodeType> = {
    nextNode1: {
      id: "nextNode1",
      title: "Next Node 1",
      description: "This is the next node",
    },
  };

  const onClickMock = vi.fn();
  const onNodeChangeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the NodeCard component", () => {
    render(
      <FlowchartNode node={mockNode} onClick={onClickMock} active={false} />,
    );

    expect(screen.getByTestId("mocked-node-card")).toBeInTheDocument();
  });

  it("passes all required props to NodeCard", () => {
    render(
      <FlowchartNode
        node={mockNode}
        onClick={onClickMock}
        active={true}
        showDetails={true}
        flowchartNodes={mockFlowchartNodes}
        onNodeChange={onNodeChangeMock}
      />,
    );

    // Verify that NodeCard was called with the correct props
    expect(NodeCard).toHaveBeenCalled();
    const expectedProps = {
      node: mockNode,
      onClick: onClickMock,
      active: true,
      showDetails: true,
      flowchartNodes: mockFlowchartNodes,
      onNodeChange: onNodeChangeMock,
    };
    expectPropsToMatch(NodeCardMock.mock.calls[0], expectedProps);
  });

  it("passes default values for optional props when not provided", () => {
    render(
      <FlowchartNode node={mockNode} onClick={onClickMock} active={false} />,
    );

    // Verify that NodeCard was called with default values for optional props
    expect(NodeCard).toHaveBeenCalled();
    const expectedProps = {
      node: mockNode,
      onClick: onClickMock,
      active: false,
      showDetails: false,
      flowchartNodes: {},
      onNodeChange: undefined,
    };
    expectPropsToMatch(NodeCardMock.mock.calls[0], expectedProps);
  });

  it("passes onNodeChange as undefined when not provided", () => {
    render(
      <FlowchartNode node={mockNode} onClick={onClickMock} active={false} />,
    );

    // This test is redundant since we already check this in the previous test
    // But keeping it for clarity
    expect(NodeCard).toHaveBeenCalled();
    const expectedProps = {
      node: mockNode,
      onClick: onClickMock,
      active: false,
      showDetails: false,
      flowchartNodes: {},
      onNodeChange: undefined,
    };
    expectPropsToMatch(NodeCardMock.mock.calls[0], expectedProps);
  });

  it("passes through all props without modification", () => {
    // Test with some arbitrary values to ensure they are passed through
    const testProps = {
      node: { ...mockNode, color: "#FF0000" },
      onClick: onClickMock,
      active: true,
      showDetails: true,
      flowchartNodes: {
        ...mockFlowchartNodes,
        extraNode: { id: "extra", title: "Extra", description: "Extra node" },
      },
      onNodeChange: onNodeChangeMock,
    };

    render(<FlowchartNode {...testProps} />);

    // Verify that NodeCard was called with exactly the same props
    expect(NodeCard).toHaveBeenCalled();
    expectPropsToMatch(NodeCardMock.mock.calls[0], testProps);
  });
});
