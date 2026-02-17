import { Component } from '@angular/core';

@Component({
  selector: 'app-founder-menu',
  templateUrl: './founder-menu.component.html',
  styleUrls: ['./founder-menu.component.css']
})
export class FounderMenuComponent {

  roleId: any = sessionStorage.getItem('RoleId');

}
