import apiClient from './axios'

export interface Notification {
  id: number
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export const notificationsApi = {
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/dashboard/notifications')
    return response.data
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.patch(`/dashboard/notifications/${id}`, { is_read: true })
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/dashboard/notifications/read-all')
  },
}
