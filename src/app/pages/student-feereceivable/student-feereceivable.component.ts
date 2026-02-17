import { Component, OnInit } from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-student-feereceivable',
  templateUrl: './student-feereceivable.component.html',
  styleUrls: ['./student-feereceivable.component.css']
})
export class StudentFeereceivableComponent implements OnInit {

  table: Array<any> = [];
  myForm: UntypedFormGroup;
  // courceId: string;
  academics: any;
  Curriculums: any;
  users: any;
  isParam: boolean = false;
  academic: any
  academicId: string;
  curriculumId: string;
  acId: any
  yearId: any;


  constructor(private fb: UntypedFormBuilder, active: ActivatedRoute, private CommonService: CommonService, private toastr: ToastrService, private route: Router) {

    this.getAcademic();


  }

  ngOnInit(): void {
    this.myForm = this.fb.group({

    })
    this.table = []
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  getAcademic() {
    // this.activeSpinner()
    this.CommonService.getCall('Academic/GetAcademicDropDownList/'+sessionStorage.getItem('TenantCode')).subscribe((res: any) => {
      this.academics = res;
      console.log(this.academics)
      this.deactivateSpinner()
    }, e => {
      this.deactivateSpinner()
    })
  }
  courceChange(acId) {
    
    this.yearId=acId.target.value
    console.log(acId)
    this.activeSpinner()
    let payLoad = {
      "academicId": acId.target.value
    }
    this.CommonService.getCall('Curriculum/CurriculumDropDownList/' + acId.target.value).subscribe((res: any) => {
      this.Curriculums = res;
      console.log(this.Curriculums)
      this.deactivateSpinner()

    }, e => {
      this.deactivateSpinner()
    })
  }



  Change(id) {
    this.curriculumId=id.target.value;
    this.activeSpinner()
    this.CommonService.getCall(`StudentRegistration/StudentDropDownList/${id.target.value}/${sessionStorage.getItem('TenantCode')}`).subscribe((res: any) => {
      this.users = res;
      console.log(this.users)
      this.deactivateSpinner()
    }, e => {
      this.deactivateSpinner()
    })
  }




  load(id) {
   
    this.activeSpinner();
    let payLoad = {
      "FEERECEIVABLE_ACADEMIC_ID": this.yearId,
      "FEERECEIVABLE_CURRICULUM_ID": this.curriculumId,
      "FEERECEIVABLE_STUDENT_ID": id.target.value,
      "TNT_CODE": sessionStorage.getItem('TenantCode'),

    }
    this.CommonService.postCall('StudentFeeReceivables/GetStudentFeeReceivables/', payLoad).subscribe((res: any) => {
      console.log(res)
      this.table = [];

      this.table = res;


      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(), console.log(e) })
  }




  // Update(){

  //   let item= this.table;
  //   console.log(item);

  //   this.CommonService.postCall('StudentFeeReceivables/Payment',item).subscribe((res: any) => {

  //     window.location.reload();
  //     this.toastr.success("Fee Receivable Updated Succuessfully");
  //     document.getElementById('md_close').click();
  //   }, err => {
  //     this.toastr.error(err.error ? err.error : 'Class Not Updated')
  //     this.deactivateSpinner();
  //   })


  // }

}