export type OrderStatus =
  | 'pending'
  | 'in_transit'
  | 'delivered'
  | 'delayed'
  | 'awaiting_confirmation'

export interface Order {
  id: number
  title: string
  description: string | null
  weight: number
  status: OrderStatus
  owner_id: number
  created_at: string
}

export interface OrderCreate {
  title: string
  description: string | null
  weight: number
  is_template: boolean
}
