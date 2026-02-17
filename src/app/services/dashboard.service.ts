import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import {environment} from './../../environments/environment'
const url = environment.serviceUrl
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getCource() {
    let uri=url+'Courses/CourseDetails'
    let data = {
      UserId: sessionStorage.getItem('UserId'),
      TenantCode: sessionStorage.getItem('TenantCode'),
      Username: sessionStorage.getItem('Username')
    }
  return  this.http.post(uri, data);
  }
  loadDashboard(){
    let uri=url+'Dashboard/LoadDashboard';
    let data = {
      UserId: sessionStorage.getItem('UserId'),
      TenentCode: sessionStorage.getItem('TenantCode'),
      RoleId: sessionStorage.getItem('UserId')
    }
    // sessionStorage.getItem('RoleId')
  return  this.http.post(uri, data);
  }

}


// {
//   "UserId":"12945884",
//   "TenantCode":"51964213",
//   "Username": "sheshu"
// }