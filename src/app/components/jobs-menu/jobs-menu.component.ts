import { Component } from '@angular/core';

@Component({
  selector: 'app-jobs-menu',
  templateUrl: './jobs-menu.component.html',
  styleUrls: ['./jobs-menu.component.css']
})
export class JobsMenuComponent {
  public tooltipContent: string = 'More information about jobs';
  public activeTab: string = 'jobLst';
}
