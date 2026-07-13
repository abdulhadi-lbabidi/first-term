export interface ParsedAddress {
  city: string
  address: string
  displayName: string
}

export interface GeoCoordinates {
  lat: number
  lng: number
}

export interface LocationSelection extends ParsedAddress, GeoCoordinates {}
