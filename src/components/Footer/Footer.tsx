import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronUpIcon } from '../icons/Icons'

type FooterLinkKey =
  | 'home'
  | 'store'
  | 'categories'
  | 'about'
  | 'contact'
  | 'orders'
  | 'cart'
  | 'login'
  | 'register'

type FooterLink = {
  key: FooterLinkKey
  href: string
}

type SocialLinkKey = 'instagram' | 'facebook' | 'tiktok'

type SocialLink = {
  key: SocialLinkKey
  href: string
}

const quickLinks: FooterLink[] = [
  { key: 'home', href: '#home' },
  { key: 'store', href: '/store' },
  { key: 'categories', href: '#store' },
  { key: 'about', href: '#about' },
  { key: 'contact', href: 'mailto:support@trend.com' },
]

const accountLinks: FooterLink[] = [
  { key: 'orders', href: '#orders' },
  { key: 'cart', href: '#cart' },
  { key: 'login', href: '#home' },
  { key: 'register', href: '#home' },
]

const socialLinks: SocialLink[] = [
  { key: 'instagram', href: 'https://instagram.com' },
  { key: 'facebook', href: 'https://facebook.com' },
  { key: 'tiktok', href: 'https://tiktok.com' },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Newsletter subscription:', email)
    setSubscribed(true)
    setEmail('')
  }

  const footerColumns = [
    { titleKey: 'quickLinks' as const, links: quickLinks },
    { titleKey: 'account' as const, links: accountLinks },
  ]

  return (
    <footer className="relative">
      <div className="relative bg-gradient-to-b from-[#faf7ff] via-[#f3ebff] to-[#ebe0ff] pt-16 pb-0 max-md:pt-12">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-200/80 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/40 to-transparent"
          aria-hidden="true"
        />

        <div className="container relative z-10 pb-4">
          <div className="group/newsletter relative z-20 mx-auto -mb-20 max-w-[860px] max-md:-mb-16 max-md:max-w-full">
            <div
              className="pointer-events-none absolute -inset-8 rounded-[2.75rem] bg-gradient-to-r from-purple-400/25 via-fuchsia-400/20 to-purple-400/25 blur-3xl transition-all duration-500 ease-out group-hover/newsletter:from-purple-400/35 group-hover/newsletter:via-fuchsia-400/30 group-hover/newsletter:to-purple-400/35"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-purple-200/40 to-fuchsia-100/30 blur-xl"
              aria-hidden="true"
            />

            <div
              className="relative rounded-[2rem] border border-purple-100 bg-white p-8 text-[#16051f] shadow-[0_25px_80px_rgba(168,85,247,0.25)] transition-all duration-500 ease-out group-hover/newsletter:-translate-y-1 max-md:p-6"
              data-aos="zoom-in"
            >
              <div className="text-center">
                <h2 className="text-[clamp(22px,3.5vw,32px)] font-extrabold tracking-tight text-[#16051f]">
                  {t('footer.newsletter.title')}
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[#5b4d6d] max-md:text-sm">
                  {t('footer.newsletter.subtitle')}
                </p>
              </div>

              <form
                onSubmit={handleNewsletterSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (subscribed) setSubscribed(false)
                  }}
                  placeholder={t('footer.newsletter.placeholder')}
                  required
                  className="min-w-0 flex-1 rounded-full border border-purple-100 bg-purple-50 px-5 py-3.5 text-sm text-[#16051f] placeholder:text-purple-400/40 outline-none transition-all duration-500 ease-out focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-500/30"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_32px_rgba(168,85,247,0.35)] transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(217,70,239,0.45)] active:scale-[0.98]"
                >
                  {t('footer.newsletter.submit')}
                </button>
              </form>

              {subscribed && (
                <p
                  className="mt-4 text-center text-sm font-medium text-fuchsia-600"
                  role="status"
                >
                  {t('footer.newsletter.success')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-b from-[#12001f] via-[#2b0646] to-[#07000d] text-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#ebe0ff]/15 via-[#2b0646]/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -start-32 top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -end-24 top-1/2 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute start-1/3 bottom-32 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-48 bottom-0 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <span className="select-none text-[clamp(100px,20vw,260px)] font-black uppercase leading-none tracking-[0.2em] text-white/[0.03]">
            TREND
          </span>
        </div>

        <div className="container relative z-10 pt-28 pb-10 max-md:pt-24 max-md:pb-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 max-md:gap-10">
            <div className="space-y-5" data-aos="fade-up">
              <a
                href="#home"
                className="inline-flex items-center gap-2.5 text-[22px] font-extrabold text-white transition-colors duration-500 ease-out hover:text-fuchsia-300"
              >
                <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-white/15 bg-white/10 text-lg font-black backdrop-blur-sm">
                  T
                </span>
                Trend
              </a>

              <p className="max-w-xs text-[15px] leading-relaxed text-purple-100/70 max-md:text-sm">
                {t('footer.brand.description')}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-purple-100/80 transition-all duration-500 ease-out hover:border-fuchsia-400/30 hover:bg-fuchsia-500/10 hover:text-fuchsia-300 hover:shadow-[0_0_20px_rgba(217,70,239,0.25)]"
                  >
                    {t(`footer.social.${social.key}`)}
                  </a>
                ))}
              </div>
            </div>

            {footerColumns.map((column, index) => (
              <div key={column.titleKey} data-aos="fade-up" data-aos-delay={index * 120}>
                <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                  {t(`footer.columns.${column.titleKey}`)}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        className="inline-block text-[15px] text-purple-100/70 transition-all duration-500 ease-out hover:translate-x-1 hover:text-fuchsia-300 max-md:text-sm"
                      >
                        {t(`footer.links.${link.key}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div data-aos="fade-up" data-aos-delay="240">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                {t('footer.columns.contact')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@trend.com"
                    className="inline-block text-[15px] text-purple-100/70 transition-all duration-500 ease-out hover:translate-x-1 hover:text-fuchsia-300 max-md:text-sm"
                  >
                    support@trend.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+966500000000"
                    className="inline-block text-[15px] text-purple-100/70 transition-all duration-500 ease-out hover:translate-x-1 hover:text-fuchsia-300 max-md:text-sm"
                  >
                    +966 500 000 000
                  </a>
                </li>
                <li>
                  <span className="text-[15px] text-purple-100/70 max-md:text-sm">
                    {t('footer.contact.tagline')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row max-md:mt-12 max-md:pt-6">
            <p className="text-sm text-purple-100/60">
              {t('footer.bottom.copyright')}
            </p>
            <p className="text-xs text-purple-100/40">
              {t('footer.bottom.tagline')}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label={t('footer.backToTop')}
        className="fixed bottom-8 end-8 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-violet-600/90 via-purple-600/90 to-fuchsia-500/90 text-white shadow-[0_8px_32px_rgba(124,58,237,0.4)] backdrop-blur-sm transition-all duration-500 ease-out hover:scale-110 hover:shadow-[0_12px_40px_rgba(217,70,239,0.5)] active:scale-95 max-md:bottom-6 max-md:end-6 max-md:h-10 max-md:w-10"
      >
        <ChevronUpIcon />
      </button>
    </footer>
  )
}
