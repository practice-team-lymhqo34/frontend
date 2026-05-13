export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'

export interface Order {
  id: number
  title: string
  description: string | null
  weight: number
  status: OrderStatus
  owner_id: number
  origin_address: string
  destination_address: string
  is_template: boolean
  created_at: string
}

export interface OrderCreate {
  title: string
  description: string | null
  weight: number
  origin_address: string
  destination_address: string
  is_template: boolean
}
