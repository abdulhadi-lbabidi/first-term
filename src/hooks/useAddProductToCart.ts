import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import type { Product, ProductColor } from '../types/product'
import { getProductDisplay, toCartColor } from '../utils/productDisplay'
import { useToast } from '../components/Toast/Toast'

export function useAddProductToCart() {
  const { t, i18n } = useTranslation()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [adding, setAdding] = useState(false)

  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  const submitAddToCart = useCallback(
    async (product: Product, selectedColor: ProductColor, selectedSize: string) => {
      if (!selectedColor || !selectedSize) return false

      setAdding(true)
      try {
        const display = getProductDisplay(product, t, priceLocale, currency)
        await addToCart({
          productId: product.id,
          code: product.code,
          name: display.name,
          price: product.price,
          image: product.images[0] ?? '',
          selectedColor: toCartColor(t, selectedColor),
          selectedSize,
          quantity: 1,
        })
        showToast(t('cart.addedToCart'))
        return true
      } catch {
        showToast(t('cart.error'))
        return false
      } finally {
        setAdding(false)
      }
    },
    [addToCart, currency, priceLocale, showToast, t],
  )

  return { adding, submitAddToCart }
}
