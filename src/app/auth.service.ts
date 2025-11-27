// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL de Gateway
  private gatewayUrl = 'http://localhost:8080';

  /**
   * 1️⃣ Récupère le nonce via Gateway
   *
   * GET /api/auth/metamask/nonce?wallet=...
   */
  async getNonce(wallet: string): Promise<string> {
    const res = await axios.get(
      `${this.gatewayUrl}/api/auth/metamask/nonce?wallet=${wallet}`,
      { withCredentials: true }
    );
    return res.data.nonce;
  }

  /**
   * 2️⃣ Login MetaMask via Gateway
   *
   * POST /api/auth/metamask/login
   * Body: { wallet, signature }
   */
  async loginWithMetamask(wallet: string, signature: string): Promise<any> {
    try {
      const res = await axios.post(
        `${this.gatewayUrl}/api/auth/metamask/login`,
        { wallet, signature },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      return res.data;

    } catch (error) {
      console.error('Erreur lors de la connexion MetaMask:', error);
      throw error;
    }
  }

  /**
   * 3️⃣ Refresh token via Gateway
   *
   * POST /api/auth/metamask/refresh?refreshToken=...
   */
  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const res = await axios.post(
        `${this.gatewayUrl}/api/auth/metamask/refresh?refreshToken=${refreshToken}`,
        {},
        { withCredentials: true }
      );

      return res.data;

    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }

  /**
   * 4️⃣ Déconnexion locale
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
