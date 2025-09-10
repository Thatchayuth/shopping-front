import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { OtpLogin } from './auth/otp-login/otp-login';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register},
    { path: 'otpfirebase', component: OtpLogin}
];
