import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loginUser, registerUser, updateUserProfile } from '../services/authApi'
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth'

const STORAGE_KEY = 'trend_current_user'

interface AuthContextValue {
  currentUser: AuthUser | null
  loading: boolean
  error: string | null
  register: (payload: RegisterPayload) => Promise<void>
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
  updateProfile: (payload: Partial<AuthUser>) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function saveStoredUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function removeStoredUser() {
  localStorage.removeItem(STORAGE_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => readStoredUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true)
    setError(null)
    try {
      const user = await registerUser(payload)
      setCurrentUser(user)
      saveStoredUser(user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الحساب'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true)
    setError(null)
    try {
      const user = await loginUser(payload)
      setCurrentUser(user)
      saveStoredUser(user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setError(null)
    removeStoredUser()
  }, [])

  const updateProfile = useCallback(
    async (payload: Partial<AuthUser>) => {
      if (!currentUser) return

      setLoading(true)
      setError(null)
      try {
        const updatedUser = await updateUserProfile(currentUser.id, payload)
        setCurrentUser(updatedUser)
        saveStoredUser(updatedUser)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث المعلومات'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [currentUser],
  )

  useEffect(() => {
    const storedUser = readStoredUser()
    if (storedUser) {
      setCurrentUser(storedUser)
    }
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      error,
      register,
      login,
      logout,
      updateProfile,
      clearError,
    }),
    [currentUser, loading, error, register, login, logout, updateProfile, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
