import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { API_CONSTANTS } from '../shared/constants/api.constants';
import { StorageUtils } from '../shared/utils/storage.utils';
import { TokenResponse, NonceResponse } from '../models/token.model';
import { RegisterUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: API_CONSTANTS.GATEWAY_URL,
      withCredentials: true,
    });
  }

  private setupInterceptors(): void {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(config => {
      const token = StorageUtils.getAccessToken();
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  private setupResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      res => res,
      async error => {
        if (error.response?.status === 401) {
          return this.handleUnauthorized(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleUnauthorized(error: any): Promise<any> {
    const refreshToken = StorageUtils.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return Promise.reject(error);
    }

    try {
      const newTokens = await this.refreshAccessToken(refreshToken);
      StorageUtils.setAccessToken(newTokens.access_token);
      StorageUtils.setRefreshToken(newTokens.refresh_token);

      if (error.config.headers) {
        error.config.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
      }
      return axios(error.config);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      this.logout();
      return Promise.reject(refreshError);
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await axios.post(
      `${API_CONSTANTS.GATEWAY_URL}${API_CONSTANTS.ENDPOINTS.AUTH.REFRESH}?refreshToken=${refreshToken}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }

  async getNonce(wallet: string): Promise<string> {
    const response = await axios.get<NonceResponse>(
      `${API_CONSTANTS.GATEWAY_URL}${API_CONSTANTS.ENDPOINTS.AUTH.NONCE}?wallet=${wallet}`,
      { withCredentials: true }
    );

    console.log('🔍 Réponse getNonce complète:', response.data);

    // Assurer que nonce est bien une chaîne
    const nonce = response.data.nonce;
    if (!nonce || typeof nonce !== 'string') {
      throw new Error('Nonce invalide reçu depuis le backend');
    }

    console.log('🔹 Nonce final utilisé:', nonce);
    return nonce;
  }

  async login(wallet: string, signature: string): Promise<TokenResponse> {
    const response = await axios.post<TokenResponse>(
      `${API_CONSTANTS.GATEWAY_URL}${API_CONSTANTS.ENDPOINTS.AUTH.LOGIN}`,
      { wallet, signature },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );

    const tokens = response.data;
    StorageUtils.setAccessToken(tokens.access_token);
    StorageUtils.setRefreshToken(tokens.refresh_token);
    StorageUtils.setWallet(wallet);

    return tokens;
  }

  async register(request: RegisterUserRequest): Promise<void> {
    await this.axiosInstance.post(
      API_CONSTANTS.ENDPOINTS.USERS.BASE,
      request,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: false   // ⬅ IMPORTANT
      }
    );
  }

  logout(): void {
    StorageUtils.clearAuth();
  }

  isAuthenticated(): boolean {
    return StorageUtils.isAuthenticated();
  }
}
