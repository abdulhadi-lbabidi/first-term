export interface OfferPosterData {
  id: string
  image: string
  code: string
  href: string
  desktopHeight: string
  desktopOffset: string
  rotationClass: string
  floatDuration: string
  floatDelay: string
}

export const offerPosters: OfferPosterData[] = [
  {
    id: 'discount-40',
    image: '/images/offer-1.jpg',
    code: 'TREND40',
    href: '#store',
    desktopHeight: 'lg:h-[540px]',
    desktopOffset: 'lg:translate-y-0',
    rotationClass: 'rotate-[-2deg]',
    floatDuration: '6s',
    floatDelay: '0s',
  },
  {
    id: 'style-3',
    image: '/images/offer-2.jpg',
    code: 'STYLE3',
    href: '#store',
    desktopHeight: 'lg:h-[460px]',
    desktopOffset: 'lg:translate-y-14',
    rotationClass: 'lg:rotate-[1deg]',
    floatDuration: '7s',
    floatDelay: '1.2s',
  },
  {
    id: 'new-launch',
    image: '/images/offer-3.jpg',
    code: 'NEWLOOK',
    href: '#store',
    desktopHeight: 'lg:h-[540px]',
    desktopOffset: 'lg:translate-y-0',
    rotationClass: 'rotate-[2deg]',
    floatDuration: '6.5s',
    floatDelay: '2.4s',
  },
]
