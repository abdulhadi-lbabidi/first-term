import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  addCartItem,
  clearCartItems,
  getCartItems,
  removeCartItem,
  updateCartItem,
} from '../services/cartApi'
import type { AddToCartPayload, CartItem } from '../types/cart'

interface CartContextValue {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  loading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addToCart: (payload: AddToCartPayload) => Promise<void>
  increaseQuantity: (itemId: number) => Promise<void>
  decreaseQuantity: (itemId: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

function findMatchingItem(items: CartItem[], payload: AddToCartPayload) {
  return items.find(
    (item) =>
      item.productId === payload.productId &&
      item.selectedColor.name === payload.selectedColor.name &&
      item.selectedSize === payload.selectedSize,
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const items = await getCartItems()
      setCartItems(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل السلة')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCart()
  }, [fetchCart])

  const addToCart = useCallback(async (payload: AddToCartPayload) => {
    setError(null)
    try {
      const currentItems = await getCartItems()
      const existing = findMatchingItem(currentItems, payload)

      if (existing) {
        const updated = await updateCartItem(existing.id, {
          quantity: existing.quantity + payload.quantity,
        })
        setCartItems((prev) =>
          prev.map((item) => (item.id === existing.id ? updated : item)),
        )
      } else {
        const created = await addCartItem(payload)
        setCartItems((prev) => [...prev, created])
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ أثناء إضافة المنتج إلى السلة'
      setError(message)
      throw err
    }
  }, [])

  const increaseQuantity = useCallback(async (itemId: number) => {
    setError(null)
    const item = cartItems.find((entry) => entry.id === itemId)
    if (!item) return

    try {
      const updated = await updateCartItem(itemId, { quantity: item.quantity + 1 })
      setCartItems((prev) =>
        prev.map((entry) => (entry.id === itemId ? updated : entry)),
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث الكمية'
      setError(message)
      throw err
    }
  }, [cartItems])

  const decreaseQuantity = useCallback(async (itemId: number) => {
    setError(null)
    const item = cartItems.find((entry) => entry.id === itemId)
    if (!item) return

    try {
      if (item.quantity > 1) {
        const updated = await updateCartItem(itemId, { quantity: item.quantity - 1 })
        setCartItems((prev) =>
          prev.map((entry) => (entry.id === itemId ? updated : entry)),
        )
      } else {
        await removeCartItem(itemId)
        setCartItems((prev) => prev.filter((entry) => entry.id !== itemId))
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث الكمية'
      setError(message)
      throw err
    }
  }, [cartItems])

  const removeFromCart = useCallback(async (itemId: number) => {
    setError(null)
    try {
      await removeCartItem(itemId)
      setCartItems((prev) => prev.filter((entry) => entry.id !== itemId))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ أثناء حذف المنتج'
      setError(message)
      throw err
    }
  }, [])

  const clearCart = useCallback(async () => {
    setError(null)
    try {
      await clearCartItems()
      setCartItems([])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ أثناء تفريغ السلة'
      setError(message)
      throw err
    }
  }, [])

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  )

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      loading,
      error,
      fetchCart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      loading,
      error,
      fetchCart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
