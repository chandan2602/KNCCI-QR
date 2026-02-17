import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-update-return-date',
  templateUrl: './update-return-date.component.html',
  styleUrls: ['./update-return-date.component.css']
})
export class UpdateReturnDateComponent extends BaseComponent implements OnInit {
  myForm: UntypedFormGroup;
  updateDate :  Array<any>=[];
  courseNameOption : Array<any>=[];
  courseScheduleOption : Array<any>=[]
  studentOption: Array<any> = [];
  rDateArray : Array<any> = [];
  chapters: any[];
  sheduleId: string;
  actualReturnDate: any;
  isSelected: boolean = false;
  studentId: any;
  constructor(private commonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {
    super(commonService,toastr);
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      courseName : ['', Validators.required],
      courseSchedule : ['',Validators.required],
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
      console.log(res)
    }, e => {
      this.deactivateSpinner();
    });
  }

 

  loadUpdateDate(event){
    console.log(event);
    this.isSelected = true;
    this.studentId = event;
    this.activeSpinner();
    let payLoad = {
      "BOOK_STD_STUDENT_ID":this.studentId,
     }
    this.commonService.postCall('LibraryManagement/AdminViewReports',payLoad).subscribe((res: any) => {
      this.updateDate = res;
      console.log(this.updateDate)
      this.deactivateSpinner();
    }, err => { this.updateDate = []; this.deactivateSpinner() })
  }

  handleDate(bookId,event){
    console.log(bookId,event)
    let obj = {
      "BOOK_STD_ID" : bookId,
      "BOOK_STD_ACTUAL_RETURN_DATE" : event.target.value,
    }
    this.rDateArray.push(obj);
    console.log(obj);
    console.log(this.rDateArray)
  }


  Update(){
    this.activeSpinner();
      this.CommonService.postCall('LibraryManagement/UpdateActualReturnDate',this.rDateArray).subscribe((res: any) => {
     this.toastr.success("Actual date Updated Succuessfully");
     this.loadUpdateDate(this.studentId);
      this.deactivateSpinner();
    }, err => {
      this.toastr.error(err.error ? err.error : 'Actual date Not Updated')
      this.deactivateSpinner();
    })


}
  

 

}
