import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-approval-domain',
  templateUrl: './approval-domain.component.html',
  styleUrls: ['./approval-domain.component.css']
})
export class ApprovalDomainComponent extends BaseComponent implements OnInit {
  editData: any;
  approvalList: Array<any> = []; compImage: any = '';
  isApprovalSubmitted: boolean = false;
  isCompany: Boolean = false;
  viewDetailsForm: UntypedFormGroup;
  userCompanyDetails: any;
  studentIDImage: string;
  // approvalStatus = [
  //   { id: 1, name: "Pending" },
  //   { id: 2, name: "Approved" },
  //   { id: 3, name: "Reject" }
  // ];
  constructor(CommonService: CommonService, toastr: ToastrService,private fb: UntypedFormBuilder) {
    super(CommonService, toastr);
  }

  viewStudentDetails() {
    this.viewDetailsForm = this.fb.group({
      Comapny:[''],
      Email:[''],
      ContactNumber:[''],
      registrationNo: [''],
      Gender: [''],
      occupation: [''],
      Country: [''],
      County: [''],
      subCounty: [''],
      address: [''],
      area: [''],
      education: [''],
      other: [''],
      pincode: [''],
      nationality: [''],
      idCard: [''],
    })
  }

  ngOnInit(): void {
    this.getApproval(true);
    this.viewStudentDetails()
  }

  getApproval(val: any) {
    this.isCompany = false;
    this.loadDataTable('approvaldomain');
    this.CommonService.getCall(`Account/GetApprovalList/${val}`).subscribe((res: any) => {
      this.approvalList = res.data;
      setTimeout(() => { this.dtTrigger.next(); }, 100);
    })
  }

  changeStatus(data: any) {
    setTimeout(() => { this.editData = data; this.isApprovalSubmitted = true; }, 10);
  }

  closeModel(data: any) {
    this.isApprovalSubmitted = false;
    this.getApproval(true);
  }

 closePopup() {
    // $("#viewDetails").modal("hide");
  }

  viewStndtDetails(item) {
    this.userCompanyDetails =item
    setTimeout(() => {
      this.viewDetailsForm.patchValue({
      Comapny:this.userCompanyDetails.company_name,
      Email:item.username,
      ContactNumber:this.userCompanyDetails.mobileno,
      registrationNo: this.userCompanyDetails?.registration_no,
      Country: this.userCompanyDetails?.country_name,
      County: this.userCompanyDetails?.counties_name,
      subCounty: this.userCompanyDetails?.sub_counties_name,
      address: this.userCompanyDetails.address,
      // Gender: this.userCompanyDetails?.Gender,
      // occupation:this.userCompanyDetails?.Occupation,
      // education: this.userCompanyDetails.EDUCATION_NAME,
      // other: this.userCompanyDetails.Other,
      // pincode: this.userCompanyDetails.Pincode,
      // nationality:this.userCompanyDetails.Nationality
      // idCard:`${this.fileUrl}${this.userCompanyDetails.upload_institute}`,
    })
    // this.studentIDImage=`${this.fileUrl}${this.userCompanyDetails.upload_institute}`
  }, 1000);
  this.compImage = `${this.urlFiles}${item.cmp_logo}`


  }

  Clear() {
    this.viewDetailsForm.reset()
  }

}
