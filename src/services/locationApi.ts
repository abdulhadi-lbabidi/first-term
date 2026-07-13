import type { GeoCoordinates, LocationSelection, ParsedAddress } from '../types/location'

interface NominatimAddress {
  city?: string
  town?: string
  village?: string
  municipality?: string
  state?: string
  state_district?: string
  suburb?: string
  neighbourhood?: string
  road?: string
  house_number?: string
  building?: string
}

interface NominatimResult {
  lat: string
  lon: string
  display_name: string
  address?: NominatimAddress
}

function parseNominatimResult(result: NominatimResult): LocationSelection {
  const address = result.address ?? {}
  const city =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.state_district ??
    address.state ??
    ''

  const streetParts = [
    address.road,
    address.house_number,
    address.building,
    address.suburb,
    address.neighbourhood,
  ].filter(Boolean)

  const formattedAddress =
    streetParts.length > 0
      ? streetParts.join('، ')
      : result.display_name.split(',').slice(0, 2).join('، ').trim()

  return {
    lat: Number(result.lat),
    lng: Number(result.lon),
    city,
    address: formattedAddress,
    displayName: result.display_name,
  }
}

export async function searchLocations(query: string): Promise<LocationSelection[]> {
  const trimmed = query.trim()
  if (trimmed.length < 3) return []

  const params = new URLSearchParams({
    q: trimmed,
    format: 'json',
    addressdetails: '1',
    limit: '6',
    'accept-language': 'ar,en',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    { headers: { Accept: 'application/json' } },
  )

  if (!response.ok) {
    throw new Error('تعذر البحث عن الموقع')
  }

  const results = (await response.json()) as NominatimResult[]
  return results.map(parseNominatimResult)
}

export async function reverseGeocode(coords: GeoCoordinates): Promise<LocationSelection> {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lng),
    format: 'json',
    addressdetails: '1',
    'accept-language': 'ar,en',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    { headers: { Accept: 'application/json' } },
  )

  if (!response.ok) {
    throw new Error('تعذر تحديد العنوان من الموقع')
  }

  const result = (await response.json()) as NominatimResult
  return parseNominatimResult(result)
}

export function buildGoogleMapsEmbedUrl(coords: GeoCoordinates, zoom = 16): string {
  return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&hl=ar&z=${zoom}&output=embed`
}

export function buildGoogleMapsOpenUrl(coords: GeoCoordinates): string {
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
}

export function toParsedAddress(selection: LocationSelection): ParsedAddress {
  return {
    city: selection.city,
    address: selection.address,
    displayName: selection.displayName,
  }
}
