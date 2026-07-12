import { useEffect, useState, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/Footer/Footer'
import HeroBackground from '../../components/HeroBackground/HeroBackground'
import Navbar from '../../components/Navbar/Navbar'
import { ChevronDownIcon } from '../../components/icons/Icons'
import { PAGE_PADDING } from '../../constants/layout'
import { heroSlides } from '../../data/home'
import { useHeroCarousel } from '../../hooks/useHeroCarousel'
import { useInView } from '../../hooks/useInView'
import type { AppPage, NavigateFn, PageProps } from '../../types/navigation'

type HelpTypeValue = 'product' | 'order' | 'cart' | 'suggestion'

interface ContactFormState {
  fullName: string
  email: string
  phone: string
  orderNumber: string
  message: string
  type: HelpTypeValue
}

const helpTypes = [
  {
    id: 'product',
    title: 'استفسار عن منتج',
    description: 'المقاسات، الألوان، رقم المنتج، أو التفاصيل',
  },
  {
    id: 'order',
    title: 'متابعة طلب',
    description: 'معرفة حالة طلبك بعد الشراء',
  },
  {
    id: 'cart',
    title: 'مشكلة في السلة',
    description: 'مشكلة بإضافة المنتجات أو الكمية',
  },
  {
    id: 'suggestion',
    title: 'اقتراح',
    description: 'اقتراحاتك لتطوير تجربة ترند',
  },
] as const

function HelpTypeIcon({ type }: { type: HelpTypeValue }) {
  const iconClass = 'h-[18px] w-[18px]'

  if (type === 'product') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <path
          d="M12 3 4 7v2c0 4.2 3.4 8.2 8 10 4.6-1.8 8-5.8 8-10V7l-8-4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 12h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'order') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <path
          d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M4 7l2-3h12l2 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 12h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'cart') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <path
          d="M6 6h15l-1.5 9H7.5L6 6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M6 6 5 3H2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.4" fill="currentColor" />
        <circle cx="18" cy="20" r="1.4" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path
        d="M12 3l1.4 4.3H18l-3.6 2.6 1.4 4.3L12 11.6 8.2 14.2l1.4-4.3L6 7.3h4.6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const HERO_BADGE_KEYS = ['fastReply', 'orderSupport', 'productInquiries'] as const
const PANEL_CONTACT_KEYS = ['email', 'phone', 'hours'] as const
const PANEL_PILL_KEYS = ['orders', 'products', 'cart', 'sizes'] as const
const PANEL_MINI_STEP_KEYS = ['receive', 'review', 'reply'] as const
const PANEL_MINI_STEP_NUMBERS = ['01', '02', '03']

const FORM_INPUT_CLASS =
  'h-12 w-full rounded-2xl border border-purple-100 bg-white px-4 text-[#25003f] outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'

const FORM_TEXTAREA_CLASS =
  'min-h-[140px] w-full resize-none rounded-2xl border border-purple-100 bg-white px-4 py-3 text-[#25003f] outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
const JOURNEY_STEP_KEYS = ['choose', 'details', 'send', 'reply'] as const
const FAQ_IDS = ['trackOrder', 'changeSize', 'chooseSize', 'accountRequired'] as const

const PANEL_CONTACT_ICONS: Record<(typeof PANEL_CONTACT_KEYS)[number], string> = {
  email: '✉',
  phone: '☎',
  hours: '◷',
}

const INITIAL_FORM: ContactFormState = {
  fullName: '',
  email: '',
  phone: '',
  orderNumber: '',
  message: '',
  type: 'product',
}

function ContactHero({
  onNavigate,
  currentPage,
}: {
  onNavigate: NavigateFn
  currentPage: AppPage
}) {
  const { t } = useTranslation()
  const { activeSlide, goToSlide } = useHeroCarousel(heroSlides.length)

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-white">
      <HeroBackground activeSlide={activeSlide} />

      <Navbar overlay currentPage={currentPage} onNavigate={onNavigate} />

      <div className="container relative z-[2] flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-[calc(72px+64px)] text-center max-md:pb-24 max-md:pt-[calc(72px+48px)]">
        <span
          className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-xl"
          data-aos="fade-up"
          data-aos-delay="0"
        >
          {t('contactPage.hero.badge')}
        </span>

        <h1
          className="max-w-4xl text-[clamp(32px,5vw,56px)] font-extrabold leading-tight tracking-tight"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          {t('contactPage.hero.title')}
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-purple-100/90 max-md:text-base"
          data-aos="fade-up"
          data-aos-delay="160"
        >
          {t('contactPage.hero.subtitle')}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-3 max-md:px-2"
          data-aos="fade-up"
          data-aos-delay="240"
        >
          {HERO_BADGE_KEYS.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xl"
            >
              {t(`contactPage.hero.badges.${badge}`)}
            </span>
          ))}
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-9 z-[3] flex justify-center gap-2.5 max-sm:bottom-6"
        role="tablist"
        aria-label={t('hero.slidesLabel')}
      >
        {heroSlides.map((slide, index) => {
          const isActive = index === activeSlide
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-label={t('hero.slideLabel', { number: index + 1 })}
              aria-selected={isActive}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer rounded-full transition-all duration-400 ${
                isActive
                  ? 'h-2.5 w-8 border-0 bg-gradient-to-r from-violet-600 to-purple-500 shadow-[0_0_16px_rgba(167,139,250,0.5)]'
                  : 'h-2.5 w-2.5 border border-white/20 bg-white/30 hover:bg-white/55'
              }`}
            />
          )
        })}
      </div>
    </section>
  )
}

function HelpTypeSelector({
  selectedHelpType,
  onSelect,
}: {
  selectedHelpType: HelpTypeValue
  onSelect: (type: HelpTypeValue) => void
}) {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-visible bg-gradient-to-b from-[#4b0078]/8 via-[#faf7ff] to-white py-16 max-md:py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,85,247,0.08),transparent_55%)]"
        aria-hidden="true"
      />

      <div className={`${PAGE_PADDING} relative`}>
        <div className="mx-auto mb-10 max-w-2xl text-center" data-aos="fade-up">
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold text-[#25003f]">
            {t('contactPage.helpSelector.title')}
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-purple-700/80 max-md:text-sm">
            {t('contactPage.helpSelector.subtitle')}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 overflow-visible sm:grid-cols-2 lg:grid-cols-4">
          {helpTypes.map((help) => {
            const isActive = selectedHelpType === help.id
            return (
              <div key={help.id} className="min-h-[11.5rem] p-1">
                <button
                  type="button"
                  onClick={() => onSelect(help.id)}
                  aria-pressed={isActive}
                  className={`flex h-full min-h-[11rem] w-full flex-col rounded-[2rem] border p-6 text-start transition-all duration-500 ease-out ${
                    isActive
                      ? 'relative z-10 scale-[1.03] border-transparent bg-gradient-to-br from-purple-700 via-fuchsia-600 to-purple-500 text-white shadow-[0_30px_90px_rgba(168,85,247,0.35)]'
                      : 'border-purple-100 bg-white/90 text-[#16051f] shadow-[0_16px_48px_rgba(168,85,247,0.10)] hover:-translate-y-1 hover:shadow-[0_22px_64px_rgba(168,85,247,0.18)]'
                  }`}
                >
                  <span
                    className={`mb-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    <HelpTypeIcon type={help.id} />
                  </span>
                  <h3 className="text-base font-bold leading-snug">
                    {t(`contactPage.helpSelector.types.${help.id}.title`)}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isActive ? 'text-white/85' : 'text-purple-600/80'
                    }`}
                  >
                    {t(`contactPage.helpSelector.types.${help.id}.description`)}
                  </p>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SupportPanel() {
  const { t } = useTranslation()

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#13001f] via-[#2b0646] to-[#5b0a83] p-6 text-white shadow-[0_30px_100px_rgba(88,28,135,0.28)] transition-all duration-500 ease-out hover:-translate-y-1 lg:p-7"
      data-aos="fade-left"
    >
      <div
        className="pointer-events-none absolute -start-6 -top-6 h-32 w-32 rounded-full bg-fuchsia-500/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-4 bottom-8 h-28 w-28 rounded-full bg-purple-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute end-1 top-1/3 text-[clamp(40px,8vw,72px)] font-black uppercase leading-none text-white/[0.04] select-none"
        aria-hidden="true"
      >
        CARE
      </div>

      <div className="relative z-[1] flex flex-col gap-3">
        <div>
          <span className="mb-2 inline-block rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xl">
            {t('contactPage.panel.badge')}
          </span>
          <h3 className="text-xl font-extrabold">{t('contactPage.panel.title')}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-purple-100/85">
            {t('contactPage.panel.text')}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/50 blur-[2px]" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]" />
            </span>
            <p className="text-sm font-bold">{t('contactPage.panel.status.title')}</p>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-purple-100/75">
            {t('contactPage.panel.status.subtitle')}
          </p>
        </div>

        <div className="space-y-2">
          {PANEL_CONTACT_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-xl transition-all duration-500 ease-out hover:bg-white/15"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm">
                {PANEL_CONTACT_ICONS[key]}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-purple-200/80">
                  {t(`contactPage.panel.contact.${key}.label`)}
                </p>
                <p className="text-sm font-semibold" dir="ltr">
                  {t(`contactPage.panel.contact.${key}.value`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {PANEL_PILL_KEYS.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-xl"
            >
              {t(`contactPage.panel.pills.${pill}`)}
            </span>
          ))}
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl">
          <p className="mb-2.5 text-xs font-bold text-purple-100">
            {t('contactPage.panel.miniSteps.title')}
          </p>
          <div className="space-y-2">
            {PANEL_MINI_STEP_KEYS.map((stepKey, index) => (
              <div key={stepKey} className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-500 text-[10px] font-black">
                  {PANEL_MINI_STEP_NUMBERS[index]}
                </span>
                <p className="text-xs font-semibold text-white/90">
                  {t(`contactPage.panel.miniSteps.steps.${stepKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FormField({
  id,
  label,
  children,
  className = '',
}: {
  id: string
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#25003f]">
        {label}
      </label>
      {children}
    </div>
  )
}

function ContactForm({
  selectedHelpType,
  formData,
  onHelpTypeChange,
  onFormDataChange,
}: {
  selectedHelpType: HelpTypeValue
  formData: ContactFormState
  onHelpTypeChange: (type: HelpTypeValue) => void
  onFormDataChange: Dispatch<SetStateAction<ContactFormState>>
}) {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isOrderType = selectedHelpType === 'order'

  useEffect(() => {
    if (!isOrderType) {
      onFormDataChange((prev) => ({ ...prev, orderNumber: '' }))
    }
  }, [isOrderType, onFormDataChange])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccess(false)

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError(t('contactPage.form.error'))
      return
    }

    setError('')
    setSuccess(true)
    onFormDataChange(INITIAL_FORM)
  }

  const updateField = <K extends keyof ContactFormState>(
    field: K,
    value: ContactFormState[K],
  ) => {
    onFormDataChange((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
    if (success) setSuccess(false)
  }

  const handleTypeChange = (type: HelpTypeValue) => {
    onHelpTypeChange(type)
    onFormDataChange((prev) => ({ ...prev, type }))
  }

  const selectedTypeTitle = t(`contactPage.helpSelector.types.${selectedHelpType}.title`)

  return (
    <div
      className="flex h-full w-full flex-col rounded-[2rem] border border-purple-100 bg-white/95 p-6 shadow-[0_30px_100px_rgba(168,85,247,0.18)] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 lg:p-8"
      data-aos="fade-right"
    >
      <h3 className="text-[clamp(20px,2.5vw,26px)] font-extrabold text-[#25003f]">
        {t('contactPage.form.title')}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-purple-600/80">
        {t('contactPage.form.subtitle')}
      </p>

      <div className="mt-4 inline-flex rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-fuchsia-50 px-4 py-2 text-xs font-semibold text-purple-800 shadow-[0_8px_24px_rgba(168,85,247,0.12)] sm:text-sm">
        {t('contactPage.form.selectedType', { type: selectedTypeTitle })}
      </div>

      <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
        <FormField id="fullName" label={t('contactPage.form.fields.fullName.label')}>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder={t('contactPage.form.fields.fullName.placeholder')}
            className={FORM_INPUT_CLASS}
          />
        </FormField>

        <FormField id="email" label={t('contactPage.form.fields.email.label')}>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder={t('contactPage.form.fields.email.placeholder')}
            dir="ltr"
            className={FORM_INPUT_CLASS}
          />
        </FormField>

        <FormField id="phone" label={t('contactPage.form.fields.phone.label')}>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder={t('contactPage.form.fields.phone.placeholder')}
            dir="ltr"
            className={FORM_INPUT_CLASS}
          />
        </FormField>

        <FormField id="messageType" label={t('contactPage.form.fields.messageType.label')}>
          <select
            id="messageType"
            value={selectedHelpType}
            onChange={(e) => handleTypeChange(e.target.value as HelpTypeValue)}
            className={FORM_INPUT_CLASS}
          >
            {helpTypes.map((help) => (
              <option key={help.id} value={help.id}>
                {t(`contactPage.form.messageTypes.${help.id}`)}
              </option>
            ))}
          </select>
        </FormField>

        {isOrderType && (
          <>
            <FormField id="orderNumber" label={t('contactPage.form.fields.orderNumber.label')}>
              <input
                id="orderNumber"
                type="text"
                value={formData.orderNumber}
                onChange={(e) => updateField('orderNumber', e.target.value)}
                placeholder={t('contactPage.form.fields.orderNumber.placeholder')}
                dir="ltr"
                className={`${FORM_INPUT_CLASS} border-fuchsia-200 focus:border-fuchsia-500 focus:ring-fuchsia-500`}
              />
            </FormField>
            <div className="flex items-end">
              <p className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-fuchsia-50/80 px-4 py-3 text-xs leading-relaxed text-purple-700">
                {t('contactPage.form.orderNote')}
              </p>
            </div>
          </>
        )}

        <FormField
          id="message"
          label={t('contactPage.form.fields.message.label')}
          className="md:col-span-2"
        >
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder={t('contactPage.form.fields.message.placeholder')}
            className={FORM_TEXTAREA_CLASS}
          />
        </FormField>

        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:col-span-2">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 md:col-span-2">
            {t('contactPage.form.success')}
          </p>
        )}

        <button
          type="submit"
          className="group relative h-14 w-full overflow-hidden rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 text-sm font-bold text-white shadow-[0_12px_40px_rgba(168,85,247,0.35)] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(217,70,239,0.40)] md:col-span-2"
        >
          <span className="relative z-[1]">{t('contactPage.form.submit')}</span>
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  )
}

function FormAndPanelSection({
  selectedHelpType,
  formData,
  onHelpTypeChange,
  onFormDataChange,
}: {
  selectedHelpType: HelpTypeValue
  formData: ContactFormState
  onHelpTypeChange: (type: HelpTypeValue) => void
  onFormDataChange: Dispatch<SetStateAction<ContactFormState>>
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#faf7ff] to-[#f5f0ff] py-12 max-md:py-10">
      <div
        className="pointer-events-none absolute -end-32 top-20 h-96 w-96 rounded-full bg-purple-300/12 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -start-24 bottom-10 h-80 w-80 rounded-full bg-fuchsia-300/10 blur-3xl"
        aria-hidden="true"
      />

      <div className={`${PAGE_PADDING} relative`}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-7">
          <div className="lg:col-span-7">
            <ContactForm
              selectedHelpType={selectedHelpType}
              formData={formData}
              onHelpTypeChange={onHelpTypeChange}
              onFormDataChange={onFormDataChange}
            />
          </div>
          <div className="lg:col-span-5">
            <SupportPanel />
          </div>
        </div>
      </div>
    </section>
  )
}

function SupportJourneyTimeline() {
  const { t } = useTranslation()
  const { ref, isInView } = useInView(0.3)

  return (
    <section className="relative overflow-hidden bg-white py-20 max-md:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(168,85,247,0.06),transparent_55%)]"
        aria-hidden="true"
      />

      <div className={`${PAGE_PADDING} relative`}>
        <h2
          className="mb-14 text-center text-[clamp(24px,3.5vw,36px)] font-extrabold text-[#25003f]"
          data-aos="fade-up"
        >
          {t('contactPage.journey.title')}
        </h2>

        <div ref={ref} className="mx-auto max-w-5xl">
          <div className="relative hidden lg:block">
            <div className="absolute start-[12%] end-[12%] top-6 h-1 overflow-hidden rounded-full bg-purple-100">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-600 transition-all duration-1000 ease-out ${
                  isInView ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <div className="relative grid grid-cols-4 gap-4">
              {JOURNEY_STEP_KEYS.map((stepKey, index) => (
                <div key={stepKey} className="flex flex-col items-center text-center">
                  <div
                    className={`relative z-[1] flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-black transition-all duration-700 ease-out ${
                      isInView
                        ? 'border-fuchsia-400 bg-gradient-to-br from-purple-700 to-fuchsia-500 text-white shadow-[0_0_24px_rgba(168,85,247,0.45)]'
                        : 'border-purple-200 bg-white text-purple-400'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="mt-5 max-w-[9rem] text-sm font-semibold leading-snug text-[#25003f]">
                    {t(`contactPage.journey.steps.${stepKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:hidden">
            <div className="absolute start-6 top-4 bottom-4 w-1 overflow-hidden rounded-full bg-purple-100">
              <div
                className={`w-full rounded-full bg-gradient-to-b from-purple-700 via-fuchsia-500 to-purple-600 transition-all duration-1000 ease-out ${
                  isInView ? 'h-full' : 'h-0'
                }`}
              />
            </div>
            <div className="space-y-8 ps-16">
              {JOURNEY_STEP_KEYS.map((stepKey, index) => (
                <div key={stepKey} className="relative">
                  <div
                    className={`absolute -start-16 top-0 flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-black transition-all duration-700 ease-out ${
                      isInView
                        ? 'border-fuchsia-400 bg-gradient-to-br from-purple-700 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                        : 'border-purple-200 bg-white text-purple-400'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="pt-3 text-sm font-semibold text-[#25003f]">
                    {t(`contactPage.journey.steps.${stepKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PremiumFaq() {
  const { t } = useTranslation()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((current) => (current === index ? null : index))
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f0ff] via-[#faf7ff] to-white py-20 max-md:py-14">
      <div className={`${PAGE_PADDING} relative`}>
        <div className="mx-auto max-w-3xl" data-aos="fade-up">
          <h2 className="mb-10 text-center text-[clamp(24px,3.5vw,36px)] font-extrabold text-[#25003f]">
            {t('contactPage.faq.title')}
          </h2>

          <div className="space-y-4">
            {FAQ_IDS.map((faqId, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={faqId}
                  className={`overflow-hidden rounded-2xl border bg-white/90 shadow-[0_12px_40px_rgba(168,85,247,0.08)] backdrop-blur-xl transition-all duration-500 ease-out ${
                    isOpen
                      ? 'border-purple-200 shadow-[0_20px_60px_rgba(168,85,247,0.18)]'
                      : 'border-purple-100 hover:shadow-[0_16px_48px_rgba(168,85,247,0.14)]'
                  }`}
                >
                  {isOpen && (
                    <div
                      className="h-1 bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-600"
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start transition-colors duration-300 hover:bg-purple-50/40"
                  >
                    <span className="text-[15px] font-bold text-[#25003f] max-md:text-sm">
                      {t(`contactPage.faq.items.${faqId}.question`)}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                        isOpen
                          ? 'rotate-180 bg-gradient-to-br from-purple-700 to-fuchsia-500 text-white'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDownIcon />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-purple-600/85">
                        {t(`contactPage.faq.items.${faqId}.answer`)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Contact({ currentPage, onNavigate }: PageProps) {
  const [selectedHelpType, setSelectedHelpType] = useState<HelpTypeValue>('product')
  const [formData, setFormData] = useState<ContactFormState>(INITIAL_FORM)

  const handleHelpTypeSelect = (type: HelpTypeValue) => {
    setSelectedHelpType(type)
    setFormData((prev) => ({ ...prev, type }))
  }

  return (
    <div className="flex min-h-svh flex-col">
      <ContactHero currentPage={currentPage} onNavigate={onNavigate} />
      <HelpTypeSelector
        selectedHelpType={selectedHelpType}
        onSelect={handleHelpTypeSelect}
      />
      <FormAndPanelSection
        selectedHelpType={selectedHelpType}
        formData={formData}
        onHelpTypeChange={handleHelpTypeSelect}
        onFormDataChange={setFormData}
      />
      <SupportJourneyTimeline />
      <PremiumFaq />
      <Footer />
    </div>
  )
}
