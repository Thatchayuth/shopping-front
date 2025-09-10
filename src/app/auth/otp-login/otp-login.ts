import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { AuthService } from '../../services/auth';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config';


initializeApp(firebaseConfig);

@Component({
  selector: 'app-otp-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-login.html',
  styleUrl: './otp-login.scss'
})
export class OtpLogin {
  phone = '';
  otp = '';
  confirmationResult: any;

  constructor(private Auth: AuthService) { }

  sendOtp() {
    
    const auth = getAuth();
    auth.languageCode = 'th';

    let phoneNumber = this.phone.trim();
    if (!phoneNumber.startsWith('+')) {
      // สมมติ user กรอก 0812345678 → แปลงเป็น +66812345678
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '+66' + phoneNumber.slice(1);
      } else {
        phoneNumber = '+66' + phoneNumber; // fallback
      }
    }

    const container = document.getElementById('recaptcha-container')!;
    const verifier = new RecaptchaVerifier(auth, container);

    signInWithPhoneNumber(auth, phoneNumber , verifier)
      .then((confirmationResult) => {
        
        this.confirmationResult = confirmationResult;
        console.log('OTP sent');
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
      });

  }

  async verifyOtp() {
    try {
      const result = await this.confirmationResult.confirm(this.otp);
      const idToken = await result.user.getIdToken();

      // ส่งไป backend NestJS
      this.Auth.loginfirebase(idToken)
        .subscribe({
          next: (res) => console.log('Backend verify result:', res),
          error: (err) => console.error(err)
        });

    } catch (err) {
      console.error('OTP verification failed', err);
    }
  }
}
