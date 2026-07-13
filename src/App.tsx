import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'
import PageIntro from './components/modals/PageIntro/PageIntro'
import About from './pages/About/About'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import Contact from './pages/Contact/Contact'
import Home from './pages/Home/Home'
import Orders from './pages/Orders/Orders'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Store from './pages/Store/Store'
import { useAppNavigate, useCurrentPage } from './hooks/useAppNavigate'
import { isValidStoreCategory } from './data/filters'
import { initAos, refreshAos } from './utils/aos'
import {
  ABOUT_PATH,
  CART_PATH,
  CHECKOUT_PATH,
  CONTACT_PATH,
  HOME_PATH,
  ORDERS_PATH,
  STORE_PATH,
} from './utils/routing'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useDocumentTitle() {
  const page = useCurrentPage()

  useEffect(() => {
    const titles: Record<string, string> = {
      about: 'Trend | About Store',
      store: 'Trend | Store',
      cart: 'Trend | Cart',
      product: 'Trend | Product Details',
      contact: 'Trend | Contact Us',
      checkout: 'Trend | Checkout',
      orders: 'Trend | My Orders',
      home: 'Trend | Fashion Store',
    }
    document.title = titles[page] ?? titles.home
  }, [page])
}

function useHashScroll() {
  const { pathname, hash } = useLocation()
  const [pendingHash, setPendingHash] = useState<string | null>(null)

  useEffect(() => {
    if (pathname === HOME_PATH && hash) {
      setPendingHash(hash)
      return
    }
    setPendingHash(null)
  }, [pathname, hash])

  useEffect(() => {
    if (!pendingHash) return

    const scrollToHash = () => {
      const element = document.querySelector(pendingHash)
      if (!element) return false
      element.scrollIntoView({ behavior: 'smooth' })
      setPendingHash(null)
      return true
    }

    if (scrollToHash()) return

    const timer = window.setTimeout(scrollToHash, 100)
    return () => window.clearTimeout(timer)
  }, [pendingHash])
}

function HomeRoute() {
  const navigate = useAppNavigate()
  return <Home currentPage="home" onNavigate={navigate} />
}

function AboutRoute() {
  const navigate = useAppNavigate()
  return <About currentPage="about" onNavigate={navigate} />
}

function StoreRoute() {
  const navigate = useAppNavigate()
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')?.trim()

  const initialCategory =
    categoryParam && categoryParam !== 'all' && isValidStoreCategory(categoryParam)
      ? categoryParam
      : 'all'

  return (
    <Store
      key={`${initialCategory}-${searchParam || ''}`}
      currentPage="store"
      onNavigate={navigate}
      initialCategory={initialCategory}
      initialSearch={searchParam || ''}
    />
  )
}

function CartRoute() {
  const navigate = useAppNavigate()
  return <Cart currentPage="cart" onNavigate={navigate} />
}

function ContactRoute() {
  const navigate = useAppNavigate()
  return <Contact currentPage="contact" onNavigate={navigate} />
}

function CheckoutRoute() {
  const navigate = useAppNavigate()
  return <Checkout currentPage="checkout" onNavigate={navigate} />
}

function OrdersRoute() {
  const navigate = useAppNavigate()
  return <Orders currentPage="orders" onNavigate={navigate} />
}

function ProductRoute() {
  const navigate = useAppNavigate()
  const { productId: productIdParam } = useParams()
  const productId = Number(productIdParam)
  const resolvedId = Number.isFinite(productId) ? productId : undefined

  if (resolvedId === undefined) {
    return <Navigate to={STORE_PATH} replace />
  }

  return (
    <ProductDetails
      key={resolvedId}
      currentPage="product"
      onNavigate={navigate}
      productId={resolvedId}
    />
  )
}

function AppRoutes() {
  const page = useCurrentPage()
  useDocumentTitle()
  useHashScroll()

  useEffect(() => {
    initAos()
  }, [])

  useEffect(() => {
    refreshAos()
  }, [page])

  return (
    <Routes>
      <Route path={HOME_PATH} element={<HomeRoute />} />
      <Route path={ABOUT_PATH} element={<AboutRoute />} />
      <Route path={STORE_PATH} element={<StoreRoute />} />
      <Route path={CART_PATH} element={<CartRoute />} />
      <Route path={CONTACT_PATH} element={<ContactRoute />} />
      <Route path={CHECKOUT_PATH} element={<CheckoutRoute />} />
      <Route path={ORDERS_PATH} element={<OrdersRoute />} />
      <Route path="/product/:productId" element={<ProductRoute />} />
      <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
    </Routes>
  )
}

export default function App() {
  const reducedMotion = prefersReducedMotion()
  const [showIntro, setShowIntro] = useState(() => !reducedMotion)
  const [isLeaving, setIsLeaving] = useState(false)
  const contentRevealed = !showIntro || isLeaving

  useEffect(() => {
    if (reducedMotion) return

    const leaveTimer = window.setTimeout(() => setIsLeaving(true), 1800)
    const hideTimer = window.setTimeout(() => setShowIntro(false), 2300)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(hideTimer)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!showIntro || isLeaving) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [showIntro, isLeaving])

  useEffect(() => {
    if (showIntro) return
    refreshAos()
  }, [showIntro])

  return (
    <>
      {showIntro && <PageIntro isLeaving={isLeaving} />}

      <div
        className={`transition-opacity duration-700 ease-out ${
          contentRevealed ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <AppRoutes />
      </div>
    </>
  )
}
