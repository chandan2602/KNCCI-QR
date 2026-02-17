import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from 'src/app/dataDictionary';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-content-repo-add',
  templateUrl: './content-repo-add.component.html',
  styleUrls: ['./content-repo-add.component.css']
})
export class ContentRepoAddComponent extends BaseComponent implements OnInit {
  classes:Array<{cnt_class_id:string;cnt_class_name:string}>=[];
  subjects:Array<{CNT_SUB_ID:string;CNT_SUB_NAME:string}>=[];
  chapters:Array<{cnt_chapter_id:string;cnt_chapter_name:string}>=[];
  board:Array<{DICTIONARYNAME:string,DICTIONARYID:string}>=[];
  medium:Array<{DICTIONARYNAME:string,DICTIONARYID:string}>=[];
  fileModes:Array<{DICTIONARYNAME:string,DICTIONARYID:string}>=[];
  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService, toastr: ToastrService,private FileuploadService:FileuploadService,active:ActivatedRoute) {
    super(CommonService,toastr);
    this.getDictionary();
    active.params.subscribe(res=>{
      if(res.id=='edit'){
        this.isEdit=true
      }
    })
    active.queryParams.subscribe(res=>{
      if(res.id)this.edit(res);
    })
  }


  ngOnInit(): void {
    this.formInit();
  }
  formInit(){
    this.myForm=this.fb.group({
      CNTREPO_NAME:['',Validators.required],
      CNTREPO_DESCRIPTION:['',Validators.required],
      CNTREPO_CLASSID:['',Validators.required],
      CNTREPO_SUBJECTID:['',Validators.required],
      CNTREPO_CHAPTERID:['',Validators.required],
      CNTREPO_MODETYPEID:['',Validators.required],
      CNTREPO_BOARDID:['',Validators.required],
      CNTREPO_MEDIUMID:['',Validators.required],
      CONTENT_TYPE:['',Validators.required],
      CNTREPO_FILENAME:[''],
      CNTREPO_FILEPATH:['',Validators.required],
      CNTREPO_STATUS:[true,Validators.required],
     CNTREPO_CREATED_BY:[this.userId],
    //  CNTREPO_MODIFIED_BY:[this.userId]
    })
    this.myForm.get('CNTREPO_CLASSID').valueChanges.subscribe(value=>{
      this.getdependentvalue('ContentSubject/GetDDList/'+value,'subjects');
    })
    this.myForm.get('CNTREPO_SUBJECTID').valueChanges.subscribe(value=>{
      this.getdependentvalue('ContentChapter/GetDDList/'+value,'chapters');
    })
  }


  getDictionary(){
    let board = this.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.board});
    let medium = this.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.medium});
    let filetypes = this.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.filetypes});
    let c = this.CommonService.getCall('ContentClass/GetDDList');
   let group=['board','medium','fileModes','classes'];
   forkJoin([board,medium,filetypes,c]).subscribe(res=>{
     group.map((key,i)=>{
       this[key]=res[i];
     })
   })
  }
  getdependentvalue(value,key){
    //ContentSubject/GetDDList/id //ContentChapter/GetDDList/id
    //
    if(!value) return this[key]=[];
    this.CommonService.getCall(value).subscribe(res=>{
      this[key]=res||[]
    })
  }
  



  ///file upload
  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      this.fileName=name;
      let filetype = name.split('.').pop()
    
      // if (check) {
        this.file = file;
        this.upload()
      // }
      // else {
      //   // alert(' Please upload pdf and doc file formats only.')
      //   this.toastr.warning('Please upload Xls,xlsx file formats only.')
      //   event.target.value = ''
      // }
    }
    }
    upload() {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('ClientDocs', 'ClientDocs');
     
      this.activeSpinner();
      this.FileuploadService.upload(formData, 'ContentRepository/UploadFiles').subscribe((res: any) => {
        try {
          this.fileName = res.path;
          if(res.ValidationMessage){this.deactivateSpinner();this.toastr.warning(res.ValidationMessage)}
          if (res.path) {
            this.deactivateSpinner()
            this.myForm.controls['CNTREPO_FILEPATH'].setValue(res.path);
            this.myForm.controls['CNTREPO_FILENAME'].setValue(this.fileName);
          }
        } catch (e) {
          console.log(e)
        }
  
      }, err => { this.deactivateSpinner(); })
    }

    edit(data: any): void {
      this.activeSpinner();
        this.CommonService.postCall('ContentRepository/get',{CNTREPO_ID:data.id}).subscribe(
           res=>{
             this.editData=res;
            
             this.datatransfer(res);
             this.deactivateSpinner();
           },e=>{
             this.deactivateSpinner();
           }
        )
    }
    datatransfer(data){
     
   //   this.getdependentvalue('ContentSubject/GetDDList/'+data.CNTREPO_CLASSID,'subjects');
    // this.getdependentvalue('ContentChapter/GetDDList/'+data.CNTREPO_SUBJECTID,'chapters');
    
      let ctrls: any = this.myForm.controls;
      Object.keys(ctrls).map((key: string) => {
        let control: UntypedFormControl = ctrls[key];
      
        control.setValue(data[key]);
        if(key=='CONTENT_TYPE'){
          control.setValue(1);
        }
      });
    
     
    }

    onSubmit(form?: UntypedFormGroup): void {
        let payaLoad=form.getRawValue();
      
         payaLoad['CNTREPO_FILENAME'],payaLoad['CNTREPO_FILEPATH']
         payaLoad['CONTENT_TYPE']
       


        if (this.isEdit) {
          payaLoad.CNTREPO_ID = this.editData.CNTREPO_ID;
       
          payaLoad.CNTREPO_CREATED_BY = sessionStorage.getItem('UserId'),
          payaLoad.CNTREPO_MODIFIED_BY=this.userId;
          this.CommonService.postCall('ContentRepository/update', payaLoad).subscribe((res: any) => {
           
            this.toastr.success('Content Updated Successfully')
            this.back();
          }, err => {
            this.toastr.error(err.error?err.error:'Content  not Updated')
          })
        } else {
          this.CommonService.postCall('ContentRepository/create', payaLoad).subscribe((res: any) => {
          
            this.toastr.success('Content created Successfully')
            this.back()
          }, err => {
            this.toastr.error(err.error?err.error:'Content  not created ')
          })
        }
    }

    close(){
      window.history.back();
    }
    back(): void {
        window.history.back();
    }
}
