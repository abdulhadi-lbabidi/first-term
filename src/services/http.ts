import { API_URL } from '../constants/api'

export { API_URL }

export async function parseJsonResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  if (!response.ok) {
    throw new Error(`${fallbackMessage} (${response.status})`)
  }
  return response.json() as Promise<T>
}

export async function ensureOkResponse(
  response: Response,
  fallbackMessage: string,
): Promise<void> {
  if (!response.ok) {
    throw new Error(`${fallbackMessage} (${response.status})`)
  }
}
