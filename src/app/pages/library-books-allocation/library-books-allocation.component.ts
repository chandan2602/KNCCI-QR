import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-library-books-allocation',
  templateUrl: './library-books-allocation.component.html',
  styleUrls: ['./library-books-allocation.component.css']
})
export class LibraryBooksAllocationComponent implements OnInit {
  myForm: UntypedFormGroup;
  courses: Array<any> = [];
  Schedules: Array<any> = []
  departments: Array<any> = [];
  students: Array<any> = [];
  chapters: any[];
  sheduleId: string;
  courceId: any;

  constructor(private commonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      courseName: ['', Validators.required],
      courseSchedule: ['', Validators.required],
      department: ['', Validators.required],
      student: ['', Validators.required],
    })
    this.loadCourse();
    this.loadDepartment();
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
      this.courses = res;
      this.deactivateSpinner();
    }, e => {
      this.deactivateSpinner();
    })

  }

  courseChange(event) {

    this.chapters = [];
    this.sheduleId = '';
    let data = {
      "CourseId": event.target.value
    }
    this.commonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.Schedules = res;
    }, e => { this.deactivateSpinner() })
  }

  sheduleChange(event) {
    this.activeSpinner();
    let payLoad = {
      "COURSESHD_ID":event.target.value
    }
    this.commonService.postCall('Account/usersbycourseShedule',payLoad).subscribe((res: any) => {
      this.deactivateSpinner();
      this.students = res;
    }, e => {
      this.deactivateSpinner();
    });
  }

  loadDepartment() {
    this.activeSpinner();
    let payload = {
      "TNT_CODE": sessionStorage.getItem('TenantCode')
    }
    this.commonService.postCall('Department/dropdown', payload).subscribe((res: any) => {
      this.departments = res;
      this.deactivateSpinner();
    }, e => {
      this.deactivateSpinner();
    })
  }


  onSubmit(form) {
    let studentObj = this.students.filter(x => x.USERID == form.value['student']);
    let departmentobj = this.departments.filter(x => x.DEPARTMENT_ID == form.value['department']);

   
    this.route.navigate(['/HOME/listofbooks'], { queryParams: { studentId: studentObj[0]['USERID'], departmentId: departmentobj[0]['DEPARTMENT_ID'], } })

  }

}
