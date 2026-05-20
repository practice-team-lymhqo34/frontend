import type { Order } from './order'

export interface Route {
  id: number
  order_id: number
  driver_id: number | null
  vehicle_id: number | null
  started_at: string | null
  eta: string
  completed_at: string | null
  statuses?: RouteStatus[]
  order?: Order
}
export type RouteStatusEnum =
  | 'assigned'
  | 'loaded'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'cancelled'

export interface RouteStatus {
  id: number
  route_id: number
  status: RouteStatusEnum
  created_at: string
}

export interface RouteOut {
  id: number
  order_id: number
  driver_id: number | null
  vehicle_id: number | null
  started_at: string | null
  eta: string
  completed_at: string | null
  order?: Order
}
