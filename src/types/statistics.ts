export interface MonthlyExpensePoint {
  date: string
  amount: number
}

export interface MonthlyExpensesResponse {
  total_amount: number
  data: MonthlyExpensePoint[]
  period: string
}
