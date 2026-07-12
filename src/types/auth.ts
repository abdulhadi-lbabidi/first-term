export interface User {
  id: number
  fullName: string
  email: string
  phone: string
  password: string
  avatar?: string
  createdAt?: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  phone: string
  password: string
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface AuthUser {
  id: number
  fullName: string
  email: string
  phone: string
  avatar?: string
  createdAt?: string
}
