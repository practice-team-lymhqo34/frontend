import apiClient from './axios'
import type { Order } from '@/types/order'

export const ordersApi = {
  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders/')
    return response.data
  },

  async getUnassignedOrders(): Promise<Order[]> {
    const orders = await this.getOrders()
    return orders.filter(
      (order) => order.status === 'PENDING' || (order.status as string) === 'pending',
    )
  },
}
