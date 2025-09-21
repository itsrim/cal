// Petit wrapper async-like autour de localStorage pour mimer AsyncStorage
export const storage = {
  async getItem(key: string): Promise<string | null> {
    try { return localStorage.getItem(key) } catch { return null }
  },
  async setItem(key: string, value: string): Promise<void> {
    try { localStorage.setItem(key, value) } catch {}
  },
  async removeItem(key: string): Promise<void> {
    try { localStorage.removeItem(key) } catch {}
  }
}
