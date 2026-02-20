import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../app/pages/base.component';
import { CommonService } from '../../../app/services/common.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-tutore-menu',
  templateUrl: './tutore-menu.component.html',
  styleUrls: ['./tutore-menu.component.css']
})
export class TutoreMenuComponent extends BaseComponent implements OnInit {
  RoleId = sessionStorage.RoleId;
  USERTYPE = sessionStorage.USERTYPE;
  activeMenuId: string | null = null;

  constructor(CommonService: CommonService, toastr: ToastrService) {

    super(CommonService, toastr);
  }

  ngOnInit(): void {
    setTimeout(() => this.companyDetails(), 10);
    console.clear();
    console.log("ScreenPermission:=", this.ScreenPermission);
    this.setupMenuClickHandlers();
  }

  companyDetails() {
    const { fileUrl } = environment;
    if (sessionStorage.homepageimage_path) {
      document.getElementById("homepageimage_path")?.setAttribute("src", `${fileUrl}${sessionStorage.homepageimage_path} `);

    }
  }

  setupMenuClickHandlers() {
    const menuItems = document.querySelectorAll('.sidebar-menu-wrapper li.parent > a.has-arrow');
    menuItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const parentLi = (item as HTMLElement).closest('li.parent');
        if (parentLi) {
          const menuId = parentLi.getAttribute('data-menu-id');
          if (this.activeMenuId === menuId) {
            this.activeMenuId = null;
            parentLi.classList.remove('active');
          } else {
            // Close previously active menu
            const previousActive = document.querySelector('.sidebar-menu-wrapper li.parent.active');
            if (previousActive) {
              previousActive.classList.remove('active');
            }
            this.activeMenuId = menuId;
            parentLi.classList.add('active');
          }
        }
      });
    });
  }

}
