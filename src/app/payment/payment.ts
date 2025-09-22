import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var OmiseCard: any;

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment {
constructor(private http: HttpClient) {}

  ngOnInit() {
    OmiseCard.configure({
      publicKey: 'pkey_test_654s0yk6qz8abr0hrvb', // Public Key (Test)
      currency: 'thb',
      frameLabel: 'My Shop',
      submitLabel: 'Pay now',
    });
  }

  pay(amount: number) {
    OmiseCard.open({
      amount: amount * 100, // แปลงเป็นสตางค์
      onCreateTokenSuccess: (token: any) => {
        console.log('Token:', token);

        // ส่ง token ไป backend
        this.http.post('http://localhost:3000/Payment/charge', {
          token: token,
          amount: amount,
          orderId : '123'
        }).subscribe({
          next: (res) => console.log('Payment result:', res),
          error: (err) => console.error('Payment error:', err)
        });
      },
      onFormClosed: () => {
        console.log('Form closed');
      },
    });
  }
}
