import apiClient from './axios'
import type { Route, RouteStatus } from '@/types/route'
import type { User } from '@/types/user'

export interface RouteStatusCreate {
  status: string
  location?: string
  description?: string
}

export const routesApi = {
  async getTodayRoutes(): Promise<Route[]> {
    const response = await apiClient.get<Route[]>('/dashboard/routes/today')
    return response.data
  },

  async addRouteStatus(routeId: number, statusIn: RouteStatusCreate): Promise<unknown> {
    const response = await apiClient.post(`/dashboard/routes/${routeId}/statuses`, statusIn)
    return response.data
  },

  async getRouteStatuses(routeId: number): Promise<RouteStatus[]> {
    const response = await apiClient.get<RouteStatus[]>(`/dashboard/routes/${routeId}/statuses`)
    return response.data
  },

  async getDrivers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/dashboard/drivers')
    return response.data
  },

  async assignRoute(orderId: number, driver_id: number, eta: string): Promise<Route> {
    const response = await apiClient.post<Route>(`/dashboard/orders/${orderId}/assign`, {
      driver_id,
      eta,
    })
    return response.data
  },
}
