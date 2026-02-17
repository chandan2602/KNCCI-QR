import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, UntypedFormArray } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { BaseComponent } from '../base.component';
import * as moment from 'moment';
@Component({
  selector: 'app-addpol',
  templateUrl: './addpol.component.html',
  styleUrls: ['./addpol.component.css']
})
export class AddpolComponent extends BaseComponent implements OnInit {
  myForm: UntypedFormGroup;
  cources: Array<any> = [

  ];
  courceId: string = '';
  dropdownSettings: any = {}
  selectedItems: { item_id: number; item_text: string; }[];
  dropdownList: { item_id: number; item_text: string; }[] = []
  isData: boolean;
  pollId: string;
  startDate: any;
  endDate: any;
  isEdit: boolean;
  selectedMember: { item_id: number; item_text: string; }[];
  members: Array<any> = [
    { item_id: 1, item_text: 'admin' },
    { item_id: 2, item_text: 'trainer' },
    { item_id: 3, item_text: 'student' }
  ]
  
  minDate: any = moment().format('yyyy-MM-DD')
  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService, active: ActivatedRoute, toastr: ToastrService, private location: Location) {
    super(CommonService,toastr);
    this.getCourses();
    active.queryParams.subscribe((res) => {
      if (res.edit) {
        this.pollId = res.edit;
      }
    })
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      PollTitle: ['', Validators.required,],
      ASSIGNMENT_COURSE: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Description: ['', Validators.required],
      PollQuestion: ['', Validators.required],
      formArray: this.fb.array([]),
      PollMember: ['', Validators.required]
    })
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    for (let i in [1, 2]) {
      let grp: UntypedFormGroup = this.getOptionGroup()
      arrayControl.push(grp)
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
    if (this.pollId) {
      this.getPollData();
      this.isEdit = true
    }

  }

  getPollData() {
    let data = {
      "PollId": this.pollId
    }
    this.CommonService.postCall('Editpoll', data).subscribe((res: any) => {
      let Table = res.Table && res.Table[0];
      if (Object.keys(Table).length) {
        this.myForm.controls['PollTitle'].setValue(Table.PollTitle);
        this.myForm.controls['Description'].setValue(Table.Description);
        this.myForm.controls['PollQuestion'].setValue(Table.PollQuestion);
        this.startDate = Table.StartDate;
        this.endDate = Table.EndDate;
        let table1 = res.Table1;
        let cources = []
        table1.map((item) => {
          let id = item.COURSEID;
          let index = this.dropdownList.findIndex(data => data.item_id == id);
          if (index > -1) {
            cources.push(this.dropdownList[index])
          }
        });
        this.selectedItems = cources;
        let mems:[]=Table.PollMember.split(',')||[];
        let selectedMember=[]
        mems.map(item=>{
          let index = this.members.findIndex(data => data.item_id == item);
          if (index > -1) {
            selectedMember.push(this.members[index])
          }
        })
        this.selectedMember=selectedMember;
        let table2 = res.Table2;
        if (table2.length) {
          for (let i in table2) {
            let obj = table2[i];
            if (parseInt(i) > 1) {
              this.add();
            }
            const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
            arrayControl.controls[i].controls['option'].setValue(obj.OptionText)
          }
        }

        let members = Table.PollMember
      }
    }, err => { })
  }

  onItemSelect(e) { }
  onSelectAll(e) { }
  getOptionGroup() {
    let newGroup = this.fb.group({
      option: ['', [Validators.required]],

    });
    return newGroup
  }


  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getCourses() {
    this.activeSpinner()
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.cources = res;
      res.map(item => {
        let obj = {
          item_id: item.COURSE_ID,
          item_text: item.COURSE_NAME
        }
        this.dropdownList.push(obj)
      })
      this.isData = true
      this.deactivateSpinner()
    }, e => {
      this.isData = true
      this.deactivateSpinner()
    })
  }
  courceChange() { }

  add() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let grp: UntypedFormGroup = this.getOptionGroup()
    arrayControl.push(grp)
  }
  delete() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let index = arrayControl.length;
    arrayControl.removeAt(index - 1)
  }

  isVisable() {
    let arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    if (arrayControl && arrayControl.controls.length > 2) {
      return true
    }
    else {
      return false
    }
  }
  isAdd() {

    let arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    if (arrayControl && arrayControl.controls.length > 9) {
      return false
    }
    else {
      return true
    }

  }
  onSubmit(form: UntypedFormGroup) {
    let data = form.value;

    let postData: any = {};
    postData.PollTitle = data.PollTitle;
    postData.PollQuestion = data.PollQuestion;
    postData.StartDate = data.StartDate;
    postData.EndDate = data.EndDate;
    postData.Description = data.Description;
    postData.TENANT_CODE = sessionStorage.getItem('TenantCode')
    for (let i in data.formArray) {
      let index = parseInt(i) + 1
      let key = 'POLL_OPTION' + index
      postData[key] = data.formArray[i].option
    }
    let cources = null;

    data.ASSIGNMENT_COURSE.map((item) => {
      let id = item.item_id;
      if (cources) {
        cources = cources + ',' + id
      } else {
        cources = id
      }

    });
    let PollMember = null;
    data.PollMember.map(item => {
      let id = item.item_id;
      if (PollMember
      ) {
        PollMember = PollMember + ',' + id
      } else {
        PollMember = id
      }
    })
    postData.CourseId = cources;
    postData.PollMember = PollMember
      ;
    if (this.isEdit) {
      postData.PollId = this.pollId;
      postData.LASTMDFBY = sessionStorage.getItem('UserId')
      this.CommonService.postCall('Updatepoll', postData).subscribe((res) => {
        this.location.back()
        this.toastr.success('updated poll successfully')
      }, err => {
        this.toastr.error('poll not updated')
        console.log(err)

      })
    } else {
      postData.CREATEDBY = sessionStorage.getItem('UserId')
      this.CommonService.postCall('Createpoll', postData).subscribe((res) => {
        this.location.back()
        this.toastr.success('created poll successfully')
      }, err => {
        this.toastr.error('poll not created')
        console.log(err)
      })
    }
  }
  endDateChange(eDate) {
    let sDate = this.myForm.get('StartDate').value;
    if (!sDate) {
      this.toastr.warning('Please select strat Date')
      this.myForm.get('EndDate').setValue(null)
      return
    }
    if (!moment(eDate).isSameOrAfter(sDate)) {
      this.toastr.warning('End date should be equal or more than start Date')
      this.myForm.get('EndDate').setValue(null)
    }
  }
}
