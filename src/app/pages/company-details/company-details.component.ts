import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../app/pages/base.component';
import { CommonService } from '../../../app/services/common.service';
import { environment } from '../../../environments/environment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FileuploadService } from '../../services/fileupload.service';
import { Route, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent extends BaseComponent implements OnInit {
  RoleId = sessionStorage.RoleId;
  USERTYPE = sessionStorage.USERTYPE;
  companyId = sessionStorage.company_id;
  pay_Load: any = {};
  companyData: any = {};
  isCompanyDetailsSubmitted: boolean = false;
  companyRegistrationForm: any = UntypedFormGroup
  countyList: Array<any> = [];
  subCountyList: Array<any> = [];
  file: any = File; serverPath: string;
  imageURL: any; fileName: any = null;
  submitted: boolean = false;
  isRead: boolean = true;
  constructor(private fileuploadService: FileuploadService, CommonService: CommonService, toastr: ToastrService, private fb: UntypedFormBuilder, private route: Router) {

    super(CommonService, toastr);
    this.serverPath = environment.urlFiles;
  }

  ngOnInit(): void {
    this.getCompanyDetails();
  }


  getCompanyDetails() {
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`TenantRegistration/GetCompanyById/` + this.companyId).subscribe((res: any) => {
      if (res.status) {
        this.companyData = res.data[0];
        this.pay_Load = this.companyData;
        this.isCompanyDetailsSubmitted = true;
        this.imageURL = this.serverPath + this.companyData.cmp_logo;
      } else {
        this.toastr.warning("Unable to fetch the data, Please Contact Administrator");
      }
      this.CommonService.deactivateSpinner();
    }, (e) => {
      this.CommonService.deactivateSpinner();
    });

  }

  onSubmit(data: any) {
    this.CommonService.activateSpinner();
    this.submitted = true;
    if (this.companyRegistrationForm.invalid) {
      this.toastr.warning("Please enter all mandatory field", 'Company Details');
      return;
    }
    let payLoad = {
      "COMPANY_ID": this.companyData.COMPANY_ID,
      "COMPANY_NAME": this.companyData.COMPANY_NAME,
      "CREATEDBY": this.userId,
      "CREATEDDATE": new Date(),
      "TNT_CODE": this.TenantCode,
      "STATUS": true,
      "registration_no": data.registration_no,
      "address": data.address,
      "cmp_county_id": data.cmp_county_id,
      "cmp_subcounty_id": data.cmp_subcounty_id,
      "contact_person": this.companyData.contact_person,
      "contact_details": this.companyData.contact_details,
      "emailid": this.companyData.emailid,
      "cmp_logo": data.cmp_logo

    }
    this.CommonService.postCall(`TenantRegistration/UpdateCompany`, payLoad).subscribe((res: any) => {
      if (res.status) {
        this.toastr.success('Company Details Updated');
        this.route.navigate(['HOME/dashboard']);
      } else {
        this.toastr.warning("Details Not Saved, Please Contact Administrator");
      }
      this.CommonService.deactivateSpinner();
    }, (e) => {
      this.CommonService.deactivateSpinner();
    });
  }

  CompanyRegistrationEvent(event: any) {
    this.isCompanyDetailsSubmitted = false;
    if (event == false)
      this.route.navigate(['HOME/dashboard'])
    else {
      this.onSubmit(event);
    }
  }

}
