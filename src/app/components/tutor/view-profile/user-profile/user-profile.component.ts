import { IUserDetails } from './../../../shared/models/userDetails';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() userDetails: IUserDetails = { userfrimages: '', rating: 0, name: '' };
  constructor() { }

  ngOnInit(): void {
  }

}
