import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent extends BaseComponent implements OnInit {
  table: Array<any> = [];
  rId: string = '';
  roles: Array<any> = [];
  tId: string = '';
  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false;

  tenanates: Array<any> = [];
  UserRoleName: string;
  constructor(public CommonService: CommonService, public toastr: ToastrService, private route: Router) {
    // this.getRoles();
    super(CommonService, toastr)
    const { company_id = 0 } = sessionStorage;
    // this.isAdmin = ((+company_id > 0) && (+this.USERTYPE == 24));
    this.isAdmin = (+this.USERTYPE == 24);
    if (this.roleId == '4') {
      this.getTennates();
    } else {
      this.getRoles();
    }
    this.rId = this.roleId;
    this.change();

    this.UserRoleName = (+sessionStorage.USERTYPE == 25) ? 'Tutor' : (+sessionStorage.USERTYPE == 24) ? 'Admin' : 'Trainee';
  }
  ngOnInit(): void {

  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  change() {
    this.activeSpinner();
    let tenantcode;
    if (this.roleId == '4') {
      tenantcode = this.tId || 0;
    } else {
      tenantcode = sessionStorage.getItem('TenantCode');
    }
    let payLoad = {
      "TenantCode": tenantcode,
      "objUserinrole": { "RoleId": this.rId || 0 }
    };

    const { UserId } = sessionStorage;
    this.CommonService.postCall('UserRolesChange', payLoad).subscribe(
      (res) => {
        this.table = [];
        setTimeout(() => {
          this.table = res;
          // this.table = this.table.filter(m => m.USERID == UserId);
        }, 10)
        this.deactivateSpinner();

      },
      err => {
        this.deactivateSpinner()
      })
  }
  changeTname() {
    this.getRoles();
  }
  edit(item) {
    let id = item.USERID;
    this.activeSpinner();
    this.CommonService.postCall('EditRegistrationByUserId', { CREATEDBY: id }).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.route.navigate(['HOME/userRegistration'], { queryParams: { token: res.value } })
        //this.route.navigate(['HOME/editUserRegistration'], { queryParams: { token: res.value } })
      }, err => {
        this.deactivateSpinner();
      }
    )

  }


  getRoles() {
    this.activeSpinner();
    this.CommonService.postCall('GetRolesByTenantCode', { TENANT_CODE: this.tId || sessionStorage.getItem('TenantCode') }).subscribe(
      (res: any) => {
        this.roles = res.filter(e => e.ROLE_ID != 3);
        // && e.ROLE_ID != 1
        this.deactivateSpinner();
      }, error => {
        this.deactivateSpinner();
      }
    )
  }
  getTennates() {
    this.activeSpinner();
    this.CommonService.postCall('GetTenantByRoleId', { RoleId: this.roleId }).subscribe(
      (res) => {
        this.tenanates = res;
        this.deactivateSpinner()
      }, err => {
        this.deactivateSpinner()
      }
    )
  }

  add() {
    let payLoad = {
      TENANT_CODE: this.tId || sessionStorage.getItem('TenantCode'),
      CREATEDBY: sessionStorage.getItem('UserId'),
      RoleId: this.rId
    }
    this.activeSpinner();
    this.CommonService.postCall('AddRegistration', payLoad).subscribe(
      (res) => {
        this.deactivateSpinner();
        let params = {
          tcode: this.tId || this.TenantCode,
          uType: res.UserType,
          rId: res.RoleId,
          token: res.VerificationToken && res.VerificationToken[0]
        }
        this.route.navigate(['/HOME/addUserRegistration'], { queryParams: params })
      }, err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error)
      })
  }

}
