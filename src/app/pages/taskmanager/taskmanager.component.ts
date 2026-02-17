import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-taskmanager',
  templateUrl: './taskmanager.component.html',
  styleUrls: ['./taskmanager.component.css']
})
export class TaskmanagerComponent implements OnInit {

  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any = {};
  parents: any=[]
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.loadTaskManager();
    this.BindParentTask()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      TaskName: ['', Validators.required],
      TaskType: ['', Validators.required],
      TaskUrl: ['',],
      Description: [''],
      ParentTaskId: [''],
      ShowInGrid: ['',],
      ShowInDashboard: [],
      CSSClass: [''],
      Status: [true, Validators.required]
    })
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  BindParentTask() {
    this.activeSpinner();
    let payload = {
      "TENANT_CODE": sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall('BindParentTask', payload).subscribe((res: any) => {
      this.parents=res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }
  loadTaskManager() {
    this.activeSpinner();
    this.CommonService.postCall('LoadTaskManager', { TENANT_CODE: sessionStorage.getItem('TenantCode') }).subscribe((res: any) => {
      this.table=[];
      setTimeout(()=>{
        this.table = res;
      },10)
     
      this.deactivateSpinner();
    }, err => { this.deactivateSpinner() })
  }

  add() {
    this.editData = {};
    this.isEdit = false;
    this.myForm.reset();
  }
  edit(data) {
    this.editData = {}
    this.isEdit = true;
    this.myForm.reset();
    this.editData.TaskId = data.TASKID;
    this.CommonService.postCall('editTaskmanager', this.editData).subscribe((res: any) => {
      this.editData = res;
      let ctrls: any = this.myForm.controls;
      Object.keys(ctrls).map((key: string) => {
        let control: UntypedFormControl = ctrls[key];
        control.setValue(res[key])
      })
    }, err => { })
  }
  onSubmit(form: UntypedFormGroup) {
    let payload = form.value;
    payload["LASTMDFBY"] = sessionStorage.getItem('UserId'),
      payload["CREATEDBY"] = this.editData.CREATEDBY || sessionStorage.getItem('UserId');
    payload.CREATEDDATE = this.editData.CREATEDDATE || moment(new Date())
    payload.LASTMDFDATE = moment(new Date())
    payload.TENANT_CODE = sessionStorage.getItem('TenantCode');
    payload.ParentTaskId=payload.ParentTaskId??0
    if (this.isEdit) {
      payload.TaskId = this.editData.TaskId;
      this.CommonService.postCall('UpdateTaskManager', payload).subscribe((res: any) => {
        this.loadTaskManager();
        this.toastr.success('Task Updated Successfully')
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error(err.error?err.error:'Task  not Updated')
      })
    } else {
      this.CommonService.postCall('CreateTaskManager', payload).subscribe((res: any) => {
        this.loadTaskManager();
        this.toastr.success('Task created Successfully')
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error(err.error?err.error.text||err.error:'Task  not created ')
      })

    }

  }
  close() { }
}
