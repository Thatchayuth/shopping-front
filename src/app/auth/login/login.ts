import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';

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
  user: any;

  constructor(private authService: AuthService, private router: Router,private socialAuthService: SocialAuthService) {
     (window as any).handleCredentialResponse = (response: any) => {
      this.decodeJWT(response.credential);
    };
  }

  decodeJWT(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    this.user = JSON.parse(jsonPayload);

    console.log('Google login successful:', this.user);

    // ส่งไป backend เพื่อบันทึกหรือสร้าง session
    // this.http.post('/auth/google', this.user).subscribe(...)
  }

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

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(googleUser => {
    this.authService.loginWithGoogle(googleUser).subscribe(res => {
      localStorage.setItem('authToken', res.token);
      alert('Login success!');
    });
  });
  }

}
