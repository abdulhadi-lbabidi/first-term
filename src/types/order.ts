import type { CartItem } from './cart'

export type OrderStatus = 'قيد المراجعة' | 'قيد التجهيز' | 'تم الشحن' | 'مكتمل'

export interface Order {
  id: number
  userId?: number | null
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  paymentMethod: 'cash' | 'card'
  items: CartItem[]
  subtotal: number
  delivery: number
  total: number
  status: OrderStatus
  createdAt: string
}

export interface CreateOrderPayload {
  userId?: number | null
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  paymentMethod: 'cash' | 'card'
  items: CartItem[]
  subtotal: number
  delivery: number
  total: number
  status: OrderStatus
  createdAt: string
}
