import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
 email = '';
  password = '';
  token: string | null = null;
  showPassword;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.token = res.token;
        localStorage.setItem('authToken', res.token);
        alert('Login success!');
        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert(err.error.message || 'Login failed'),
    });
  }
}
