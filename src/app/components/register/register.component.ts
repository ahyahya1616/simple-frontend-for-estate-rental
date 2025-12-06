import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterUserRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  @Input() wallet: string = '';
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() registerCancel = new EventEmitter<void>();

  registerData: RegisterUserRequest = {
    wallet: '',
    username: '',
    email: '',
    firstName:'',
    lastName:'',
    description: '',
    role: 'ROLE_USER'
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.registerData.wallet = this.wallet;
  }

  async onSubmit(): Promise<void> {
    try {
      await this.authService.register(this.registerData);
      this.registerSuccess.emit();
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }

  onCancel(): void {
    this.registerCancel.emit();
  }
}
