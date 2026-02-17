import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  cources: [] = [];
  constructor( private route: Router, private commonService: CommonService, private toast: ToastrService) { 
    this.loadCourse();
  }

  ngOnInit(): void {
  }

  loadCourse() {
    this.commonService.activateSpinner()
    this.commonService.getCall(`Courses/GetCourses/${sessionStorage.getItem('UserId')}/${sessionStorage.getItem('RoleId')}`).subscribe((res: any) => {
      this.cources = res;
      this.commonService.deactivateSpinner()
    }, e => {
      this.commonService.deactivateSpinner()
    })
  }

}
