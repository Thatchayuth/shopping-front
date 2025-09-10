import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  loginWithGoogle(googleUser: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/googleLogin`,
      { email: googleUser.email, name: googleUser.name, sub: googleUser.id, picture: googleUser.photoUrl });
  }

  loginfirebase(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otpfirebase`, { token });
  }

  test() {
    return this.http.get('http://localhost:3000/auth');
  }

}
