import type { Product } from '../types/product'
import { API_URL, parseJsonResponse } from './http'

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`)
  return parseJsonResponse<Product[]>(response, 'فشل تحميل المنتجات')
}

export async function getProductById(id: string | number): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`)
  return parseJsonResponse<Product>(response, 'فشل تحميل المنتج')
}

export async function getNewArrivals(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products?isNew=true`)
  return parseJsonResponse<Product[]>(response, 'فشل تحميل أحدث المنتجات')
}
