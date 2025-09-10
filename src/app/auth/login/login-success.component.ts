import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-success',
  standalone: true,
  template: `<div class="alert alert-success">Login Success 🎉</div>`,
})
export class LoginSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        const user = JSON.parse(decodeURIComponent(params['user']));
        console.log('User from Google:', user);

        // 👉 เก็บ user ลง localStorage/session
        localStorage.setItem('user', JSON.stringify(user));
      }
    });
  }
}
