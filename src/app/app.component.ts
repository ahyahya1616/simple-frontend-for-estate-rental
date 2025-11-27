import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetamaskService } from './metamask.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 40px; max-width: 500px; margin: auto;">
      <h2>Login MetaMask → Spring Authorization Server</h2>

      <button (click)="connectWallet()">Connect Wallet</button>
      <p *ngIf="wallet">Wallet: {{ wallet }}</p>

      <button *ngIf="wallet" (click)="loginMetamask()">
        Login via MetaMask
      </button>

      <div *ngIf="tokens">
        <h3>Tokens</h3>
        <p>Access Token:</p>
        <textarea rows="4" cols="50">{{ tokens.access_token }}</textarea>

        <p>Refresh Token:</p>
        <textarea rows="3" cols="50">{{ tokens.refresh_token }}</textarea>
      </div>
    </div>
  `
})
export class AppComponent {

  wallet: string | null = null;
  tokens: any = null;

  constructor(
    private metamask: MetamaskService,
    private auth: AuthService
  ) {}

  async connectWallet() {
    this.wallet = await this.metamask.connectWallet();
  }
  async loginMetamask() {
    if (!this.wallet) return;

    // Step 1: Get nonce depuis le backend
    const nonce = await this.auth.getNonce(this.wallet);

    // Step 2: Préfixer le message comme attendu par le backend
    const prefix = "Sign this message to authenticate: "; // doit correspondre à app.metamask.signature-message-prefix
    const messageToSign = prefix + nonce;

    // Step 3: Signer le message complet avec MetaMask
    const signature = await this.metamask.signMessage(this.wallet, messageToSign);

    // Step 4: Envoyer la requête OAuth2 avec le wallet et la signature
    this.tokens = await this.auth.loginWithMetamask(this.wallet, signature);
  }

}
