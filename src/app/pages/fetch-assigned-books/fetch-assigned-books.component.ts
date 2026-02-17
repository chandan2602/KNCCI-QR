import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fetch-assigned-books',
  templateUrl: './fetch-assigned-books.component.html',
  styleUrls: ['./fetch-assigned-books.component.css']
})
export class FetchAssignedBooksComponent implements OnInit {
  myForm: UntypedFormGroup;
  courseNameOption : Array<any>=[];
  courseScheduleOption : Array<any>=[]
  departmentOption: Array<any> = [];
  studentOption: Array<any> = [];
  chapters: any[];
  sheduleId: string;
  courceId: any;

  constructor(private commonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      courseName : ['', Validators.required],
      courseSchedule : ['',Validators.required],
      department: ['', Validators.required],
      student: ['', Validators.required],
    })
    this.loadCourse();
  }
  activeSpinner() {
    this.commonService.activateSpinner();
  }

  deactivateSpinner() {
    this.commonService.deactivateSpinner()
  }

  loadCourse() {
    this.activeSpinner();
    this.commonService.getAdminCourses().subscribe((res: any) => {
      this.courseNameOption = res;
      this.deactivateSpinner();
    }, e => {
      this.deactivateSpinner();
    })

  }

  courseChange(event){
    this.chapters = [];
    this.sheduleId = '';
    let data = {
      "CourseId": event.target.value
    }
    this.commonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.courseScheduleOption = res;
    }, e => { this.deactivateSpinner() })
  }

  sheduleChange(event){
    this.activeSpinner();
    let payLoad = {
      "COURSESHD_ID":event.target.value
    }
    this.commonService.postCall('Account/usersbycourseShedule',payLoad).subscribe((res: any) => {
      this.deactivateSpinner();
      this.studentOption = res;
    }, e => {
      this.deactivateSpinner();
    });
  }
  

  handleDepartment(event) {
    let payLoad = {
      CHAPTER_CS_ID: event.target.value,
      "TNT_CODE":sessionStorage.getItem('TenantCode')
      // "TNT_CODE": 60268037
    }
    this.commonService.postCall('Department/dropdown',payLoad).subscribe((res: any) => {
      this.departmentOption = res;
      this.deactivateSpinner();
    }, err => { this.departmentOption = []; this.deactivateSpinner() })

  }



  onSubmit(form) {
    // let courseObj = this.courseNameOption.filter(x => x.COURSE_ID == form.value['courseName']);
    // let courseScheduleObj =this.courseScheduleOption.filter(x => x.COURSESHD_ID == form.value['courseSchedule']);
    // let departmentObj = this.departmentOption.filter(x=>x.DEPARTMENT_ID == form.value['department']);
    let studentObj = this.studentOption.filter(x=>x.USERID == form.value['student']);
    
  
    this.route.navigate(['/HOME/studentReport'],{ queryParams: { studentId:studentObj[0]['USERID'], studentName:studentObj[0]['FIRSTNAME']} })
  }

}
