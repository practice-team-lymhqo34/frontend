import apiClient from './axios'
import type { MonthlyExpensesResponse, MonthlyExpensePoint } from '@/types/statistics'

export const getMonthlyExpenses = async (): Promise<MonthlyExpensesResponse> => {
  const response = await apiClient.get<MonthlyExpensePoint[]>('/dashboard/statistics/monthly')
  const rawData = response.data

  // Sort by month ascending for the chart
  const sortedData = [...rawData].sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
  )

  // Map backend fields to frontend expectations
  // We use total_weight as a primary metric for the "amount" in the chart
  const data = sortedData.map((item) => ({
    ...item,
    date: item.month,
    amount: item.total_weight,
  }))

  const total_amount = data.reduce((acc, item) => acc + (item.amount || 0), 0)

  // Determine the period string
  let period = 'Last 12 Months'
  if (data.length > 0) {
    const firstItem = data[0]
    const lastItem = data[data.length - 1]

    if (firstItem && lastItem) {
      const firstMonth = new Date(firstItem.month).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      const lastMonth = new Date(lastItem.month).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      period = `${firstMonth} - ${lastMonth}`
    }
  }

  return {
    total_amount,
    period,
    data,
  }
}
