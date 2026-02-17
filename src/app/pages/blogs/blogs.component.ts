import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogs: Array<any> = [];
  myForm:UntypedFormGroup;
  fileName:string;
  file:File;
  tenantCode: string = sessionStorage.getItem('TenantCode');
  searchText:string;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService, private FileuploadService: FileuploadService, private route: Router) {
    this.getBlogs();
   }

  ngOnInit(): void {
    this.myForm=this.fb.group({
      BlogTitle:['',Validators.required],
      BlogImage:[''],
      Labels:['',Validators.required],
      IsCommentsShow:['',Validators.required],
      BlogMessage:['']
    })
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  getBlogs() {
    // LoadAllBlogs
    this.activeSpinner();
    this.CommonService.postCall('LoadAllBlogs', { TenantCode: this.tenantCode }).subscribe(
      (res => {
        this.deactivateSpinner();
        this.blogs = res;
      }),
      error => {
        this.deactivateSpinner()
      })
  }
  view(item){
    this.route.navigate(['HOME/viewPost'],{queryParams:{id:item.BlogId}})
  }

  onSubmit(form:UntypedFormGroup,type){
    let selectedobj={
      publish:{
        url:'ComposeNewPost',
        successMsg:"Publish Blog Successfully",
        errorMsg:'error occured'    
      },
      save:{
        url:'PublishNewPost',
        successMsg:"Information updated successfully",
        errorMsg:'error occured' 
      }
    }[type]

    this.activeSpinner()
    let payLoad=form.getRawValue();
    payLoad['TenantCode']=this.tenantCode
    payLoad['CREATEDBY']=sessionStorage.getItem('UserId');
    payLoad['DictionaryCode']=sessionStorage.getItem('DICTIONARYCODE');
    payLoad['RoleId']=sessionStorage.getItem('RoleId');
    payLoad['ImageName']=this.file&&this.file.name;
    payLoad['IsCommentsShow']=parseInt( payLoad.IsCommentsShow);
    this.CommonService.postCall(selectedobj.url,payLoad).subscribe(
      (res:any)=>{
        this.toastr.success(selectedobj.successMsg);
        this.deactivateSpinner();
        this.getBlogs();
        document.getElementById('md_close').click()
      },err=>{
        this.deactivateSpinner();
        this.toastr.error(err.message?err.message:selectedobj.errorMsg)
      })



  }
  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
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
      this.FileuploadService.upload(formData, 'UploadBlogFiles').subscribe((res: any) => {
        try {
          this.fileName = res.path;
          if(res.ValidationMessage){this.deactivateSpinner();this.toastr.warning(res.ValidationMessage)}
          if (this.fileName) {
            this.deactivateSpinner()
            this.myForm.controls['BlogImage'].setValue(this.fileName)
          }
        } catch (e) {
          console.log(e)
        }
  
      }, err => { this.deactivateSpinner(); })
    }
    close(){
      this.myForm.reset();
    }

    search(){
      let payLoad={
        Search:this.searchText,
        CREATEDBY:sessionStorage.getItem('UserId')
      }
      if(!this.searchText){
        this.getBlogs();
        return
      }
      this.activeSpinner();
      this.CommonService.postCall('BlogSearch',payLoad).subscribe((res:any)=>{
        this.deactivateSpinner()
        if(res instanceof Array){
          this.blogs=res;
        }else{
          this.blogs=[]
        }
      },e=>{this.deactivateSpinner()})
    }
}
