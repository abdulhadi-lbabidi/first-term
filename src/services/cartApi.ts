import type { AddToCartPayload, CartItem } from '../types/cart'
import { API_URL, ensureOkResponse, parseJsonResponse } from './http'

export async function getCartItems(): Promise<CartItem[]> {
  const response = await fetch(`${API_URL}/cart`)
  return parseJsonResponse<CartItem[]>(response, 'فشل تحميل السلة')
}

export async function addCartItem(payload: AddToCartPayload): Promise<CartItem> {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJsonResponse<CartItem>(response, 'فشل إضافة المنتج إلى السلة')
}

export async function updateCartItem(
  id: number,
  payload: Partial<CartItem>,
): Promise<CartItem> {
  const response = await fetch(`${API_URL}/cart/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJsonResponse<CartItem>(response, 'فشل تحديث عنصر السلة')
}

export async function removeCartItem(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/cart/${id}`, { method: 'DELETE' })
  await ensureOkResponse(response, 'فشل حذف عنصر السلة')
}

export async function clearCartItems(): Promise<void> {
  const items = await getCartItems()
  await Promise.all(items.map((item) => removeCartItem(item.id)))
}
