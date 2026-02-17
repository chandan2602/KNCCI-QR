import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICourse } from '../../shared/models/course';
declare const TrendingCourses_owlCarousel: any;
@Component({
  selector: 'app-trending-courses',
  templateUrl: './trending-courses.component.html',
  styleUrls: ['./trending-courses.component.css']
})
export class TrendingCoursesComponent implements OnInit {
  @Input() trending_courseList: Array<ICourse> = [];
  constructor(private route: Router) { }

  ngOnInit(): void {
    TrendingCourses_owlCarousel();
  }

  gotoCourseDetail(course: ICourse) {
    if (sessionStorage.UserId)
      this.route.navigate(['view-course-details'], { state: course });
    else
      this.route.navigate(['eRP/view-course-details'], { state: course });
  }

  ShowAll() {
    this.route.navigate(['all-category-courses'], { state: this.trending_courseList });
  }

}