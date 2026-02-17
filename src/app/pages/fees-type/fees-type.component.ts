import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-fees-type',
  templateUrl: './fees-type.component.html',
  styleUrls: ['./fees-type.component.css']
})
export class FeesTypeComponent implements OnInit {
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any = {};
  TenantCode: string = sessionStorage.getItem('TenantCode');
  UserId: string = sessionStorage.getItem('UserId');

  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.loadfees();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      FEETYPE_NAME: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      FEETYPE_DESCRIPTION: [''],

    });
    this.loadfees();
  }


  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }




  loadfees() {
    this.activeSpinner();
    let payLoad: any = {
      //"TNT_CODE": 71258324,
      "TNT_CODE": sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall('Feestype/GetList', payLoad).subscribe((res: any) => {

      this.table = [];
      setTimeout(() => {
        this.table = res;

      }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }

  onSubmit(form: UntypedFormGroup) {
    let value: any = form.value;

    let payload = {

      "FEETYPE_NAME": value.FEETYPE_NAME,
      "FEETYPE_DESCRIPTION": value.FEETYPE_DESCRIPTION,
      "FEETYPE_STATUS": true,
      "TNT_CODE": sessionStorage.getItem("TenantCode"),
      "FEETYPE_CREATED_BY": sessionStorage.getItem("UserId"),
      "FEETYPE_CREATED_DATE": new Date(),
      "FEETYPE_MODIFIED_BY": sessionStorage.getItem("UserId"),
      "FEETYPE_MODIFIED_DATE": new Date(),
    }
    if (this.isEdit) {


      payload['FEETYPE_ID'] = this.editData.FEETYPE_ID;
      payload['FEETYPE_CREATED_DATE'] = this.editData.FEETYPE_CREATED_DATE;
      this.CommonService.postCall('Feestype/Update', payload).subscribe((res: any) => {
        this.loadfees();
        this.toastr.success("fees Updated Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Fees Not Updated')
      })
    } else {

      this.CommonService.postCall('Feestype/Create', payload).subscribe((res: any) => {
        this.loadfees();
        this.toastr.success("Fees Created Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error.message : 'Class Not created')
        console.log(err.error.message)

      })
    }



  }



  edit(feesId) {
    this.isEdit = true;

    this.myForm.reset();
    let payLoad = {
      "FEETYPE_ID": feesId,
    }
    this.CommonService.getCall('Feestype/Get/' + feesId).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
        this.datatransform()
      } else {
        this.editData = res;
        this.datatransform()
      }
    }, err => { }

    )
  }
  datatransform() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      let value = this.editData[key];
      if (value != undefined) control.setValue(value);
    });
    ctrls['FEETYPE_ID'].setValue(this.editData['FEETYPE_ID'])
    ctrls['FEETYPE_NAME'].setValue(this.editData['FEETYPE_NAME'])
    ctrls['FEETYPE_DESCRIPTION'].setValue(this.editData['FEETYPE_DESCRIPTION'])
  }




  add() {
    this.editData = {};
    this.isEdit = false;
    this.myForm.reset();
  }

  close() {
    this.isEdit = false;
    this.myForm.reset();
  }

}
