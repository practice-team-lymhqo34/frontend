// import apiClient from './axios'
import type { Route } from '@/types/route'

export const routesApi = {
  // Real endpoint (commented out for now)
  /*
  async assignRoute(orderId: number, driverId: number, vehicleId: number): Promise<Route> {
    const response = await apiClient.post<Route>('/routes/assign', {
      order_id: orderId,
      driver_id: driverId,
      vehicle_id: vehicleId
    })
    return response.data
  },
  */

  // Mock implementation for development
  async assignRoute(orderId: number, driverId: number, vehicleId: number): Promise<Route> {
    console.log('API call: assignRoute', { orderId, driverId, vehicleId })

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock response
    return {
      id: Math.floor(Math.random() * 1000),
      order_id: orderId,
      driver_id: driverId,
      vehicle_id: vehicleId,
      started_at: null,
      eta: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
      completed_at: null,
    }
  },
}
