import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  locations: Array<any> = [];
  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
    this.getRoles();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      RoleName: ['', [Validators.required, Validators.minLength(3)],],
      Description: ['', Validators.required,],
      Status: [1, Validators.required]
    })
    this.setDefault();

  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['Status'].setValue(1);

  }

  getRoles() {
    this.activeSpinner();
    this.CommonService.postCall('LoadRoles', { "TENANT_CODE": this.tId || this.TenantCode }).subscribe(
      (res: any) => {
        this.table = [];
        this.table = res;
        this.renderDataTable();
        this.deactivateSpinner()
      }, err => {
        this.deactivateSpinner();
      }
    )
  }

  add() {
    this.editData = {};
    this.isEdit = false;
  }

  edit(data) {
    this.isEdit = true;
    this.editData = data;
    let controls = this.myForm.controls;
    controls['RoleName'].setValue(data.ROLE_NAME);
    controls['Status'].setValue(data.ROLE_STATUS=='Active' ? 1 : 0);
    controls['Description'].setValue(data.ROLE_DESCRIPTION);
  }
  close() {
    this.myForm.reset();
    this.setDefault()
  }
  onSubmit(form: UntypedFormGroup) {
    this.activeSpinner();
    let payLoad = form.value;
    payLoad['TENANT_CODE'] = this.TenantCode;
    payLoad['CREATEDBY'] = this.userId
    payLoad['LASTMDFBY'] = this.userId
    if (this.isEdit) {
      payLoad['RoleId'] = this.editData['ROLE_ID'];
      this.CommonService.postCall('UpdateRole', payLoad).subscribe(
        (res: any) => {
          this.toastr.success('Updated Successfully')
          this.getRoles();
          this.deactivateSpinner();
          document.getElementById('md_close').click()
        }, err => {
          this.toastr.error(err.error ?  err.error.text||err.error : err); this.deactivateSpinner()
        })
    } else {

      this.CommonService.postCall('AddRole', payLoad).subscribe(
        (res: any) => {
          this.toastr.success('Created Successfully')
          this.getRoles();
          this.deactivateSpinner();
          document.getElementById('md_close').click()
        }, err => { this.toastr.error(err.error ? err.error.text||err.error : err); this.deactivateSpinner(); })
    }
  }
  changeTname() {
    this.getRoles()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
