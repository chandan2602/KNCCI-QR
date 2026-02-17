import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {

  approvalForm: UntypedFormGroup;
  @Input() editData;
  @Output() closeModelEvent: EventEmitter<boolean> = new EventEmitter();
  // isTrue: Boolean = false;
  company_id: number = 0;
  approvalStatus: Array<{ id: number, name: string }> = [];
  submitted = false;
  isDomainExists: boolean = false;

  constructor(private fb: UntypedFormBuilder, private toastr: ToastrService, private CommonService: CommonService,) { }

  ngOnInit(): void {
    this.formInit();
    document.getElementById('btnOpenModel')?.click();

    this.approvalStatus = [
      { id: 1, name: "Pending" },
      { id: 2, name: "Approved" },
      { id: 3, name: "Reject" }
    ];
    this.validationControls();

    if (this.editData) {
      console.clear();
      console.table(this.editData);
      this.company_id = +this.editData.company_id;
      this.approvalForm.patchValue({
        approval_id: this.editData.approval_id,
        tnt_code: this.editData.tenantcode,
        issubdomain: this.editData?.issubdomain ?? false,
        subdomainname: this.editData.subdomainname || '',
        approval_status: this.editData.approval_status,
        approved_date: this.editData.approved_date?.replace("T00:00:00", ""),
        rejected_date: this.editData.rejected_date?.replace("T00:00:00", ""),
        remarks: this.editData.remarks || ''
      });
      if (this.company_id == 0) {
        this.approvalForm.get('issubdomain')?.disable();
      }
    }
  }

  formInit() {
    this.approvalForm = this.fb.group({
      approval_id: [0],
      tnt_code: [+sessionStorage.TenantCode],
      issubdomain: [false],
      subdomainname: [''],
      approval_status: ['', Validators.required],
      approved_date: [null],
      rejected_date: [null],
      remarks: [''],
      createdby: [+sessionStorage.UserId],
      modifiedby: [+sessionStorage.UserId]


    })
  }

  validationControls() {
    const [approval_statusFormControl, approved_dateFormControl, rejected_dateFormControl, remarksFormControl, issubdomainFormControl, subdomainnameFormControl] = [
      this.approvalForm.get('approval_status'),
      this.approvalForm.get('approved_date'),
      this.approvalForm.get('rejected_date'),
      this.approvalForm.get('remarks'),
      this.approvalForm.get('issubdomain'),
      this.approvalForm.get('subdomainname'),
    ];

    //issubdomainFormControl
    issubdomainFormControl?.valueChanges.subscribe((status: boolean) => {
      subdomainnameFormControl?.setValue('');
      subdomainnameFormControl?.setValidators(status ? Validators.required : null);
      // if(company_id>0)

      if (status)
        subdomainnameFormControl?.enable();
      else
        subdomainnameFormControl?.disable();
      subdomainnameFormControl?.updateValueAndValidity();

    });
    //approval status Changed
    approval_statusFormControl?.valueChanges.subscribe((id) => {
      const val = +id;

      remarksFormControl?.setValue('');
      remarksFormControl?.enable();
      remarksFormControl?.setValidators(null);

      approved_dateFormControl?.setValue('');
      approved_dateFormControl?.enable();
      approved_dateFormControl?.setValidators(null);

      rejected_dateFormControl?.setValue('');
      rejected_dateFormControl?.enable();
      rejected_dateFormControl?.setValidators(null);

      if (val == 2) {
        remarksFormControl?.setValidators(Validators.required);
        approved_dateFormControl?.setValidators(Validators.required);
        rejected_dateFormControl?.disable();
      }
      else if (val == 3) {
        remarksFormControl?.setValidators(Validators.required);
        rejected_dateFormControl?.setValidators(Validators.required);
        approved_dateFormControl?.disable();
      }
      else {
        remarksFormControl?.disable();
        approved_dateFormControl?.disable();
        rejected_dateFormControl?.disable();
      }
      remarksFormControl?.updateValueAndValidity();
      approved_dateFormControl?.updateValueAndValidity();
      rejected_dateFormControl?.updateValueAndValidity();
    });

  }

  close() {
    this.closeModelEvent.emit(false);
  }

  get f() { return this.approvalForm.controls; }

  onSubmit(form: UntypedFormGroup) {
    this.submitted = true;

    if (this.approvalForm.invalid) {
      this.toastr.warning("Please enter all mandatory field");
      return;
    }


    if (this.isDomainExists) {
      this.toastr.error('Subdomain Already Exist');
      return;
    } else {
      this.CommonService.activateSpinner();
      let payLoad = { ...this.approvalForm.getRawValue() };
      this.CommonService.postCall('Account/SaveOrUpdateApproval', payLoad).subscribe((res: any) => {
        document.getElementById("btnClose")?.click();
        this.toastr.success(res.message);
        this.CommonService.deactivateSpinner();
      }, e => { this.CommonService.deactivateSpinner(); 
        this.toastr.info(e.message);
      })
    }

  }

  domainChange() {
    const [issubdomain, subdomainname] = [this.approvalForm.get('issubdomain')?.value, this.approvalForm.get('subdomainname')?.value];
    if (issubdomain && subdomainname) {
      this.isExistDomain(subdomainname);
    }
  }

  isExistDomain(subdomain_name: string) {
    this.isDomainExists = false;
    this.CommonService.getCall(`account/IsSubDomainExists/${subdomain_name}`).subscribe((res: any) => {
      this.isDomainExists = res.data;
      if (this.isDomainExists)
        this.toastr.error('Subdomain Already Exist');
    });
  }

}
