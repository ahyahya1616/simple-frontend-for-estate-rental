import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetamaskService } from '../../services/metamask.service';
import { AuthService } from '../../services/auth.service';
import { StorageUtils } from '../../shared/utils/storage.utils';
import { RegisterComponent } from '../register/register.component';
import { UserInfoComponent } from '../user/user-info/user-info.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RegisterComponent, UserInfoComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  wallet: string | null = null;
  showUserInfo: boolean = false;
  showRegisterForm: boolean = false;

  constructor(
    private metamaskService: MetamaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    if (this.authService.isAuthenticated()) {
      this.wallet = StorageUtils.getWallet();
      this.showUserInfo = true;
    }
  }

  async connectWallet(): Promise<void> {
    try {
      this.wallet = await this.metamaskService.connectWallet();
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet');
    }
  }

  async login(): Promise<void> {
    if (!this.wallet) return;

    try {
      // 1. Récupérer le nonce depuis le backend
      const nonceResponse = await this.authService.getNonce(this.wallet);
      const nonce = typeof nonceResponse === 'string' ? nonceResponse : nonceResponse; // Au cas où

      console.log('🔹 Wallet:', this.wallet);
      console.log('🔹 Nonce récupéré:', nonce);

      // 2. Construire le message à signer
      const prefix = "Sign this message to authenticate: ";
      const messageToSign = prefix + nonce;
      console.log('🔹 Message à signer:', messageToSign);

      // 3. Signer le message avec MetaMask
      const signature = await this.metamaskService.signMessage(this.wallet, messageToSign);
      console.log('🔹 Signature obtenue:', signature);

      // 4. Envoyer le wallet + signature au backend
      const tokens = await this.authService.login(this.wallet, signature);
      console.log('✅ Tokens reçus:', tokens);

      this.showUserInfo = true;
      this.showRegisterForm = false;

    } catch (error: any) {
      console.error('❌ Erreur lors du login:', error);
      this.handleLoginError(error);
    }
  }

  private handleLoginError(error: any): void {
    if (error.response?.data?.error === 'USER_NOT_FOUND' || error.response?.status === 404) {
      this.showRegisterForm = true;
    } else {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  }

  async onRegisterSuccess(): Promise<void> {
    this.showRegisterForm = false;
    await this.login();
  }

  onRegisterCancel(): void {
    this.showRegisterForm = false;
  }
}


