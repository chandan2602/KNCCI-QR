import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  myform: UntypedFormGroup;
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  // submitted = false;
  // bankDetails:any = {};
  changed: boolean = false;
  BankDetails: any;
  accountnumber: any;
  constructor(private fb: UntypedFormBuilder, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.myform = this.fb.group({
      BANK_DETAILS_ID: [0],
      ACCOUNT_HOLDER_NAME: ['', Validators.required],
      ACCOUNT_NO: ['', Validators.required],
      BANK_NAME: ['', Validators.required],
      BRANCH_NAME: ['', Validators.required],
      IFSC_CODE: ['', Validators.required],

    })
    this.parent.childs['BankDetailsData'] = this
  }

  ngOnChanges() {
    if (this.editData && Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.dataTransform();
      // this.BankDetailsData = this.editData['BankDetailsData'].length && this.editData['BankDetailsData'][0];
    }
  }

  validateAccountNumber(event) {
    let val = event.target?.value;
    let exp = /^\d{8,18}$/
    if (new RegExp(exp).test(val)) {
      this.accountnumber = val;
    } else {
      this.accountnumber = null;
      return this.toastr.warning("Enter Valid Account Number")
    }
  }
  // }

  dataTransform() {
    let data: Array<any> = this.editData;
    this.myform.markAllAsTouched;

    if (data.length > 0) {
      const bankdata = data[0];
      this.myform.patchValue({
        BANK_DETAILS_ID: bankdata.BANK_DETAILS_ID,
        ACCOUNT_HOLDER_NAME: bankdata.ACCOUNT_HOLDER_NAME,
        ACCOUNT_NO: bankdata.ACCOUNT_NO,
        BANK_NAME: bankdata.BANK_NAME,
        BRANCH_NAME: bankdata.BRANCH_NAME,
        IFSC_CODE: bankdata.IFSC_CODE
      });
    }
  }
  save() {
    this.parent.save();
  }
  close() {

  }

}