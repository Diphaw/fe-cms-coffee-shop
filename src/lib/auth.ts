// ─── Auth Token Helpers ───────────────────────────────────────────────────────

const TOKEN_KEY = "cms_token";

export const auth = {
  getToken: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,

  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),

  clearToken: (): void => localStorage.removeItem(TOKEN_KEY),

  isAuthenticated: (): boolean => Boolean(auth.getToken()),
};
