import http from './http'

export interface TradeItem {
  id: number
  title: string
  category: string
  price: number
  condition: string
  location: string
  publisher: string
  publishTime: string
  image: string
  status: string
  description: string
  contact: string
}

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

export function createTrade(data: Omit<TradeItem, 'id'>) {
  return http.post<TradeItem>('/trades', data)
}

export function getTradeById(id: number | string) {
  return http.get<TradeItem>(`/trades/${id}`)
}

export function updateTrade(id: number | string, data: Partial<TradeItem>) {
  return http.patch<TradeItem>(`/trades/${id}`, data)
}

export function deleteTrade(id: number | string) {
  return http.delete(`/trades/${id}`)
}
