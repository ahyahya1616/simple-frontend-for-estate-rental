import { Injectable } from '@angular/core';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    return accounts[0];
  }

  async signMessage(wallet: string, message: string): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }


    return await window.ethereum.request({
      method: 'personal_sign',
      params: [message, wallet]
    });
  }

  isMetamaskAvailable(): boolean {
    return !!window.ethereum;
  }
}
