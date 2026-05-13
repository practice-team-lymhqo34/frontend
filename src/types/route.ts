export interface Route {
  id: number
  order_id: number
  driver_id: number | null
  vehicle_id: number | null
  started_at: string | null
  eta: string
  completed_at: string | null
  statuses?: RouteStatus[]
}
export type RouteStatusEnum = 'ASSIGNED' | 'LOADED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED'

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
}
