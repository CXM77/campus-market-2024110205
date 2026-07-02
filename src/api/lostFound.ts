import http from './http'

export interface LostFoundItem {
  id: number
  title: string
  type: 'lost' | 'found'
  itemName: string
  location: string
  eventTime: string
  contact: string
  status: string
  description: string
  publisher?: string
}

export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

export function createLostFound(data: Omit<LostFoundItem, 'id'>) {
  return http.post<LostFoundItem>('/lostFounds', data)
}

export function getLostFoundById(id: number | string) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}

export function updateLostFound(id: number | string, data: Partial<LostFoundItem>) {
  return http.patch<LostFoundItem>(`/lostFounds/${id}`, data)
}

export function deleteLostFound(id: number | string) {
  return http.delete(`/lostFounds/${id}`)
}
