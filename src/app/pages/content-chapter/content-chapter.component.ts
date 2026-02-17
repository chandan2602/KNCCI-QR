import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-content-chapter',
  templateUrl: './content-chapter.component.html',
  styleUrls: ['./content-chapter.component.css']
})
export class ContentChapterComponent implements OnInit {
  table: Array<any> = [];
  ClsDropdown: Array<any> = [];
  subDropdown: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  dropdownSettings: any = {}

  isData: boolean;
  classId: string;


  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.loadChapter();
    this.getClass();

  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      cnt_class_name: ['', Validators.required,],
      cnt_sub_name: ['', Validators.required,],
      cnt_chapter_name: ['', Validators.required,],
      cnt_chapter_description: [''],
      cnt_status: [1, Validators.required],

    })

  }


  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner();
  }

  loadChapter() {
    this.activeSpinner();
    let payLoad: any = {
      TENANT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.CommonService.getCall('ContentChapter/GetList/' + 0).subscribe((res: any) => {
      this.table = [];
      setTimeout(() => {
        // res.forEach(element => {
        //   let sub=this.subDropdown.filter(x=>x.item_id==element.cnt_sub_id)
        //   element['cnt_sub_name']=sub[0]['item_text']

        // });
        this.table = res;
        // this.table.map((x) => x.stus = '');
        // this.table.forEach(x => {
        //   if (x.cnt_status)
        //     x.stus = 'Active';
        //   else
        //     x.stus = 'Inactive';
        // })

      }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })


  }

  handleClass(event) {
    this.activeSpinner()
    this.subDropdown = [];
    let id: any
    if (event.type == 'change') {
      id = event.target.value
    } else {
      id = event
    }

    this.CommonService.getCall('ContentSubject/GetDDList/' + id).subscribe((res: any) => {
      res.map(element => {
        let obj = {
          item_id: element.CNT_SUB_ID,
          item_text: element.CNT_SUB_NAME,
        }
        this.subDropdown.push(obj)
      })
      this.isData = true
      this.deactivateSpinner()
    })
  }


  getClass() {
    this.activeSpinner()
    this.CommonService.getCall('ContentClass/GetDDList').subscribe((res: any) => {

      res.map(item => {
        let obj = {
          item_id: item.cnt_class_id,
          item_text: item.cnt_class_name,
        }
        this.ClsDropdown.push(obj)
      })

      this.isData = true
      this.deactivateSpinner()
    }, e => {
      this.isData = true
      this.deactivateSpinner()
    })
  }

  getSubject() {
    this.activeSpinner()
    this.CommonService.getCall('ContentSubject/GetDDList').subscribe((res: any) => {
      res.map(item => {
        let obj = {
          item_id: item.CNT_SUB_ID,
          item_text: item.CNT_SUB_NAME,
        }
        this.subDropdown.push(obj)
      })
      this.isData = true
      this.deactivateSpinner()
    }, e => {
      this.isData = true
      this.deactivateSpinner()
    })
  }

  add() {
    this.editData = {};
    this.isEdit = false;
    this.myForm.reset();
  }
  close() {


  }

  onSubmit(form: UntypedFormGroup) {
    let value: any = form.value;
    value.TENANT_CODE = sessionStorage.getItem('TenantCode');
    let status: Boolean
    if (value.cnt_status == 1) {
      status = true
    } else {
      status = false
    }
    let payload = {
      "cnt_chapter_name": value.cnt_chapter_name,
      "cnt_chapter_description": value.cnt_chapter_description,
      "cnt_sub_id": value.cnt_sub_name,
      "cnt_status": status,
      "cnt_created_by": sessionStorage.getItem('UserId'),
      "cnt_modified_date": moment(new Date()),
      "cnt_modified_by": sessionStorage.getItem('UserId'),

    }
    if (this.isEdit) {
      payload['cnt_created_date'] = this.editData.cnt_created_date;
      payload['cnt_chapter_id'] = this.editData.cnt_chapter_id;
      this.CommonService.postCall('ContentChapter/Update', payload).subscribe((res: any) => {
        this.loadChapter();
        this.toastr.success("Chapter Updated Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Chapter Not Updated')
      })
    } else {

      this.CommonService.postCall('ContentChapter/Create', payload).subscribe((res: any) => {
        this.loadChapter();
        this.toastr.success("Chapter Created Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Chapter Not created')

      })
    }
  }

  edit(chapterId) {
    this.isEdit = true;
    this.myForm.reset();
    let payLoad = {
      "cnt_chapter_id": chapterId
    }
    this.CommonService.getCall('ContentChapter/GetById/' + chapterId).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
        this.datatransform()
      } else {
        this.editData = res;
        this.datatransform()
      }
    }, err => { }
    )
  }
  datatransform() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      //let value = this.editData[key];

      let value: any;

      if (key == "cnt_status") {
        value = this.editData[key] ? 1 : 0
        control.setValue(value);
      }
      else if (key == 'cnt_class_name') {
        value = this.editData['cnt_class_id']
        control.setValue(value);
      }
      else if (key == 'cnt_sub_name') {
        this.handleClass(this.editData['cnt_class_id'])
        value = this.editData['cnt_sub_id']

        control.setValue(value);
      } else {
        value = this.editData[key];
        if (value != undefined) control.setValue(value);

      }

    });
  }
}
