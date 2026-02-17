import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-add-user-registration',
  templateUrl: './add-user-registration.component.html',
  styleUrls: ['./add-user-registration.component.css']
})
export class AddUserRegistrationComponent extends BaseComponent implements OnInit {
  registrationTitle: string = '';
  titles: Array<any> = [];
  genders: Array<any> = [];
  myform: UntypedFormGroup;
  params: any = {}
  maxDate: any = moment().format('yyyy-MM-DD')
  constructor(CommonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, toastr: ToastrService) {
    super(CommonService, toastr)
    this.active.queryParams.subscribe((res) => {
      if (Object.keys(res).length) {
        this.params = res;
        this.getAll();
      }
    })
  }

  ngOnInit(): void {
    this.myform = this.fb.group({
      Title: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Mobileno: ['', [Validators.required, Validators.minLength(10)]],
      UserName: ['', [Validators.required, Validators.email]],
      // password:['',[Validators.required,Validators.minLength(6)]],
      // confirmPassword:['',[Validators.required,Validators.minLength(6)]],
      dob: ['', Validators.required],
      Gender: ['', Validators.required]
    })
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  getTitle() {

  }
  getAll() {
    let payLoad = {
      UserType: this.params.uType,
      RoleId: this.params.rId,
      TENANT_CODE: this.params.tcode
    }
    this.activeSpinner();

    let title = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Title }).subscribe(res => {
      this.titles = res;
    });
    let registrationTitle = this.CommonService.postCall('GetRegistrationTitle', payLoad).subscribe(res => {
      this.registrationTitle = res;
    });
    let gender = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Gender }).subscribe(res => {
      this.deactivateSpinner();
      this.genders = res;
    }, err => {
      this.deactivateSpinner();
    })

  }

  save() {
    let payLoad = this.myform.value;
    payLoad.TENANT_CODE = this.params.tcode;
    payLoad.UserType = this.params.uType;
    payLoad.Role = this.params.rId;
    payLoad.VerificationToken = this.params.token;
    payLoad.Timezone = 'India Standard Time';
    payLoad.CREATEDBY = sessionStorage.UserId;
    payLoad.Company_id = +sessionStorage.company_id;
    // if (+this.params.rId == 2)
    //   payLoad.Company_id = +sessionStorage.company_id;
    this.activeSpinner();
    this.CommonService.postCall('SaveRegistration', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.toastr.success('Information saved successfully');
        window.history.back()

      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'User not Registered');
        window.history.back()
      })

  }
  passwordCheck() {
    let pControl = this.myform.controls['password'];
    let cControl = this.myform.controls['confirmPassword'];
    if (!pControl.value) {
      this.toastr.warning('Please enter the password');
      cControl.setValue(null);
      return;
    }
    if (pControl.value != cControl.value) {
      this.toastr.warning('Password and Confirm Password Should be same');
      cControl.setValue(null);
    }

  }
}
