import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export  interface User {
  email: string;
  password: string;
  Username: string;
  LastName: string;
  Address: string;
  Phone: string;
}
@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;

  passwordValidation = {
    upper: false,
    lower: false,
    number: false,
    special: false,
    length: false
  };

  UsersRegistered : User = {
    email: '',
    password: '',
    Username: '',
    LastName: '',
    Address: '',
    Phone: ''
  };



  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const Socialuser: any = localStorage.getItem('user');
    if (Socialuser) {
      this.UsersRegistered.email = JSON.parse(Socialuser).email;
      this.UsersRegistered.Username = JSON.parse(Socialuser).UserName;
      this.UsersRegistered.LastName = JSON.parse(Socialuser).LastName;
    } 
    
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

    this.checkPassword();
    if (Object.values(this.passwordValidation).includes(false)) {
      alert('Password does not meet the criteria');
      return;
    }

    console.log(this.UsersRegistered);

    // this.authService.register(this.email, this.password).subscribe({
    //   next: () => {
    //     alert('Register success! Please login.');
    //     this.router.navigate(['/login']);
    //   },
    //   error: (err) => alert(err.error.message || 'Register failed'),
    // });
  }

   checkPassword() {
    const pwd = this.password;
    this.passwordValidation.upper = /[A-Z]/.test(pwd);
    this.passwordValidation.lower = /[a-z]/.test(pwd);
    this.passwordValidation.number = /[0-9]/.test(pwd);
    this.passwordValidation.special = /[!@#$%^&*]/.test(pwd);
    this.passwordValidation.length = pwd.length >= 6;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;

  }
}
