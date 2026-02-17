import { Component } from '@angular/core';

@Component({
  selector: 'app-student-job-menu',
  templateUrl: './student-job-menu.component.html',
  styleUrls: ['./student-job-menu.component.css']
})
export class StudentJobMenuComponent {
  public activeTab: string = 'jobLst';
}
