import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { constants } from 'src/app/constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-backup-manager',
  templateUrl: './backup-manager.component.html',
  styleUrls: ['./backup-manager.component.css']
})
export class BackupManagerComponent implements OnInit {
  tId: string = ''
  tenants: Array<any> = [];
  courses: Array<any> = [];
  data: any = {}
  table: Array<any> = [];
  archive: boolean = false;
  constructor(private CommonService: CommonService, private toastr: ToastrService,) {
    this.loadTenats();
  }


  ngOnInit(): void {
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  loadTenats() {
    let payLoad = {
      RoleId: sessionStorage.getItem('RoleId'),
      TNT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.activeSpinner();
    this.CommonService.postCall('LoadTenantByRoleId', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner()
        this.tenants = res;
      }, err => {
        this.deactivateSpinner()
      }
    )
  }
  getCourses() {
    this.reset();
    this.activeSpinner();
    let apiUrl=constants['GetAdminCourses']||'GetAdminCourses'
    let uri = apiUrl+'/' + sessionStorage.getItem('UserId');
    let id = sessionStorage.RoleId
    let code = this.tId
    let url = uri + '/' + id + '/' + code;
    this.CommonService.getCall(url).subscribe(
      (res: any) => {
        this.courses = res;
        this.deactivateSpinner()
      }, e => {

        this.deactivateSpinner()
      }
    )
  }
  materialChange() {
    this.getRecords();
  }
  courseChange() { }

  getRecords() {
    let url = this.archive ? 'LoadArchiveMaterials' : 'LoadMaterials';
    this.activeSpinner();
    this.CommonService.postCall(url, this.data).subscribe((res) => {
      this.table = [];
      setTimeout(() => { this.table = res }, 10);
      this.deactivateSpinner();
    }, err => {
      this.deactivateSpinner();
    })
  }
  reset() {
    this.courses = [];
    this.data = {
      CourseId: '',
      MaterialType: ''
    }
  }
  archiveclick(item) {
    let c = confirm('Do you want to Archive this material?');
    if (c) {
      this.activeSpinner();
      this.CommonService.postCall('ArchiveMaterial', { COURSEMETERIAL_ID: item['MATERIAL_ID'] }).subscribe(
        (res) => {
          this.deactivateSpinner();
          this.toastr.success(res);
          this.getRecords()
        },
        err => {
          this.toastr.warning(err.error ? err.error : 'error occured! Please try later');
          this.deactivateSpinner()
        }
      )
    }

  }
  undo(item) {
    let c = confirm('Do you want to Rollback this material?')
    if (c) {
      this.activeSpinner();
      this.CommonService.postCall('RollbackMaterial', { COURSEMETERIAL_ID: item['MATERIAL_ID'] }).subscribe(
        (res) => {
          this.deactivateSpinner();
          this.toastr.success(res);
          this.getRecords();
        },
        err => {
          this.toastr.warning(err.error ? err.error : 'error occured! Please try later');
          this.deactivateSpinner()
        }
      )
    }
  }
  actin(item, archive:boolean) {
    let archiveData = {
      url: 'ArchiveMaterial',
      msg: 'Do you want to Archive this material?'
    }
    let undoData = {
      url: 'RollbackMaterial',
      msg: 'Do you want to Rollback this material?'
    }
    let obj: { url: string, msg: string } = archive ? archiveData : undoData

    let c = confirm(obj.msg)
    if (c) {
      this.activeSpinner();
      this.CommonService.postCall(obj.url, { COURSEMETERIAL_ID: item['MATERIAL_ID'] }).subscribe(
        (res) => {
          this.deactivateSpinner();
          this.toastr.success(res);
          this.getRecords();
        },
        err => {
          this.toastr.warning(err.error ? err.error : 'error occured! Please try later');
          this.deactivateSpinner()
        }
      )
    }
  }
}

