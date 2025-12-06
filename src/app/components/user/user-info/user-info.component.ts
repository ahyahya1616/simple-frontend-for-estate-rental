import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { StorageUtils } from '../../../shared/utils/storage.utils';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {
  user: User | null = null;
  isLoading: boolean = false;

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    await this.loadUserInfo();
  }

  private async loadUserInfo(): Promise<void> {
    const wallet = StorageUtils.getWallet();
    if (!wallet) return;

    this.isLoading = true;
    try {
      this.user = await this.userService.getUserByWallet(wallet);
    } catch (error) {
      console.error('Failed to load user info:', error);
      alert('Failed to load user information');
    } finally {
      this.isLoading = false;
    }
  }

  async updateUser(): Promise<void> {
    if (!this.user || !this.user.id) return;

    this.isLoading = true;
    try {
      await this.userService.updateUser(this.user.id, this.user);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    } finally {
      this.isLoading = false;
    }
  }
}
