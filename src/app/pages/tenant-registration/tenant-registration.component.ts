import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tenant-registration',
  templateUrl: './tenant-registration.component.html',
  styleUrls: ['./tenant-registration.component.css']
})
export class TenantRegistrationComponent implements OnInit {
  table:Array<any>=[];

  constructor(private route: Router, private CommonService: CommonService,private toastr: ToastrService) {
    this.getTenantData()
   }

  ngOnInit(): void {
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  add() {
    this.route.navigate(['/home/tenantRegistration/add'])
  }
  edit(item) {
    let params = {
      tntCode: item.TNT_CODE,
    }
    this.route.navigate(['/home/tenantRegistration/edit'], { queryParams: params });
  }
  getTenantData(){
    let payLoad={
      RoleId:sessionStorage.getItem('RoleId'),
      TNT_CODE:sessionStorage.getItem('TenantCode')
    }
    this.activeSpinner();
    this.CommonService.postCall('LoadTenantByRoleId',payLoad).subscribe(
      (res:any)=>{
        this.deactivateSpinner()
        this.table=res;
      },err=>{
        this.deactivateSpinner()
      }
    )
  }

}
