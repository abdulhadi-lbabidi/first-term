import type { AuthUser, LoginPayload, RegisterPayload, User } from '../types/auth'
import { API_URL, parseJsonResponse } from './http'

function toAuthUser(user: User): AuthUser {
  const { password: _password, ...authUser } = user
  return authUser
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`)
  return parseJsonResponse<User[]>(response, 'تعذر تحميل المستخدمين')
}

export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
  const users = await getUsers()
  const email = payload.email.trim().toLowerCase()
  const phone = payload.phone.trim()

  if (users.some((user) => user.email.trim().toLowerCase() === email)) {
    throw new Error('هذا البريد الإلكتروني مستخدم مسبقاً')
  }

  if (users.some((user) => user.phone.trim() === phone)) {
    throw new Error('رقم الهاتف مستخدم مسبقاً')
  }

  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: payload.fullName.trim(),
      email,
      phone,
      password: payload.password,
      avatar: '',
      createdAt: new Date().toISOString(),
    }),
  })

  const user = await parseJsonResponse<User>(response, 'تعذر إنشاء الحساب')
  return toAuthUser(user)
}

export async function loginUser(payload: LoginPayload): Promise<AuthUser> {
  const users = await getUsers()
  const identifier = payload.identifier.trim()
  const identifierLower = identifier.toLowerCase()

  const user = users.find(
    (item) =>
      item.email.trim().toLowerCase() === identifierLower || item.phone.trim() === identifier,
  )

  if (!user || user.password !== payload.password) {
    throw new Error('بيانات تسجيل الدخول غير صحيحة')
  }

  return toAuthUser(user)
}

export async function updateUserProfile(
  userId: number,
  payload: Partial<AuthUser>,
): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const user = await parseJsonResponse<User>(response, 'تعذر تحديث الملف الشخصي')
  return toAuthUser(user)
}
