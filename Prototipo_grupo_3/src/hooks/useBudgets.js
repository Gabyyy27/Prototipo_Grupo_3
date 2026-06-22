import { mockBudgets } from '../data/mockBudgets.js';
import { useLocalStorage } from './useLocalStorage.js';

const BUDGETS_KEY = 'contfia.budgets.v1';

export function useBudgets() {
  const [budgets, setBudgets] = useLocalStorage(BUDGETS_KEY, mockBudgets);

  function addBudget(budget) {
    setBudgets([
      {
        ...budget,
        id: `${budget.type}-${Date.now()}`,
        target: Number(budget.target || 0),
        current: Number(budget.current || 0),
      },
      ...budgets,
    ]);
  }

  function updateProgress(budgetId, amount) {
    setBudgets(budgets.map((budget) =>
      budget.id === budgetId
        ? { ...budget, current: Math.max(0, Number(budget.current) + Number(amount || 0)) }
        : budget,
    ));
  }

  return {
    budgets,
    addBudget,
    updateProgress,
  };
}
