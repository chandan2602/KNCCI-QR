
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from './../../environments/environment'
const url = environment.serviceUrl



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,) { }

  login(data){
    return this.http.post(url+'Account/Login',data)
  }
  forgotPassword(payload:string){
    return this.http.get(`${url}${payload}`);
  }
}

