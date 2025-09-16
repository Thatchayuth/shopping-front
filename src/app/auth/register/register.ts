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

export interface Address {
  address_detail: string;
  sub_district: number;
  district: number;
  province: number;
  postal_code: string;
  phone: string;
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
  passwordStrength: number = 0;
passwordStrengthText: string = 'Weak';

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

  Address: Address = {
    address_detail: '',
    sub_district: 0,
    district: 0,
    province: 0,
    postal_code: '',
    phone: ''
  };

  provinces: any;
  Districts: any;
  Subdistricts: any;


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

    this.GetProvince();
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


    this.authService.register(this.UsersRegistered,this.Address).subscribe({
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

    let score = 0;
  Object.values(this.passwordValidation).forEach(valid => {
    if (valid) score += 20;
  });

  this.passwordStrength = score;

  if (score < 40) {
    this.passwordStrengthText = 'Weak';
  } else if (score < 80) {
    this.passwordStrengthText = 'Medium';
  } else {
    this.passwordStrengthText = 'Strong';
  }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;

  }


  GetProvince() {
    this.authService.getProvince().subscribe((data: any) => {
      console.log(data);
      this.provinces = data;

    });
  }

  GetDistrict(event) {
    const provinceId = event.target.value;
    this.Address.province = provinceId;
    this.authService.getDistrict(provinceId).subscribe((data: any) => {
      console.log(data);
      this.Districts = data;
    });
  }

  GetSubdistrict(event) {
    const districtId = event.target.value;
    this.Address.district = districtId;
    console.log(districtId);
    this.authService.getsubDistrict(districtId).subscribe((data: any) => {
      console.log(data);
      this.Subdistricts = data;
    });
  }

  GetZipCode(event) {
    const subDistrictId = event.target.value;
    this.Address.sub_district = subDistrictId;
    const selectedSubDistrict = this.Subdistricts.find((sub: any) => sub.id == subDistrictId);
    this.Address.postal_code = selectedSubDistrict ? selectedSubDistrict.ZipCode : '';
    console.log(selectedSubDistrict);

  }
}
