import type { MonthlyExpensesResponse } from '@/types/statistics'

export const getMonthlyExpenses = async (): Promise<MonthlyExpensesResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data for the current month
  return {
    total_amount: 45200.5,
    period: 'May 2026',
    data: [
      { date: '2026-05-01', amount: 1200 },
      { date: '2026-05-03', amount: 2500 },
      { date: '2026-05-05', amount: 800 },
      { date: '2026-05-08', amount: 4200 },
      { date: '2026-05-10', amount: 1500 },
      { date: '2026-05-12', amount: 3100 },
      { date: '2026-05-15', amount: 2800 },
      { date: '2026-05-18', amount: 5600 },
      { date: '2026-05-20', amount: 1200 },
      { date: '2026-05-22', amount: 3400 },
      { date: '2026-05-25', amount: 4800 },
      { date: '2026-05-27', amount: 2100 },
    ],
  }
}
