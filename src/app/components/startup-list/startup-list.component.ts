import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';
declare var $: any;

@Component({
  selector: 'app-startup-list',
  templateUrl: './startup-list.component.html',
  styleUrls: ['./startup-list.component.css']
})
export class StartupListComponent extends BaseComponent implements OnInit {
  parentMessage: any = ''; parentUser: any = 0;

  isView: boolean = false;
  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false; listGrid: any[] = [];

  
					tooltipContent = `
You can view the submitted start-up ideas in the table below. Click the <strong> View</strong> button to see ratings, comments, and the current status of each idea.
<br><br>
To submit a new start-up idea:<br><br>

Click the<strong> Add </strong>button.
Fill in all the required details across the six tabs (Start-up Idea, Market & Customers, Funding, etc.).
Once completed, click <strong>Submit.</strong><br><br>

After submission, your idea will be forwarded to the respective <strong>Incubator under the selected sector</strong> for review and rating.
`;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.isAdmin = (+this.USERTYPE == 24);
    // this.active.queryParams.subscribe((res) => {
    //   if (Object.keys(res).length) {
    //     this.params = res;
    //     this.getAll();
    //   }
    // })
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  LoadGrid() { // Registration/GetMyAllStartUpListAsync
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`Registration/GetMyAllStartUpListAsync/${sessionStorage.UserId}`, '', false).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.listGrid = res.data;
        } else {
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
        // window.history.back()
      })
  }

  add() {
    this.router.navigate(['/HOME/startsUp'])
  }

  OnEditView(evnt: any, ctrl: string = '' ) {
    this.isView = true
    this.parentMessage = evnt.startup_id, this.parentUser = evnt?.user_id;
    // let params = {type: ctrl, id: evnt?.startup_id}
    // this.router.navigate(['/HOME/startup-profle'], { queryParams: params })
  }

  Close() {
    this.isView = false;
  }
}
