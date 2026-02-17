import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from './../../environments/environment'
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
const url = environment.serviceUrl
@Injectable({
  providedIn: 'root'
})
export class Resolver implements Resolve<any> {
  userId = sessionStorage.getItem('UserId');
  constructor(private service  : CommonService) {

   }
   resolve(router:ActivatedRouteSnapshot):Observable<any>{
    return this.service.postCall('LoadMenusByRoleId',{RoleId:sessionStorage.getItem('RoleId'),TENANT_CODE:sessionStorage.getItem('TenantCode')})
   }
}
