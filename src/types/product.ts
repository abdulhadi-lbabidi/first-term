export interface ProductColor {
  key: string
  value: string
}

export interface Product {
  id: number
  code: string
  price: number
  oldPrice?: number
  categoryKey: string
  images: string[]
  colors: ProductColor[]
  sizes: string[]
  isNew?: boolean
  isFeatured?: boolean
  createdAt?: string
}
