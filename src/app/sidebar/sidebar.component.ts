import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  roleId: number | string = sessionStorage.getItem('RoleId') || 3;
  menus: Array<any> = []
  constructor(private route: ActivatedRoute, private router: Router, private service: CommonService) {
    if (this.roleId == 4)
      this.getMenu();
  }

  ngOnInit(): void {

  }

  getClass(name) {
    return "mdi " + name + " menu-icon"
  }

  navigate(path, menu) {
    if (!menu.childs.length && path) {
      this.router.navigate(['HOME/' + path])
    }

  }
  getMenu() {
    let payLoad = {
      RoleId: parseInt(sessionStorage.getItem('RoleId')), TENANT_CODE: parseInt(sessionStorage.getItem('TenantCode'))
    }
    this.service.postCall('Account/LoadMenusByRoleId', payLoad).subscribe((res) => {
      this.menus = res;

      //this.menus = [];
    }, err => { })
  }
  getId(id: any) {
    return id.replaceAll(/\s/g, '')
  }
}
