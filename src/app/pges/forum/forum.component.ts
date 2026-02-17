import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent  extends BaseComponent implements OnInit {

  cources: Array<any> = [];
  courceId: string = ''
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;

  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService,  toastr: ToastrService, private FileuploadService: FileuploadService) {
    super(CommonService,toastr)
    this.loadForums()
    this.getCourses()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      MNAME: [sessionStorage.getItem('Username'), Validators.required,],
      CourseId: ['', Validators.required],
      Description: ['', Validators.required],
      Topic: ['', Validators.required],
      Attachment: ['']
    })
  }



  getCourses() {
    
    if(this.roleId == '3'){
      this.activeSpinner()
      this.CommonService.getCourses().subscribe((res: any) => {
        this.cources = res;
        console.log(res,this.cources)
        this.deactivateSpinner()
      }, e => {
        this.deactivateSpinner()
      })

    }else{
    this.activeSpinner()
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.cources = res;
      console.log(res,this.cources)
      this.deactivateSpinner()
    }, e => {
      this.deactivateSpinner()
    })
  }

  }


  loadForums() {
    this.activeSpinner()
    let payLoad = {
      TENANT_CODE: this.tId||this.TenantCode,
      RoleId:this.roleId
    }
    this.CommonService.postCall("LoadFourm", payLoad).subscribe((res: any) => {
      this.table = [];
      if(res instanceof Array){
        this.table = res;
       
      }
      this.renderDataTable()
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }


  close() {
    this.myForm.reset();
    this.myForm.controls['MNAME'].setValue(sessionStorage.getItem('Username'))
  }
  // add() { }


  onSubmit(form: UntypedFormGroup) {
    let payLoad = form.value;
    payLoad['TenantCode'] = sessionStorage.getItem('TenantCode');
    payLoad['CREATEDBY'] = sessionStorage.getItem('UserId');
    payLoad['RoleId'] = sessionStorage.getItem('RoleId');
    this.activeSpinner();
    this.CommonService.postCall('AddTopic', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.toastr.success('Forum topic created Successfully')
        document.getElementById('md_close').click()
      }, error => { this.deactivateSpinner(); this.toastr.error(error.message ? error.message : error) }
    )

  }

  changeFile(event) {
    if (!this.courceId) {
      this.toastr.warning('Please select course name');
      return
    }
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['doc', 'docx', 'pdf', 'jpg', 'gif', 'png', 'xlsx', 'xlr', 'ppt', 'pptx', 'jpeg', 'zip']
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload()
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning('Please upload the' + JSON.stringify(types))
        event.target.value = ''
      }
    }


  }
  upload() {
    const formData = new FormData();
    formData.append('File', this.file);
    formData.append('ClientDocs', 'ClientDocs');
    formData.append('Course', this.courceId);

    this.activeSpinner();
    this.FileuploadService.upload(formData, 'UploadTopicFiles').subscribe((res: any) => {
      try {
        this.fileName = res.path;
        if (this.fileName) {
          this.deactivateSpinner()
          this.myForm.controls['Attachment'].setValue(this.fileName)
        }
      } catch (e) {
        console.log(e)
      }

    }, err => { this.deactivateSpinner(); })
  }
  changeTname() {
    this.loadForums()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}