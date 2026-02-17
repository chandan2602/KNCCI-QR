import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { MailBoxComponent } from 'src/app/pges/mail-box/mail-box.component';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';


@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.css']
})
export class ComposeMailComponent implements OnInit {
  @Input() parent: MailBoxComponent;
  file:any;
  Type: string = "New Mail"
  myForm: UntypedFormGroup;
  parentType: string = 'New'
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
  fileNames: string = null;
  selectedUsers: { item_id: number; item_text: string; }[];
  selectedCCUsers: { item_id: number; item_text: string; }[];
  dropdownList: { item_id: number; item_text: string; }[] = [];
  dropdownSettings: any = {}
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService,private FileuploadService: FileuploadService) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getUsers();
    switch (this.parent.type) {
      case 'new':
        this.Type = "New Mail"
        break;
      case 'replay':
        this.Type = "Replay Mail"
        break;
      case 'forward':
        this.Type = "Forward Mail"
        break;
      default:
        this.Type = "New Mail"
        break;

    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  createForm() {
    this.myForm = this.fb.group({
      Message: [''],
      Subject: [''],
      ToUserIds: ['', Validators.required],
      CcUserIds: [''],
      ParentId: ['']
    })
  }

  changeFile(event) {
    let file: Array<File>;
    file = event.target.files;
    this.file = file;
    this.fileNames = Array.from(file).map(x => x.name).join('');
  }
  removeFile() {
    document.getElementById('mailfileId1')['value'] = '';
    this.fileNames = null;
    this.file = [];
  }
  Send() {
    if (!this.myForm.valid) {
      this.toastr.warning('Need to select one user to sent')
    }
    let to = null;
    to = this.selectedUsers.map(x => x.item_id).join(',')
    let cc = this.selectedCCUsers.map(x => x.item_id).join(',')
    let Subject = this.myForm.value['Subject'];
    let Message=this.myForm.value['Message'];
    const formData = new FormData();
    formData.append('ToUserIds',to);
    formData.append('CcUserIds',cc);
    formData.append('Subject',Subject);
    formData.append('Message',Message);
    if(this.file&&this.file[0])
    for (const file of this.file) {
      formData.append('Files', file) // file.name is optional
  }
    formData.append('FromUserId',this.parent.userId)
   this.parent.activeSpinner();
   this.CommonService.postCall('MailBox/SendMail',formData).subscribe(res=>{
     this.parent.deactivateSpinner();
       this.toastr.success("Mail has been sent");
       this.parent.loadInbox(this.parent.MailTypes[this.parent.action].loadUrl,this.parent.action)
     this.close()
   },err=>{
     this.parent.deactivateSpinner();
     this.toastr.warning('Mail not sent')
   })

  }


  close() {
    this.parent.closeall();
  }

  getUsers() {
    this.parent.activeSpinner();
    this.CommonService.getCall('MailBox/GetUsers/' + this.parent.TenantCode).subscribe(res => {
      res.map(item => {
        let obj = {
          item_id: item.USERID,
          item_text: item.USERNAME
        }
        this.dropdownList.push(obj)
      })
      this.parent.deactivateSpinner();
    }, err => {
      this.parent.deactivateSpinner();
    })
  }
  onItemSelect(e) { }
  onSelectAll(e) { }
}
