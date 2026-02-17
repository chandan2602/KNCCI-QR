import { Component, Input, OnInit } from '@angular/core';
import { ICourse } from '../../shared/models/course';
import { Location } from '@angular/common';

@Component({
  selector: 'app-all-category-courses',
  templateUrl: './all-category-courses.component.html',
  styleUrls: ['./all-category-courses.component.css']
})
export class AllCategoryCoursesComponent implements OnInit {
  isShowAll: boolean = true;
  courseList: Array<ICourse> = [];

  constructor(private location: Location) { }

  ngOnInit(): void {
    const resultState: unknown = this.location.getState();
    delete resultState['navigationId'];
    console.log(resultState);
    this.courseList = Object.values(resultState);
    if (Object.values(resultState).length > 1) {
    }
    // if (sessionStorage.courseList)
    //   this.courseList = JSON.parse(sessionStorage.courseList);
    // sessionStorage.courseList = null;
  }
}