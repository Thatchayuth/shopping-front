import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  token: string | null = null;
  showPassword;
  user: any;

  constructor(private authService: AuthService, private router: Router) {
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
    const popup = window.open(
      'http://localhost:3000/auth/google',
      'Login with Google',
      'width=500,height=600'
    );

    const timer = setInterval(() => {
      if (popup?.closed) {
        debugger
        clearInterval(timer);
        const user: any = localStorage.getItem('user');
        if (user) {
          console.log('Logged in user:', JSON.parse(user));
          const parsedUser = JSON.parse(user);
          if (parsedUser.address.address_detail)
            this.router.navigate(['/dashboard']);
          else
            this.router.navigate(['/register'], { queryParams: { user: encodeURIComponent(user) } });

        }
      }
    }, 500);
  }

  loginWithFacebook() {
    const popup = window.open(
      'http://localhost:3000/auth/facebook',
      'facebookLogin',
      'width=500,height=600'
    );

    const timer = setInterval(() => {
      if (popup?.closed) {
        debugger
        clearInterval(timer);
        const user: any = localStorage.getItem('user');
        if (user) {
          console.log('Logged in user:', JSON.parse(user));
          const parsedUser = JSON.parse(user);
          if (parsedUser.address.address_detail)
            this.router.navigate(['/dashboard']);
          else
            this.router.navigate(['/register'], { queryParams: { user: encodeURIComponent(user) } });

        }
      }
    }, 500);
  }

}
