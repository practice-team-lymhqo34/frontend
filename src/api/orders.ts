import apiClient from './axios'
import type { Order } from '@/types/order'

export const ordersApi = {
  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders/')
    return response.data
  },

  async getOrder(orderId: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/dashboard/orders/${orderId}`)
    return response.data
  },

  async getUnassignedOrders(): Promise<Order[]> {
    const orders = await this.getOrders()
    return orders.filter(
      (order) => order.status === 'PENDING' || (order.status as string) === 'pending',
    )
  },

  async getTemplates(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders/', {
      params: { is_template: true },
    })
    return response.data
  },

  async cancelOrder(orderId: number): Promise<void> {
    await apiClient.patch(`/dashboard/orders/${orderId}`, { status: 'canceled' })
  },

  async deleteOrder(orderId: number): Promise<void> {
    await apiClient.delete(`/dashboard/orders/${orderId}`)
  },

  async confirmReceipt(orderId: number): Promise<void> {
    await apiClient.post(`/dashboard/orders/${orderId}/confirm-receipt`)
  },
}
