import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // ✅ Importer CommonModule
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ✅ Ajouter CommonModule
  template: `
    <div *ngIf="user">
      <h2>User Info</h2>
      <p>Wallet: {{ user.wallet }}</p>
      <label>Username: <input [(ngModel)]="user.username"/></label>
      <label>Email: <input [(ngModel)]="user.email"/></label>
      <button (click)="updateUser()">Save</button>
    </div>
  `
})
export class UserInfoComponent implements OnInit {
  user: any;

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    const wallet = localStorage.getItem('wallet');
    if (!wallet) return;

    const res = await this.auth.axiosInstance.get(`/api/users/wallet/${wallet}`);
    this.user = res.data;
  }

  async updateUser() {
    if (!this.user) return;
    await this.auth.axiosInstance.put(`/api/users/${this.user.id}`, this.user);
    alert('User updated successfully!');
  }
}
