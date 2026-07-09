export interface ProductColor {
  name: string
  value: string
}

export interface CartItem {
  id: number
  productId: number
  code: string
  name: string
  price: number
  image: string
  selectedColor: ProductColor
  selectedSize: string
  quantity: number
}

export interface AddToCartPayload {
  productId: number
  code: string
  name: string
  price: number
  image: string
  selectedColor: ProductColor
  selectedSize: string
  quantity: number
}
