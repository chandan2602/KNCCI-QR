import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { valHooks } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-course-program-outcome',
  templateUrl: './course-program-outcome.component.html',
  styleUrls: ['./course-program-outcome.component.css']
})
export class CourseProgramOutcomeComponent implements OnInit {
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any = {};
  id: string;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService, active: ActivatedRoute) {
    // this.load();
    active.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.id = res.id;
        this.load();
      }
    })
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      COURSE_OBJECTIVE: ['', [Validators.required, Validators.minLength(3)]],
      STATUS: [1, Validators.required]
    })
    this.setDefault()
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['STATUS'].setValue(1)
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }


  load() {
    this.activeSpinner()
    let payLoad = {
      "COURSE_OBJECTIVE_COURSE_ID": this.id,
      "TENANT_CODE": sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall('LoadProgramOutcomeByCourseId', payLoad).subscribe((res: any) => {
      this.table = [];
      setTimeout(() => { this.table = res }, 10)
      this.deactivateSpinner()
    }, err => { this.deactivateSpinner() })

  }

  add() {
    this.editData = {};
    this.isEdit = false;
  }
  edit(data) {
    this.isEdit=true;
    this.editData = data;
    let controls = this.myForm.controls;
    controls['COURSE_OBJECTIVE'].setValue(data.COURSE_OBJECTIVE);
    controls['STATUS'].setValue(data.STATUS ? 1 : 0)

  }
  close() {
    this.myForm.reset();
    this.setDefault()
  }
  onSubmit(form: UntypedFormGroup) {
    this.activeSpinner();
    let payLoad = form.value;
    payLoad['COURSE_OBJECTIVE_COURSE_ID'] = this.id;
    payLoad['LASTMDFBY']=sessionStorage.getItem('UserId')
    if (this.isEdit) {
      payLoad['COURSE_OBJECTIVE_ID'] = this.editData['COURSE_OBJECTIVE_ID'];
      this.CommonService.postCall('UpdateProgramOutcomeByCourseId', payLoad).subscribe(
        (res: any) => {
          this.toastr.success('Updated Successfully')
          this.load();
          this.deactivateSpinner();
          document.getElementById('md_close').click()
        }, err => { this.toastr.error(err.Message?err.Message:err); this.deactivateSpinner() })
    } else {
      payLoad['CREATEDBY']=sessionStorage.getItem('UserId')
      this.CommonService.postCall('CreateProgramOutcomeByCourseId', payLoad).subscribe(
        (res: any) => {
          this.toastr.success('Created Successfully')
          this.load();
          this.deactivateSpinner();
          document.getElementById('md_close').click()
        }, err => { this.toastr.error(err.Message?err.Message:err); this.deactivateSpinner() })
    }
  }
}
