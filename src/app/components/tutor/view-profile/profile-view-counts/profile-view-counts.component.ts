import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-view-counts',
  templateUrl: './profile-view-counts.component.html',
  styleUrls: ['./profile-view-counts.component.css']
})
export class ProfileViewCountsComponent implements OnInit {
  @Input() profileCounts = { COURSES: 0, ONLINE: 0, STUDENTS: 0, REVIEWS: 0 };
  constructor() { }

  ngOnInit(): void {
  }

}