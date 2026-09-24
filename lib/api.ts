export function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error((data as { error?: string } | null)?.error || `Permintaan gagal (${res.status})`);
    (error as Error & { status: number }).status = res.status;
    throw error;
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
};

export type RequestError = Error & { status?: number };