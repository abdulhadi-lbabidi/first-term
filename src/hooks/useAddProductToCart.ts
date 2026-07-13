import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import type { Product, ProductColor } from '../types/product'
import { getProductDisplay, toCartColor } from '../utils/productDisplay'
import { usePriceFormat } from '../hooks/usePriceFormat'

import { useToast } from '../components/modals/Toast/Toast'

export function useAddProductToCart() {
  const { t } = useTranslation()
  const { priceLocale, currency } = usePriceFormat()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [adding, setAdding] = useState(false)

  const submitAddToCart = useCallback(
    async (
      product: Product,
      selectedColor: ProductColor,
      selectedSize: string,
      imageIndex = 0,
    ) => {
      if (!selectedColor || !selectedSize) return false

      setAdding(true)
      try {
        const display = getProductDisplay(product, t, priceLocale, currency)
        const image =
          product.images[imageIndex] ?? product.images[0] ?? ''
        await addToCart({
          productId: product.id,
          code: product.code,
          name: display.name,
          price: product.price,
          image,
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
