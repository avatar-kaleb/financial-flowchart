import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NodeActions } from '../';

describe('NodeActions Component', () => {
  const onNavigateMock = vi.fn();
  const onDecisionMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Decision Node', () => {
    it('renders decision buttons correctly', () => {
      render(
        <NodeActions 
          isDecision={true}
          decisionQuestion="Should I invest?"
          decisionYesNode="investYes"
          decisionNoNode="investNo"
          canProceed={true}
          onDecision={onDecisionMock}
          onNavigate={onNavigateMock}
        />
      );

      // Check if decision question is rendered
      expect(screen.getByText('Should I invest?')).toBeInTheDocument();
      
      // Check if Yes and No buttons are rendered
      expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
    });

    it('disables buttons when canProceed is false', () => {
      render(
        <NodeActions 
          isDecision={true}
          decisionQuestion="Should I invest?"
          decisionYesNode="investYes"
          decisionNoNode="investNo"
          canProceed={false}
          onDecision={onDecisionMock}
          onNavigate={onNavigateMock}
        />
      );

      // Check if buttons are disabled
      expect(screen.getByRole('button', { name: /yes/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /no/i })).toBeDisabled();
      
      // Check if warning is displayed
      expect(screen.getByText(/must complete all subtasks/i)).toBeInTheDocument();
    });

    it('calls onDecision when Yes button is clicked', () => {
      render(
        <NodeActions 
          isDecision={true}
          decisionQuestion="Should I invest?"
          decisionYesNode="investYes"
          decisionNoNode="investNo"
          canProceed={true}
          onDecision={onDecisionMock}
          onNavigate={onNavigateMock}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /yes/i }));
      expect(onDecisionMock).toHaveBeenCalledWith(true);
    });

    it('calls onDecision when No button is clicked', () => {
      render(
        <NodeActions 
          isDecision={true}
          decisionQuestion="Should I invest?"
          decisionYesNode="investYes"
          decisionNoNode="investNo"
          canProceed={true}
          onDecision={onDecisionMock}
          onNavigate={onNavigateMock}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /no/i }));
      expect(onDecisionMock).toHaveBeenCalledWith(false);
    });
  });

  describe('Next Steps Node', () => {
    it('renders next steps buttons correctly', () => {
      render(
        <NodeActions 
          isDecision={false}
          nextNodes={['nextStep1', 'nextStep2']}
          canProceed={true}
          onDecision={onDecisionMock}
          onNavigate={onNavigateMock}
        />
      );

      // Check if header is rendered
      expect(screen.getByText(/complete this step by/i)).toBeInTheDocument();
      
      // Check if buttons are rendered - first one should say "Continue to next step"
      expect(screen.getByRole('button', { name: /continue to next step/i })).toBeInTheDocument();
    });

    it('disables buttons when canProceed is false', () => {
      render(
        <NodeActions 
          isDecision={false}
          nextNodes={['nextStep1', 'nextStep2']}
          canProceed={false}
          onDecision={onDecisionMock}
          onNavigate={onNavigateMock}
        />
      );

      // Check if button is disabled
      expect(screen.getByRole('button', { name: /continue to next step/i })).toBeDisabled();
      
      // Check if warning is displayed
      expect(screen.getByText(/complete all subtasks before proceeding/i)).toBeInTheDocument();
    });

    it('calls onNavigate with correct nodeId when button is clicked', () => {
      render(
        <NodeActions 
          isDecision={false}
          nextNodes={['nextStep1', 'nextStep2']}
          canProceed={true}
          onDecision={onDecisionMock}
          onNavigate={onNavigateMock}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /continue to next step/i }));
      expect(onNavigateMock).toHaveBeenCalledWith('nextStep1');
    });

    it('correctly names options beyond the first one', () => {
      render(
        <NodeActions 
          isDecision={false}
          nextNodes={['nextStep1', 'nextStep2', 'nextStep3']}
          canProceed={true}
          onDecision={onDecisionMock}
          onNavigate={onNavigateMock}
        />
      );

      // First item should be "Continue to next step"
      expect(screen.getByRole('button', { name: /continue to next step/i })).toBeInTheDocument();
      
      // Additional items should be labeled as options
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(3);
      
      // The buttons should be named correctly
      const buttonTexts = buttons.map(button => button.textContent);
      expect(buttonTexts).toEqual(expect.arrayContaining(['Continue to next step', 'Option 2', 'Option 3']));
    });
  });

  it('returns null when no next steps or decision is provided', () => {
    const { container } = render(
      <NodeActions 
        isDecision={false}
        canProceed={true}
        onDecision={onDecisionMock}
        onNavigate={onNavigateMock}
      />
    );
    
    // The component should not render anything
    expect(container.firstChild).toBeNull();
  });
});
