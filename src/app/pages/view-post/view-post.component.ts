import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  blogId:string;
  blogData:any={};
  isData:boolean=false;
  comment:string;
  adminComments:Array<any>=[];
  comments:Array<any>=[];
  replayData:any={};
  replayComment:string;
  constructor(private CommonService: CommonService,private active:ActivatedRoute,private toastr: ToastrService) {
      this.active.queryParams.subscribe((params)=>{
        if(params.id){
          this.blogId=params.id
         this.getBlogData()
        }else{
          window.history.back()
        }
      })
   }

  ngOnInit(): void {
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
 
  getBlogData(){
    this.activeSpinner();
    this.CommonService.postCall('ViewBlog',{BlogId:this.blogId}).subscribe(
      (res:any)=>{
        this.blogData=res&&res[0];
        this.isData=true;
        this.deactivateSpinner();
        if(this.blogData&&this.blogData.IsReaderComments){
          this.loadComments()
        }
      },err=>{
        console.log(err);
        this.deactivateSpinner()
      }
    )
  }
  loadComments():void{
    this.activeSpinner()
   this.CommonService.postCall('LoadComments',{BlogId:this.blogId}).subscribe(
     (res:Array<any>)=>{
       this.deactivateSpinner();
       this.comments=res;
       this.adminComments=res.filter((item)=>{return item.IsAdmin}).sort((a,b)=>{return b.ReplyId-a.ReplyId})
       console.log(this.adminComments)
     },err=>{this.deactivateSpinner()}
   )
  }

  addComment(){
    let payLoad={
      TENANT_CODE:sessionStorage.getItem('TenantCode'),
      ReplyText:this.comment,
      CREATEDBY:sessionStorage.getItem('UserId'),
      RoleId:sessionStorage.getItem('RoleId'),
      BlogId:this.blogId
    }
    this.activeSpinner();
    this.CommonService.postCall('AddComment',payLoad).subscribe((res:any)=>{
        this.deactivateSpinner();
        this.toastr.success(res.message);
        this.loadComments();
        this.comment=null
      },err=>{
         this.deactivateSpinner();
         this.toastr.error(err.message?err.message:'error occured')
      }
    )
  }
  onSubmit(){
  
     let payLoad={
      ParentReplyId:this.replayData.ReplyId,
      ReplyText:this.replayComment,
      DictionaryCode:sessionStorage.getItem('DICTIONARYCODE'),
      CREATEDBY:sessionStorage.getItem('UserId'),
      BlogId:this.blogId,
      RoleId:sessionStorage.getItem('RoleId'),
     }
     this.activeSpinner();
     this.CommonService.postCall('ReplyToComment',payLoad).subscribe(
       (res:any)=>{
         this.deactivateSpinner();
         this.toastr.success(res.message);
         document.getElementById('md_close').click();
         this.loadComments();
       },err=>{
         this.toastr.error(err.message?err.message:'error occured');
         this.deactivateSpinner();
       })
  }
  close(){
this.replayComment=''
  }
  deleteComments(data){
    this.activeSpinner();
    this.CommonService.postCall('DeleteComment',{ReplyId:data.ReplyId}).subscribe(
      (res:any)=>{
        this.deactivateSpinner();
        this.toastr.success(res);
        this.loadComments();
      },err=>{
        this.toastr.error(err.message?err.message:'error occured');
        this.deactivateSpinner();
      }
    )
  }
}
