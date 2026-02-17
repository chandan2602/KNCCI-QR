import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

let $: any;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: UntypedFormGroup;
  password: any;
  validate: boolean = false; isSave: boolean = false;
  RoleId = sessionStorage.RoleId;

  constructor(private route: Router, private CommonService: CommonService, private toastr: ToastrService, private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    // document.getElementById('btnOpenModel').click();
    (<HTMLInputElement>document.getElementById('txtOldpassword')).focus();

    this.changePasswordForm = this.fb.group({
      OLD_PWD: ['', Validators.required,],
      NEW_PWD: ['', Validators.required,],
      CONFIRM_PWD: ['', Validators.required,],
    })
  }

  onSubmit(form: UntypedFormGroup) {
    this.validate = true;
    let value = form.value;
    const { PASSWORD } = sessionStorage;
    if(PASSWORD!=value.OLD_PWD){
      this.toastr.warning('old password not match');
      return;
    }
    if (value.OLD_PWD == value.NEW_PWD) {
      this.toastr.warning('old password and new password should not match');
    } else if (value.NEW_PWD != value.CONFIRM_PWD) {
      this.toastr.warning('passward not match ');
    } else if (value.NEW_PWD == value.CONFIRM_PWD) {

      let payLoad = {
        TENANT_CODE: sessionStorage.getItem('TenantCode'),
        UserId: sessionStorage.getItem('UserId'),
        password: value.CONFIRM_PWD,

      };
      this.CommonService.activateSpinner();
      this.CommonService.postCall('Account/ChangePassword', payLoad).subscribe((res: any) => {
        this.CommonService.deactivateSpinner();
        this.isSave = true;
        this.toastr.success(' Password generated  Successfully');
        this.close();
        // document.getElementById('btnCloseModel').click();
        // sessionStorage.setItem('PASSWORD', payLoad.password)
        // this.Signout();
      }, err => {
        this.CommonService.deactivateSpinner();
      });
    }

  }

  Signout() {
    let { hostname } = location;
    const { company_id, cerficateimage_path, favicon_path, homepageimage_path, landingpageimage_path } = sessionStorage;
    sessionStorage.clear();
    localStorage.clear();
    // if (!["localhost", "shiksion.com", 'oukinternship.dhanushinfotech.com'].includes(hostname)) {

    sessionStorage.company_id = company_id;
    sessionStorage.cerficateimage_path = cerficateimage_path;
    sessionStorage.favicon_path = favicon_path;
    sessionStorage.homepageimage_path = homepageimage_path;
    sessionStorage.landingpageimage_path = landingpageimage_path;
    // }
    this.route.navigate(['/login']);
    // const closeBtn = document.getElementById('btnCloseModel') as HTMLElement;
    // if (closeBtn) {
    //   closeBtn.click();
    // }

  }

  close() {
    this.validate = false;
    if((this.RoleId == 2 || this.RoleId == 4) && !this.isSave) {
      this.route.navigate(['/HOME/trainer-dashboard']);
    } else 
    if(this.RoleId == 1 && !this.isSave) {
      this.route.navigate(['/HOME/admin-dashboard']);
    } else
    if(this.RoleId == 6 && !this.isSave) {
      this.route.navigate(['/HOME/founder-dshbrd']);
    } else
    if(this.RoleId == 7 && !this.isSave) {
      this.route.navigate(['/HOME/incubator-dshbrd']);
    } else
    if(this.RoleId == 8 && !this.isSave) {
      this.route.navigate(['/HOME/investor-dshbrd']);
    } else
    if(this.RoleId == 3 && !this.isSave) {
      this.route.navigate(['/HOME/my-courses']);
    }
    else  
      this.Signout();
  }
}
