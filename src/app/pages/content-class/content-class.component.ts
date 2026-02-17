import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-content-class',
  templateUrl: './content-class.component.html',
  styleUrls: ['./content-class.component.css']
})

export class ContentClassComponent implements OnInit {
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit:boolean=false;
  editData: any={};

  constructor( private fb: UntypedFormBuilder, private CommonService: CommonService,private toastr: ToastrService) { 
    this.loadClass()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      cnt_class_name: ['', Validators.required],     
      cnt_class_description: [''],
      cnt_status: [1, Validators.required],
    });
    this.loadClass();
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  loadClass() {
    this.activeSpinner();
    let payLoad: any = {
      TENANT_CODE: 60268037
    }
    this.CommonService.getCall('ContentClass/GetList').subscribe((res: any) => {
      this.table = [];
      setTimeout(() => {
        this.table = res;
      }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })

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

  onSubmit(form: UntypedFormGroup) {
    //console.log(form.value)
    let value: any = form.value;
    // value.TENANT_CODE = 60268037;
    value.TENANT_CODE = sessionStorage.getItem('UserId')
    let status: Boolean
    if (value.cnt_status == 1) {
      status = true
    } else {
      status = false
    }
    let payload = {
    
        "cnt_class_id": 1,
        "cnt_class_name": value.cnt_class_name,
        "cnt_class_description":value.cnt_class_description,
        "cnt_status": status,
        "cnt_created_by": sessionStorage.getItem('UserId'),
        "cnt_modified_date":  moment(new Date()),
        "cnt_modified_by":  sessionStorage.getItem('UserId'),
    }
    if (this.isEdit) {
      payload['cnt_created_date']= this.editData.cnt_created_date;
      payload['cnt_chapter_id'] = this.editData.cnt_chapter_id;
      this.CommonService.postCall('ContentClass/Update', payload).subscribe((res: any) => {
        this.loadClass();
        this.toastr.success("Class Updated Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Class Not Updated')
      })
    } else {

      this.CommonService.postCall('ContentClass/Create', payload).subscribe((res: any) => {
        this.loadClass();
        this.toastr.success("Class Created Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Class Not created')

      })
    }
  }

  edit(classId) {
    this.isEdit = true;
    this.myForm.reset();
    let payLoad = {
      "cnt_class_id":classId
    }
    this.CommonService.getCall('ContentClass/GetById/'+classId).subscribe((res: any) => {
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
      if (key == "cnt_status") {
        value = this.editData[key] ? 1 : 0
        control.setValue(value);
      }

    });
  }
  

}
