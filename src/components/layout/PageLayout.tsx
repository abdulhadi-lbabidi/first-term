import type { ReactNode } from 'react'
import type { AppPage, NavigateFn } from '../../types/navigation'
import Footer from './Footer/Footer'
import Navbar from './Navbar/Navbar'

interface PageLayoutProps {
  currentPage: AppPage
  onNavigate: NavigateFn
  children: ReactNode
  navbarOverlay?: boolean
}

export default function PageLayout({
  currentPage,
  onNavigate,
  children,
  navbarOverlay = false,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar overlay={navbarOverlay} currentPage={currentPage} onNavigate={onNavigate} />
      {children}
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
