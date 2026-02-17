import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICourse } from '../../shared/models/course';

@Component({
  selector: 'app-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
  styleUrls: ['./autocomplete-demo.component.css']
})
export class AutocompleteDemoComponent implements OnInit {
  keyword = 'name';
  @Input() allCourseList: Array<ICourse> = [];
  CourseList: Array<any> = [];
  @Output() categoryEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.CourseList = [...this.allCourseList];
  }

  selectEvent(item) {
    // do something with selected item
    this.categoryEvent.emit(item.id);
  }

  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.

    // const regex = new RegExp(search, 'i');
    // this.CourseList = this.allCourseList.filter(e => regex.test(e.name));
    // console.log(this.CourseList);
  }

  onFocused(e) {
    // do something
  }
}
