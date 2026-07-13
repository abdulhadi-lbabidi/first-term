import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { CloseIcon, MapPinIcon } from '../../common/icons/Icons'
import {
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsOpenUrl,
  reverseGeocode,
  searchLocations,
} from '../../../services/locationApi'
import type { LocationSelection } from '../../../types/location'

interface LocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selection: LocationSelection) => void
}

const DEFAULT_COORDS = { lat: 33.5138, lng: 36.2765 }

const inputClass =
  'w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm text-[#1e1033] outline-none transition-colors duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20'

export default function LocationPickerModal({
  isOpen,
  onClose,
  onConfirm,
}: LocationPickerModalProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<LocationSelection[]>([])
  const [selected, setSelected] = useState<LocationSelection | null>(null)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')

  const mapCoords = selected ?? DEFAULT_COORDS
  const mapUrl = useMemo(() => buildGoogleMapsEmbedUrl(mapCoords), [mapCoords])

  useEffect(() => {
    if (!isOpen) return

    setSearchQuery('')
    setResults([])
    setSelected(null)
    setError('')
    setLoading(false)
    setLocating(false)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const query = searchQuery.trim()
    if (query.length < 3) {
      setResults([])
      return
    }

    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      searchLocations(query)
        .then((items) => setResults(items))
        .catch(() => setError(t('checkoutPage.location.searchError')))
        .finally(() => setLoading(false))
    }, 450)

    return () => window.clearTimeout(timer)
  }, [isOpen, searchQuery, t])

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t('checkoutPage.location.geolocationUnsupported'))
      return
    }

    setLocating(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        reverseGeocode(coords)
          .then((location) => {
            setSelected(location)
            setSearchQuery(location.displayName)
            setResults([])
          })
          .catch(() => setError(t('checkoutPage.location.reverseError')))
          .finally(() => setLocating(false))
      },
      () => {
        setLocating(false)
        setError(t('checkoutPage.location.geolocationDenied'))
      },
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  const handleConfirm = () => {
    if (!selected) {
      setError(t('checkoutPage.location.selectRequired'))
      return
    }
    onConfirm(selected)
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('checkoutPage.location.close')}
        onClick={onClose}
        className="absolute inset-0 bg-[#1e1033]/55 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-picker-title"
        className="relative z-[1] flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-purple-100 bg-white shadow-[0_30px_90px_rgba(124,58,237,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-purple-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md">
              <MapPinIcon />
            </span>
            <div>
              <h2 id="location-picker-title" className="text-lg font-extrabold text-[#1e1033]">
                {t('checkoutPage.location.title')}
              </h2>
              <p className="text-xs font-medium text-[#7c6b92]">
                {t('checkoutPage.location.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#7c6b92] transition-colors hover:bg-purple-50 hover:text-purple-700"
            aria-label={t('checkoutPage.location.close')}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          <div>
            <label htmlFor="location-search" className="mb-1.5 block text-sm font-semibold text-[#1e1033]">
              {t('checkoutPage.location.searchLabel')}
            </label>
            <input
              id="location-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('checkoutPage.location.searchPlaceholder')}
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-purple-50/70 px-4 py-3 text-sm font-bold text-purple-700 transition-colors hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <MapPinIcon />
            {locating
              ? t('checkoutPage.location.locating')
              : t('checkoutPage.location.useCurrent')}
          </button>

          {(loading || results.length > 0) && (
            <div className="max-h-44 overflow-y-auto rounded-2xl border border-purple-100 bg-purple-50/30">
              {loading && (
                <p className="px-4 py-3 text-sm font-medium text-[#7c6b92]">
                  {t('checkoutPage.location.searching')}
                </p>
              )}
              {results.map((item) => (
                <button
                  key={`${item.lat}-${item.lng}-${item.displayName}`}
                  type="button"
                  onClick={() => {
                    setSelected(item)
                    setSearchQuery(item.displayName)
                    setResults([])
                    setError('')
                  }}
                  className="block w-full border-b border-purple-100/80 px-4 py-3 text-start text-sm text-[#1e1033] transition-colors last:border-b-0 hover:bg-white"
                >
                  <span className="font-semibold">{item.address || item.displayName}</span>
                  {item.city && (
                    <span className="mt-0.5 block text-xs text-[#7c6b92]">{item.city}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-purple-100">
            <iframe
              title={t('checkoutPage.location.mapTitle')}
              src={mapUrl}
              className="h-56 w-full sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {selected && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm">
              <p className="font-bold text-emerald-800">{t('checkoutPage.location.selected')}</p>
              <p className="mt-1 text-emerald-900">{selected.address}</p>
              {selected.city && <p className="mt-0.5 text-emerald-800/80">{selected.city}</p>}
              <a
                href={buildGoogleMapsOpenUrl(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-semibold text-purple-700 underline-offset-2 hover:underline"
              >
                {t('checkoutPage.location.openInGoogle')}
              </a>
            </div>
          )}

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 border-t border-purple-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-purple-200 px-4 py-3 text-sm font-bold text-purple-700 transition-colors hover:bg-purple-50"
          >
            {t('checkoutPage.location.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(168,85,247,0.35)] transition-transform hover:scale-[1.02]"
          >
            {t('checkoutPage.location.confirm')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
