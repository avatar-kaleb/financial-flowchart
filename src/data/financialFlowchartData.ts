import { Flowchart } from '../types/flowchart';

export const financialFlowchartData: Flowchart = {
  phases: [
    {
      id: 'phase1',
      title: 'Phase 1',
      steps: ['budgetIncome', 'emergencyFund', 'employerMatch', 'highInterestDebt', 'retirementIRA', 'otherGoals'],
      color: '#f0f0f0'
    }
  ],
  nodes: {
    // Initial nodes
    'budgetIncome': {
      id: 'budgetIncome',
      title: 'Step 0: Budget & reduce expenses, set realistic goals',
      description: 'A sound financial footing is knowing where your money is going. Budgeting helps you see your sources of income less your expenses.',
      color: '#e0e0e0',
      nextNodes: ['createBudget'],
      completionDeadline: '2025-03-31',
      subtasks: [
        {
          id: 'bi-1',
          title: 'Track all income sources',
          description: 'Include salary, side jobs, investments, and any other income',
          completed: false
        },
        {
          id: 'bi-2',
          title: 'List and categorize all monthly expenses',
          description: 'Separate into fixed, variable, and discretionary spending',
          completed: false
        },
        {
          id: 'bi-3',
          title: 'Identify areas where expenses can be reduced',
          description: 'Focus on subscription services and discretionary spending first',
          completed: false
        },
        {
          id: 'bi-4',
          title: 'Set specific, measurable financial goals',
          description: 'Include short-term and long-term goals with deadlines',
          completed: false
        }
      ]
    },
    'createBudget': {
      id: 'createBudget',
      title: 'Create Budget',
      description: 'Fundamental to a sound financial footing is knowing where your money is going. Track your expenses and identify areas to save.',
      nextNodes: ['payRent']
    },
    'payRent': {
      id: 'payRent',
      title: 'Pay Rent/Mortgage',
      description: 'Including utilities or homeowners insurance, if required',
      nextNodes: ['payFood']
    },
    'payFood': {
      id: 'payFood',
      title: 'Pay Food/Groceries',
      description: 'Depending on the severity of your situation and needs, you may wish to prioritize utilities before this need.',
      nextNodes: ['payEssentials']
    },
    'payEssentials': {
      id: 'payEssentials',
      title: 'Pay Essential Items',
      description: 'Power, water, heat, toiletries, etc.',
      nextNodes: ['payIncomeExpenses']
    },
    'payIncomeExpenses': {
      id: 'payIncomeExpenses',
      title: 'Pay Income Earning Expenses',
      description: 'Transportation expenses, possibly internet/phone, anything required to continue earning income',
      nextNodes: ['payNonEssentials']
    },
    'payNonEssentials': {
      id: 'payNonEssentials',
      title: 'Pay Any Non-Essential Bills in Full',
      description: 'Cable, internet, phone, etc.',
      nextNodes: ['emergencyFund']
    },
    
    // Emergency Fund
    'emergencyFund': {
      id: 'emergencyFund',
      title: 'Step 1: Build an emergency fund',
      description: 'Either $1000 or one month\'s worth of expenses, whichever is greater; use a savings or checking account.',
      color: '#ffcccb',
      nextNodes: ['minimumPayments'],
      completionDeadline: '2025-04-15',
      subtasks: [
        {
          id: 'ef-1',
          title: 'Calculate one month of essential expenses',
          description: 'Include rent/mortgage, utilities, food, transportation, and other necessities',
          completed: false
        },
        {
          id: 'ef-2',
          title: 'Set up a dedicated savings account',
          completed: false
        },
        {
          id: 'ef-3',
          title: 'Set up automatic transfers to savings',
          description: 'Try to save at least 10% of each paycheck',
          completed: false
        },
        {
          id: 'ef-4',
          title: 'Reach target emergency fund amount',
          completed: false
        }
      ]
    },
    'minimumPayments': {
      id: 'minimumPayments',
      title: 'Make Minimum Payments On All Debts & Loans',
      description: 'Student loans, credit cards, etc.',
      nextNodes: ['payHealthCare']
    },
    'payHealthCare': {
      id: 'payHealthCare',
      title: 'Pay Health Care',
      description: 'Health Insurance and Health Care',
      nextNodes: ['employerMatch']
    },
    
    // Employer Match
    'employerMatch': {
      id: 'employerMatch',
      title: 'Step 2: Employer-sponsored matching funds',
      description: 'If your employer offers a retirement account with matching contributions, contribute the amount needed to get the full employer match, but nothing above that amount.',
      color: '#ffffcc',
      nextNodes: ['hasEmployerMatch'],
      completionDeadline: '2025-05-01',
      subtasks: [
        {
          id: 'em-1',
          title: 'Check if your employer offers a 401(k) or similar plan',
          completed: false
        },
        {
          id: 'em-2',
          title: 'Review employer match percentage and terms',
          description: 'Typically shown in benefits documentation or HR portal',
          completed: false
        },
        {
          id: 'em-3',
          title: 'Calculate minimum contribution to receive full match',
          completed: false
        },
        {
          id: 'em-4',
          title: 'Update payroll deduction to contribution amount',
          completed: false
        }
      ]
    },
    'hasEmployerMatch': {
      id: 'hasEmployerMatch',
      title: 'Does your employer offer a retirement account with an employer match?',
      description: '',
      isDecision: true,
      decisionQuestion: 'Does your employer offer a retirement account with an employer match?',
      decisionYesNode: 'contributeForMatch',
      decisionNoNode: 'highInterestDebt'
    },
    'contributeForMatch': {
      id: 'contributeForMatch',
      title: 'Contribute the amount needed to get the full employer match, but nothing above that amount.',
      description: '',
      nextNodes: ['highInterestDebt']
    },
    
    // High Interest Debt
    'highInterestDebt': {
      id: 'highInterestDebt',
      title: 'Step 3: Pay down high-interest debt',
      description: 'Pay down high interest rate debt (interest rate over 10% or higher)',
      color: '#ccffcc',
      nextNodes: ['hasHighInterestDebt'],
      completionDeadline: '2025-06-15',
      subtasks: [
        {
          id: 'hid-1',
          title: 'List all debts with interest rates above 10%',
          description: 'Include credit cards, personal loans, and any other high-interest debt',
          completed: false
        },
        {
          id: 'hid-2',
          title: 'Sort debts by interest rate (highest to lowest)',
          completed: false
        },
        {
          id: 'hid-3',
          title: 'Allocate extra payments to highest interest debt first',
          description: 'While maintaining minimum payments on all other debts',
          completed: false
        },
        {
          id: 'hid-4',
          title: 'Consider balance transfer or consolidation options',
          description: 'Only if you can get a significantly lower interest rate',
          completed: false
        }
      ]
    },
    'hasHighInterestDebt': {
      id: 'hasHighInterestDebt',
      title: 'Do you have any high interest debt?',
      description: 'i.e., debt with an interest rate of 10% or higher',
      isDecision: true,
      decisionQuestion: 'Do you have any high interest debt?',
      decisionYesNode: 'evaluateAvalancheSnowball',
      decisionNoNode: 'increaseEmergencyFund'
    },
    'evaluateAvalancheSnowball': {
      id: 'evaluateAvalancheSnowball',
      title: 'Evaluate the merits of the "Avalanche" and "Snowball" methods and their advantages in your personal financial/psychological situation and apply accordingly to pay off these debts.',
      description: '',
      nextNodes: ['increaseEmergencyFund']
    },
    
    // Emergency Fund Increase
    'increaseEmergencyFund': {
      id: 'increaseEmergencyFund',
      title: 'Increase Emergency Fund to 3-6 Months Living Expenses',
      description: 'Use a savings or checking account',
      color: '#ffcccb',
      nextNodes: ['moderateInterestDebt']
    },
    
    // Moderate Interest Debt
    'moderateInterestDebt': {
      id: 'moderateInterestDebt',
      title: 'Do you have any moderate interest debt?',
      description: 'i.e., remaining debt over 4-5% interest rate, excluding mortgage',
      isDecision: true,
      decisionQuestion: 'Do you have any moderate interest debt?',
      decisionYesNode: 'evaluateModerateDebtMethods',
      decisionNoNode: 'largePurchase'
    },
    'evaluateModerateDebtMethods': {
      id: 'evaluateModerateDebtMethods',
      title: 'Evaluate the merits of the "Avalanche" and "Snowball" methods and their advantages in your personal financial/psychological situation and apply accordingly to pay off these debts.',
      description: '',
      nextNodes: ['largePurchase']
    },
    
    // Large Purchase
    'largePurchase': {
      id: 'largePurchase',
      title: 'Are you expecting any large, required purchases or personal investments in the near future?',
      description: 'College, professional certifications, a car or you can\'t get to work, etc.',
      isDecision: true,
      decisionQuestion: 'Are you expecting any large, required purchases or personal investments in the near future?',
      decisionYesNode: 'savePurchaseAmount',
      decisionNoNode: 'currentlySaving15Percent'
    },
    'savePurchaseAmount': {
      id: 'savePurchaseAmount',
      title: 'Save the amount needed for these expenses in a savings or checking account.',
      description: '',
      nextNodes: ['currentlySaving15Percent']
    },
    
    // Retirement Savings
    'currentlySaving15Percent': {
      id: 'currentlySaving15Percent',
      title: 'Are you currently saving at least 15% of your pre-tax income for retirement?',
      description: 'Count contributions to all retirement accounts, both that you may need to save more if you are behind on retirement savings.',
      isDecision: true,
      decisionQuestion: 'Are you currently saving at least 15% of your pre-tax income for retirement?',
      decisionYesNode: 'retirementIRA',
      decisionNoNode: 'employer401k'
    },
    'employer401k': {
      id: 'employer401k',
      title: 'Does your employer offer a 401(k), 403(b), or similar retirement plan into which you could save more money?',
      description: '',
      isDecision: true,
      decisionQuestion: 'Does your employer offer a 401(k), 403(b), or similar retirement plan into which you could save more money?',
      decisionYesNode: 'increaseRetirementContributions',
      decisionNoNode: 'selfEmployedRetirement'
    },
    'increaseRetirementContributions': {
      id: 'increaseRetirementContributions',
      title: 'Increase contributions until you have reached 15% pre-tax income being saved for retirement.',
      description: '',
      nextNodes: ['retirementIRA']
    },
    'selfEmployedRetirement': {
      id: 'selfEmployedRetirement',
      title: 'If self-employed, contribute to an Individual 401(k), SEP-IRA, or SIMPLE IRA to reach 15% pre-tax income saved. For the self-employed, consider a taxable account to reach this goal.',
      description: '',
      nextNodes: ['retirementIRA']
    },
    
    // Retirement IRA
    'retirementIRA': {
      id: 'retirementIRA',
      title: 'Step 4: Saving for retirement in an IRA',
      description: 'Save more for retirement in an IRA, max out any other tax-advantaged accounts that apply to you, and save for college if needed',
      color: '#ccccff',
      nextNodes: ['hasHSA'],
      completionDeadline: '2025-07-30',
      subtasks: [
        {
          id: 'ira-1',
          title: 'Research IRA options (Traditional vs Roth)',
          description: 'Consider tax implications for your current/future situations',
          completed: false
        },
        {
          id: 'ira-2',
          title: 'Open an IRA account with a reputable provider',
          description: 'Compare fees, investment options, and user interface',
          completed: false
        },
        {
          id: 'ira-3',
          title: 'Set up automatic contributions',
          description: 'Aim to max out annual contribution limits if possible',
          completed: false
        },
        {
          id: 'ira-4',
          title: 'Select appropriate investments based on age/goals',
          description: 'Consider target date funds or a diversified portfolio',
          completed: false
        }
      ]
    },
    
    // HSA
    'hasHSA': {
      id: 'hasHSA',
      title: 'Do you have a qualified high-deductible health plan and are thus eligible for an investable HSA?',
      description: '',
      isDecision: true,
      decisionQuestion: 'Do you have a qualified high-deductible health plan and are thus eligible for an investable HSA?',
      decisionYesNode: 'maxHSA',
      decisionNoNode: 'hasChildren'
    },
    'maxHSA': {
      id: 'maxHSA',
      title: 'Max yearly HSA contributions',
      description: '',
      nextNodes: ['hasChildren']
    },
    
    // College Savings
    'hasChildren': {
      id: 'hasChildren',
      title: 'Do you have children and wish to help pay for some or all of their college expenses?',
      description: '',
      isDecision: true,
      decisionQuestion: 'Do you have children and wish to help pay for some or all of their college expenses?',
      decisionYesNode: 'collegeSavings',
      decisionNoNode: 'personalOptions'
    },
    'collegeSavings': {
      id: 'collegeSavings',
      title: 'Evaluate available savings/investment options, such as a 529 plan, and contribute accordingly.',
      description: '',
      nextNodes: ['personalOptions']
    },
    
    // Personal Options
    'personalOptions': {
      id: 'personalOptions',
      title: 'At this point, you have some options on how to proceed; it is completely up to you and your personal goals and desires.',
      description: '',
      nextNodes: ['retireEarly', 'immediateGoals']
    },
    
    // Retire Early
    'retireEarly': {
      id: 'retireEarly',
      title: 'Would you like to retire early?',
      description: '',
      isDecision: true,
      decisionQuestion: 'Would you like to retire early?',
      decisionYesNode: 'maxRetirementAccounts',
      decisionNoNode: 'otherGoals'
    },
    'maxRetirementAccounts': {
      id: 'maxRetirementAccounts',
      title: 'Max out 401(k), 403(b), or other employer sponsored account; consider the "mega backdoor Roth IRA", then use a taxable account.',
      description: '',
      nextNodes: ['otherGoals']
    },
    
    // Immediate Goals
    'immediateGoals': {
      id: 'immediateGoals',
      title: 'Do you have more immediate goals?',
      description: '',
      isDecision: true,
      decisionQuestion: 'Do you have more immediate goals?',
      decisionYesNode: 'useSavingsForGoals',
      decisionNoNode: 'otherGoals'
    },
    'useSavingsForGoals': {
      id: 'useSavingsForGoals',
      title: 'Use savings for goals sooner than 3-5 years, a conservative mix of stocks & bonds (< 50% stocks) for 3-10 years, and a more aggressive allocation (> 50% stocks) for time horizons > 10 years.',
      description: 'Common examples include down payments for homes, saving for big vacation, etc.',
      nextNodes: ['otherGoals']
    },
    
    // Other Goals
    'otherGoals': {
      id: 'otherGoals',
      title: 'Step 6: Save for other goals & advanced methods',
      description: 'Other goals like vacation, home down payment, early retirement, etc.',
      color: '#e6ccff',
      nextNodes: [],
      completionDeadline: '2025-10-01',
      subtasks: [
        {
          id: 'og-1',
          title: 'List all personal financial goals',
          description: 'Include both short-term and long-term goals with timeframes',
          completed: false
        },
        {
          id: 'og-2',
          title: 'Prioritize goals based on importance and timeline',
          completed: false
        },
        {
          id: 'og-3',
          title: 'Set up dedicated savings accounts for each goal',
          description: 'Consider high-yield savings accounts for short-term goals',
          completed: false
        },
        {
          id: 'og-4',
          title: 'Create automatic savings plans for each goal',
          description: 'Determine monthly contribution amounts needed to reach targets',
          completed: false
        }
      ]
    }
  }
};
