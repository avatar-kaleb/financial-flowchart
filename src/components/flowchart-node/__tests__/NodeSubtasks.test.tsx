import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NodeSubtasks } from "../";
import { SubTask } from "../../../types/flowchart";

describe("NodeSubtasks Component", () => {
  const mockSubtasks: SubTask[] = [
    { id: "1", title: "First Task", completed: false },
    {
      id: "2",
      title: "Second Task",
      description: "Description for second task",
      completed: true,
    },
    { id: "3", title: "Third Task", completed: false },
  ];

  const onSubtaskChangeMock = vi.fn();

  it("renders all subtasks correctly", () => {
    render(
      <NodeSubtasks
        subtasks={mockSubtasks}
        onSubtaskChange={onSubtaskChangeMock}
      />,
    );

    // Check if all task titles are rendered
    expect(screen.getByText("First Task")).toBeInTheDocument();
    expect(screen.getByText("Second Task")).toBeInTheDocument();
    expect(screen.getByText("Third Task")).toBeInTheDocument();

    // Check if description is rendered
    expect(screen.getByText("Description for second task")).toBeInTheDocument();
  });

  it("shows progress indicator with correct percentage", () => {
    render(
      <NodeSubtasks
        subtasks={mockSubtasks}
        onSubtaskChange={onSubtaskChangeMock}
      />,
    );

    // One out of three tasks is completed, so progress should be 33.33%
    const progressBar = document.querySelector(".MuiLinearProgress-root");
    expect(progressBar).toBeInTheDocument();

    // Check value attribute of progress bar
    const progressBarValue = progressBar?.getAttribute("aria-valuenow");

    // The MUI component might round the value, so we'll check it more flexibly
    expect(Number(progressBarValue)).toBeCloseTo(33.33, 0);
  });

  it("calls onSubtaskChange when checkbox is clicked", () => {
    render(
      <NodeSubtasks
        subtasks={mockSubtasks}
        onSubtaskChange={onSubtaskChangeMock}
      />,
    );

    // Find and click the first task's checkbox
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]); // First task's checkbox

    // Check if the handler was called with correct arguments
    expect(onSubtaskChangeMock).toHaveBeenCalledWith("1", true);
  });

  it("shows success message when all tasks are completed", () => {
    const allCompletedTasks: SubTask[] = [
      { id: "1", title: "First Task", completed: true },
      { id: "2", title: "Second Task", completed: true },
    ];

    render(
      <NodeSubtasks
        subtasks={allCompletedTasks}
        onSubtaskChange={onSubtaskChangeMock}
      />,
    );

    // Check if success message is displayed
    expect(screen.getByText("All subtasks completed!")).toBeInTheDocument();
  });

  it("does not show success message when not all tasks are completed", () => {
    render(
      <NodeSubtasks
        subtasks={mockSubtasks}
        onSubtaskChange={onSubtaskChangeMock}
      />,
    );

    // Success message should not be displayed
    const successMessage = screen.queryByText("All subtasks completed!");
    expect(successMessage).not.toBeInTheDocument();
  });
});
