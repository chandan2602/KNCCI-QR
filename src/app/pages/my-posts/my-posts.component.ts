import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  case=1;
  constructor() { }

  ngOnInit(): void {
  }
  selectTab(value){
    this.case=value
  }

}
