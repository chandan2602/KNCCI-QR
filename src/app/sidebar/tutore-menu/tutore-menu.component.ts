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
  constructor(CommonService: CommonService, toastr: ToastrService) {

    super(CommonService, toastr);
  }

  ngOnInit(): void {
    setTimeout(() => this.companyDetails(), 10);
    console.clear();
    console.log("ScreenPermission:=", this.ScreenPermission);

  }
  companyDetails() {
    const { fileUrl } = environment;
    if (sessionStorage.homepageimage_path) {
      document.getElementById("homepageimage_path")?.setAttribute("src", `${fileUrl}${sessionStorage.homepageimage_path} `);

    }
  }

}
