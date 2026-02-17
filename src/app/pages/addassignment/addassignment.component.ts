import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileuploadService } from '../../services/fileupload.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BaseComponent } from '../base.component';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-addassignment',
  templateUrl: './addassignment.component.html',
  styleUrls: ['./addassignment.component.css']
})
export class AddassignmentComponent extends BaseComponent implements OnInit {
  myForm: UntypedFormGroup;
  id: string | number = null;
  startDate: Date = null;
  isDisable: boolean = false;
  file: File;
  fileName: string = null;
  progress: number = null;
  minDate: any = moment().format('yyyy-MM-DD')
  myCourseList: Array<any> = [];
  private readonly onDestroy = new Subscription();
  dropdownList = [];
  selectedItems = [];
  //settings = {};
  dropdownSettings: IDropdownSettings;
  traineesName = [];
  tableData = [];
  selectedIds = [];
  traineeList: Array<any> = []

  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, private active: ActivatedRoute, private route: Router, private FileuploadService: FileuploadService, toastr: ToastrService) {
    super(CommonService, toastr)
    active.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.id = res.id;
        this.getData(res.id);
        this.isDisable = true
      }
    })
    this.getCourses();
  }
  cources: [] = [];
  courceId: string = ''
  // schedulId: string | number = '';
  schedulId: string = '';
  scheduls: [] = [];
  data: any = {}
  assessments: Array<any> = []
  ngOnInit(): void {

    this.myForm = this.fb.group({
      ASSIGNMENT_NAME: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      ASSIGNMENT_COURSE: ['', Validators.required],
      ASSIGNMENT_COURSE_SCHEDULE: ['', Validators.required],
      // ASSIGNMENTS_SCHEDULE_ID: [''],
      ASSIGNMENT_START_DATE: [''],
      ASSIGNMENT_END_DATE: [''],
      ASSIGNMENT_UPLOAD: [false],
      ASSIGNMENT_MAX_MARKS: ['', Validators.required],
      AssignmentStatus: [1],
      StudentList: []
    })


    this.dropdownList = this.traineeList;
    this.tableData = [...this.traineeList];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "userid",
      textField: "firstname",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  custom(type) {
    return function (control: UntypedFormControl) {
      const file = control.value;
      if (file) {
        const extension = file.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }

      return null;
    };
  }

  getData(id) {
    this.activeSpinner()
    this.CommonService.getAssignmentsById(id).subscribe((res: any) => {
      this.deactivateSpinner();
      if (res instanceof Array) {
        this.data = res[0];
      } else {
        this.data = res;
      }
      if (res) {

        this.startDate = this.data.ASSIGNMENT_START_DATE;
        this.courceId = this.data.ASSIGNMENT_COURSE;
        this.fileName = this.data.ASSIGNMENT_UPLOAD;
        this.schedulId = this.data.ASSIGNMENT_COURSE_SCHEDULE;



        // this.myForm.controls['ASSIGNMENT_UPLOAD'].setValue(this.fileName)
        this.myForm.controls['AssignmentStatus'].setValue(this.data.ASSIGNMENT_STATUS ? 1 : 0);
        // idField: "userid",
        // textField: "firstname",
        if (this.courceId) {
          this.courceChange();
        }

        if (this.schedulId) {
          this.getTrainees(true);
        }
      }
    }, err => {
      this.deactivateSpinner();
    })
  }

  // getCourses() {
  //   this.activeSpinner()
  //   this.CommonService.getAdminCourses().subscribe((res: any) => {
  //     this.cources = res;
  //     this.deactivateSpinner()
  //   }, e => {
  //     this.deactivateSpinner()
  //   })
  // }

  getCourses() {
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };

    // this.myCourseList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', payLoad).subscribe((res: any) => {
      // this.myCourseList = res.dtCourseScehdule;
      this.cources = res;
      this.renderDataTable();
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }


  courceChange() {
    let data = {
      "CourseId": this.courceId
    }
    this.activeSpinner();
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.scheduls = res;
    }, e => { this.deactivateSpinner() })
  }

  getTrainees(isFirstTimeEdit: boolean = false) {
    this.activeSpinner();
    // this.CommonService.loadAssessmentDropdown(this.courceId, this.schedulId).subscribe((res: any) => {
    this.CommonService.getCall('CourseSchedule/get-trainees/', `${this.schedulId}`).subscribe((res: any) => {
      this.deactivateSpinner();
      this.traineeList = res.data;
      if (isFirstTimeEdit) {
        const list = this.data.StudentList.map(e => ({ userid: e.ASM_STUDENT_ID, firstname: this.traineeList.find(x => x.userid == e.ASM_STUDENT_ID).firstname }));
        console.log(list);
        // setTimeout(() => this.myForm.patchValue({ StudentList: list }), 100);
        this.myForm.patchValue({ StudentList: list });
      }
      // this.assessments = res;
    }, e => { this.deactivateSpinner() })
  }


  onSubmit(form: UntypedFormGroup) {
    if (form.invalid) {
      this.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }
    let params = this.myForm.getRawValue();

    params = { ...params };
    // delete params.StudentList;

    if (params.ASSIGNMENT_UPLOAD == false) {
      if (this.fileName == null) {
        this.toastr.warning('Please upload File');
        return;
      }
    }
    params['TENANT_CODE'] = sessionStorage.getItem('TenantCode');
    // params['ASSIGNMENT_COURSE_SCHEDULE'] = parseInt(params['ASSIGNMENT_COURSE_SCHEDULE']);
    params.ASSIGNMENT_ID = this.data.ASSIGNMENT_ID || 0;
    params.ASSIGNMENT_UPLOAD = this.fileName;
    const new_student = {
      ASM_STUDENT_ID: 0,
      ASM_COURSE_ID: params.ASSIGNMENT_COURSE,
      ASM_COURSE_SCHEDULE_ID: params.ASSIGNMENT_COURSE_SCHEDULE,
      ASM_ASSIGNMENT_ID: params.ASSIGNMENT_ID,
      ASM_CREATEDBY: sessionStorage.UserId,
      ASM_STATUS: true,
      TNT_CODE: sessionStorage.TenantCode,
      ASM_ID: 0
    };
    // params.StudentList = params.StudentList.map((e: any) => ({ ...new_student, ASM_STUDENT_ID: e.userid }));
    // console.log(params.StudentList);
    // return;
    params.StudentList = params.StudentList || [];
    if (params.StudentList.length == 0) {
      this.toastr.warning('Please select atleast one Trainee');
      return;
    }
    this.activeSpinner();
    if (this.id) {
      const newList = params.StudentList.map((e: any) => e.userid);
      const oldList = this.data.StudentList.map((e: any) => e.ASM_STUDENT_ID);
      const arr = [... new Set([...oldList, ...newList])];
      arr.forEach(id => {
        if (newList.includes(id) && oldList.includes(id)) { }
        else if (newList.includes(id)) {
          this.data.StudentList.push({ ...new_student, ASM_STUDENT_ID: id });
        }
        else {
          this.data.StudentList.find(e => e.ASM_STUDENT_ID == id).ASM_STATUS = false;
        }

      });
      params.StudentList = this.data.StudentList;
      console.log(params.StudentList);



      this.CommonService.postCall('updateAssignments', params).subscribe((res: any) => {
        //  alert('Information saved successfully.')
        this.deactivateSpinner();
        this.toastr.success('Information Updated successfully.');
        this.route.navigate(['HOME/assignments']);
      }, err => {
        this.deactivateSpinner();
        this.toastr.error(err.error ? err.error : err);
      })

    } else {
      params.StudentList = params.StudentList.map((e: any) => ({ ...new_student, ASM_STUDENT_ID: e.userid }));
      this.CommonService.setAssignments(params).subscribe((res: any) => {
        //  alert('Information saved successfully.')
        this.deactivateSpinner();
        this.toastr.success('Information saved successfully.');
        this.route.navigate(['HOME/assignments']);
      }, err => {
        this.deactivateSpinner();
      })
    }
  }


  // upload() {
  //   const formData = new FormData();
  //   formData.append('Yes', this.file);
  //   formData.append('ClientDocs', 'ClientDocs');
  //   formData.append('Course', this.courceId);
  //   this.activeSpinner();
  //   this.FileuploadService.upload(formData, 'Assignments/UploadAssignment').subscribe((res: any) => {
  //     // this.file = null
  //     this.progress = res.message || this.progress;
  //     this.fileName = res.path;
  //     if (this.fileName) this.deactivateSpinner()
  //     this.myForm.controls['ASSIGNMENT_UPLOAD'].setValue(this.fileName)
  //   }, err => { this.deactivateSpinner(); })
  // }
  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('Yes', this.file);
    formData.append('ClientDocs', 'ClientDocs');
    formData.append('Course', this.courceId);

    formData.append('DIRECTORY_NAME', 'Attachments/UploadAssignment');
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;

      } catch (e) { console.log(e); }

    }, err => { })
  }
  change(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['doc', 'docx', 'pdf'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning('Please upload pdf and doc file formats only.');
        event.target.value = ''
      }
    }
  }
  endDateChange(eDate) {
    let sDate = this.myForm.get('ASSIGNMENT_START_DATE').value;
    if (!sDate) {
      this.toastr.warning('Please select start Date');
      this.myForm.get('ASSIGNMENT_END_DATE').setValue(null);
      return
    }
    if (!moment(eDate).isSameOrAfter(sDate)) {
      this.toastr.warning('End date should be equal or more than start Date');
      this.myForm.get('ASSIGNMENT_END_DATE').setValue(null);
    }
  }

  onItemSelect(item: any) {
    this.selectedIds.push(item.userid);
    // this.resetTable();
  }
  onSelectAll(event: any) {
    this.selectedIds = this.traineeList.map(x => x.userid);
    // this.resetTable();
  }
  onDeSelectAll() {
    this.selectedIds = [];
    this.tableData = [...this.traineeList];
  }
  onItemDeSelect(item: any) {
    this.selectedIds.splice(this.selectedIds.indexOf(item.userid), 1);
    //this.resetTable();
  }
  // resetTable() {
  //   this.tableData = [
  //     ...this.traineeList.filter(x => this.selectedIds.includes(x.userid))
  //   ];
  // }



}
// [ngModel] ="dt | date:'yyyy-MM-dd'"