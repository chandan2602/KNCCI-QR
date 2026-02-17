import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { WindowRefService } from '../../../app/services/window-ref.service';
import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-posting-internship-view',
  templateUrl: './posting-internship-view.component.html',
  styleUrls: ['./posting-internship-view.component.css']
})
export class PostingInternshipViewComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() parentId: any = 0; editData: any = ''; imageURL: any = ''; crtfcteURL: any = '';

  constructor(CommonService: CommonService, private winRef: WindowRefService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, toastr: ToastrService) {
    super(CommonService, toastr)
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['parentId']) {
      if(changes['parentId'].currentValue != '') {
        if(this.parentId != 0 && this.parentId != '') {
          this.GetById(this.parentId)
        }
        
      }
    }
  }
  
  ngOnInit(): void {

  }

  GetById(course_id: any) {
    this.editData = '';
      let payLoad = { COURSE_ID: course_id }
    this.CommonService.postCall('EditCourse', payLoad).subscribe((res: any) => {
      if (res instanceof Array) {
        if (res.length) {
          this.editData = res[0];
          this.imageURL = (this.editData.COURSE_IMAGE != '' && this.editData.COURSE_IMAGE != null) ? `${this.urlFiles}${this.editData.COURSE_IMAGE}`: '';
          this.crtfcteURL = (this.editData.UPLOAD_CERTIFIED != null && this.editData.UPLOAD_CERTIFIED != '') ? `${this.urlFiles}${this.editData.UPLOAD_CERTIFIED}`: '';
        }
      } else {
        this.editData = res;
        this.imageURL = (this.editData.COURSE_IMAGE != '' && this.editData.COURSE_IMAGE != null) ? `${this.urlFiles}${this.editData.COURSE_IMAGE}`: '';
          this.crtfcteURL = (this.editData.UPLOAD_CERTIFIED != null && this.editData.UPLOAD_CERTIFIED != '') ? `${this.urlFiles}${this.editData.UPLOAD_CERTIFIED}`: '';
      }
    }, err => { })
  }
}
