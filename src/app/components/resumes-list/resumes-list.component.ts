import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-resumes-list',
  templateUrl: './resumes-list.component.html',
  styleUrls: ['./resumes-list.component.css']
})
export class ResumesListComponent extends BaseComponent implements OnInit {


  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false; listGrid: any[] = [];

  	tooltipContent = `
This section displays resumes uploaded by students upon completion of their internships.<br><br>
Company admins can<strong> view </strong>these resumes and may <strong>contact the students directly </strong>if needed for future opportunities.
`;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    // this.isAdmin = (+this.USERTYPE == 24);
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

  LoadGrid() {
    this.CommonService.activateSpinner();
    let payLoad: any = {company_id: sessionStorage.getItem('company_id'), tnt_code: sessionStorage.getItem('TenantCode'), job_id: 0}
    this.CommonService.getCall(`InternshipJobs/GetResumeByCompanyIdAsync/${sessionStorage.getItem('company_id')}`).subscribe(
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

  OnEditView(evnt: any, ctrl: string = '' ) {
      if (ctrl === 'view' && evnt.resume) {
    window.open(evnt.resume, '_blank');
  }
  }

}
