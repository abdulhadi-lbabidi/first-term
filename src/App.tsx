import { useCallback, useEffect, useState } from 'react'
import PageIntro from './components/PageIntro/PageIntro'
import About from './pages/About/About'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Store from './pages/Store/Store'
import type { AppPage, NavigateOptions } from './types/navigation'
import { parseNavigateOptions } from './types/navigation'
import { initAos, refreshAos } from './utils/aos'
import { getPageFromLocation, syncHistory } from './utils/routing'

function getInitialHash(): string | null {
  const location = getPageFromLocation()
  if (location.page !== 'home') return null
  return window.location.hash || null
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function App() {
  const reducedMotion = prefersReducedMotion()
  const initialLocation = getPageFromLocation()
  const [showIntro, setShowIntro] = useState(() => !reducedMotion)
  const [isLeaving, setIsLeaving] = useState(false)
  const [page, setPage] = useState<AppPage>(() => initialLocation.page)
  const [productId, setProductId] = useState<number | undefined>(
    () => initialLocation.productId,
  )
  const [pendingHash, setPendingHash] = useState<string | null>(getInitialHash)

  const contentRevealed = !showIntro || isLeaving

  const navigate = useCallback((target: AppPage, options?: string | NavigateOptions) => {
    const { hash, productId: nextProductId } = parseNavigateOptions(options)
    syncHistory(target, { hash, productId: nextProductId })
    setPage(target)
    setProductId(nextProductId)

    if (hash) {
      setPendingHash(hash)
      return
    }

    setPendingHash(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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
    const syncFromLocation = () => {
      const nextLocation = getPageFromLocation()
      setPage(nextLocation.page)
      setProductId(nextLocation.productId)

      const hash = window.location.hash
      if (nextLocation.page === 'home' && hash) {
        setPendingHash(hash)
        return
      }

      setPendingHash(null)
      if (nextLocation.page !== 'home') {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }

    window.addEventListener('popstate', syncFromLocation)
    return () => window.removeEventListener('popstate', syncFromLocation)
  }, [])

  useEffect(() => {
    initAos()
  }, [])

  useEffect(() => {
    if (showIntro) return
    refreshAos()
  }, [showIntro])

  useEffect(() => {
    if (showIntro) return
    refreshAos()
  }, [page, pendingHash, productId, showIntro])

  useEffect(() => {
    if (page !== 'home' || !pendingHash) return

    const scrollToHash = () => {
      const element = document.querySelector(pendingHash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setPendingHash(null)
        return true
      }
      return false
    }

    if (scrollToHash()) return

    const timer = window.setTimeout(scrollToHash, 100)
    return () => window.clearTimeout(timer)
  }, [page, pendingHash])

  useEffect(() => {
    if (page === 'about') {
      document.title = 'Trend | About Store'
      return
    }
    if (page === 'store') {
      document.title = 'Trend | Store'
      return
    }
    if (page === 'cart') {
      document.title = 'Trend | Cart'
      return
    }
    if (page === 'product') {
      document.title = 'Trend | Product Details'
      return
    }
    document.title = 'Trend | Fashion Store'
  }, [page])

  const renderPage = () => {
    switch (page) {
      case 'about':
        return <About currentPage={page} onNavigate={navigate} />
      case 'store':
        return <Store currentPage={page} onNavigate={navigate} />
      case 'cart':
        return <Cart currentPage={page} onNavigate={navigate} />
      case 'product':
        return (
          <ProductDetails
            currentPage={page}
            onNavigate={navigate}
            productId={productId}
          />
        )
      default:
        return <Home currentPage={page} onNavigate={navigate} />
    }
  }

  return (
    <>
      {showIntro && <PageIntro isLeaving={isLeaving} />}

      <div
        className={`transition-opacity duration-700 ease-out ${
          contentRevealed ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {renderPage()}
      </div>
    </>
  )
}
