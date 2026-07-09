import AOS from 'aos'

export const AOS_OPTIONS = {
  duration: 900,
  easing: 'ease-out-cubic',
  once: true,
  offset: 120,
} as const

export function initAos() {
  AOS.init(AOS_OPTIONS)
}

export function refreshAos() {
  requestAnimationFrame(() => {
    AOS.refresh()
  })
}

export function aosDelay(index: number, step = 120) {
  return index * step
}
