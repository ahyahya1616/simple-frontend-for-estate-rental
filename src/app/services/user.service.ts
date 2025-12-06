import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { API_CONSTANTS } from '../shared/constants/api.constants';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService) {}

  async getUserByWallet(wallet: string): Promise<User> {
    const response = await this.authService.axiosInstance.get<User>(
      API_CONSTANTS.ENDPOINTS.USERS.BY_WALLET(wallet)
    );
    return response.data;
  }

  async updateUser(userId: number, user: User): Promise<User> {
    const response = await this.authService.axiosInstance.put<User>(
      `${API_CONSTANTS.ENDPOINTS.USERS.BASE}/${userId}`,
      user
    );
    return response.data;
  }
}
