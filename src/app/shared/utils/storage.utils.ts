
export class StorageUtils {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly WALLET_KEY = 'wallet';

  static setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setWallet(wallet: string): void {
    localStorage.setItem(this.WALLET_KEY, wallet);
  }

  static getWallet(): string | null {
    return localStorage.getItem(this.WALLET_KEY);
  }

  static clearAuth(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.WALLET_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getWallet();
  }
}
