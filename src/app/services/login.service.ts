
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from './../../environments/environment'
const url = environment.serviceUrl

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(data){
    return this.http.post(url+'Account/Login',data)
  }

  // Static counselor login
  counselorLogin(email: string, password: string): Observable<any> {
    // Static credentials check
    if (email === 'counsellor@kncci.org' && password === '123456') {
      // Store login state
      localStorage.setItem('counselorLoggedIn', 'true');
      localStorage.setItem('counselorEmail', email);
      
      return of({
        success: true,
        message: 'Login successful',
        user: {
          email: email,
          role: 'counselor'
        }
      });
    } else {
      return of({
        success: false,
        message: 'Invalid credentials'
      });
    }
  }

  // Check if counselor is logged in
  isCounselorLoggedIn(): boolean {
    return localStorage.getItem('counselorLoggedIn') === 'true';
  }

  // Logout counselor
  counselorLogout(): void {
    localStorage.removeItem('counselorLoggedIn');
    localStorage.removeItem('counselorEmail');
    this.router.navigate(['/login']);
  }

  forgotPassword(payload:string){
    return this.http.get(`${url}${payload}`);
  }
}

