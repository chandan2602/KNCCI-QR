import { Component } from '@angular/core';

@Component({
  selector: 'app-internship-menu',
  templateUrl: './internship-menu.component.html',
  styleUrls: ['./internship-menu.component.css']
})
export class InternshipMenuComponent {
  public tooltipContent: string = 'More information about internships';
  activeTab = 'intrnShipLst';
}
