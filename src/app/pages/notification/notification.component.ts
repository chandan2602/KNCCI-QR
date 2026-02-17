import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { BaseComponent } from '../base.component';
import * as moment from 'moment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent extends BaseComponent implements OnInit {
  myForm: UntypedFormGroup;
  isEdit: boolean = null;
  isDisable: boolean = false;
  table: Array<any> = [];
  htmlContent: any = '';
  htmlContentWithOutHtml = '';
  roles: Array<any> = [];
  tId: string = '';
  subscription: any = {}
  TenantCode: string = sessionStorage.getItem('TenantCode');
  sms: boolean = false;
  eMail: boolean = false;
  notification: boolean = false;
  dropdownSettings: any = {};
  editData: any;
  selectedCategory!: { USERID: number; FIRSTNAME: string; }[];
  dropdownListCategory: { USERID: number; FIRSTNAME: string; }[] = [];
  file: File;
  fileName: any;
  documentType = "circularAlert";
  labelName: any = {};
  headingName: any = {};
  workItemId: any;
  stId: any;
  submitted = false;
  minDate: any = moment().format('yyyy-MM-DD');
  notificationtype: any;
  subject: any;
  startDate: any;
  
					tooltipContent = `
					Company Admins can use this section to send notifications directly to registered students. Select the recipients and compose your message to share important updates, reminders, or announcements.
					`;

  showHtml() {
    this.htmlContentWithOutHtml = document.getElementById('htmldiv')?.innerHTML;
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService, private FileuploadService: FileuploadService) {
    super(CommonService, toastr);
    this.getRoles(this.TenantCode);
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({

      notification_type: ['', [Validators.required]],
      notification_subject: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      // message_type: ['', Validators.required],
      message: [''],
      notification_priority: [''],
      designation_id: ['', Validators.required],
      // circular_upload: ['', Validators.required],
      // template_type: ['', Validators.required],
      staff: ['', Validators.required],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'USERID',
      textField: 'FIRSTNAME',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner();
  }
  onItemSelect(e) { }
  onSelectAll(e) { }


  getRoles(tId) {
    this.stId = tId
    this.activeSpinner();
    let payLoad = {
      TENANT_CODE: tId || this.TenantCode,
      "RoleName": "Admin",
    }
    this.CommonService.postCall('GetRolesByTenant', payLoad).subscribe(
      (res: any) => {
        this.roles = res.TenantBasdRoles.filter(e => e.ROLE_NAME != 'Trainer')

        this.subscription = res.Subscription && res.Subscription[0]
        this.deactivateSpinner();
      }, err => {
        this.deactivateSpinner();
      }
    )
  }

  designationChange(id: any) {
    this.dropdownListCategory = [];
    this.selectedCategory = [];
    const { company_id, TenantCode } = sessionStorage;
    id = id || 0;
    id = (+company_id == 0) ? [1, 2].includes(+id) ? 1 : id : id;
    // this.activeSpinner();
    let payLoad = {
      "TenantCode": TenantCode,
      "company_id": company_id || 0,
      "objUserinrole": { "RoleId": id }
    }

    this.CommonService.postCall(`UserRolesChange`, payLoad).subscribe(
      (res) => {
        this.dropdownListCategory = res;
        // this.deactivateSpinner();
        e => {
          // this.deactivateSpinner()
        }
      })
  }
  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['doc', 'docx', 'pdf', 'jpg', 'gif', 'png', 'xlsx', 'xlr', 'ppt', 'pptx', 'jpeg']
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload();
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning('Please upload pfc,doc and jpeg file formats only.');
        event.target.value = ''
      }
    }
  }

  // 

  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/circularupload');
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
      } catch (e) { console.log(e); }

    }, err => { })
  }

  getName(folderName: string, fileName: any) {
    return fileName?.substr(fileName?.indexOf(`${folderName}_`)).replace(`${folderName}_`, '').split(/_(.*)/s)[1];
  }


  get f() { return this.myForm.controls; }

  onSubmit(form: UntypedFormGroup) {
    this.submitted = true;
    if (form.invalid) {
      this.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }

    let value = form.value;
    let user = [];
    // let users = [];
    this.selectedCategory.forEach(e => {
      let obj = {
        "notification_to": e.USERID
      }
      user.push(obj);
    });
    // this.selectedCategory.forEach(e => {
    //   let obj = {
    //     "people_id": e.USERID
    //   }
    //   users.push(obj);
    // });
    // console.log(user, users);
    console.log(user);

    let PayloadNotification = {
      message_type: 'Notification',
      notification_type: value.notification_type,
      notification_from: sessionStorage.getItem('UserId'),
      user: user,
      notification_code: '',
      notification_subject: value.notification_subject,
      notification_body: this.htmlContent,
      notification_file: value.circular_upload,
      notification_send_status: "",
      notification_priority: value.notification_priority,
      notification_read_status: 0,
      notification_status: "",
      designation_id: value.designation_id,
      start_date: value.start_date,
      end_date: value.end_date,
      created_by: sessionStorage.getItem('UserId'),
      modified_by: sessionStorage.getItem('UserId'),
      tnt_code: this.stId || sessionStorage.getItem('TenantCode'),
      attachment: this.fileName
    }
    this.CommonService.postCall('EmsAlerts/StaffCircularAlert', PayloadNotification).subscribe((res: any) => {
      this.toastr.success("Notification has been sent");

      setTimeout(() => {
        window.location.reload();
      }, 200);
    }, err => {
      this.toastr.error(err.error ? err.error : 'Notification has not been sent');
    })

  }


  // cancle() {
  //   window.history.back();
  // }

  changeStartdate() {
    this.myForm.patchValue({
      end_date: ''
    })
  }



}
