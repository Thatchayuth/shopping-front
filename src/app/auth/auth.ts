import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [CommonModule,FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
  email = '';
  password = '';
  token: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
        
  }

  validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

  register() {
    if (!this.validateEmail(this.email)) {
      alert('Invalid email format');
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        alert('Register success');
      },
      error: (err) => {
        console.error(err);
         alert(err.error.message || 'Register failed');
      },
    });
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.token = res.token;
        localStorage.setItem('authToken', res.token);
        alert('Login success!');
      },
      error: (err) => {
        console.error(err);
        alert('Login failed');
      },
    });
  }
}
