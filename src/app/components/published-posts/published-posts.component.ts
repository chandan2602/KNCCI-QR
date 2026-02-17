import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';

@Component({
  selector: 'app-published-posts',
  templateUrl: './published-posts.component.html',
  styleUrls: ['./published-posts.component.css']
})
export class PublishedPostsComponent implements OnInit {
  posts: Array<any> = [];
  checked: boolean;
  myForm:UntypedFormGroup;
  fileName:string;
  file:File;
  ediData:any={}
  @Input() type:string;
  ActualPostS:Array<any>=[];
  blogType:any={
    allBlogs:{
      loadUrl:'LoadAllBlogs',
      searchUrl:'AllBlogsSearch',
      status:0
    },
    publish:{
      loadUrl:'LoadpublishedPosts',
      searchUrl:'MyPostSearch',
      status:1
    }
  }
  searchText:string;
  constructor(private fb: UntypedFormBuilder,private CommonService: CommonService, private toastr: ToastrService,private FileuploadService: FileuploadService,private route:Router) {
   
  }

  ngOnInit(): void {
  this.myForm=this.fb.group({
    BlogTitle:['',Validators.required],
    BlogImage:[''],
    Labels:['',Validators.required],
    IsCommentsShow:['',Validators.required],
    BlogMessage:['']
  })
  this.getPosts();
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  getPosts() {
    this.activeSpinner();
    let payLoad={
      CREATEDBY: sessionStorage.getItem('UserId'),
      TenantCode:sessionStorage.getItem('TenantCode')
    }
    let type=this.blogType[this.type]||this.blogType.publish;
    this.CommonService.postCall(type.loadUrl, payLoad).subscribe(
      (res: any) => {
        if(res instanceof Array){
          this.ActualPostS=res;
          this.posts = res;
        }
     
        this.deactivateSpinner()
      }, err => {
        this.deactivateSpinner();
        console.log(err)
      }
    )



  }

  deletePost(flag: boolean, post?) {
    let checkedItems = this.posts.filter((post) => { return post.checked })
    if (flag) {
      this.posts.map((post) => {
        post.checked = false;
        this.checked = false;
      })
      post.checked = true;
    } else
      if (!checkedItems.length) return
    let c = confirm('Are you sure you want to delete the post(s)?');
    if (c) {
      let payload: any = {}
      if (flag) {
        payload.BlogIds = post.BlogId
      } else {
        let BlogId = '';
        checkedItems.map((post: any) => {
          BlogId = BlogId ? BlogId + ',' + post.BlogId : post.BlogId
        })
        payload.BlogIds = BlogId

      }

      this.activeSpinner()
      this.CommonService.postCall('RemoveBlog', payload).subscribe(
        () => {
          this.toastr.success('Record deleted successfully.');
          this.deactivateSpinner()
          this.getPosts()
        }, e => { console.log(e); this.deactivateSpinner() })
    }
  }

  allChecked() {
    this.posts.map((post) => {
      post.checked = this.checked
    })
  }
  close(){}

  onSubmit(form:UntypedFormGroup,type){
    let selectedobj={
      publish:{
        url:'PublishBlog',
        successMsg:"Publish Blog Successfully",
        errorMsg:'error occured'    
      },
      save:{
        url:'SaveBlog',
        successMsg:"Information updated successfully",
        errorMsg:'error occured' 
      }
    }[type]

    this.activeSpinner()
    let payLoad=form.getRawValue();
    payLoad['TenantCode']=sessionStorage.getItem('TenantCode');
    payLoad['CREATEDBY']=sessionStorage.getItem('UserId');
    payLoad['DictionaryCode']=sessionStorage.getItem('DICTIONARYCODE');
    payLoad['BlogId']=this.ediData['BlogId'];
    payLoad['RoleId']=sessionStorage.getItem('RoleId');
    payLoad['ImageName']=this.file&&this.file.name;
    payLoad['IsCommentsShow']=parseInt( payLoad.IsCommentsShow);
    this.CommonService.postCall(selectedobj.url,payLoad).subscribe(
      (res:any)=>{
        this.toastr.success(res.message||selectedobj.successMsg);
        this.deactivateSpinner();
        this.getPosts();
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

    edit(data){
      this.activeSpinner();
      this.ediData=data;
      this.CommonService.postCall('EditBlog',{BlogId:data.BlogId}).subscribe(
        (res:any)=>{
          if(res.length){
            this.ediData=res[0];
          }else{
           let table=res.Table&&res.Table[0];
           this.ediData=table?table:{};
          }
           this.dataTransform(this.ediData)
        }
      )
    }
    dataTransform(data){
      this.deactivateSpinner()
      let controls=this.myForm.controls;
      Object.keys(controls).map((key)=>{
        let ctrl:AbstractControl=controls[key];
        ctrl.setValue(data[key])
      })
      this.fileName=data['BlogImage'];
      controls['IsCommentsShow'].setValue(data['IsReaderComments']?'1':'0')
    }
    view(data){
      this.route.navigate(['HOME/viewPost'],{queryParams:{id:data.BlogId}})
    }
    search(){
      let type=this.blogType[this.type]||this.blogType.publish;
      let payLoad={
        Search:this.searchText,
        CREATEDBY:sessionStorage.getItem('UserId'),
        Status:type.status
      }
      if(!this.searchText){
        this.getPosts();
        return
      }
      this.activeSpinner();
      this.CommonService.postCall(type.searchUrl,payLoad).subscribe((res:any)=>{
        this.deactivateSpinner()
        if(res instanceof Array){
          this.posts=res;
        }else{
          this.posts=[]
        }
      },e=>{this.deactivateSpinner()})
    }
    onChange(){
      if(!this.searchText){
        this.posts=Object.assign([],this.ActualPostS)
      }
    }
}
