import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.css']
})
export class VisualEditorComponent implements OnInit {

  myForm: UntypedFormGroup;

  editorData: any = [];
  courceId: string = '';
  dropdownSettings: any = {}
  selectedItems: { item_id: number; item_text: string; }[];
  dropdownList: { item_id: number; item_text: string; }[] = []
  isData: boolean;
  table: Array<any> = [];
  isEdit: boolean = false;
  editData: any = {};
  courses: Array<any> = [];
  shedules: Array<any> = [];
  assignData: any = {};
  points: Array<any> = []
  htmlContent: any = '';
  htmlContentWithOutHtml = '';
  materialName: string = '';
  contentId: string = '';
  MATERIALNAME: any = '';
  CourseName: any = '';
  myGroup: UntypedFormGroup;


  showHtml() {
    this.htmlContentWithOutHtml = document.getElementById('htmldiv').innerHTML;
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



  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.getCourses();

  }



  ngOnInit(): void {
    this.myForm = this.fb.group({

      ASSIGNMENT_COURSE: ['', Validators.required],
      MATERIALNAME: ['', Validators.required]
      // CourseName : ['', Validators.required]



    });




    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.loadVistualEditor();

  }

  onItemSelect(e) { }
  onSelectAll(e) { }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }


  // loadChapterCourse(){
  //   this.activeSpinner()
  //   let payLoad={
  //     TENANT_CODE:sessionStorage.getItem('TenantCode')
  //   }
  //   this.CommonService.postCall("LoadChapterCourse",payLoad).subscribe((res:any)=>{
  //     this.courses=res;
  //     console.log(this.courses)
  //     this.deactivateSpinner();
  //   },e=>{this.deactivateSpinner()});
  // }


  loadVistualEditor() {
    let payload = {
      "TENANT_CODE": 60268037

    }
    this.CommonService.postCall("VisualEditor/GetList", payload).subscribe((response: any) => {
      this.editorData = response;
  
    })
  }


  getCourses() {
    this.activeSpinner()
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.courses = res;
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
    console.log(this.dropdownList)
  }

  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.editData = {};
    this.selectedItems = [];
    this.materialName = '';
    this.htmlContent = '';
  }

  close1() {
    document.getElementById('close1').click()
  }


  onEdit(CONTENTID) {
    this.isEdit = true;
    this.contentId = CONTENTID
    let payload = {
      "CONTENTID": CONTENTID

    }
    this.CommonService.postCall("VisualEditor/Get", payload).subscribe((response: any) => {
      // this.editorData = response [0];
      let result = response.map(a => a.COURSEID);
      let coursearray = []
      result.forEach(element => {
        this.dropdownList.forEach(list => {
          if (element == list.item_id) {
            coursearray.push(list)
          }

        });
      });
      this.selectedItems = coursearray
      this.materialName = response[0].MATERIALNAME;
      this.htmlContent = response[0].COURSECONTENTS;
      console.log(coursearray)
      console.log(result)
    })


  }

  onSubmit(form: UntypedFormGroup) {
    let ids = ''
    // console.log(this.selectedItems, this.materialName, this.htmlContent)
    this.selectedItems.forEach(element => {
      console.log(element)


    });
    let result = this.selectedItems.map(a => a.item_id);
    // result.join(','); 
    // console.log(result.join(','))
    let payload = {
      "MATERIALNAME": this.materialName,
      "COURSECONTENTS": this.htmlContent,
      "TENANT_CODE": sessionStorage.getItem("TenantCode"),
      "COURSEIDS": result.join(','),
      "CREATEDBY": sessionStorage.getItem("UserId")
    }
    this.activeSpinner();
    if (this.isEdit) {
      payload['CONTENTID'] = this.contentId;
      this.CommonService.postCall("VisualEditor/update", payload).subscribe((response: any) => {
        this.editorData = response;
        console.log(response)
        this.toastr.success("Subject  Updated Successfully")
        this.loadVistualEditor();
        this.deactivateSpinner();
        this.selectedItems = [];
        this.materialName = '';
        this.htmlContent = '';
        document.getElementById('md_close').click()
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : 'VistualEditor not updated') });


    }
    else {
      this.CommonService.postCall("VisualEditor/Create", payload).subscribe((response: any) => {
        this.editorData = response;
        console.log(response)
        this.toastr.success("Subject  Created Successfully")
        this.loadVistualEditor();
        this.deactivateSpinner();
        this.selectedItems = [];
        this.materialName = '';
        this.htmlContent = '';
        document.getElementById('md_close').click()
      }, err => {
        this.deactivateSpinner(); this.toastr.error(err.error ? err.error : 'VistualEditor not Created')
      });
    }

    
    //     let payload= Object.assign({},form.value);
    //     payload.TENANT_CODE=sessionStorage.getItem('TenantCode');
    //     payload.COURSENAMES=this.editData.COURSENAMES||sessionStorage.getItem('');
    //     payload.MATERIALNAME=this.editData.MATERIALNAME||sessionStorage.getItem('');

    //     this.activeSpinner();
    //     if(this.isEdit){
    //       payload.CONTENTID=this.editData.CONTENTID;
    //       this.CommonService.postCall("UpdateSubjects",payload).subscribe((res:any)=>{
    //        this.toastr.success("VistualEditor updated Successfully")
    //        this.loadVistualEditor();
    //        this.deactivateSpinner();
    //        document.getElementById('md_close').click()
    //      },err=>{this.deactivateSpinner();this.toastr.error(err.error?err.error:'VistualEditor not updated')});
    //     }else{
    //      payload.COURSEIDS=this.editData.COURSEIDS;
    //      this.CommonService.postCall("VisualEditor/GetList",payload).subscribe((res:any)=>{
    //       this.toastr.success("Subject  Created Successfully")
    //       this.loadVistualEditor();
    //       this.deactivateSpinner();
    //       document.getElementById('md_close').click()
    //     },err=>{
    //       this.deactivateSpinner();this.toastr.error(err.error?err.error:'VistualEditor not Created')
    //      });
    //     }


  }

}





