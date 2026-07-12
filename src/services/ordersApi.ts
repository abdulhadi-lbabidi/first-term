import type { CreateOrderPayload, Order } from '../types/order'
import { API_URL, parseJsonResponse } from './http'

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return parseJsonResponse<Order>(response, 'تعذر إنشاء الطلب')
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`)
  return parseJsonResponse<Order[]>(response, 'تعذر تحميل الطلبات')
}

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders?userId=${userId}`)
  return parseJsonResponse<Order[]>(response, 'تعذر تحميل طلباتك')
}

export async function getOrderById(id: number | string): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`)
  return parseJsonResponse<Order>(response, 'تعذر تحميل الطلب')
}
