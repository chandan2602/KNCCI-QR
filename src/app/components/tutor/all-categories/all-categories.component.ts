import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICourse } from '../../shared/models/course';

declare const AllCategories_owlCarousel: any;
@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.css']
})
export class AllCategoriesComponent implements OnInit {

  @Input() categoryList: Array<{ id: number, name: string }> = [];
  @Input() allCourseList: Array<ICourse> = [];
  @Input() categoryName: string = 'All Programs';
  activeIndex: number = 0;
  @Output() categoryEvent = new EventEmitter<number>();

  constructor(private route: Router) { }

  ngOnInit(): void {
    AllCategories_owlCarousel();
  }

  onCategoryChanged(categoryId: number) {
    this.categoryEvent.emit(categoryId);
  }

  ShowAll() {
    // this.route.navigate(['all-category-courses']);
    this.route.navigate(['all-category-courses'], { state: this.allCourseList });
  }
}
