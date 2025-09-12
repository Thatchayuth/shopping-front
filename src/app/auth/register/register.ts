import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocialUser } from '@abacritt/angularx-social-login';

export interface User {
  email: string;
  password: string;
  Username: string;
  LastName: string;
  Address: string;
  Phone: string;
  Social: boolean;
  id: number;
}
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
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

  UsersRegistered: User = {
    email: '',
    password: '',
    Username: '',
    LastName: '',
    Address: '',
    Phone: '',
    Social: false,
    id: 0
  };



  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const Socialuser: any = localStorage.getItem('user');
    if (Socialuser) {
      this.UsersRegistered.email = JSON.parse(Socialuser).email;
      this.UsersRegistered.Username = JSON.parse(Socialuser).UserName;
      this.UsersRegistered.LastName = JSON.parse(Socialuser).LastName;
      this.UsersRegistered.Social = true;
      this.UsersRegistered.id = JSON.parse(Socialuser).id;
    }

  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  register() {
    if (!this.validateEmail(this.UsersRegistered.email)) {
      alert('Invalid email format');
      return;
    }

    this.checkPassword();
    if (Object.values(this.passwordValidation).includes(false)) {
      alert('Password does not meet the criteria');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log(this.UsersRegistered);

    this.UsersRegistered.password = this.password;


    this.authService.register(this.UsersRegistered).subscribe({
      next: () => {
        alert('Register success! Please login.');
        // this.router.navigate(['/login']);
      },
      error: (err) => alert(err.error.message || 'Register failed'),
    });
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

items: string[] = ['Apple', 'Banana', 'Cherry', 'Durian', 'Grape', 'Mango'];
  filteredItems: string[] = [];
  searchText: string = '';
  activeIndex: number = -1;

  onSearch() {
    const term = this.searchText.toLowerCase();
    this.filteredItems = this.items.filter(item => item.toLowerCase().includes(term));
    this.activeIndex = -1;
  }

  selectItem(item: string) {
    this.searchText = item;
    this.filteredItems = [];
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.filteredItems.length) return;

    if (event.key === 'ArrowDown') {
      this.activeIndex = (this.activeIndex + 1) % this.filteredItems.length;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.activeIndex = (this.activeIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (this.activeIndex >= 0) {
        this.selectItem(this.filteredItems[this.activeIndex]);
      }
      event.preventDefault();
    }
  }

  closeDropdown() {
    setTimeout(() => { this.filteredItems = []; }, 150); // delay เพื่อให้ click ยังทำงาน
  }
}
